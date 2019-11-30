FROM node:13.2.0
MAINTAINER EngHyu <roomedia@naver.com>

RUN git clone https://github.com/EngHyu/unlevel-movie-field /root/workspace
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y nodejs python3
RUN npm install -g react react-dom create-react-app react-calendar

RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
RUN python3 get-pip.py
RUN rm get-pip.py
RUN pip3 install --upgrade pip requests bs4 flask flask_cors

WORKDIR /root/workspace