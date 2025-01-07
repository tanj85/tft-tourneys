import pandas as pd
from sqlalchemy import create_engine, text
import psycopg2
import requests
from bs4 import BeautifulSoup
import os
from remove_eprod import remove_eprod



db_name = os.getenv("DB_NAME")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_port = '5432'
table_name = 'tbl_tournament_info'

def insert_placement_data(player_name, placement, tournament_id, day_num, lobby_id, game_num):
    """Insert a new record into the tbl_placement_data table if it doesn't already exist."""
    
    sql = """INSERT INTO tbl_placement_data (player_name, placement, tournament_id, day_num, lobby_id, game_num)
             SELECT %s, %s, %s, %s, %s, %s
             WHERE NOT EXISTS (
                 SELECT 1 FROM tbl_placement_data 
                 WHERE player_name = %s AND tournament_id = %s AND day_num = %s AND lobby_id = %s AND game_num = %s
             );"""

    try:
        # Connect to the PostgreSQL database server
        with psycopg2.connect(host=db_host, database=db_name, user=db_user, password=db_password) as conn:
            with conn.cursor() as cur:
                # Execute the INSERT statement with a check for existing record
                cur.execute(sql, (player_name, placement, tournament_id, day_num, lobby_id, game_num,
                                  player_name, tournament_id, day_num, lobby_id, game_num))
                # Check the number of rows affected
                rows_added = cur.rowcount

                # Commit the changes to the database
                conn.commit()
                return 1 if rows_added > 0 else 0  # Return 1 if a row was added, otherwise 0
    
    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")
        if conn:
            conn.rollback()  # Rollback transaction on error
        return 0

def getNum(df, r, c):
    num = ''.join(filter(str.isdigit, df.iloc[r, c]))
    return int(num) if num.isdigit() else None

def removeTag(name):
    parts = name.rsplit('#', 1)
    return parts[0] if len(parts) > 1 else name

def getSheetIndexByName(url, sheetName):
    response = requests.get(url)
    html_content = response.text

    soup = BeautifulSoup(html_content, 'html.parser')
    tabs = soup.find_all('li', id=lambda value: value and value.startswith('sheet-button'))

    # Extract sheet names and IDs
    sheets = []
    for tab in tabs:
        sheet_name = tab.find('a').text.strip()
        sheets.append(sheet_name)
    try:
        sheetIndex = sheets.index(sheetName)
    except:
        print(f"{sheetName} NOT A VALID SHEET NAME IN THIS SHEET")
        sheetIndex = -1
    
    return sheetIndex

def apac_scrape(tournament_id, url, day, sheet):
    dfs = pd.read_html(url)  # This reads all tables into a list of DataFrame objects

    df = dfs[sheet]

    player_cols = [i for i, col in enumerate(df.columns) if df[col].astype(str).str.contains("Name").any()]

    game_cols = [i for i, col in enumerate(df.columns) if df[col].astype(str).str.contains("Round").any()]

    scraped = 0

    current_game = 0
    # print(df)
    num_player_rows = int(pd.to_numeric(df.iloc[:, 1], errors='coerce').max())
    # print(num_player_rows)

    for col in game_cols:
        current_game += 1
        for i in range(num_player_rows):
            # print(df.iloc[i+1, player_cols[0]], "|", df.iloc[i, col])
            try:
                
                num = getNum(df, i+1, col)
                if num is None:
                    continue
                scraped += insert_placement_data(removeTag(df.iloc[i+1, player_cols[0]]), 9-num, tournament_id, day, -1, current_game)
            except:
                pass
    print(f"scraped tourney {tournament_id}, day {day} and updated {scraped} entries")

    return scraped

def default_scrape(tournament_id, url, day, sheet):

    dfs = pd.read_html(url)  # This reads all tables into a list of DataFrame objects

    df = dfs[sheet]

    player_cols = [i for i, col in enumerate(df.columns) if df[col].astype(str).str.contains("Name").any()]

    # Store game and lobby info as you find it for use with subsequent rows
    current_game = 0  # assuming the games are numbered sequentially in the DataFrame

    # print(f"{'Player':<30} {'Score':<5} {'Lobby':<5} {'Game':<5}")

    # print(player_cols)

    scraped = 0

    for col in player_cols:
        current_game += 1
        # print(current_game)
        current_lobby = None
        game_lobby_rows = df[df.iloc[:, col].str.contains("LOBBY", na=False, case=False)].index

        # print(game_lobby_rows)
        # print(df.iloc[:, col])

        for index, row in df.iterrows():
            if index in game_lobby_rows:
                # print(index, col)
                current_lobby = getNum(df, index, col)
            elif current_lobby is not None and pd.notna(df.iloc[index, col]) and pd.notna(df.iloc[index, col+1]):
                num = getNum(df, index, col+1)
                if num is None:
                    continue
                scraped += insert_placement_data(removeTag(df.iloc[index, col]), 9-num, tournament_id, day, current_lobby, current_game)
                # print(f"{df.iloc[index, col]:<30} {9-getNum(df, index, col+1):<5} {current_lobby:<5} {current_game:<5}")
    print(f"scraped tourney {tournament_id}, day {day} and updated {scraped} entries")

    return scraped


def day_header_scrape(tournament_id, url, day, sheet):

    dfs = pd.read_html(url)  # This reads all tables into a list of DataFrame objects

    df = dfs[sheet]

    player_cols = [i for i, col in enumerate(df.columns) if (df[col].astype(str).str.contains("Name").any() and df[col].astype(str).str.contains(f"DAY {day}").any())]

    # Store game and lobby info as you find it for use with subsequent rows
    current_game = 0  # assuming the games are numbered sequentially in the DataFrame

    # print(f"{'Player':<30} {'Score':<5} {'Lobby':<5} {'Game':<5}")

    print(player_cols)

    scraped = 0

    for col in player_cols:
        current_game += 1
        # print(current_game)
        current_lobby = None
        game_lobby_rows = df[df.iloc[:, col].str.contains("LOBBY", na=False, case=False)].index

        # print(game_lobby_rows)
        # print(df.iloc[:, col])

        for index, row in df.iterrows():
            if index in game_lobby_rows:
                # print(index, col)
                current_lobby = getNum(df, index, col)
            elif current_lobby is not None and pd.notna(df.iloc[index, col]) and pd.notna(df.iloc[index, col+1]):
                num = getNum(df, index, col+1)
                if num is None:
                    continue
                scraped += insert_placement_data(removeTag(df.iloc[index, col]), 9-num, tournament_id, day, current_lobby, current_game)
                
                # print(f"{df.iloc[index, col]:<30} {9-getNum(df, index, col+1):<5} {current_lobby:<5} {current_game:<5}")
    print(f"scraped tourney {tournament_id}, day {day} and updated {scraped} entries")

    return scraped

def scrape_tourney(tournament_id, engine = None, quick_insert = False):

    scraped = 0

    if engine is None:
        

        # Database connection details

        db_name = os.getenv("DB_NAME")
        db_user = os.getenv("DB_USER")
        db_password = os.getenv("DB_PASSWORD")
        db_host = os.getenv("DB_HOST")
        db_port = '5432'
        table_name = 'tbl_tournament_info'


        # Create a connection to the PostgreSQL database
        engine = create_engine(f'postgresql+psycopg2://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}')

    # Set up the database query to retrieve URLs for the given tournament ID
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT link,day,sheet_index,sheet_name,updated_flag FROM tbl_tournament_info WHERE id = :t_id"),
            {'t_id': tournament_id}
        )
        urls = []
        days = []
        sheet_indices = [] 
        sheet_names = []
        updated = []
        
        # Iterate through the result set a single time
        for row in result:
            urls.append(row[0])       # Access by column name for clarity
            days.append(row[1])
            sheet_indices.append(row[2]) 
            sheet_names.append(row[3])
            updated.append(row[4])            
    # Process each URL
    # print(urls)
    # print(days)
    # print(sheet_indices)
    # print(updated)

    for j in range(len(urls)):

        if not urls[j]:
            print(f"tourney {tournament_id} has no sheet link, skipping.")
            continue

        if quick_insert and updated[j] == 1:
            print(f"skippa tourney {tournament_id}, day {days[j]}")
            continue

        if sheet_indices[j] == -1:
            if not sheet_names[j]:
                print(f"skippa bc not exist tourney {tournament_id}, day {days[j]}")
                continue
            print("using sheet_name")
            sheet_indices[j] = getSheetIndexByName(urls[j], sheet_names[j])
            if sheet_indices[j] == -1:
                print(f"Tourney {tournament_id}, day {days[j]} is BOINKED, sadge")
                continue

        special_scrape = None

        with engine.connect() as conn2:
            
            result = conn2.execute(
                text("SELECT special_scrape FROM tbl_tournament_rules WHERE id = :t_id"),
                {'t_id': tournament_id}
            )

            for row in result:
                special_scrape = row[0]

        if special_scrape == "day_header":
            scraped += day_header_scrape(tournament_id, urls[j], days[j], sheet_indices[j])
        elif special_scrape == "apac":
            scraped += apac_scrape(tournament_id, urls[j], days[j], sheet_indices[j])
        else:
            scraped += default_scrape(tournament_id, urls[j], days[j], sheet_indices[j])

        with engine.connect() as conn:

            transaction = conn.begin()
            conn.execute(
                text(f"""UPDATE tbl_tournament_info SET updated_flag = 1 
                WHERE id = {tournament_id} AND link='{urls[j]}' AND day={days[j]} AND sheet_index = {sheet_indices[j]};
                """))
            transaction.commit()
        # remove_eprod()
        print(f"Successfully scraped tournament_id: {tournament_id}, day {days[j]}")

    return scraped

def scrape_all():

    db_name = os.getenv("DB_NAME")
    db_user = os.getenv("DB_USER")
    db_password = os.getenv("DB_PASSWORD")
    db_host = os.getenv("DB_HOST")
    db_port = '5432'
    table_name = 'tbl_tournament_info'


    # Create a connection to the PostgreSQL database
    engine = create_engine(f'postgresql+psycopg2://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}')
    try:
        query = text(f"SELECT DISTINCT id FROM {table_name}")
        with engine.connect() as connection:
            result = connection.execute(query)
            tourney_ids = [row[0] for row in result]

        # Iterate over each tourney_id and call scrape_tourney
        for tourney_id in tourney_ids:
            try:
                scrape_tourney(tourney_id, engine, True)
            except Exception as e:
                print(f"An error occurred while scraping tourney_id {tourney_id}: {e}")                                                                         
    except Exception as e:
        print(f"An error occurred: {e}")


# if run this file directly
if __name__ == '__main__':

    scrape_all()