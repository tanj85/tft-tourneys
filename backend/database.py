import os
import psycopg2
from psycopg2.extensions import connection, cursor
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from typing import Dict, List, Optional
from datetime import date, datetime

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

def query_sql(conn: connection, query: str, ret_dict=False):

    if ret_dict:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query)
            output = cur.fetchall()
        return output

    cur = conn.cursor()
    cur.execute(query)
    output = cur.fetchall()
    cur.close()
    return output

def parse_tournament_info(conn: connection) -> None:
    rows = query_sql(conn, "SELECT * FROM tbl_tournament_info")
    tourneys = {}
    for row in rows:
        if row[8] not in tourneys:
            tourney = {
                "name": row[0],
                "tier": row[1],
                "region": row[2],
                "start_date": str(row[3]),
                "end_date": str(row[4]),
                "link": row[6],
                "patch": row[7],
                "id": row[8],
                "days": [],  # todo: want standings in days
            }
            tourneys[row[8]] = tourney

        while (len(tourney["days"]) < row[9]):
            tourney["days"].append(None)

        tourney["days"][row[9] - 1] = {
            "standings": {},
            "num_participants": row[5],
            "day": row[9],
            "sheet_index": row[10],
            "games": []
        }

    return tourneys


def expand(lis, num):
    while len(lis) < num:
        lis.append(None)
        
def parse_tournament_info_new(conn: connection):
    tourneys = {}

    columns = query_sql(conn, """
                    SELECT column_name, data_type
                    FROM information_schema.columns
                    WHERE table_name = 'tbl_tournament_info'
                      AND table_schema = 'public'
                """)
    column_names = [col[0] for col in columns]

    rows = query_sql(conn, "SELECT * FROM tbl_tournament_info")

#     tournament_level = ["tourney_name", "tier" ,"region", "start_date", "end_date", "patch", "id"]
 #    day_level = ["num_participants", "link"]
    seen_tourneys = set()
    for row in rows:
        seen = False
        day = {}
        for col_name, col_value in zip(column_names, row):
            if col_value != "integer":
                col_value = str(col_value)
            day[col_name] = col_value
        
        
        id = tourney["id"]

        if id not in seen_tourneys:
            tourney = {}
            for col_name in col_names:
                tourney[col_name] = []
        seen_tourneys.add(id)
        for col_name in col_names:
            expand(tourney[col_name]["day"])
            tourney[col_name][day] = day[col_name]

    for id in tourneys:
        for col_name in col_names:
            if len(tourneys["id"]) <= 1:
                break
            
    return tourneys                
        


def parse_placement_data(conn: connection, cur: cursor, tourneys, players):
    rows = query_sql(conn, "SELECT * FROM tbl_placement_data")
    for row in rows:
        tourney_id = row[3]
        day_num = row[4]

        game_num = row[6]
        print(tourneys[tourney_id]["days"][day_num - 1])
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

        standings = tourneys[tourney_id]["days"][day_num - 1]["standings"]
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


def parse_database(conn: connection):
    cur = conn.cursor()

    players = {}

    tourneys = parse_tournament_info(conn)
    parse_placement_data(conn, cur, tourneys, players)

    cur.close()

    return tourneys, players



def print_tournament_info_schema(conn: connection, name):
    cur = conn.cursor()
    cur.execute("""
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = """ + name + ";")

    # Fetch all results
    columns = cur.fetchall()
    print("\nColumns in your_table_name:")
    for column in columns:
        print(f"{column[0]}: {column[1]}")

    cur.close()
def print_first_row(conn: connection, name):
    cur = conn.cursor()
    cur.execute("SELECT * FROM " + name)
    rows = cur.fetchall()
    print(rows[0])
    cur.close()

def update_tourney(conn: connection, tourneys, tourney_id: int):
    cur = conn.cursor()
    cur.execute(
        "SELECT * FROM tbl_placement_data WHERE tournament_id=" + str(tourney_id)
    )
    rows = cur.fetchall()


def close_connection(conn: connection) -> None:
    conn.close()

if __name__ == "__main__":
    conn = get_db_connection()
    print_tournament_info_schema(conn, "'tbl_tournament_info'")
    print_tournament_info_schema(conn, "'tbl_placement_data'")
    print_first_row(conn, "tbl_tournament_info")
    print_first_row(conn, "tbl_placement_data")
