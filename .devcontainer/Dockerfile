# [Choice] Python version: 3, 3.8, 3.7, 3.6
ARG VARIANT=3.8
FROM mcr.microsoft.com/vscode/devcontainers/python:${VARIANT}

ENV VIRTUAL_ENV=~/venv/movie-app
RUN python -m venv $VIRTUAL_ENV

# Install dependencies:
COPY backend/requirements.txt .
RUN pip install -r requirements.txt