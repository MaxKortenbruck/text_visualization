import json
import os
from pathlib import Path

from flask import Flask, render_template

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

def get_path(article = ''):
    return os.path.join('static', 'ressourcen', 'jsons', article)


@app.route('/')
def main():
    return render_template('information.html')

@app.route('/information')
def info():
    return render_template('information.html')

@app.route('/article-view')
def singleArticleView():
    return render_template('article-view.html')

@app.route('/contact')
def contact():
	return render_template('contact.html')

@app.route('/api')
def send_json():

    files = os.listdir(get_path())
    print(os.listdir(get_path()))
    articles = {}
    for article in files:
        with open(get_path(article)) as f:
            data = json.load(f)
        articles[article] = data
    return json.dumps(articles)

@app.route('/alle_jsons')
def send_json_names():
    data = {}
    articles = []
    files = os.listdir(get_path())
    for f in files:
        articles.append(f)

    data['articles'] = articles

    return json.dumps(data)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
