from flask import Flask, request
from flask_restful import Resource, Api
import psycopg2
from psycopg2 import sql

app = Flask(__name__)
api = Api(app)

DB_HOST = "68.183.150.147"
DB_NAME = "tftourneys"
DB_USER = "postgres"
DB_PASS = "tft!"


class HelloWorld(Resource):
    def get(self):
        return {"hello": "world"}


class Test(Resource):
    def get(self):
        return {"jdfkla": "djklafjad", "dfjkla": 5}


class Tournament(Resource):
    # want an input of a tournment name
    # returns list of rounds

    # each game is a list of lobbies
    # each lobbies is a map of 8 players along to their score
    def get(self):
        pass


# https://docs.google.com/spreadsheets/d/e/2PACX-1vQjodoBBeSzVtRFp6-nRsQYkShZjJamVwCDrwXDzK8BA1nrOa594V0zRyvP2HDOdST-NyrIsNVbLy1K/pubhtml#
game1 = {
    "lobbies": [
        {
            "So bio#eprod": 1,
            "prestivent#eprod": 8,
            "seihunkim": 7,
            "ISG FRITZ#eprod": 6,
            "wilf#eprod": 4,
            "Sealkun Mbappe#eprod": 2,
            "Liquid ego#eprod": 5,
            "Ayy Rick#eprod": 3,
        },
        {
            "thybeaster#eprod": 2,
            "Cambulee#eprod": 5,
            "LilTop#eprod": 3,
            "Lab018biribiri#eprod": 1,
            "Altenahue TFT#eprod": 7,
            "CookiesOP#eprod": 6,
            "Ciulla#eprod": 4,
            "GK Bapzera#eprod": 8,
        },
    ]
}

game2 = {
    "lobbies": [
        {
            "So bio#eprod": 8,
            "prestivent#eprod": 7,
            "seihunkim": 5,
            "ISG FRITZ#eprod": 4,
            "wilf#eprod": 3,
            "Sealkun Mbappe#eprod": 1,
            "Liquid ego#eprod": 2,
            "Ayy Rick#eprod": 6,
        },
        {
            "thybeaster#eprod": 4,
            "Cambulee#eprod": 2,
            "LilTop#eprod": 1,
            "Lab018biribiri#eprod": 7,
            "Altenahue TFT#eprod": 6,
            "CookiesOP#eprod": 3,
            "Ciulla#eprod": 5,
            "GK Bapzera#eprod": 8,
        },
    ]
}


class ExampleGame(Resource):
    def get(self):
        return game1


standings1 = [
    {
        "placement": 1,
        "player": "socks#eprod",
        "region": "NA",
        "games points": [8, 3, 7, 6, 6, 7, 5],
        "total": 42,
        "cumulative total": 98,
        "top 4+1": 7,
        "placement counts": [1, 2, 2, 1, 0, 1, 0, 8],
        "eod placement": 5,
        "game placements": [8, 3, 7, 6, 6, 7],
    },
    {
        "placement": 2,
        "player": "prestivent#eprod",
        "region": "NA",
        "games points": [8, 7, 6, 8, 2, 4, 6],
        "total": 41,
        "cumulative total": 105,
        "top 4+1": 7,
        "placement counts": [7, 2, 1, 2, 0, 1, 0, 1, 0],
        "eod placement": 6,
        "game placements": [8, 7, 6, 8, 2, 4],
    },
]

event_info = {}

tournament1 = {
    "id": "1",
    "name": "2024 Americas TFT Inkborn Fables Tactician's Cup III",
    "days": [{"games": [game1, game2], "standings": standings1}],
    "event info": event_info,
}

tournament2 = {
    "id": "2",
    "name": "2024 Americas TFT Inkborn Fables Tactician's Cup I",
    "games": {},
}

tournaments_cache = {"1": tournament1}


class AllTournaments(Resource):

    def get(self):
        return {
            "2024 Americas TFT Inkborn Fables Tactician's Cup III": "1",
            "2024 Americas TFT Inkborn Fables Tactician's Cup I": "2",
        }


class Tournaments(Resource):

    def get(self, id):

        if id in tournaments_cache:

            return tournaments_cache[id]


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


api.add_resource(HelloWorld, "/")
api.add_resource(Test, "/test")
api.add_resource(ExampleGame, "/examplegame/")
api.add_resource(Tournaments, "/tournaments/<string:id>")
api.add_resource(AllTournaments, "/tournaments/")
api.add_resource(Player, "/player/<string:name>/<string:tag>")

if __name__ == "__main__":
    app.run(debug=True)
