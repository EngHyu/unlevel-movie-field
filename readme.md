# tested
## requirements
- docker image `node:13.2.0`

## use docker
- download [dockerfile](https://github.com/EngHyu/unlevel-movie-field/blob/master/dockerfile)
- build dockerfile using
```sh
docker build -t=unlevel .
```
- make container using
```sh
docker run -it -p 3000:3000 -p 6006:6006 --name=movie unlevel
```

## otherwise
- in linux, run `sh get-env.sh` in bash to get all requirements.

# ./movie
## What is this for?
- frontend view using `create-react-app`

## requirements
- node 13.2.0
- react 15.5
- react-dom 15.5
- create-react-app 3.2.0
- react-calendar 2.19.2

## run
- run `npm start` in movie folder
- check the result [here](localhost:3000/)

# ./data
## What is this for?
- backend api server crawling data from [kobis](https://www.kobis.or.kr/)
- made with `flask`

## requirements
- python 3.5.3
- requests 2.22.0
- beautifulsoup4 4.8.1
- bs4 0.0.1
- flask 1.1.1
- flask-cors 3.0.8

## run
- run `python app.py` in data folder.
- check the result [here](localhost:6006/api/area).