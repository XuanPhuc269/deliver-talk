-- Bảng lưu file âm thanh
CREATE TABLE IF NOT EXISTS audio_files (
    file_id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng lưu transcript
CREATE TABLE IF NOT EXISTS transcripts (
    transcript_id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id INTEGER,
    language TEXT,
    status TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(file_id) REFERENCES audio_files(file_id)
);

-- Bảng lưu nội dung từng dòng transcript
CREATE TABLE IF NOT EXISTS transcript_lines (
    line_id INTEGER PRIMARY KEY AUTOINCREMENT,
    transcript_id INTEGER,
    speaker TEXT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(transcript_id) REFERENCES transcripts(transcript_id)
);
