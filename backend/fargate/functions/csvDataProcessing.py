import os
import ast
import boto3
import logging
import requests
import numpy as np
import pandas as pd
from io import StringIO
from typing import Tuple, Optional, List, Dict, Any
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
from utils.constants import TMDB_5000_CSV, S3_PROCESSED_FILE_PATH, TMDB_KEY
from backend.utils.functions import get_s3_object, upload_to_s3, upload_to_dynamoDB

# Get environment variables
MOVE_CSV_PROCESSED_BUCKET_NAME = os.getenv("MOVE_CSV_PROCESSED_BUCKET_NAME")
MOVE_CSV_SOURCE_BUCKET_NAME = os.getenv("MOVE_CSV_SOURCE_BUCKET_NAME")
MOVIES_SIMILARITY_DYNAMO_DB_NAME = os.getenv("MOVIES_SIMILARITY_DYNAMO_DB_NAME")

# Check if environment variables are set
if not MOVE_CSV_PROCESSED_BUCKET_NAME:
    raise ValueError("Missing environment variable: MOVE_CSV_PROCESSED_BUCKET_NAME")
if not MOVE_CSV_SOURCE_BUCKET_NAME:
    raise ValueError("Missing environment variable: MOVE_CSV_SOURCE_BUCKET_NAME")
if not MOVIES_SIMILARITY_DYNAMO_DB_NAME:
    raise ValueError("Missing environment variable: MOVIES_SIMILARITY_DYNAMO_DB_NAME")

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3_resource = boto3.resource('s3')

def main() -> None:
    try:
        movies, credits = get_movie_df()
        similarity_df = process_data(movies, credits)
        upload_data(similarity_df=similarity_df)
    except Exception as error:
        logger.error(f"Error processing raw movie app data: {error}")
        raise

def process_data(movies: pd.DataFrame, credits: pd.DataFrame) -> pd.DataFrame:
    """Process raw data and return a processed DataFrame."""
    merged_df = merge_dataframes(movies, credits)
    merged_df = extract_useful_information(merged_df)
    merged_df.dropna(inplace=True)

    processed_df = process_dataframe(merged_df)
    vectors = create_feature_vectors(processed_df['tags'])
    similarity = cosine_similarity(vectors)
    
    similarity_df = get_similarity_df(processed_df, merged_df['overview'], similarity)
    similarity_df = apply_fetch_movie_poster(similarity_df)
    similarity_df = rename_columns_and_reset_index(similarity_df)
    logger.info("------ similarity_df informations -------")
    similarity_df.info()
    
    return similarity_df

def rename_columns_and_reset_index(df: pd.DataFrame) -> pd.DataFrame:
    df.rename(columns={'movie_id': 'movieId'},
                        inplace=True, errors='raise')
    df = df.drop_duplicates(subset="movieId")
    df = df.reset_index(drop=True)
    df['index'] = df.index
    return df

def apply_fetch_movie_poster(df: pd.DataFrame) -> pd.DataFrame:
    return df.apply(fetch_movie_poster, axis=1)

def merge_dataframes(movies: pd.DataFrame, credits: pd.DataFrame) -> pd.DataFrame:
    return movies.merge(credits, on='title')

def extract_useful_information(df: pd.DataFrame) -> pd.DataFrame:
    return df[['movie_id', 'title', 'overview', 'genres', 'keywords', 'cast', 'crew']]

def upload_data(similarity_df: pd.DataFrame) -> None:
    upload_to_s3(S3_PROCESSED_FILE_PATH["SIMILARITY"],
                MOVE_CSV_PROCESSED_BUCKET_NAME, similarity_df)
    upload_to_dynamoDB(
            similarity_df, MOVIES_SIMILARITY_DYNAMO_DB_NAME)

def create_feature_vectors(tags: List[str]) -> np.ndarray:
    vectorizer = CountVectorizer(max_features=5000, stop_words='english')
    feature_vectors = vectorizer.fit_transform(tags).toarray()
    return feature_vectors

def get_similarity_df(new_df: pd.DataFrame, overview: pd.Series, similarity: np.ndarray) -> pd.DataFrame:
    similarity_series = pd.Series(similarity.tolist())
    similarity_df = pd.DataFrame().assign(
        movie_id=new_df['movie_id'], title=new_df['title'], overview=overview, similarity=similarity_series.values
    )
    similarity_df["similarity"] = similarity_df["similarity"].apply(
        lambda x: get_recommended_movie_id(x, similarity_df)
    )
    return similarity_df

def get_recommended_movie_id(obj, similarity_df: pd.DataFrame) -> List[int]:
    result = []
    recommended = sorted(list(enumerate(obj)),
                         reverse=True, key=lambda x: x[1])[1:8]
    for i in recommended:
        result.append(similarity_df.iloc[i[0]].movie_id)
    return result

def fetch_movie_poster(obj: Dict[str, Any]) -> Dict[str, Any]:
    try:
        response = requests.get(
            f'https://api.themoviedb.org/3/movie/{obj["movie_id"]}?api_key={TMDB_KEY}&language=en-US')
        data = response.json()
        obj['poster'] = f"https://image.tmdb.org/t/p/w500/{data.get('poster_path', '')}"
    except requests.exceptions.RequestException as error:
        logger.error(f"Error fetching movie poster: {error}")
        obj['poster'] = ""
    return obj


def get_movie_df() -> Tuple[pd.DataFrame, pd.DataFrame]:
    movies, credits = None, None
    try:
        movies, credits = fetch_movies_and_credits()
        if movies is None or credits is None:
            raise ValueError("Movies or credits data could not be fetched.")
    except Exception as error:
        logging.error(f"Error retrieving S3 object: {error}")
        raise
    return movies, credits

def fetch_movies_and_credits() -> Tuple[Optional[pd.DataFrame], Optional[pd.DataFrame]]:
    movie_source_bucket = s3_resource.Bucket(MOVE_CSV_SOURCE_BUCKET_NAME)
    tmdb_objects = movie_source_bucket.objects.filter(Prefix=TMDB_5000_CSV["PREFIX"])
    movies, credits = None, None
    for object in tmdb_objects:
        csv_data = get_s3_object(object.bucket_name, object.key)
        if object.key == TMDB_5000_CSV["CREDITS"]:
            credits = pd.read_csv(StringIO(csv_data))
        if object.key == TMDB_5000_CSV["MOVIES"]:
            movies = pd.read_csv(StringIO(csv_data))
    return movies, credits

def process_dataframe(dataframe: pd.DataFrame) -> pd.DataFrame:
    try:
        dataframe['genres'] = dataframe['genres'].apply(convert_name)
        dataframe['keywords'] = dataframe['keywords'].apply(convert_name)
        dataframe['cast'] = dataframe['cast'].apply(get_top3_actor)
        dataframe['crew'] = dataframe['crew'].apply(fetch_director)
        dataframe['overview'] = dataframe['overview'].apply(lambda x: x.split())
        dataframe['genres'] = dataframe['genres'].apply(
            lambda x: [i.replace(" ", "") for i in x])
        dataframe['keywords'] = dataframe['keywords'].apply(
            lambda x: [i.replace(" ", "") for i in x])
        dataframe['cast'] = dataframe['cast'].apply(
            lambda x: [i.replace(" ", "") for i in x])
        dataframe['crew'] = dataframe['crew'].apply(
            lambda x: [i.replace(" ", "") for i in x])
        dataframe['tags'] = dataframe['overview'] + dataframe['genres'] + \
            dataframe['keywords'] + dataframe['cast'] + dataframe['crew']
        new_dataframe = dataframe[['movie_id', 'title', 'tags', 'overview']].copy()
        new_dataframe['tags'] = new_dataframe['tags'].apply(lambda x: " ".join(x))
        new_dataframe['tags'] = new_dataframe['tags'].apply(lambda x: x.lower())
        return new_dataframe
    except Exception as error:
        logger.error(f"Error processing dataframe: {error}")
        raise


def convert_name(obj: str) -> List[str]:
    names = []
    for item in ast.literal_eval(obj):
        names.append(item['name'])
    return names

def get_top3_actor(obj: str) -> List[str]:
    names = []
    counter = 0
    for item in ast.literal_eval(obj):
        if counter != 3:
            names.append(item['name'])
            counter += 1
        else:
            break
    return names

def fetch_director(obj: str) -> List[str]:
    names = []
    for item in ast.literal_eval(obj):
        if item['job'] == 'Director':
            names.append(item['name'])
            break
    return names

if __name__ == '__main__':
    main()
