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
                if cur.rowcount > 0:
                    print("Data inserted successfully")
                    print(f"{player_name:<30} {placement:<5} {day_num:<5} {lobby_id:<5} {game_num:<5}")
                else:
                    pass
                    # print("Data already exists, no new data inserted")
                
    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")
        conn.rollback()

def getNum(df, r, c):
    return int(''.join(filter(str.isdigit, df.iloc[r, c])))

def scrape_tourney(tournament_id, engine = None):

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
            text("SELECT link,day,sheet_index FROM tbl_tournament_info WHERE id = :t_id"),
            {'t_id': tournament_id}
        )
        urls = []
        days = []
        sheet_indices = [] 
        
        # Iterate through the result set a single time
        for row in result:
            urls.append(row[0])       # Access by column name for clarity
            days.append(row[1])
            sheet_indices.append(row[2])            
    # Process each URL
    print(urls)
    print(days)
    print(sheet_indices)

    for j in range(len(urls)):
        dfs = pd.read_html(urls[j])  # This reads all tables into a list of DataFrame objects

        df = dfs[sheet_indices[j]]

        player_cols = [i for i, col in enumerate(df.columns) if df[col].astype(str).str.contains("Name").any()]

        # Store game and lobby info as you find it for use with subsequent rows
        current_game = 0  # assuming the games are numbered sequentially in the DataFrame

        print(f"{'Player':<30} {'Score':<5} {'Lobby':<5} {'Game':<5}")

        print(player_cols)

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
                    insert_placement_data(df.iloc[index, col], 9-getNum(df, index, col+1), tournament_id, days[j], current_lobby, current_game)
                    # print(f"{df.iloc[index, col]:<30} {9-getNum(df, index, col+1):<5} {current_lobby:<5} {current_game:<5}")

# if run this file directly doin some test dummy things for now... 
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
        scrape_tourney(67173566, engine)
    except Exception as e:
        print(f"An error occurred: {e}")