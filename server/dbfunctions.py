

# dbfunctions.py
import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

def db_result(query, values=None, fetch_results=False):
    """
    Connects to the PostgreSQL database, executes the given query,
    and optionally returns results for SELECT queries.

    Args:
        query (str): The SQL query string to execute.
        values (tuple, optional): A tuple of values to substitute into the query.
                                  Defaults to None.
        fetch_results (bool, optional): If True, and the query is a SELECT statement,
                                       the function will return the fetched results.
                                       Defaults to False.

    Returns:
        list: A list of tuples containing the fetched data for SELECT queries,
              or an empty list for other query types or errors.
    """
    connection = None
    cursor = None
    results = None

    print("Connecting to the database...")
    try:
        connection = psycopg2.connect(
            user=os.getenv("db_user"),
            password=os.getenv("db_password"),
            host=os.getenv("db_host"),
            port=os.getenv("db_port"),
            database=os.getenv("db_database")
        )
        cursor = connection.cursor()

        print("Connected.")
        print("Executing query...")
        cursor.execute(query, values)
        print("Query executed.")

        if fetch_results and query.strip().upper().startswith("SELECT"):
            results = cursor.fetchall()  # Fetch all results from the SELECT query.
            print("Results fetched.")

        connection.commit()  # Commit changes for INSERT, UPDATE, DELETE.

    except psycopg2.Error as e:
        print(f"Database error: {e}")
        if connection:
            connection.rollback()  # Rollback in case of an error.
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
    finally:
        if cursor:
            cursor.close()  # Ensure cursor is closed.
        if connection:
            connection.close()  # Ensure connection is closed.
            print("Database connection closed.")

    # Ensure function returns an empty list instead of None
    if results is None:
        results = []

    return results
