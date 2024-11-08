import psycopg2
from sqlalchemy import create_engine, text
import os

# Database connection parameters
dbname = os.getenv("DB_NAME")
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
port = '5432'

def remove_eprod():
    # Connect to the PostgreSQL database
    engine = create_engine(f'postgresql+psycopg2://{user}:{password}@{host}:{port}/{dbname}')

    # Set up the database query to retrieve URLs for the given tournament ID
    with engine.connect() as conn:
        
        transaction = conn.begin()
        conn.execute(
            text("""
        UPDATE tbl_placement_data
        SET player_name = SUBSTRING(player_name, 1, LENGTH(player_name) - POSITION('#' IN REVERSE(player_name)))
        WHERE player_name LIKE '%#%';
        """)
        )
        transaction.commit()
    print("removed eprod")

if __name__ == '__main__':
    remove_eprod()