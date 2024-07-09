import time
import threading
from typing import Optional
from flask import Flask
from flask_restful import Resource, Api
from Levenshtein import distance

import database

app = Flask(__name__)
api = Api(app)

CURR_TOURNEY_ID = 67173566


# api request for list of all tournaments names and ids
class AllTournaments(Resource):
    def get(self):
        return list(tourneys.values())

# api request for an individual tournament, when given an id
class Tournaments(Resource):

    def get(self, id):
        try:
            if id.lower() == "current" and CURR_TOURNEY_ID:
                return tourneys[CURR_TOURNEY_ID]
            int_id = int(id)
            if int_id in tourneys:
                return tourneys[int_id]
        except:
            pass


class AllPlayers(Resource):
    def get(self):
        return list(players.keys())


# api request for individual player, when given a name
class Player(Resource):
    def get(self, name, tag):
        name += "#" + tag
        if name in players:
            return players[name]


# returns true if s1 is a prefix of s2
def is_prefix(s1, s2):
    if len(s1) > len(s2):
        return False

    return s1 == s2[: len(s1)]


def remove_tag(name):
    for i in range(len(name) - 1, -1, -1):
        if name[i] == "#":
            return name[:i]


class Search(Resource):
    def get(self, search_name):
        names = list(players.keys())
        names.sort(key=lambda name: distance(remove_tag(name), search_name))
        names = filter(
            lambda name: is_prefix(search_name.lower(), name.lower())
            or distance(remove_tag(name).lower(), search_name.lower()) <= 3,
            names,
        )
        names = list(names)
        return names


api.add_resource(Tournaments, "/tournaments/<string:id>")
api.add_resource(AllTournaments, "/tournaments/")
api.add_resource(Player, "/players/<string:name>/<string:tag>"),
api.add_resource(AllPlayers, "/players/")
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
    global tourneys, players
    conn = database.get_db_connection()
    tourneys, players = database.parse_database(conn)

    task_thread = threading.Thread(target=periodic_task, args=[conn])
    task_thread.daemon = True
    task_thread.start()

    app.run(host="0.0.0.0", debug=True)
    database.close_connection(conn)
