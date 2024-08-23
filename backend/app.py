import time
import threading
from typing import Optional
from flask import Flask  # type: ignore
from flask_restful import Resource, Api  # type: ignore
import database
from resources import Tourneys, Players, Search

app = Flask(__name__)
api = Api(app)

api.add_resource(Tourneys, "/tournaments/", "/tournaments/<int:id>")
api.add_resource(Players, "/players/")
api.add_resource(Search, "/search/<string:search_name>/")


if __name__ == "__main__":
    try:
        Tourneys.init()
        app.run(port=8080, debug=True)
    finally:
        print("closing pool")
        database.close_conn_pool()
