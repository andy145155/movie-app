# Dockerfile, Image, Container
# Container with python version 3.7
FROM python:3.8


WORKDIR /backend

# Add python file and directory
COPY ./backend/functions/dataProcessing/csvDataProcessing.py ./backend/requirements.txt ./
COPY ./backend/utils ./utils

# upgrade pip and install pip packages
RUN pip install --no-cache-dir --upgrade pip && \
    pip install -r requirements.txt

# run python program
CMD ["python", "csvDataProcessing.py"]