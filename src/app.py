import json
import os

from flask import Flask, render_template

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

@app.route('/')
def main():
    return render_template('information.html')

@app.route('/information')
def info():
    return render_template('information.html')

@app.route('/single-article-view')
def singleArticleView():
    return render_template('single-article-view.html')

@app.route('/multi-article-view')
def multiArticleView():
    return render_template('multi-article-view.html')

@app.route('/statistics')
def statistics():
    return render_template('statistics.html')

@app.route('/contact')
def contact():
	return render_template('contact.html')

@app.route('/api')
def send_json():

    files = os.listdir('./static/ressourcen/jsons')
    articles = {}
    for article in files:
        with open('./static/ressourcen/jsons/' + article) as f:
            data = json.load(f)
        articles[article] = data
    #with open('./static/ressourcen/jsons/2021-05-05_19_15_53_3_DemocratsSueRUTrump_entity_data.json') as f:
    #    data = json.load(f)
    return json.dumps(articles)

@app.route('/alle_jsons')
def send_json_names():
    data = {}
    articles = []
    files = os.listdir('./static/ressourcen/jsons')
    for f in files:
        articles.append(f)

    data['articles'] = articles

    return json.dumps(data)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
