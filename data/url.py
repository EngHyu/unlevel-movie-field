BASE = 'http://www.kobis.or.kr/{}'

THEATER = BASE.format('kobis/business/mast/thea/{}')
NUM_OF_THEATER = THEATER.format('findAreaTheaterStat.do')
CITY = THEATER.format('findTheaterSchedule.do')
GET_TOWN = lambda area_id: THEATER.format('findBasareaCdList.do?sWideareaCd={}').format(area_id)
GET_THEATER = lambda theater_id: THEATER.format('findTheaCdList.do?sBasareaCd={}').format(theater_id)

BOXOFFICE = BASE.format('kobis/business/stat/boxs/{}')
TOP_MOVIE = BOXOFFICE.format('findDailyBoxOfficeList.do')

MOVIE = BASE.format('kobis/business/mast/mvie/{}')
POSTER = MOVIE.format('searchMovieDtl.do')