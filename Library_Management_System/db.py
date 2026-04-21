import sqlite3

conn = sqlite3.connect("library.db")
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS books (
    book_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author TEXT,
    publisher TEXT,
    quantity INTEGER
)
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS issue (
    issue_id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER,
    student_name TEXT,
    issue_date TEXT
)
""")

conn.commit()
conn.close()
print("Database created successfully")