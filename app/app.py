from flask import Flask
from flask import render_template
app = Flask(__name__)


@app.route("/")
def index():
    return render_template('index.html')

@app.route("/tech")
def techSpace():
    pageTitle = ""
    articles = [{
        "title": "Blog 1",
        "description": "Blog 1 Desc",
        "content": ''' Blog 1
        abcd
        efg
        '''
    }, {
        "title": "Blog 2",
        "description": "Blog 2 Desc",
        "content": ''' Blog 2 Content '''
    }, {
        "title": "Blog 3",
        "description": "Blog 3 Desc",
        "content": ''' Blog 3 Content '''
    }, {
        "title": "Blog 4",
        "description": "Blog 4 Desc",
        "content": ''' Blog 4 Content '''
    }, {
        "title": "Blog 5",
        "description": "Blog 5 Desc",
        "content": ''' Blog 5 Content '''
    }, {
        "title": "Blog 6",
        "description": "Blog 6 Desc",
        "content": ''' Blog 6 Content '''
    }, {
        "title": "Blog 7",
        "description": "Blog 7 Desc",
        "content": ''' Blog 7 Content '''
    }, {
        "title": "Blog 8",
        "description": "Blog 8 Desc",
        "content": ''' Blog 8 Content '''
    }]
    return render_template('blog.html', pageTitle="Running Journey", articles=articles)

@app.route("/running")
def runningJourney():
    return render_template('blog.html')

if __name__ == "__main__":
    app.run()
