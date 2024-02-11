from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

from views import *

if __name__ == '__main__':
    
    app.run(debug=True, host='0.0.0.0', port=5002)