# Bảng Users (tùy chọn)
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
''')

# Bảng Audio Files
cursor.execute('''
CREATE TABLE IF NOT EXISTS audio_files (
    file_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    upload_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
)
''')

# Bảng Transcripts
cursor.execute('''
CREATE TABLE IF NOT EXISTS transcripts (
    transcript_id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id INTEGER NOT NULL,
    language TEXT,
    status TEXT DEFAULT 'pending',
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES audio_files(file_id)
)
''')

# Bảng Transcript Lines
cursor.execute('''
CREATE TABLE IF NOT EXISTS transcript_lines (
    line_id INTEGER PRIMARY KEY AUTOINCREMENT,
    transcript_id INTEGER NOT NULL,
    speaker TEXT,
    content TEXT NOT NULL,
    timestamp_start REAL,
    timestamp_end REAL,
    FOREIGN KEY (transcript_id) REFERENCES transcripts(transcript_id)
)
''')
