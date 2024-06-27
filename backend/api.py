import os
from flask import Flask, request
from flask_restful import Resource, Api
import psycopg2
from psycopg2.extensions import connection

import database

app = Flask(__name__)
api = Api(app)

CURRENT_GAME_ID = 67173566


# api request for list of all tournaments names and ids
class AllTournaments(Resource):
    def get(self):
        lis = []
        for id in tourneys:
            lis.append(
                {
                    "name": tourneys[id]["name"],
                    "id": tourneys[id]["id"],
                    "tier": tourneys[id]["tier"],
                    "region": tourneys[id]["region"],
                    "num_participants": tourneys[id]["num_participants"],
                    "patch": tourneys[id]["patch"],
                }
            )
        return lis


# api request for an individual tournament, when given an id
class Tournaments(Resource):

    def get(self, id):
        try:
            int_id = int(id)
            if int_id in tourneys:
                return tourneys[int_id]
        except:
            pass


class AllPlayers(Resource):
    def get(self):
        print(type(players.keys()))
        return list(players.keys())


player1 = {
    "name": "Sio bio#eprod",
    "live standings": {
        "current tournament": "2024 Americas TFT Inkborn Fables Tactician's Cup III",
        "current game": "lobby6",
        "current placement overall": 6,
        "game placements": {
            "game1": 4,
            "game2": 6,
        },
        "total points": 54,
    },
    "tournament history": [
        "2024 Americas TFT Inkborn Fables Tactician's Cup III",
        "2024 Americas TFT Inkborn Fables Tactician's Cup I",
    ],
}

player_cache = {"Sio bio#eprod": player1}


# api request for individual player, when given a name
class Player(Resource):
    def get(self, name, tag):
        name += "#" + tag
        if name in players:
            return players[name]


api.add_resource(Tournaments, "/tournaments/<string:id>")
api.add_resource(AllTournaments, "/tournaments/")
api.add_resource(Player, "/players/<string:name>/<string:tag>"),
api.add_resource(AllPlayers, "/players/")


if __name__ == "__main__":
    global tourneys, players
    conn = database.get_db_connection()
    tourneys, players = database.parse_database(conn, CURRENT_GAME_ID)
    database.close_connection(conn)
    app.run(debug=True)
