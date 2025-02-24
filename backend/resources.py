# from operator import itemgetter
from datetime import datetime, date, timedelta
from typing import List, Callable, Iterable, Optional, Tuple
from dataclasses import dataclass

from flask_restful import Resource, reqparse  # type: ignore

# from Levenshtein import distance

import database

debug = True


class Tourneys(Resource):
    _initialized = False
    tourneys: dict[int, dict] = {}
    tourney_fields = [
        "tournament_name",
        "tournament_id",
        "start_date",
        "end_date",
        "set",
        "num_participants",
        "patch",
        "liquipedia_link",
        "tier",
        "region",
        "has_detail",
        "live",
        "rules",
    ]
    day_fields = ["day", "sheet_index"]
    field_types = {
        "tournament_name": str,
        "tournament_id": int,
        "start_date": str,
        "end_date": str,
        "set": str,
        "num_participants": int,
        "patch": str,
        "liquipedia_link": str,
        "tier": str,
        "region": str,
        "has_detail": bool,
        "day": str,
        "sheet_index": int,
        "live": bool,
        "rules": List[str],
    }

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
    last_load_all: datetime = datetime.min
    last_load_live: datetime = datetime.min
    LOAD_ALL_DELTA: int = 10
    LOAD_LIVE_DELTA: int = 5

    @classmethod
    def get_placement_data(cls, tournament_ids: Tuple[int, ...]) -> dict[str, list]:
        """Given [tournament_ids], return placement data of those tournaments"""
        placement_data_columns = database.get_column_names("tbl_placement_data")

        query = "SELECT * FROM tbl_placement_data"
        if len(tournament_ids) > 1:
            # print(tournament_ids, len(tournament_ids))
            # print(str(tournament_ids))
            query += f" WHERE tournament_id IN {tournament_ids}"
        elif len(tournament_ids) == 1:
            # print("hi")
            query += f" WHERE tournament_id IN ({tournament_ids[0]})"
            print(query)
        else:
            return {name: [] for name in placement_data_columns}

        query_data = database.query_sql(query)
        placement_data: dict[str, list] = {name: [] for name in placement_data_columns}
        for row in query_data:
            for i, col_name in enumerate(placement_data_columns):
                placement_data[col_name].append(row[i])

        # postcondition
        if debug:
            assert_fields = (
                "tournament_id",
                "day_num",
                "game_num",
                "lobby_id",
                "placement",
                "player_name",
            )
            for field in assert_fields:
                assert (
                    field in placement_data
                ), f"postcondition violated: {field} missing in placement data columns"
        return placement_data

    @classmethod
    def get_all_tournament_ids(cls) -> Tuple[int, ...]:
        all_ids = Tourneys.tourneys.keys()
        return tuple(all_ids)

    @classmethod
    def get_live_tournament_ids(cls) -> Tuple[int, ...]:
        all_ids = Tourneys.get_all_tournament_ids()
        live_ids = (id for id in all_ids if Tourneys.tourneys[id]["live"])

        return tuple(live_ids)

    def load_placement_data(tournament_ids: Tuple[int, ...]) -> None:
        """Loads/reloads the placement data of the tournaments with ids in [tournament_ids].
        Modifies Tourneys.tourneys."""
        placement_data = Tourneys.get_placement_data(tournament_ids)

        
        for i in range(len(tournament_ids)):
            if tournament_ids[i] in Tourneys.tourneys and "days" in Tourneys.tourneys[tournament_ids[i]]:
                Tourneys.tourneys[tournament_ids[i]]["days"] = []

        for i in range(len(placement_data["tournament_id"])):
            tourney_id = int(placement_data["tournament_id"][i])
            day_num = placement_data["day_num"][i]
            game_num = placement_data["game_num"][i]
            lobby_id = placement_data["lobby_id"][i]
            placement = placement_data["placement"][i]
            player_name = placement_data["player_name"][i]

            tourney = Tourneys.tourneys[tourney_id]
            while len(tourney["days"]) < day_num:
                tourney["days"].append({"standings": {}, "games": []})

            games = tourney["days"][day_num - 1]["games"]
            while len(games) < game_num:
                games.append({"lobbies": []})
            lobbies = games[game_num - 1]["lobbies"]
            if (lobby_id != -1):
                while len(lobbies) < lobby_id:
                    lobbies.append({})
                lobbies[lobby_id - 1][player_name] = placement
            else:
                if len(lobbies) == 0:
                    lobbies.append({})
                lobbies[0][player_name] = placement

            standings = Tourneys.tourneys[tourney_id]["days"][day_num - 1]["standings"]
            if player_name not in standings:
                standings[player_name] = 0
            standings[player_name] += 9 - placement

    @classmethod
    def load_all_tourneys(cls) -> None:
        """Loads/reloads all tourneys. Modifies Tourneys.tourneys."""
        tourneys = {}

        all_info = database.query_sql("SELECT * FROM tbl_liquipedia_tournaments", True)
        current_time = datetime.now()
        for row in all_info:
            for k, v in row.items():
                row[k] = v if type(v) in (int, type(None)) else str(v)
            tourneys[row["tournament_id"]] = dict(row)
            tourneys[row["tournament_id"]]["has_detail"] = False
            tourneys[row["tournament_id"]]["live"] = False 
            tourneys[row["tournament_id"]]["days"] = []
            tourneys[row["tournament_id"]]["rules"] = []

        detailed_info = database.query_sql("SELECT * FROM tbl_tournament_info", True)

        for row in detailed_info:
            id = row["id"]
            day = row["day"]

            tourneys[id]["has_detail"] = True
            start_date = datetime.strptime(tourneys[id]["start_date"], "%Y-%m-%d")
            end_date = datetime.strptime(tourneys[id]["end_date"], "%Y-%m-%d") + timedelta(hours=31)
            tourneys[id]["live"] = (
                start_date <= current_time <= end_date
            )

            # scuffed check for if the tournament detailed data is nuked :p
            if day == -1:
                day = 3

                while len(tourneys[id]["days"]) < day:
                    tourneys[id]["days"].append({"standings": {}, "games": []})

                for day_num in range(day):

                    for key in row.keys():
                        if len(tourneys[id]["days"]) > day_num:
                            tourneys[id]["days"][day_num][key] = row[key]
            
            else:

                while len(tourneys[id]["days"]) < day:
                    tourneys[id]["days"].append({"standings": {}, "games": []})

                for key in row.keys():
                    if len(tourneys[id]["days"]) > day-1:
                        tourneys[id]["days"][day - 1][key] = row[key]
        
        tourney_special_rules = database.query_sql("SELECT * FROM tbl_tournament_rules", True)

        for row in tourney_special_rules:
            if row["id"] not in tourneys:
                tourneys[row["id"]] = {"rules": []}
            else:
                tourneys[row["id"]]["rules"] = []

            for column, value in row.items():
                if column == "id":
                    continue
                if isinstance(value, bool) and value: 
                    tourneys[row["id"]]["rules"].append(column)
                elif isinstance(value, str) and value.strip(): 
                    tourneys[row["id"]]["rules"].append(value)
                elif isinstance(value, int): 
                    tourneys[row["id"]]["rules"].append(column + "-" + str(value))

        # intialize standings for each game, changes modifies tourneys
        Tourneys.tourneys = tourneys
        Tourneys.load_placement_data(Tourneys.get_all_tournament_ids())
        Tourneys.last_load_all = datetime.now()
        Tourneys.last_load_live = datetime.now()

    # initialize
    def __init__(self):
        Tourneys.init()

    @classmethod
    def init(cls) -> None:
        if not Tourneys._initialized:
            Tourneys.load_all_tourneys()
            Tourneys._initialized = True

    def get(self, id=None):
        if id:
            return id

        parser = reqparse.RequestParser()
        parser.add_argument("id", type=int, location="args", required=False)
        parser.add_argument(
            "sort",
            type=str,
            action="append",
            location="args",
            required=False,
            help="Fields to sort by, e.g., 'name' or '-name' for descending",
            default=None,
        )
        parser.add_argument(
            "tier",
            type=str,
            location="args",
            required=False,
            help="Which tier of tournaments to return",
            default=None,
        )
        parser.add_argument(
            "region",
            type=str,
            location="args",
            required=False,
            help="Which region of tournaments to return",
            default=None,
        )
        parser.add_argument(
            "date_lower_bound",
            type=str,
            location="args",
            required=False,
            help="Lower bound of dates to return",
            default=None,
        )
        parser.add_argument(
            "date_upper_bound",
            type=str,
            location="args",
            required=False,
            help="Upper bound of dates to return",
            default=None,
        )
        parser.add_argument(
            "name_search_query",
            type=str,
            location="args",
            required=False,
            help="Upper bound of dates to return",
            default=None,
        )
        parser.add_argument(
            "set",
            type=str,
            location="args",
            required=False,
            help="Which Set of tournaments to return",
            default=None,
        )
        parser.add_argument(
            "has_detail", type=str, location="args", required=False, default=None
        )
        parser.add_argument(
            "live", type=str, location="args", required=False, default=None
        )
        args = parser.parse_args()

        if args["set"] and args["set"].isdigit():
            args["set"] = int(args["set"])

        if args["id"]:
            return self.get_tournament_info(args["id"])
        
        if args["live"]:
            if args["live"] == "true":
                args["live"] = True
            elif args["live"] == "false":
                args["live"] = False
            else:
                args["live"] = None
        
        # print(args["has_detail"])
        if args["has_detail"]:
            if args["has_detail"] == "TFTourneys":
                args["has_detail"] = True
            elif args["has_detail"] == "Liquipedia":
                args["has_detail"] = False
            else:
                args["has_detail"] = None

        # If no ID, process sorting parameters and return sorted list
        sort_fields = []
        ascending = []
        if args["sort"]:
            for field in args["sort"]:
                if field.startswith("-"):
                    sort_fields.append(field[1:])  # strip the '-' for the field name
                    ascending.append(False)  # descending sort
                else:
                    sort_fields.append(field)
                    ascending.append(True)  # ascending sort

        return Tourneys.get_tournament_list(
            sort_fields,
            ascending,
            args["name_search_query"],
            args["region"],
            args["tier"],
            args["date_lower_bound"],
            args["date_upper_bound"],
            args["set"],
            args["has_detail"],
            args["live"],
        )

    # def get_tourney_list(tourney_ids: Tuple[int, ...]):
    #     assert Tourneys.tourneys is not None
    #     tourney_list = (Tourneys.tourneys[id] for id in tourney_ids)
        # return tuple(tourney_list)

    def get_tournament_list(
        sort_fields=[],
        ascending=[],
        name_search_query=Optional[str],
        region=Optional[str],
        tier=None,
        date_lower_bound=None,
        date_upper_bound=None,
        tft_set=None,
        has_detail = None,
        live = None,
    ):
        all_params_except_detail = (sort_fields, ascending, name_search_query, region, tier, date_lower_bound, date_upper_bound, tft_set)
        pull_out_live = False
        urlParamsEmpty = False
        if all(not x for x in all_params_except_detail):
            sort_fields = ["live","start_date"]
            ascending = False
            pull_out_live = True
            urlParamsEmpty = True
        
        if not sort_fields:
            sort_fields = ["live","start_date"]
            ascending = False
            urlParamsEmpty = True

        tournaments = [
            {
                field: Tourneys.tourneys[id][field]
                for field in Tourneys.tourney_fields
            }
            for id in Tourneys.tourneys
            if (
                name_search_query is None
                or name_search_query.lower()
                in Tourneys.tourneys[id]["tournament_name"].lower()
            )
            and (
                region is None
                or region.lower() in Tourneys.tourneys[id]["region"].lower()
            )
            and (tier is None or tier.lower() in Tourneys.tourneys[id]["tier"].lower())
            and Tourneys.compare_date_valid(
                date_lower_bound, date_upper_bound, Tourneys.tourneys[id]["start_date"]
            )
            and (
                tft_set is None
                or (tft_set if type(tft_set) == str else Tourneys.set_dict[tft_set])
                in Tourneys.tourneys[id]["set"]
            )
            and (
                has_detail is None
                or has_detail == Tourneys.tourneys[id]["has_detail"]
            )
            and (
                live is None
                or live == Tourneys.tourneys[id]["live"]
            )
        ]

        # print(tournaments, name_search_query)

        if sort_fields:
            if isinstance(ascending, bool):
                ascending = [ascending] * len(sort_fields)

            for i in range(len(ascending)):
                if (
                    Tourneys.field_types[sort_fields[i]] == str
                    and not "date" in sort_fields[i]
                ):
                    ascending[i] = not ascending[i]

            sort_key = lambda x: tuple(
                (
                    Tourneys.handle_tier_field(asc)
                    if (field == "tier" and x[field] == "S")
                    else (
                        Tourneys.handle_none(field) 
                        if x[field] is None 
                        else(
                            x[field]
                            if asc
                            else (
                                -x[field]
                                if isinstance(x[field], (int, float))
                                else (
                                    Tourneys.reverse_string(x[field].lower())
                                    if isinstance(x[field], str)
                                    else x[field]
                                )
                            )
                        )
                    )
                )
                for field, asc in zip(sort_fields, ascending)
            )

            tournaments = sorted(tournaments, key=sort_key)

        for tournament in tournaments:
            tournament["place_header"] = ""

        if sort_fields and (sort_fields[0] == "start_date" or sort_fields[0] == "live"):
            today = date.today()
            upcoming_first_index = -1
            upcoming_last_index = -1
            saw_upcoming = False
            saw_ongoing = False
            saw_past = False
            saw_live = False
            curr_index = -1
            for tournament in tournaments:
                curr_index += 1
                start_date = datetime.strptime(
                    tournament["start_date"], "%Y-%m-%d"
                ).date()
                end_date = datetime.strptime(tournament["end_date"], "%Y-%m-%d").date()

                if pull_out_live and not saw_live and tournament["live"]:
                    tournament["place_header"] = "live"
                    saw_live = True
                elif not saw_upcoming and start_date > today:
                    if not urlParamsEmpty:
                        tournament["place_header"] = "upcoming"
                    saw_upcoming = True
                    upcoming_first_index = curr_index
                    upcoming_last_index = curr_index
                elif saw_upcoming and start_date > today:
                    upcoming_last_index = curr_index
                elif not saw_ongoing and start_date <= today <= end_date and not tournament["live"]:
                    tournament["place_header"] = "ongoing"
                    saw_ongoing = True
                elif not saw_past and end_date < today:
                    tournament["place_header"] = "past"
                    saw_past = True
            if urlParamsEmpty and upcoming_first_index >= 0 and upcoming_last_index >= 0:
                # print(upcoming_first_index, upcoming_last_index)
                rev_upcoming = list(reversed(tournaments[upcoming_first_index:upcoming_last_index+1])) 
                # print([x["start_date"] for x in rev_upcoming])
                tournaments = tournaments[:upcoming_first_index]  + rev_upcoming + tournaments[upcoming_last_index+1:]  
                tournaments[upcoming_first_index]["place_header"] = "upcoming"
                # print([x["start_date"] for x in tournaments])

        return tournaments

    def compare_date_valid(date_lower, date_higher, str_date):
        date_lower = (
            date(1969, 6, 22)
            if date_lower is None
            else datetime.strptime(date_lower, "%Y-%m-%d").date()
        )
        date_higher = (
            date(2069, 6, 22)
            if date_higher is None
            else datetime.strptime(date_higher, "%Y-%m-%d").date()
        )
        str_date = datetime.strptime(str_date, "%Y-%m-%d").date()
        return date_lower < str_date < date_higher

    def handle_none(field):
        if Tourneys.field_types[field] == int:
            return 0
        if Tourneys.field_types[field] == str:
            return ""
        return None

    def handle_tier_field(asc):
        # print(asc)
        if asc:
            return chr(1)
        return chr(255)
    
    def reverse_string(s):
        return "".join([chr(255 - ord(x)) for x in s if ord(x) > 0 and ord(x) < 255])

    def get_tournament_info(self, id: int):
        tourneys = Tourneys.tourneys
        assert tourneys is not None
        try:
            if id in tourneys:
                return tourneys[id]
        except:
            return None, 500

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("live_only", type=str, location="args", required=False, default=None)
        args = parser.parse_args()
        print(args)
        if args["live_only"] is None:
            Tourneys.load_all_tourneys()
            Tourneys.last_load_all = datetime.now()
            print("reloaded all tournaments")
            return {"message": "reloaded all tournaments"}, 200

        if args["live_only"].lower() == "true":
            Tourneys.load_placement_data(Tourneys.get_live_tournament_ids())
            Tourneys.last_load_live = datetime.now()
            print("reloaded live tournaments only")
            return {"message": "reloaded live tournaments"}, 200
        
        return {"message": "couldn't load anything"}, 500


# api request for individual player, when given a name
class Players(Resource):
    players = None

    def __init__(self):
        _ = Tourneys()  # force tourneys to be initialzied first!

        players = {}
        placement_data = {}
        for field in ["player_name", "placement", "tournament_id"]:
            placement_data[field] = database.query_sql(
                "SELECT " + field + " FROM tbl_placement_data"
            )
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
            players[player_name.lower()]["tournament history"][
                tourney_name
            ] = tourney_id

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


def is_prefix(s1: str, s2: str) -> bool:
    """returns if [s1] is a prefix of [s2]"""
    if len(s1) > len(s2):
        return False

    return s1 == s2[: len(s1)]


def remove_tag(name: str) -> str:
    for i in range(len(name) - 1, -1, -1):
        if name[i] == "#":
            return name[:i]
    return name


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


if __name__ == "__main__":
    Tourneys.init()
    print(Tourneys.get_live_tournament_ids())
    pass
