from api import make_req_and_return_json
from urllib.request import Request, urlopen
import json


def get_authors_list():
    
    url = 'https://poetrydb.org/authors'

    res_json = make_req_and_return_json(url)

    authors = res_json['authors']
    
    return authors