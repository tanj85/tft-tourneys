from flask_restful import Resource, Api, reqparse
from flask import jsonify
from psycopg2.extensions import connection, cursor
from operator import itemgetter
from datetime import datetime, date
from Levenshtein import distance

import database




class Tourneys(Resource):
    tourneys = None
    tourney_fields = ["tournament_name", "tournament_id", "start_date", "end_date", "set", "num_participants", "patch", "liquipedia_link", "tier", "region", "has_detail"]
    day_fields = ["day", "sheet_index"]

    set_dict = {
        2: "Faction Wars",
        3: "Galaxies",
        4: "Fates",
        5: "Reckoning",
        6: "Gizmos & Gadgets",
        7: "Dragonlands",
        8: "Monsters Attack!",
        9: "Runeterra Reforged",
        10: "Remix Rumble",
        11: "Inkborn Fables",
        12: "Magic n' Mayhem",
        13: "Set 13",
    }

    current_set = set_dict[12]

    # initialize
    def __init__(self):
        # rows = database.query_sql(conn, "SELECT * FROM tbl_tournament_info")
        tourneys = {}
        tournament_info = {}
        # for field in Tourneys.tourney_fields:
        #     tournament_info[field] = database.query_sql(conn, f"SELECT {field} FROM tbl_liquipedia_tournaments")
        #     tournament_info[field] = [x[0] for x in tournament_info[field]]

        all_info = database.query_sql("SELECT * FROM tbl_liquipedia_tournaments", True)


        for row in all_info:
            # print(row)
            for k, v in row.items():
                row[k] = v if type(v) == int else str(v)
            tourneys[row["tournament_id"]] = dict(row)
            tourneys[row["tournament_id"]]["has_detail"] = False
        
        detailed_info = database.query_sql("SELECT * FROM tbl_tournament_info", True)

        # print(tourneys)

        for row in detailed_info:
            id = row["id"]
            day = row["day"]
            tourneys[id]["has_detail"] = True
            if "days" not in tourneys[id]:
                tourneys[id]["days"] = []
            
            while (len(tourneys[id]["days"]) < day):
                tourneys[id]["days"].append({"standings": {}, "games": []})
            
            for key in row.keys():
                tourneys[id]["days"][day - 1][key] = row[key]

        # intialize standings for each game, changes modifies tourneys
        fields = ["tournament_id", "game_num", "day_num", "lobby_id", "placement", "player_name"]
        placement_data = {}
        for field in fields:
            placement_data[field] = database.query_sql("SELECT " + field + " FROM tbl_placement_data")
            placement_data[field] = [x[0] for x in placement_data[field]]

        for i in range(len(placement_data["tournament_id"])):
            tourney_id = int(placement_data["tournament_id"][i])
            day_num = placement_data["day_num"][i]
            game_num = placement_data["game_num"][i]
            lobby_id = placement_data["lobby_id"][i]
            placement = placement_data["placement"][i]
            player_name = placement_data["player_name"][i]
            # print(tourney_id)
            if tourney_id not in tourneys:
                print("what", tourney_id)
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
        
    def get(self):
        if Tourneys.tourneys is None:
            return {"message": "Server Error: Tournament data not available"}, 500
        
        parser = reqparse.RequestParser()
        parser.add_argument("id", type=int, location="args", required = False)
        parser.add_argument("sort", type=str, action='append', location="args", required = False, help="Fields to sort by, e.g., 'name' or '-name' for descending", default=None)
        parser.add_argument("tier", type=str, location="args", required = False, help="Which tier of tournaments to return", default=None)
        parser.add_argument("region", type=str, location="args", required = False, help="Which region of tournaments to return", default=None)
        parser.add_argument("date_lower_bound", type=str, location="args", required = False, help="Lower bound of dates to return", default=None)
        parser.add_argument("date_upper_bound", type=str, location="args", required = False, help="Upper bound of dates to return", default=None)
        parser.add_argument("name_search_query", type=str, location="args", required = False, help="Upper bound of dates to return", default=None)
        parser.add_argument("set", type=str, location="args", required = False, help="Which Set of tournaments to return", default=None)
        args = parser.parse_args()

        if args["set"] and args["set"].isdigit():
            args["set"] = int(args["set"])

        if args["id"]:
            return self.get_tournament_info(args["id"])

        # If no ID, process sorting parameters and return sorted list
        sort_fields = []
        ascending = []
        if args["sort"]:
            for field in args["sort"]:
                if field.startswith('-'):
                    sort_fields.append(field[1:])  # strip the '-' for the field name
                    ascending.append(False)  # descending sort
                else:
                    sort_fields.append(field)
                    ascending.append(True)  # ascending sort
        
        return Tourneys.get_tournament_list(sort_fields, ascending, 
                                            args["name_search_query"], args["region"], args["tier"],
                                            args["date_lower_bound"], args["date_upper_bound"], args["set"])
    
    def get_tournament_list(sort_fields=["start_date"], ascending=False, 
                            name_search_query=None, region=None, tier=None, 
                            date_lower_bound=None, date_upper_bound=None, tft_set=None):
        
        tournaments = [{field: Tourneys.tourneys[id][field] for field in Tourneys.tourney_fields} for id in Tourneys.tourneys
                       if (not name_search_query or name_search_query.lower() in Tourneys.tourneys[id]["tournament_name"].lower()) and
                        (not region or region.lower() in Tourneys.tourneys[id]["region"].lower()) and
                        (not tier or tier.lower() in Tourneys.tourneys[id]["tier"].lower()) and 
                        Tourneys.compare_date_valid(date_lower_bound, date_upper_bound, Tourneys.tourneys[id]["start_date"]) and
                        (not tft_set or (tft_set if type(tft_set) == str else Tourneys.set_dict[tft_set]) in Tourneys.tourneys[id]["set"])]
        
        # print(tournaments, name_search_query)

        if sort_fields:
            if isinstance(ascending, bool):
                ascending = [ascending] * len(sort_fields)
            
                
            sort_key = lambda x: tuple((Tourneys.handle_tier_field(asc) if (field == "tier" and x[field] == "S") else 
                                        x[field] if asc else -x[field] if isinstance(x[field], (int, float)) else 
                                        Tourneys.reverse_string(x[field].lower()) if isinstance(x[field], str) else 
                                        x[field]) for field, asc in zip(sort_fields, ascending))
            
            tournaments = sorted(tournaments, key=sort_key)
        
        for tournament in tournaments:
            tournament["place_header"] = ""

        if sort_fields and sort_fields[0] == "start_date":
            today = date.today()
            saw_upcoming = False
            saw_ongoing = False
            saw_past = False
            for tournament in tournaments:
                start_date = datetime.strptime(tournament["start_date"], '%Y-%m-%d').date()
                end_date = datetime.strptime(tournament["end_date"], '%Y-%m-%d').date()

                if not saw_upcoming and start_date > today:
                    tournament["place_header"] = "upcoming"
                    saw_upcoming = True
                elif not saw_ongoing and start_date <= today <= end_date:
                    tournament["place_header"] = "ongoing"
                    saw_ongoing = True
                elif not saw_past and end_date < today:
                    tournament["place_header"] = "past"
                    saw_past = True

        return tournaments
    
    def compare_date_valid(date_lower, date_higher, str_date):
        date_lower = date(1969, 6, 22) if date_lower is None else datetime.strptime(date_lower, '%Y-%m-%d').date()
        date_higher = date(2069, 6, 22) if date_higher is None else datetime.strptime(date_higher, '%Y-%m-%d').date()
        str_date = datetime.strptime(str_date, '%Y-%m-%d').date()
        return date_lower < str_date < date_higher
    
    def handle_tier_field(asc):
        if asc:
            return 'z'
        return '@'
    
    def reverse_string(s):
        return ''.join([chr(53+64+64-ord(x)) for x in s])
    
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
        _ = Tourneys() # initialize tourneys

        players = {}
        placement_data = {}
        for field in ["player_name", "placement", "tournament_id"]:
            placement_data[field] = database.query_sql("SELECT " + field + " FROM tbl_placement_data")
            placement_data[field] = [x[0] for x in placement_data[field]]

        for i in range(len(placement_data["player_name"])):
            player_name = placement_data["player_name"][i]
            tourney_id = placement_data["tournament_id"][i]
            tourney_name = Tourneys.tourneys[tourney_id]["tournament_name"]
            if player_name.lower() not in players:
                players[player_name.lower()] = {
                    "name": player_name,
                    "live": {},
                    "tournament history": {},
                }
        #     players[player_name.lower()]["tournament history"].add(Tourneys.tourneys[tourney_id]["tourney_name"])
        # for name in players.keys():
        #     players[name]["tournament history"] = list(players[name]["tournament history"])
            players[player_name.lower()]["tournament history"][tourney_name] = tourney_id

        Players.players = players


    def get(self):
        if Players.players is None:
            return None, 501

        parser = reqparse.RequestParser()
        parser.add_argument("name", type=str, location="args")
        parser.add_argument("tag", type=str, location="args")
        args = parser.parse_args()
        print(args)

        if args["name"] is not None and args["tag"] is not None:
            return self.get_player_info(args["name"], args["tag"])

        return list(self.players.keys())

    def get_player_info(self, name, tag):
        players = Players.players
        # just to run v can remove if its an issue
        if name.lower() in players:
            return players[name]
        # just to run ^
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
