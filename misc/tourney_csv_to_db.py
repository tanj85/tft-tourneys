import pandas as pd
from sqlalchemy import create_engine, text
import os

def update():
    # Load the CSV data into a DataFrame
    csv_file = '/root/tft-tourneys/misc/tourney_info.csv'
    new_data = pd.read_csv(csv_file).drop_duplicates()

    # Database connection details

    db_name = os.getenv("DB_NAME")
    db_user = os.getenv("DB_USER")
    db_password = os.getenv("DB_PASSWORD")
    db_host = os.getenv("DB_HOST")
    db_port = '5432'
    table_name = 'tbl_tournament_info'
    engine_url = f'postgresql+psycopg2://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}'
    engine = create_engine(engine_url)

    # Connect to the database and perform operations within a transaction
    with engine.begin() as connection:
        # Read existing data from the database
        existing_data = pd.read_sql_table(table_name, connection)
        
        # Find data to delete (in DB but not in new_data)
        data_to_delete = existing_data.merge(new_data, on=['id', 'sheet_index', 'day'], how='left', indicator=True, suffixes=('', '_other'))
        data_to_delete = data_to_delete[data_to_delete['_merge'] == 'left_only']
        data_to_delete = data_to_delete[list(existing_data.columns)]

        print(data_to_delete)
        
        # Delete these records from the database
        if not data_to_delete.empty:
    # Get the list of records to delete
            records_to_delete = list(data_to_delete[['id', 'sheet_index', 'day']].itertuples(index=False, name=None))

            # Construct the DELETE query
            delete_query = "DELETE FROM {} WHERE (id, sheet_index, day) IN (".format(table_name)
            delete_query += ", ".join(["(:id_{}, :sheet_index_{}, :day_{})".format(i, i, i) for i in range(len(records_to_delete))])
            delete_query += ")"

            # Create a dictionary of parameters
            params = {}
            for i, record in enumerate(records_to_delete):
                params["id_{}".format(i)] = record[0]
                params["sheet_index_{}".format(i)] = record[1]
                params["day_{}".format(i)] = record[2]

            # Execute the query using `text` and `bindparams`
            query = text(delete_query).bindparams(**params)
            connection.execute(query)
        # Prepare new records to insert by ensuring DataFrame matches database schema
        data_to_insert = new_data.merge(existing_data, on=['id', 'sheet_index', 'day'], how='left', indicator=True, suffixes=('', '_other'))
        data_to_insert = data_to_insert[data_to_insert['_merge'] == 'left_only']
        # Ensure columns match database schema
        data_to_insert = data_to_insert[list(existing_data.columns)]

        print(data_to_insert)

        # Insert new unique data into the database
        if not data_to_insert.empty:
            # del data_to_insert['is_live_flag']
            data_to_insert.to_sql(table_name, connection, if_exists='append', index=False)

if __name__ == '__main__':
    update()
