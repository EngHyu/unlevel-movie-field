import re
import json
import urllib
import requests
from datetime import date, timedelta
from decimal import Decimal

from bs4 import BeautifulSoup
from flask import Flask, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app, resources={r'/api/*': {'origin': '*'}})

BASE_URL = 'http://www.kobis.or.kr/{}'
THEATER_URL = BASE_URL.format('kobis/business/mast/thea/{}')
BOXOFFICE_URL = BASE_URL.format('kobis/business/stat/boxs/{}')
MOVIE_URL = BASE_URL.format('kobis/business/mast/mvie/{}')

# cache
## check the data is today
def is_today(name):
    try:
        today = str(date.today())
        jsons = json.loads(open(name, 'r').readline())
        if today == jsons['time']:
            return jsons
    except:
        pass
    return False

# Location.js
## get area names
@app.route('/api/area')
@cross_origin()
def area():
    name = 'cache/area.json'
    field = 'areas'
    jsons = is_today(name)
    if jsons:
        print('load cached {}'.format(name))
        return jsonify(jsons[field])

    # area and count
    FIND_AREA_COUNT_URL = THEATER_URL.format('findAreaTheaterStat.do')
    soup = BeautifulSoup(requests.get(FIND_AREA_COUNT_URL).text, 'html.parser')
    count = list(map(lambda count: int(count.text), soup.select('td:nth-child(2)')))

    # area and id
    FIND_AREA_URL = THEATER_URL.format('findTheaterSchedule.do')
    soup = BeautifulSoup(requests.get(FIND_AREA_URL).text, 'html.parser')
    areas = tuple(map(
        lambda soup, count: {
            'count': count,
            'id': soup.attrs['wideareacd'],
            'name': soup.find('label').text,
        },
        soup.select('.schedule li'),
        count,
    ))

    areas = sorted(areas, key=lambda item: item['count'])
    data = {
        'time': str(date.today()),
        field: areas,
    }
    open(name, 'w').write(json.dumps(data))
    return jsonify(areas)

## get detail area names
@app.route('/api/detail/<area_id>')
@cross_origin()
def detail(area_id):
    name = 'cache/detail_{}.json'.format(area_id)
    field = 'details'
    jsons = is_today(name)
    if jsons:
        print('load cached {}'.format(name))
        return jsonify(jsons[field])

    # detail
    FIND_AREA_DETAIL_URL = THEATER_URL.format('findBasareaCdList.do?sWideareaCd={}').format(area_id)
    response = requests.get(FIND_AREA_DETAIL_URL).text

    data = {
        'time': str(date.today()),
        field: json.loads(response),
    }
    open(name, 'w').write(json.dumps(data))
    return json.loads(response)

## get theather names
@app.route('/api/theater/<theater_id>')
@cross_origin()
def theater(theater_id):
    name = 'cache/theaters_{}.json'.format(theater_id)
    field = 'theaters'
    jsons = is_today(name)
    if jsons:
        print('load cached {}'.format(name))
        return jsonify(jsons[field])

    FIND_THEATER_URL = THEATER_URL.format('findTheaCdList.do?sBasareaCd={}').format(theater_id)
    response = requests.get(FIND_THEATER_URL).text

    data = {
        'time': str(date.today()),
        field: json.loads(response),
    }
    open(name, 'w').write(json.dumps(data))
    return json.loads(response)

# Movie.js
## get movie posters
@app.route('/api/movie')
@cross_origin()
def movie():
    name = 'cache/movie.json'
    field = 'movies'
    jsons = is_today(name)
    if jsons:
        print('load cached {}'.format(name))
        return jsonify(jsons[field])

    form = {
        'loadEnd': 0,
        'searchType': 'search',
        'sSearchFrom': date.today() - timedelta(1),
        'sSearchTo': date.today() - timedelta(1),
    }
    FIND_MOVIE_URL = BOXOFFICE_URL.format('findDailyBoxOfficeList.do')
    soup = BeautifulSoup(requests.post(FIND_MOVIE_URL, data=form).text, 'html.parser')
    movies = list(map(
        lambda anchor, see: {
            'name': anchor.text,
            'code': re.search(r'movie.+,\'(.+)\'', anchor.attrs['onclick']).group(1),
            'see': int(Decimal(re.sub(r'[^\d]', '', see.text))),
        },
        soup.select('.ellip > a'),
        soup.select('td.tar:nth-child(8)'),
    ))

    FIND_POSTER_URL = MOVIE_URL.format('searchMovieDtl.do')
    for movie in movies:
        response = requests.post(FIND_POSTER_URL, data=movie).text
        soup = BeautifulSoup(response, 'html.parser')
        img = soup.select('.fl.thumb>img')
        if len(img) == 0: continue
        href = img[0].attrs['src']
        movie['img'] = BASE_URL.format(href)

    data = {
        'time': str(date.today()),
        field: movies,
    }
    open(name, 'w').write(json.dumps(data))
    return jsonify(movies)

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=6006)

# for movie schedule
#THEATER_URL.format('findSchedule.do?theaCd={}&showDt={}').format()