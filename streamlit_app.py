import streamlit as st
import sqlite3
import os

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_connection():
    return sqlite3.connect("delivertalk.db")

def create_tables():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL,
            password TEXT NOT NULL
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS audio_files (
            file_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            filename TEXT NOT NULL,
            file_path TEXT NOT NULL,
            file_size INTEGER,
            file_type TEXT,
            upload_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
    ''')

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

    conn.commit()
    conn.close()

def upload_audio():
    st.title("Upload Audio File")
    user_id = st.text_input("User ID")
    file = st.file_uploader("Upload Audio File", type=["mp3", "wav", "m4a"])

    if file:
        file_path = os.path.join(UPLOAD_DIR, file.name)
        with open(file_path, "wb") as f:
            f.write(file.getbuffer())

        st.success("Audio file uploaded successfully!")

        # Lưu thông tin file vào cơ sở dữ liệu
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO audio_files (user_id, filename, file_path, file_size, file_type)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, file.name, file_path, file.size, file.type))

        conn.commit()
        conn.close()

        st.success("Audio file information saved successfully!")

def generate_transcript():
    st.title("Generate Transcript")
    file_id = st.text_input("File ID")
    language = st.text_input("Language")

    if st.button("Generate Transcript"):
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO transcripts (file_id, language)
            VALUES (?, ?)
        ''', (file_id, language))

        conn.commit()
        conn.close()

        st.success("Transcript generation started!")
        
def display_transcript():
    st.title("Transcript")
    file_id = st.text_input("File ID")

    if st.button("Display Transcript"):
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT t.transcript_id, t.language, t.status, t.generated_at, 
                   a.filename, a.file_size, a.file_type, a.upload_time
            FROM transcripts t
            JOIN audio_files a ON t.file_id = a.file_id
            WHERE t.file_id = ?
        ''', (file_id,))

        transcript = cursor.fetchone()
        if transcript:
            st.write(f"Transcript ID: {transcript[0]}")
            st.write(f"Language: {transcript[1]}")
            st.write(f"Status: {transcript[2]}")
            st.write(f"Generated at: {transcript[3]}")
            st.write(f"File: {transcript[4]}")
            st.write(f"File size: {transcript[5]}")
            st.write(f"File type: {transcript[6]}")
            st.write(f"Upload time: {transcript[7]}")

        conn.close()

def main():
    st.title("DeliverTalk Transcription System")
    st.sidebar.title("Navigation")
    page = st.sidebar.selectbox("Select Page", ["Upload Audio", "Generate Transcript", "Display Transcript"])

    if page == "Upload Audio":
        upload_audio()
    elif page == "Generate Transcript":
        generate_transcript()
    elif page == "Display Transcript":
        display_transcript()

if __name__ == "__main__":
    create_tables()
    main()