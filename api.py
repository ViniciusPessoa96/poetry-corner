from urllib.request import Request, urlopen
import json

def make_req(url):
    
    user_agent = {'user-agent': "Mozilla/5.0 (Linux; Android 6.0; \
        Nexus 5 Build/MRA58N) AppleWeb'Kit/537.36 (KHTML, like Gecko) \
            Chrome/111.0.0.0 Mobile Safari/537.36"}
    
    req = Request(url, headers=user_agent)
    
    return req

def get_json_response(req):
    
    res = urlopen(req).read()
    res_json = json.loads(res)
    
    return res_json

def make_req_and_return_json(url):
    
    req = make_req(url)
    res_json = get_json_response(req)
    
    return res_json