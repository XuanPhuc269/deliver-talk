import uuid
import shutil

if uploaded_file:
    if st.button("Chuyển giọng nói thành văn bản"):
        with st.spinner("Đang xử lý tệp âm thanh..."):
            time.sleep(2)  # Giả lập xử lý
            transcript = {
                "Shipper": "Xin chào! Chị có đơn hàng.",
                "Khách hàng": "Cảm ơn bạn"
            }

            # --- Lưu tệp vào thư mục uploads ---
            file_ext = uploaded_file.name.split('.')[-1]
            saved_filename = f"{uuid.uuid4()}.{file_ext}"
            file_path = os.path.join(UPLOAD_DIR, saved_filename)
            with open(file_path, "wb") as f:
                f.write(uploaded_file.read())

            # --- Ghi dữ liệu vào database ---
            conn = get_connection()
            cursor = conn.cursor()

            # Lưu audio file
            cursor.execute('''
                INSERT INTO audio_files (filename, file_path, file_size, file_type)
                VALUES (?, ?, ?, ?)
            ''', (uploaded_file.name, file_path, uploaded_file.size, uploaded_file.type))
            file_id = cursor.lastrowid

            # Lưu transcript
            cursor.execute('''
                INSERT INTO transcripts (file_id, language, status)
                VALUES (?, ?, ?)
            ''', (file_id, "vi", "completed"))
            transcript_id = cursor.lastrowid

            # Lưu từng dòng thoại
            for speaker, content in transcript.items():
                cursor.execute('''
                    INSERT INTO transcript_lines (transcript_id, speaker, content)
                    VALUES (?, ?, ?)
                ''', (transcript_id, speaker, content))

            conn.commit()
            conn.close()
