FROM python:3.9-alpine

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN mkdir /code
WORKDIR /code
RUN pip install --upgrade pip
COPY backend/requirements.txt /code/
RUN pip install -r requirements.txt
COPY backend/ /code/
