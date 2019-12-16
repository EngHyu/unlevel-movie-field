import json
import functools
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

def cache(func, *args):
    @functools.wraps(func)
    def wrapper(*args):
        field = func.__name__
        name = 'cache/{}.json'.format(field)

        if field == 'movie':
            jsons = is_today(name)
            if jsons:
                print('load cached {}'.format(name))
                return jsonify(jsons[field])

        try:
            with open(name, 'r') as f:
                data = json.loads(f.readline())
        except:
            data = {field: {}, 'time': ''}

        result = func(*args)
        key = sorted(result.keys())[0]

        try:
            # print([d[key] for d in data[field][key]])
            data[field][key] += result[key]
            if len(result[key]) > 0:
                k = sorted(result[key][0].keys())[0]
                j = sorted(result[key][0].keys())[-2]
                data[field][key] = sorted(
                    {
                        ele[k]:ele for ele in data[field][key]
                    }.values(),
                    key=lambda item: item[j]
                )

        except Exception as err:
            data[field][key] = result[key]
            print('err processing', err, len(data[field][key]), key)

        data['time'] = str(date.today())
        with open(name, 'w') as f:
            f.write(json.dumps(data))

        return (data[field])
    return wrapper

def run(func):
    @functools.wraps(func)
    def wrapper():
        field = func.__name__
        name = 'cache/{}.json'.format(field)
        with open(name, 'r') as f:
            data = json.loads(f.readline())
        return jsonify(data)
    return wrapper