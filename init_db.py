import sqlite3

with open("schema.sql", "r") as f:
    sql = f.read()

conn = sqlite3.connect("delivertalk.db")
conn.executescript(sql)
conn.commit()
conn.close()

print("✅ Database đã được khởi tạo thành công.")