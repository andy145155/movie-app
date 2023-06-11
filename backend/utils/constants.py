MOVIE_APP_REGION_NAME = "ap-southeast-1"
DATABASE = "input-csv"

TMDB_5000_CSV = {
    "PREFIX": "tmdb_5000_",
    "CREDITS":  "tmdb_5000_credits.csv",
    "MOVIES":  "tmdb_5000_movies.csv",
}

S3_DATABASE_FILE_PATH = {
    "CREDITS":  "csv/credits/credits_raw_data.csv",
    "MOVIES":  "csv/movies/movies_raw_data.csv",
    "SIMILARITY": "csv/similarity/similarity_data.csv"
}

DB_TABLE = {
    "TMDB_CREDITS_RAW_DATA": "credits",
    "TMDB_MOVIE_RAW_DATA": "movies",
    "SIMILARITY": "similarity"
}

S3_BUCKETS_NAME = {
    "DATABASE": "movie-app-athena-database",
    "CSV_BUCKET": "movie-app-csv-bucket"
}

DYNAMO_DB_TABLE_LIST = {
    "MOVIES_SIMILARITY": 'movies_similarity',
    "USER_SELECTION": 'user_selection',
}

GLUE_CRAWLER = {
    "CREDITS": "input-credits-csv-crawler",
    "MOVIES": "input-movies-csv-crawler",
    "SIMILARITY": "input-similarity-csv-crawler",
}

TMDB_KEY = '0e770cd6eb622a65729afb287f266062'
