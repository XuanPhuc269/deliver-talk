import streamlit as st
import time
from server import transcribe_audio
import os

# ---- Page Setup ----
st.set_page_config(
    page_title="DeliverTalk",
    layout="centered",
)
st.markdown('## 🚚 DeliverTalk - Hệ thống nhận diện giọng nói thời gian thực cho giao hàng')

# ---- Sidebar ----
with st.sidebar:
    st.markdown("## Menu")
    if st.button("🎙️ Transcribe", use_container_width=True):
        st.session_state['sidebar_action'] = 'transcribe'
    if st.button("📦 My Storage", use_container_width=True):
        st.session_state['sidebar_action'] = 'storage'
    
    st.markdown("---")
    st.markdown("### About this app")
    st.markdown(
        """
        DeliverTalk là một ứng dụng nhận diện giọng nói thời gian thực, giúp chuyển đổi giọng nói thành văn bản cho các cuộc gọi giao hàng.
        Ứng dụng này sử dụng công nghệ AI tiên tiến để cung cấp độ chính xác cao và tốc độ nhanh chóng.
        """
    )

# --- Chuyển đổi giọng nói thành văn bản ---
if st.session_state.get("sidebar_action", "transcribe") == "transcribe":
    # ---- Upload File ----
    st.markdown("### 🎙️ Tải lên tệp âm thanh")
    uploaded_file = st.file_uploader(
        "Kéo và thả hoặc nhấn để chọn tệp (.wav, .mp3, tối đa 200MB)",
        type=["wav", "mp3"],
        help="Tệp âm thanh phải có định dạng WAV hoặc MP3 và không lớn hơn 200MB.",
    )
    transcript = {}
    if uploaded_file:
        temp_file_path = os.path.join("temp", uploaded_file.name)
        os.makedirs("temp", exist_ok=True)
        with open(temp_file_path, "wb") as f:
            f.write(uploaded_file.getbuffer())
            
        if st.button("Chuyển giọng nói thành văn bản"):
            with st.spinner("Đang xử lý tệp âm thanh..."):
                try:
                    transcription = transcribe_audio(temp_file_path)
                    transcript = {"Transcription": transcription}
                    st.success("Chuyển đổi thành công!")
                except Exception as e:
                    st.error(f"Đã xảy ra lỗi: {e}")
                finally:
                    # clear
                    os.remove(temp_file_path)

            # show results
            st.markdown("### 📝 Kết quả chuyển đổi:")
            for speaker, line in transcript.items():
                st.markdown(f"**{speaker}:** {line}")
    else:
        st.warning("Vui lòng tải lên tệp âm thanh để bắt đầu.")

elif st.session_state.get("sidebar_action", "storage") == "storage":
    st.markdown("### 📦 Kho lưu trữ")
    file_data = [
        {"Tên file": "file1.wav", "Kích cỡ": "2MB", "Ngày đăng tải": "2025-05-18", "Transcription file": "file1.txt"},
        {"Tên file": "file2.mp3", "Kích cỡ": "3MB", "Ngày đăng tải": "2025-05-18", "Transcription file": "file2.txt"},
        {"Tên file": "file3.wav", "Kích cỡ": "4MB", "Ngày đăng tải": "2025-05-20", "Transcription file": "file3.txt"},
    ]
    st.table(file_data)

# ---- Footer ----
st.markdown("---")
st.caption("© 2025 DeliverTalk | Được phát triển bởi nhóm <strong style='color:#ff4b4;'>Fast & Shipperious</strong>", unsafe_allow_html=True)