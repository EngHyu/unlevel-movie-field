import crawl

from flask import Flask
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app, resources={r'/api/*': {'origin': '*'}})

@cross_origin()
@app.route('/api/city')
def city():
    '''
    communicate with Location.js
    get city info

    params: None
    return: { "data": ..., [
        { "id": city_id },
        { "name": city_name },
        { "count": num_of_theater },
    ]}
    '''
    return crawl.city()

@cross_origin()
@app.route('/api/town/<city_id>')
def town(city_id):
    '''
    communicate with Location.js
    get town info in selected city_id

    params: city_id
    return: { "data": ..., [
        { "cd": town_id },
        { "cdNm": town_name },
    ]}
    '''
    return crawl.town(city_id)

@cross_origin()
@app.route('/api/theater/<town_id>')
def theater(town_id):
    '''
    communicate with Location.js
    get theater info in selected town_id

    params: town_id
    return: { "data": ..., [
        { "cd": theater_id },
        { "cdNm": theater_name },
    ]}
    '''
    return crawl.theater(town_id)

# Movie.js
## get movie posters
@app.route('/api/movie')
@cross_origin()
def movie():
    '''
    communicate with Movie.js
    get movie info in box office

    params: 
    return: { "data": ..., [
        { "name": movie_name },
        { "code": movie_code },
        { "img": movie_poster },
        { "scale": propo },
    ]}
    '''
    return crawl.movie()

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=6006)
