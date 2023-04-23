'''
This function will
'''
try:
    import unzip_requirements
except ImportError:
    pass
from utils.constants import TMDB_5000_CSV, S3_BUCKETS_NAME, S3_DATABASE_FILE_PATH, TMDB_KEY
from utils.apiFunctions import getS3Object, uploadCsvToS3, uploadCsvToDB
import pandas as pd
import boto3
from sklearn.feature_extraction.text import CountVectorizer
from nltk.stem.porter import PorterStemmer
from sklearn.metrics.pairwise import cosine_similarity
from io import StringIO
import ast
import requests


def main():
    try:
        movies, credits = getRawCsvData()
        merge = movies.merge(credits, on='title')

        # Extract usefull information from the data frame
        merge = merge[['movie_id', 'title', 'overview',
                       'genres', 'keywords', 'cast', 'crew']]
        overview = merge['overview']
        merge.dropna(inplace=True)

        new_df = dataFrameProcessing(merge)
        counter = CountVectorizer(max_features=5000, stop_words='english')
        vectors = counter.fit_transform(new_df['tags']).toarray()
        counter.fit_transform(new_df['tags']).toarray().shape
        new_df['tags'] = new_df['tags'].apply(stemming)
        similarity = cosine_similarity(vectors)
        similarity_series = pd.Series(similarity.tolist())

        similarity_df = pd.DataFrame().assign(
            movie_id=new_df['movie_id'], title=new_df['title'], overview=overview, similarity=similarity_series.values)

        # Get Recommended Movie Based on Similarity Score
        similarity_df["similarity"] = similarity_df["similarity"].apply(
            lambda x: getRecommendedMovieId(x, similarity_df))
        similarity_df.head()
        similarity_df = similarity_df.apply(fetch_poster, axis=1)
        similarity_df = similarity_df.reset_index()
        similarity_df['index'] = similarity_df['index'].astype(int)
        print("------ similarity_df informations -------")
        similarity_df.info()
        uploadCsvToS3(S3_DATABASE_FILE_PATH["SIMILARITY"],
                      S3_BUCKETS_NAME["DATABASE"], similarity_df)
        uploadCsvToDB(similarity_df)
    except Exception as error:
        print("Error processing raw movie app data: %s" % (error))
    return


def getRecommendedMovieId(obj, similarity_df):
    result = []
    recommended = sorted(list(enumerate(obj)),
                         reverse=True, key=lambda x: x[1])[1:8]
    for i in recommended:
        result.append(similarity_df.iloc[i[0]].movie_id)
    return result


def fetch_poster(obj):
    response = requests.get(
        'https://api.themoviedb.org/3/movie/{}?api_key={}&language=en-US'.format(obj['movie_id'], TMDB_KEY))
    data = response.json()
    try:
        if data['poster_path']:
            obj['poster'] = "https://image.tmdb.org/t/p/w500/" + \
                data['poster_path']
    except:
        obj['poster'] = ""
    return obj


def getRawCsvData():
    # Create S3 bucket client
    s3 = boto3.resource('s3')
    my_bucket = s3.Bucket(S3_BUCKETS_NAME["CSV_BUCKET"])
    tmdb_prfix_objects = my_bucket.objects.filter(
        Prefix=TMDB_5000_CSV["PREFIX"])
    try:
        for s3_object in tmdb_prfix_objects:
            csv_data = getS3Object(
                s3_object.bucket_name, s3_object.key)
            if s3_object.key == TMDB_5000_CSV["CREDITS"]:
                credits = pd.read_csv(StringIO(csv_data))
            if s3_object.key == TMDB_5000_CSV["MOVIES"]:
                movies = pd.read_csv(StringIO(csv_data))
        return movies, credits
    except Exception as error:
        print("Error retriving S3 object: %s" % (error))
        return


def dataFrameProcessing(merge):
    merge['genres'] = merge['genres'].apply(convertName)
    merge['keywords'] = merge['keywords'].apply(convertName)
    merge['cast'] = merge['cast'].apply(convertTop3Actor)
    merge['crew'] = merge['crew'].apply(fetchDirector)
    merge['overview'] = merge['overview'].apply(lambda x: x.split())
    merge['genres'] = merge['genres'].apply(
        lambda x: [i.replace(" ", "") for i in x])
    merge['keywords'] = merge['keywords'].apply(
        lambda x: [i.replace(" ", "") for i in x])
    merge['cast'] = merge['cast'].apply(
        lambda x: [i.replace(" ", "") for i in x])
    merge['crew'] = merge['crew'].apply(
        lambda x: [i.replace(" ", "") for i in x])
    merge['tags'] = merge['overview'] + merge['genres'] + \
        merge['keywords'] + merge['cast'] + merge['crew']
    new_df = merge[['movie_id', 'title', 'tags', 'overview']].copy()
    new_df['tags'] = new_df['tags'].apply(lambda x: " ".join(x))
    new_df['tags'] = new_df['tags'].apply(lambda x: x.lower())
    return new_df


def convertName(obj):
    L = []
    for i in ast.literal_eval(obj):
        L.append(i['name'])
    return L


def convertTop3Actor(obj):
    L = []
    counter = 0
    for i in ast.literal_eval(obj):
        if counter != 3:
            L.append(i['name'])
            counter += 1
        else:
            break
    return L


def fetchDirector(obj):
    L = []
    for i in ast.literal_eval(obj):
        if i['job'] == 'Director':
            L.append(i['name'])
            break
    return L


def stemming(text):
    y = []
    ps = PorterStemmer()
    for i in text.split():
        y.append(ps.stem(i))
    return " ".join(y)


if __name__ == '__main__':
    main()
