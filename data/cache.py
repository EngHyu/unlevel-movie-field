import json
from flask import jsonify
from datetime import date

# cache
## check the data is today
def is_today(name):
    try:
        today = str(date.today())
        jsons = json.loads(open(name, 'r').readline())
        if today == jsons['time']:
            return jsons

    except Exception as err:
        print("error", err)

    return None

def cache(func, **kwargs):
    def wrapper(**kwargs):
        if len(kwargs) == 0:
            field = func.__name__
            name = 'cache/{}.json'.format(field)
        else:
            field = kwargs['type']
            id = kwargs['id']
            name = 'cache/{}_{}.json'.format(field, id)

        jsons = is_today(name)
        if jsons:
            print('load cached {}'.format(name))
            return jsonify(jsons[field])

        data = {
            'time': str(date.today()),
            field: func(**kwargs),
        }
        open(name, 'w').write(json.dumps(data))
        return jsonify(data[field])
    return wrapper
