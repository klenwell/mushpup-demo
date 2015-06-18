"""`main` is the top level module for your Flask application."""
# Imports
from os.path import dirname, join
from datetime import date
from flask import Flask
import jinja2


# Constants
JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(join(dirname(__file__), 'templates')),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

# Note: We don't need to call run() since our application is embedded within
# the App Engine WSGI application server.
app = Flask(__name__)


@app.route('/')
def index():
    """Return a friendly HTTP greeting."""
    template = JINJA_ENVIRONMENT.get_template('index.html')
    return template.render(year=date.today().year)


@app.route('/hello')
def hello():
    """Return a friendly HTTP greeting."""
    return 'Hello World!'


@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, Nothing at this URL.', 404


@app.errorhandler(500)
def application_error(e):
    """Return a custom 500 error."""
    return 'Sorry, unexpected error: {}'.format(e), 500
