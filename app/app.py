from flask import Flask
from flask import render_template
from flaskext.markdown import Markdown
import os

app = Flask(__name__)
Markdown(app)

def get_articles(type="tech"):
    print("Get articles")
    articles = {}
    entries = os.listdir('articles')
    for article in entries:
        content = open("articles/" + article, 'r').read()
        articles[article.split('.')[0]] = {'title': article, 'description': '', 'content': content}

    return articles

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/tech")
def techSpace():
    pageTitle = "Tech Space"
    articles = get_articles()
    content = open("articles/kube-install.md", 'r').read()
    return render_template('bloglist.html', pageTitle=pageTitle, articles=articles, markup_content=content)

@app.route("/tech/<id>/data")
def getArticleContent(id):
    article = get_articles()[id]
    return article.content

@app.route("/tech/<id>")
def articleView(id):
    print("Viewing article: " + id)
    article = get_articles()[id]
    return render_template('blog-content.html', article=article, articles=get_articles())

@app.route("/running")
def runningJourney():
    return render_template('blog.html')

if __name__ == "__main__":
    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(debug=True)
