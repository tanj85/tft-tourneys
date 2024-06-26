import os

from flask import Flask, request
from flask_restful import Resource, Api
import psycopg2
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
api = Api(app)


def get_db_connection():
    connection = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
    )
    return connection


conn = get_db_connection()
cur = conn.cursor()


tourneys = {}


def init_tournmanets_cache():
    cur.execute("SELECT * FROM tbl_tournament_info")
    rows = cur.fetchall()
    for row in rows:
        id = row[8]

        tourney = {
            "id": id,
            "name": row[0],
            "days": [],
            "tier": row[1],
            "region": row[2],
            # "start_date": row[3],
            # "end_date": row[4],
            "num_participants": row[5],
            "link": row[6],
            "patch": row[7],
        }

        tourneys[id] = tourney

    cur.execute("SELECT * FROM tbl_placement_data")
    rows = cur.fetchall()
    for row in rows:
        tourney_id = row[3]
        day_num = row[4]
        while len(tourneys[tourney_id]["days"]) < day_num:
            tourneys[tourney_id]["days"].append({"games": []})

        game_num = row[6]
        games = tourneys[tourney_id]["days"][day_num - 1]["games"]
        while len(games) < game_num:
            games.append({"lobbies": []})

        lobby_id = row[5]
        lobbies = games[game_num - 1]["lobbies"]
        while len(lobbies) < lobby_id:
            lobbies.append({})
        player_name = row[1]
        placement = row[2]
        lobbies[lobby_id - 1][player_name] = 9 - placement


class AllTournaments(Resource):
    def get(self):
        d = {}
        for id in tourneys:
            d[tourneys[id]["name"]] = tourneys[id]["id"]
        return d


class Tournaments(Resource):

    def get(self, id):
        try:
            int_id = int(id)
            if int_id in tourneys:
                return tourneys[int_id]
        except:
            pass


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


class Player(Resource):

    def get(self, name, tag):
        name += "#" + tag
        if name in player_cache:
            return player_cache[name]


api.add_resource(Tournaments, "/tournaments/<string:id>")
api.add_resource(AllTournaments, "/tournaments/")
api.add_resource(Player, "/player/<string:name>/<string:tag>")


if __name__ == "__main__":
    init_tournmanets_cache()
    app.run(debug=True)
    cur.close()
    conn.close()
