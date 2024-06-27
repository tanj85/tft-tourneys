import os
import psycopg2
from psycopg2.extensions import connection, cursor
from dotenv import load_dotenv
from typing import Dict, List, Optional

load_dotenv()


# returns a connection to the database
def get_db_connection() -> connection:
    connection = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
    )
    return connection


def parse_tournament_info(conn: connection, cur: cursor, tourneys) -> None:
    cur = conn.cursor()
    cur.execute("SELECT * FROM tbl_tournament_info")

    rows = cur.fetchall()
    for row in rows:
        id = row[8]

        tourney = {
            "id": id,
            "name": row[0],
            "standings": {},
            "days": [],
            "tier": row[1],
            "region": row[2],
            "start_date": str(row[3]),
            "end_date": str(row[4]),
            "num_participants": row[5],
            "link": row[6],
            "patch": row[7],
        }

        tourneys[id] = tourney


def parse_placement_data(
    conn: connection, cur: cursor, tourneys, players, curr_game_id: Optional[int]
):
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
        lobbies[lobby_id - 1][player_name] = placement

        standings = tourneys[tourney_id]["standings"]
        if player_name not in standings:
            standings[player_name] = 0
        standings[player_name] += 9 - placement

        if player_name not in players:
            players[player_name] = {
                "name": player_name,
                "live": {},
                "tournament history": set(),
            }
        players[player_name]["tournament history"].add(tourneys[tourney_id]["name"])
    for name in players.keys():
        players[name]["tournament history"] = list(players[name]["tournament history"])


def parse_database(conn: connection, curr_game_id: Optional[int]):
    cur = conn.cursor()

    tourneys = {}
    players = {}

    parse_tournament_info(conn, cur, tourneys)
    parse_placement_data(conn, cur, tourneys, players, curr_game_id)

    cur.close()

    return tourneys, players


def close_connection(conn: connection) -> None:
    conn.close()
