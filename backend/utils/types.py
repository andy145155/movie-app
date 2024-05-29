from typing import Optional, TypedDict

class SelectedMovie(TypedDict):
    movieId: str
    similarity: list[str]
    
class UserSelectedAndRecommendedMovies(TypedDict):
    email: str
    recommendedMovies: list[str]
    selectedMovies: list[int]

class Movie(TypedDict):
    movieId: str
    index: int
    poster: str
    similarity: list[int]
    overview: str
    title: str