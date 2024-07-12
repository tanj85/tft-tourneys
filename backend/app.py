import time
import threading
from typing import Optional
from flask import Flask
from flask_restful import Resource, Api
from Levenshtein import distance
import database
from resources.resources import Tourneys, Players, Search, test

app = Flask(__name__)
api = Api(app)

api.add_resource(Tourneys, "/tournaments/")
api.add_resource(Players, "/players/")
api.add_resource(Search, "/search/<string:search_name>/")


def periodic_task(conn):
    global tourneys, players
    while True:
        tourneys, players = database.parse_database(conn)
        print("refreshed")

        if not CURR_TOURNEY_ID:
            time.sleep(3000)
        else:
            time.sleep(60)

        # if not CURR_TOURNEY_ID:
        #     print("no tournament happening right now!")
        # else:
        #     database.update_tourney(conn, tourneys, CURR_TOURNEY_ID)


if __name__ == "__main__":
    # task_thread = threading.Thread(target=periodic_task, args=[conn])
    # task_thread.daemon = True
    # task_thread.start()
    test()

    app.run(host="0.0.0.0", debug=True)
    database.close_connection(conn)
