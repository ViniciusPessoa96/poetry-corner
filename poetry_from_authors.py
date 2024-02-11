from api import make_req_and_return_json


def format_name(name):
    
    name = name.replace(' ', '%20')
    return name

def filter_irrelevant_data(data_arr):
    
    for data_item in data_arr:
        del data_item['author']
        del data_item['linecount']
        
    return data_arr

def get_poetry_from_author(author_name):
    
    url = 'https://poetrydb.org/author/{}'.format(
        format_name(author_name))
    
    res_json = make_req_and_return_json(url)
    
    #filtrar dados irrelevantes da resposta em json
    filtered_json = filter_irrelevant_data(res_json)

    return filtered_json