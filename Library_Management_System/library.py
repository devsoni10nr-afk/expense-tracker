import sqlite3
from datetime import date

# Connect Database
def connect():
    return sqlite3.connect("library.db")

# Add Book
def add_book():
    title = input("Enter book title: ")
    author = input("Enter author name: ")
    publisher = input("Enter publisher: ")
    qty = int(input("Enter quantity: "))

    conn = connect()
    cur = conn.cursor()
    cur.execute("INSERT INTO books (title, author, publisher, quantity) VALUES (?,?,?,?)",
                (title, author, publisher, qty))
    conn.commit()
    conn.close()
    print("Book added successfully")

# View Books
def view_books():
    conn = connect()
    cur = conn.cursor()
    cur.execute("SELECT * FROM books")
    rows = cur.fetchall()
    conn.close()

    print("\n--- Book List ---")
    for row in rows:
        print(row)

# Search Book
def search_book():
    keyword = input("Enter title or author to search: ")
    conn = connect()
    cur = conn.cursor()
    cur.execute("SELECT * FROM books WHERE title LIKE ? OR author LIKE ?",
                ('%'+keyword+'%', '%'+keyword+'%'))
    rows = cur.fetchall()
    conn.close()

    if rows:
        for row in rows:
            print(row)
    else:
        print("No book found")

# Issue Book
def issue_book():
    book_id = int(input("Enter book ID: "))
    student = input("Enter student name: ")
    today = date.today()

    conn = connect()
    cur = conn.cursor()

    cur.execute("SELECT quantity FROM books WHERE book_id=?", (book_id,))
    result = cur.fetchone()

    if result and result[0] > 0:
        cur.execute("INSERT INTO issue (book_id, student_name, issue_date) VALUES (?,?,?)",
                    (book_id, student, today))
        cur.execute("UPDATE books SET quantity = quantity - 1 WHERE book_id=?", (book_id,))
        conn.commit()
        print("Book issued successfully")
    else:
        print("Book not available")

    conn.close()

# Return Book
def return_book():
    book_id = int(input("Enter book ID to return: "))
    conn = connect()
    cur = conn.cursor()

    cur.execute("DELETE FROM issue WHERE book_id=? LIMIT 1", (book_id,))
    cur.execute("UPDATE books SET quantity = quantity + 1 WHERE book_id=?", (book_id,))
    conn.commit()
    conn.close()
    print("Book returned successfully")

# Reports
def reports():
    conn = connect()
    cur = conn.cursor()

    print("\n1. Total Books")
    cur.execute("SELECT COUNT(*) FROM books")
    print(cur.fetchone()[0])

    print("\n2. Issued Books")
    cur.execute("SELECT * FROM issue")
    for row in cur.fetchall():
        print(row)

    conn.close()

# Main Menu
def menu():
    while True:
        print("""
        \nLibrary Management System
        1. Add Book
        2. View Books
        3. Search Book
        4. Issue Book
        5. Return Book
        6. Reports
        7. Exit
        """)

        choice = input("Enter choice: ")

        if choice == '1': add_book()
        elif choice == '2': view_books()
        elif choice == '3': search_book()
        elif choice == '4': issue_book()
        elif choice == '5': return_book()
        elif choice == '6': reports()
        elif choice == '7': break
        else: print("Invalid choice")

menu()