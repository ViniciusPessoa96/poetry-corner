from poetry import app
from flask import render_template
from flask_cors import cross_origin
from poetry_authors import get_authors_list
from poetry_from_authors import get_poetry_from_author
from helper_classes import Authors

authors = Authors()

def check_and_set_authors():
    if not authors.getAuthors():
        authors.setAuthors(get_authors_list())    

@app.route('/')
def inicio():
    
    check_and_set_authors()
    
    return render_template('index.html', authors=authors.getAuthors())

@app.route('/poetry_from/<author_name>')
def poetry_from(author_name):
    
    return render_template('poetry_from_author.html', author_name=author_name)

@app.route('/get_poetry_from/<author_name>')
def get_poetry_from(author_name):
    
    poetry_json = get_poetry_from_author(author_name)
    
    return poetry_json

@app.route('/authors_with/<first_letter>')
def authors_with(first_letter):
    
    authors_with_letter = list(filter(lambda x: x.startswith(first_letter.upper()), authors.getAuthors()))
    
    return authors_with_letter

#rotas para serem consumidas pelo front feito em react

@app.route('/authors_list')
@cross_origin()
def authors_list():
    
    a_list = get_authors_list()
    
    return a_list
