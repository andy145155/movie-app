from typing import Optional, TypedDict


class SelectedMovie(TypedDict):
    movieId: str
    similarity: list[str]


class UserSelection(TypedDict):
    email: str
    recommendedMovies: list[str]
    selectedMovies: list[int]


class Movie(TypedDict):
    movieId: int
    index: int
    poster: str
    similarity: list[int]
    overview: str
    title: str
