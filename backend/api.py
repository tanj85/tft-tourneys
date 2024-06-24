from flask import Flask, request
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)


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
    "lobby1": {
        "So bio#eprod": 1,
        "prestivent#eprod": 8,
        "seihunkim": 7,
        "ISG FRITZ#eprod": 6,
        "wilf#eprod": 4,
        "Sealkun Mbappe#eprod": 2,
        "Liquid ego#eprod": 5,
        "Ayy Rick#eprod": 3
    },
    "lobby2": {
        "thybeaster#eprod": 2,
        "Cambulee#eprod": 5,
        "LilTop#eprod": 3,
        "Lab018biribiri#eprod": 1,
        "Altenahue TFT#eprod": 7,
        "CookiesOP#eprod": 6,
        "Ciulla#eprod": 4,
        "GK Bapzera#eprod": 8
    }
}

game2 = {
    "lobby1": {
        "So bio#eprod": 8,
        "prestivent#eprod": 7,
        "seihunkim": 5,
        "ISG FRITZ#eprod": 4,
        "wilf#eprod": 3,
        "Sealkun Mbappe#eprod": 1,
        "Liquid ego#eprod": 2,
        "Ayy Rick#eprod": 6
    },
    "lobby2": {
        "thybeaster#eprod": 4,
        "Cambulee#eprod": 2,
        "LilTop#eprod": 1,
        "Lab018biribiri#eprod": 7,
        "Altenahue TFT#eprod": 6,
        "CookiesOP#eprod": 3,
        "Ciulla#eprod": 5,
        "GK Bapzera#eprod": 8
    }
}


class ExampleGame(Resource):
    def get(self):
        return game1


tournament1 = {
    "id": "1",
    "name": "2024 Americas TFT Inkborn Fables Tactician's Cup III",
    "games": {"game1": game1, "game2": game2}
}

tournament2 = {
    "id": "2",
    "name": "2024 Americas TFT Inkborn Fables Tactician's Cup I",
    "games": {}
}

tournaments_cache = {
    "1": tournament1
}


class AllTournaments(Resource):

    def get(self):
        return {
            "2024 Americas TFT Inkborn Fables Tactician's Cup III": "1",
            "2024 Americas TFT Inkborn Fables Tactician's Cup I": "2"
        }


class Tournaments(Resource):

    def get(self, id):

        if id in tournaments_cache:
            return tournaments_cache[id]


class Profile(Resource):

    def get(self, name):

        if id in profile_cache:
            return profile_cache[id]


api.add_resource(HelloWorld, '/')
api.add_resource(Test, '/test')
api.add_resource(ExampleGame, '/examplegame/')
api.add_resource(Tournaments, '/tournaments/<string:id>')
api.add_resource(AllTournaments, '/tournaments/')
api.add_resource(Profile, '/profile/<string:name>')

if __name__ == '__main__':
    app.run(debug=True)
