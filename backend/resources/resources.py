from flask_restful import Resource, Api, reqparse
from flask import jsonify
from psycopg2.extensions import connection, cursor

import database




class Tourneys(Resource):
    tourneys = None
    tourney_fields = ["tourney_name", "id", "start_date", "end_date", "num_participants", "patch", "link", "tier", "region"]
    day_fields = ["day", "sheet_index"]

    # initialize
    def __init__(self):
        conn = database.get_db_connection()
        # rows = database.query_sql(conn, "SELECT * FROM tbl_tournament_info")
        tourneys = {}
        tournament_info = {}
        for field in Tourneys.tourney_fields + Tourneys.day_fields:
            tournament_info[field] = database.query_sql(conn, "SELECT " + field + " FROM tbl_tournament_info")
            tournament_info[field] = [x[0] for x in tournament_info[field]]
        
        for i in range(len(tournament_info["id"])):
            id = tournament_info["id"][i]
            if id not in tourneys:
                tourney = {}
                for field in Tourneys.tourney_fields:
                    entry = tournament_info[field][i]
                    if type(entry) != "int":
                        entry = str(entry)
                    tourney[field] = entry
                tourney["days"] = []
                tourneys[id] = tourney;

            day = tournament_info["day"][i]
            while (len(tourney["days"]) < day):
                tourney["days"].append({"standings": {}, "games": []})

            for field in Tourneys.day_fields:
                tourney["days"][day - 1][field] = tournament_info[field][i]

        # intialize standings for each game, changes modifies tourneys
        fields = ["tournament_id", "game_num", "day_num", "lobby_id", "placement", "player_name"]
        placement_data = {}
        for field in fields:
            placement_data[field] = database.query_sql(conn, "SELECT " + field + " FROM tbl_placement_data")
            placement_data[field] = [x[0] for x in placement_data[field]]

        for i in range(len(placement_data["tournament_id"])):
            tourney_id = placement_data["tournament_id"][i]
            day_num = placement_data["day_num"][i]
            game_num = placement_data["game_num"][i]
            lobby_id = placement_data["lobby_id"][i]
            placement = placement_data["placement"][i]
            player_name = placement_data["player_name"][i]
            # print(tourney_id)
            if tourney_id not in tourneys:
                print("what")
                continue

            tourney = tourneys[tourney_id]
            while len(tourney["days"]) < day_num:
                tourney["days"].append({"standings": {}, "games": []})

            games = tourney["days"][day_num - 1]["games"]

            while len(games) < game_num:
                games.append({"lobbies": []})
            lobbies = games[game_num - 1]["lobbies"]
            while len(lobbies) < lobby_id:
                lobbies.append({})
            lobbies[lobby_id - 1][player_name] = placement

            standings = tourneys[tourney_id]["days"][day_num - 1]["standings"]
            if player_name not in standings:
                standings[player_name] = 0
            standings[player_name] += 9 - placement
           
            
        Tourneys.tourneys = tourneys
        conn.close()
        
    def get(self):
        if Tourneys.tourneys is None:
            return None, 500
        parser = reqparse.RequestParser()
        parser.add_argument("id", type=int)
        args = parser.parse_args()
        if not args["id"]:
            return Tourneys.get_tournament_list()
        else:
            return self.get_tournament_info(args["id"])
       
    

    def get_tournament_list():
        return [{field: Tourneys.tourneys[id][field] for field in Tourneys.tourney_fields} for id in Tourneys.tourneys]

    def get_tournament_info(self, id: int):
        tourneys = Tourneys.tourneys
        assert tourneys is not None
        try:
            if id in tourneys:
                return tourneys[id]
        except:
            return None, 500



# api request for individual player, when given a name
class Players(Resource):
    players = None

    def __init__(self):
        foo = Tourneys()
       
        conn = database.get_db_connection()

        players = {}
        placement_data = {}
        for field in ["player_name", "placement", "tournament_id"]:
            placement_data[field] = database.query_sql(conn, "SELECT " + field + " FROM tbl_placement_data")
            placement_data[field] = [x[0] for x in placement_data[field]]

        for i in range(len(placement_data["player_name"])):
            player_name = placement_data["player_name"][i]
            tourney_id = placement_data["tournament_id"][i]
            if player_name.lower() not in players:
                players[player_name.lower()] = {
                    "name": player_name,
                    "live": {},
                    "tournament history": set(),
                }
            players[player_name.lower()]["tournament history"].add(Tourneys.tourneys[tourney_id]["tourney_name"])
        for name in players.keys():
            players[name]["tournament history"] = list(players[name]["tournament history"])

        Players.players = players

        conn.close()


    def get(self):
        if Players.players is None:
            return None, 501

        parser = reqparse.RequestParser()
        parser.add_argument("name", type=str)
        parser.add_argument("tag", type=str)
        args = parser.parse_args()
        print(args)

        if args["name"] is not None and args["tag"] is not None:
            return self.get_player_info(args["name"], args["tag"])

        return list(self.players.keys())

    def get_player_info(self, name, tag):
        players = Players.players
        name += "#" + tag
        name = name.lower()
        if name in players:
            return players[name]

        return None, 400

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

def test():
    players = Players()
