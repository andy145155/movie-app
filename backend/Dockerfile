FROM python:3.11-slim

WORKDIR /backend

# Copy only the requirements first to leverage Docker cache
COPY ./fargate/requirements.txt ./

# Install pip packages
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Add python file and directory
COPY ./fargate/functions/csvDataProcessing.py ./
COPY ./utils ./utils

# Run python program
CMD ["python", "csvDataProcessing.py"]