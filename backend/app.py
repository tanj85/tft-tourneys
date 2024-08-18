import time
import threading
from typing import Optional
from flask import Flask
from flask_restful import Resource, Api
from Levenshtein import distance
import database
from resources.resources import Tourneys, Players, Search

app = Flask(__name__)
api = Api(app)

api.add_resource(Tourneys, "/tournaments/", "/tournaments/<int:id>")
api.add_resource(Players, "/players/")
api.add_resource(Search, "/search/<string:search_name>/")


def periodic_refresh(small_interval=60, big_interval=60):
    global tourneys, players
    last_small_update = None
    last_big_update = None

    while True:
        Tourneys.load_all_tourneys(5)

        time.sleep(5)

        # if not CURR_TOURNEY_ID:
        #     print("no tournament happening right now!")
        # else:
        #     database.update_tourney(conn, tourneys, CURR_TOURNEY_ID)


if __name__ == "__main__":
    # task_thread = threading.Thread(target=periodic_task, args=[conn])
    # task_thread.daemon = True
    # task_thread.start()
    try:
        Tourneys.init()
        # refresh_thread = threading.Thread(target=periodic_refresh)
        # refresh_thread.daemon = True
        # refresh_thread.start()
        app.run(debug=True)
    finally:
        print("closing pool")
        database.close_conn_pool()
