import os
import psycopg2
from psycopg2.pool import SimpleConnectionPool
from psycopg2.extensions import connection, cursor
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from typing import Dict, List, Optional, Tuple, Iterable, Union

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


def close_conn_pool() -> None:
    if conn_pool:
        conn_pool.closeall()


def get_conn() -> connection:
    """Returns a connection from database pool"""
    return conn_pool.getconn()


def close_conn(conn: connection) -> None:
    """Returns a connection to database pool"""
    conn_pool.putconn(conn)


def query_sql(query: str, ret_dict: bool = False, args=None):
    """
    Queries database and returns result.

    Args:
        query (str): The sql query
        ret_dict (bool): TODO. Defaults to False.
        args (TODO): The arguments passed to query used by psycopg2. Defaults to None.

    Returns:
        The result of the query.
    """
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


def expand(lis: List, num: int) -> None:
    """Expands a [lis] to have length of at least [num]."""
    while len(lis) < num:
        lis.append(None)


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
    """Returns the column_names the table [table_name]."""
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


if __name__ == "__main__":
    close_conn_pool()
