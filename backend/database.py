import os
import psycopg2
from psycopg2.pool import SimpleConnectionPool
from psycopg2.extensions import connection, cursor
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from typing import Dict, List, Optional, Tuple, Iterable

load_dotenv()

conn_pool = SimpleConnectionPool(
    1,
    20,
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port="5432",
    database=os.getenv("DB_NAME"),
)
if conn_pool:
    print("created pool")


def close_conn_pool() -> None:
    if conn_pool:
        conn_pool.closeall()


def get_conn() -> connection:
    return conn_pool.getconn()


def close_conn(conn: connection) -> None:
    conn_pool.putconn(conn)


def query_sql(query: str, ret_dict=False, args=None):
    conn = None
    try:
        conn = get_conn()

        if ret_dict:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(query, args)
                output = cur.fetchall()
            return output

        with conn.cursor() as cur:
            cur.execute(query, args)
            output = cur.fetchall()
            return output
    finally:
        if conn:
            close_conn(conn)


def parse_tournament_info() -> None:
    rows = query_sql("SELECT * FROM tbl_tournament_info")
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

        while len(tourney["days"]) < row[9]:
            tourney["days"].append(None)

        tourney["days"][row[9] - 1] = {
            "standings": {},
            "num_participants": row[5],
            "day": row[9],
            "sheet_index": row[10],
            "games": [],
        }

    return tourneys


def expand(lis, num):
    while len(lis) < num:
        lis.append(None)


def parse_tournament_info_new():
    tourneys = {}

    columns = query_sql(
        """
                    SELECT column_name, data_type
                    FROM information_schema.columns
                    WHERE table_name = 'tbl_tournament_info'
                      AND table_schema = 'public'
                """
    )
    column_names = [col[0] for col in columns]

    rows = query_sql("SELECT * FROM tbl_tournament_info")

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


def parse_placement_data(tourneys, players):
    rows = query_sql("SELECT * FROM tbl_placement_data")
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


def parse_database():

    players = {}
    tourneys = parse_tournament_info()
    parse_placement_data(tourneys, players)

    return tourneys, players


def print_tournament_info_schema(name):
    columns = query_sql(
        """
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = """
        + name
        + ";"
    )

    print("\nColumns in your_table_name:")
    for column in columns:
        print(f"{column[0]}: {column[1]}")


def get_column_names(table_name: str) -> Tuple[str]:
    columns = query_sql(
        f"""
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = '{table_name}';
        """
    )
    columns = tuple(row[0] for row in columns)
    return columns


def print_first_row(name: str):
    rows = query_sql("SELECT * FROM " + name)
    print(rows[0])


# FUTURE
def update_tourney(conn: connection, tourneys, tourney_id: int):
    cur = conn.cursor()
    cur.execute(
        "SELECT * FROM tbl_placement_data WHERE tournament_id=" + str(tourney_id)
    )
    rows = cur.fetchall()


if __name__ == "__main__":
    # print_tournament_info_schema("'tbl_tournament_info'")
    # print_tournament_info_schema("'tbl_placement_data'")
    # print_first_row("tbl_tournament_info")
    # print_first_row("tbl_placement_data")

    close_conn_pool()
