import pandas as pd
from sqlalchemy import create_engine, text
import psycopg2


db_user = 'postgres'
db_password = 'tft!'
db_host = '68.183.150.147'
db_port = '5432'
db_name = 'tftourneys'
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
                
                # Commit the changes to the database
                conn.commit()
                
    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")
        conn.rollback()
        return 0
    
    return 1

def getNum(df, r, c):
    return int(''.join(filter(str.isdigit, df.iloc[r, c])))

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
                scraped += insert_placement_data(df.iloc[index, col], 9-getNum(df, index, col+1), tournament_id, day, current_lobby, current_game)
                # print(f"{df.iloc[index, col]:<30} {9-getNum(df, index, col+1):<5} {current_lobby:<5} {current_game:<5}")
    print(f"scraped tourney {tournament_id}, day {day} and updated {scraped} entries")


def day_header_scrape(tournament_id, url, day, sheet):

    dfs = pd.read_html(url)  # This reads all tables into a list of DataFrame objects

    df = dfs[sheet]

    player_cols = [i for i, col in enumerate(df.columns) if (df[col].astype(str).str.contains("Name").any() and df[col].astype(str).str.contains(f"DAY {day}").any())]

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
                scraped += insert_placement_data(df.iloc[index, col], 9-getNum(df, index, col+1), tournament_id, day, current_lobby, current_game)
                
                # print(f"{df.iloc[index, col]:<30} {9-getNum(df, index, col+1):<5} {current_lobby:<5} {current_game:<5}")
    print(f"scraped tourney {tournament_id}, day {day} and updated {scraped} entries")

def scrape_tourney(tournament_id, engine = None, quick_insert = False):

    if engine is None:
        

        # Database connection details
        db_user = 'postgres'
        db_password = 'tft!'
        db_host = '68.183.150.147'
        db_port = '5432'
        db_name = 'tftourneys'
        table_name = 'tbl_tournament_info'


        # Create a connection to the PostgreSQL database
        engine = create_engine(f'postgresql+psycopg2://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}')

    # Set up the database query to retrieve URLs for the given tournament ID
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT link,day,sheet_index, updated_flag FROM tbl_tournament_info WHERE id = :t_id"),
            {'t_id': tournament_id}
        )
        urls = []
        days = []
        sheet_indices = [] 
        updated = []
        
        # Iterate through the result set a single time
        for row in result:
            urls.append(row[0])       # Access by column name for clarity
            days.append(row[1])
            sheet_indices.append(row[2]) 
            updated.append(row[3])            
    # Process each URL
    # print(urls)
    # print(days)
    # print(sheet_indices)
    # print(updated)

    for j in range(len(urls)):
        if quick_insert and updated[j] == 1:
            print(f"skippa tourney {tournament_id}, day {days[j]}")
            continue

        special_scrape = None

        with engine.connect() as conn:
            
            result = conn.execute(
                text("SELECT special_scrape FROM tbl_tournament_rules WHERE id = :t_id"),
                {'t_id': tournament_id}
            )

            for row in result:
                special_scrape = row[0]

        if special_scrape == "day_header":
            day_header_scrape(tournament_id, urls[j], days[j], sheet_indices[j])
        else:
            default_scrape(tournament_id, urls[j], days[j], sheet_indices[j])

        with engine.connect() as conn:

            transaction = conn.begin()
            conn.execute(
                text(f"""UPDATE tbl_tournament_info SET updated_flag = 1 
                WHERE id = {tournament_id} AND link='{urls[j]}' AND day={days[j]} AND sheet_index = {sheet_indices[j]};
                """))
            transaction.commit()
        print(f"Successfully scraped tournament_id: {tournament_id}, day {days[j]}")

# if run this file directly
if __name__ == '__main__':

    # Database connection details
    db_user = 'postgres'
    db_password = 'tft!'
    db_host = '68.183.150.147'
    db_port = '5432'
    db_name = 'tftourneys'
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