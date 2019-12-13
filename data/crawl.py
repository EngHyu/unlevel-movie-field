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
            'name': soup.find('label').text,
            'count': count,
        },
        soup.select('.schedule li'),
        counts,
    ))

    return { 'data': cities }

@cache
def crawl(**kwargs):
    url = kwargs['url']
    response = json.loads(requests.get(url).text)
    response['data'] = response.pop(list(response.keys())[0])
    return response

def town(city_id):
    # town
    url = URL.GET_TOWN(city_id)
    return crawl(type='town', url=url, id=city_id)

def theater(town_id):
    url = URL.GET_THEATER(town_id)
    return crawl(type='theater', url=url, id=town_id)

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
    normalize = lambda num: math.floor(math.log(num, 2)) if num != 0 else 0

    scales = [parseInt(see.text) for see in soup.select('td.tar:nth-child(8)')]
    min_scale = normalize(scales[-1])
    normalized_scales = [normalize(scale) - min_scale for scale in scales]

    movies = tuple(map(
        lambda anchor, scale: {
            'name': anchor.text,
            'code': re.search(r'movie.+,\'(.+)\'', anchor.attrs['onclick']).group(1),
            'scale': scale,
        },
        soup.select('.ellip > a'),
        normalized_scales,
    ))

    for movie in movies:
        response = requests.post(URL.POSTER, data=movie).text
        soup = BeautifulSoup(response, 'html.parser')
        img = soup.select('.fl.thumb>img')
        if len(img) == 0:
            continue

        href = img[0].attrs['src']
        movie['img'] = URL.BASE.format(href)

    return { 'data': movies }

