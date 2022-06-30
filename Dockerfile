FROM python:3.9-alpine

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN mkdir /code
WORKDIR /code

COPY backend/requirements.txt /code/
RUN \
 apk add --no-cache postgresql-libs && \
 apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
 pip install --upgrade pip && \
 pip install -r requirements.txt --no-cache-dir &&\
 apk --purge del .build-deps

COPY backend/ /code/
