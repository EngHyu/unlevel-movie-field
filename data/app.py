import json
import requests
from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from bs4 import BeautifulSoup

# findSchedule_URL = 'http://www.kobis.or.kr/kobis/business/mast/thea/findSchedule.do'
# findSchedule_form_data = {
#     'theaCd': '002065',
#     'showDt': '20191109'
# }
app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origin": "*"}})

@app.route('/api/area')
@cross_origin()
def area():
    # area and count
    FIND_AREA_COUNT_URL = 'http://www.kobis.or.kr/kobis/business/mast/thea/findAreaTheaterStat.do'
    soup = BeautifulSoup(requests.get(FIND_AREA_COUNT_URL).text)
    count = [count.text for count in soup.select('td:nth-child(2)')]

    # area and id
    FIND_AREA_URL = 'http://www.kobis.or.kr/kobis/business/mast/thea/findTheaterSchedule.do'
    soup = BeautifulSoup(requests.get(FIND_AREA_URL).text, 'html.parser')
    areas = tuple(map(
        lambda data: {
            'count': int(data[1]),
            'id': data[0].attrs['wideareacd'],
            'name': data[0].find('label').text,
        }, zip(soup.select('.schedule li'), count)
    ))

    areas = sorted(areas, key=lambda item: item['count'], reverse=True)
    return jsonify(areas)

@app.route('/api/detail/<area_id>')
@cross_origin()
def detail(area_id):
    # detail
    FIND_AREA_DETAIL_URL = 'http://www.kobis.or.kr/kobis/business/mast/thea/findBasareaCdList.do?sWideareaCd='
    response = requests.get(FIND_AREA_DETAIL_URL + area_id)
    return json.loads(response.text)

@app.route('/api/theater/<theater_id>')
@cross_origin()
def theater(theater_id):
    FIND_THEATER_URL = 'http://www.kobis.or.kr/kobis/business/mast/thea/findTheaCdList.do?sBasareaCd='
    response = requests.get(FIND_THEATER_URL + theater_id)
    return json.loads(response.text)


if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=6006)

# for area in areas:
#     response = requests.get(FIND_AREA_DETAIL_URL + area['id'])
#     area.append(json.loads(response.text))

# print(len(areas[0]))

# count = [count.text for count in soup.select('td:nth-child(2)')]
# #data['area_count'] = {k : int(v) for k, v in zip(area, count)[:-1]}
# #data['area_count'] = sorted(data['area_count'].items(), key=lambda x: x[1], reverse=True)
# data['detail'] = json.loads(response.text)['basareaCdList']
# #print(response.text.encode('utf-8'))

# response = requests.get(findTheaCdList_URL)
# data['theater'] = json.loads(response.text)['theaCdList']

# response = requests.post(findSchedule_URL, findSchedule_form_data)
# #data['schedule'] = json.loads(response.text)

# data_str = json.dumps(data)
# codecs.open('src/data.json', 'w', 'utf-8').write(data_str)