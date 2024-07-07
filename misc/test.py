
# Database credentials and connection details
db_user = 'postgres'
db_password = 'tft!'
db_host = '68.183.150.147'
db_port = '5432'
db_name = 'tftourneys'
table_name = 'tbl_placement_data'  # Ensure this is the correct table you intend to use

# Create a connection to the PostgreSQL database
import psycopg2

def insert_placement_data(player_name, placement, tournament_id, day_num, lobby_id, game_num):
    """Insert a new record into the tbl_placement_data table."""
    
    sql = """INSERT INTO tbl_placement_data (player_name, placement, tournament_id, day_num, lobby_id, game_num)
             VALUES(%s, %s, %s, %s, %s, %s);"""
    

    try:
        # Connect to the PostgreSQL database server
        with psycopg2.connect(host=db_host,database=db_name,user=db_user,password=db_password) as conn:
            with conn.cursor() as cur:
                # Execute the INSERT statement
                cur.execute(sql, (player_name, placement, tournament_id, day_num, lobby_id, game_num))
                
                # Commit the changes to the database
                conn.commit()
                print("Data inserted successfully")
                
    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")
        conn.rollback()

if __name__ == '__main__':
    # Example data insertion
    insert_placement_data("John Doe", 7, 67173566, 1, 1, 1)
