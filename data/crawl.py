# -*- coding: utf-8 -*-
import re
import json
import math
import urllib
import requests
import url as URL

from bs4 import BeautifulSoup
from cache import is_today, cache
from datetime import date, timedelta

@cache
def city():
    # num of theater in city
    soup = BeautifulSoup(requests.get(URL.NUM_OF_THEATER).text, 'html.parser')
    counts = [int(count.text) for count in soup.select('td:nth-child(2)')]

    # city info
    soup = BeautifulSoup(requests.get(URL.CITY).text, 'html.parser')
    cities = tuple(map(
        lambda soup, count: {
            'id': soup.attrs['wideareacd'],
            'idNum': count,
            'name': soup.find('label').text,
        },
        soup.select('.schedule li'),
        counts,
    ))

    cities = sorted(cities, key=lambda item: item['idNum'])
    return { 'data': cities }

@cache
def town(*args):
    # town
    [city_id] = args
    url = URL.GET_TOWN(city_id)
    response = json.loads(requests.get(url).text)
    response[city_id] = response.pop(list(response.keys())[0])
    return response

@cache
def theater(*args):
    city_id, city_name, town_id = args
    url = URL.GET_THEATER(town_id)
    response = json.loads(requests.get(url).text)
    
    try:
        response[city_id] += [dict({'name': city_name}, **ele) for ele in response['theaCdList']]
    except Exception as err:
        print('no such key', err)
        response[city_id] = [dict({'name': city_name}, **ele) for ele in response['theaCdList']]
    finally:
        del response['theaCdList']

    return response

@cache
def movie():
    today = date.today()
    yesterday = today - timedelta(1)
    form = {
        'loadEnd': 0,
        'searchType': 'search',
        'sSearchFrom': yesterday,
        'sSearchTo': yesterday,
    }
    soup = BeautifulSoup(requests.post(URL.TOP_MOVIE, data=form).text, 'html.parser')
    
    parseInt = lambda text: int(re.sub(r'[^\d]', '', text))
    normalize = lambda num: math.floor(math.log(num, 4)) if num != 0 else 0

    scales = [parseInt(see.text) for see in soup.select('td.tar:nth-child(8)')]
    min_scale = normalize(scales[-1])
    normalized_scales = [normalize(scale) - min_scale for scale in scales]

    screens = [math.ceil(see/parseInt(screen.text)) for see, screen in zip(scales, soup.select('td.tar:nth-child(12)'))]
    max_screen = max(screens)
    normalized_screens = [math.ceil(screen / max_screen * 255) for screen in screens]

    movies = tuple(map(
        lambda anchor, scale, screen: {
            'name': anchor.text,
            'code': re.search(r'movie.+,\'(.+)\'', anchor.attrs['onclick']).group(1),
            'scale': normalized_scales[0] - scale,
            'screen': screen,
        },
        soup.select('.ellip > a'),
        normalized_scales,
        normalized_screens,
    ))[::-1]

    for movie in movies:
        response = requests.post(URL.POSTER, data=movie).text
        soup = BeautifulSoup(response, 'html.parser')
        img = soup.select('.fl.thumb>img')
        if len(img) == 0:
            continue

        href = re.sub('x192', 'x640', img[0].attrs['src'])
        movie['img'] = URL.BASE.format(href)

    return { 'data': movies }

if __name__ == '__main__':
    city = [c for c in city()['data']]
    city_id = [c['id'] for c in city]
    city_name = [c['name'] for c in city]
    town_id = [[t['cd'] for t in town(id)[id]] for id in city_id]
    for c_id, c_name, t_ids in zip(city_id, city_name, town_id):
        for t_id in t_ids:
            theater(c_id, c_name, t_id)

    movie()