# blog_table.py
from dbfunctions import db_result

def create_blog_table():
    schema_query = "CREATE SCHEMA IF NOT EXISTS Blog;"
    db_result(schema_query)

    create_table_query = """
    CREATE TABLE IF NOT EXISTS public.blog (
        PostID VARCHAR(10) PRIMARY KEY,
        Title TEXT NOT NULL,
        Author VARCHAR(100),
        CreatedAt TIMESTAMP,
        Content TEXT,
        Tags TEXT[],
        Image BYTEA,
        isdeleted BOOLEAN NOT NULL DEFAULT FALSE
    );
    """
    db_result(create_table_query)



# =========================
# CREATE USER TABLE
# =========================
def create_user_table():

    query_create = """
    CREATE TABLE IF NOT EXISTS public.users (
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        PRIMARY KEY (name, email)
    );
    """
    db_result(query_create)
    print("Users table created with composite primary key (name, email).")
