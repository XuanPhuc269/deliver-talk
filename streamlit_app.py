import streamlit as st
import time

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
        if st.button("Chuyển giọng nói thành văn bản"):
            with st.spinner("Đang xử lý tệp âm thanh..."):
                # Mô phỏng quá trình chuyển đổi
                time.sleep(2)
                transcript = {
                    "Shipper": "Xin chào! Chị có đơn hàng.",
                    "Khách hàng": "Cảm ơn bạn"
                }
            st.success("Chuyển đổi thành công!")
            # ---- Hiển thị kết quả ----
            st.markdown("### 📝 Kết quả chuyển đổi:")
            for speaker, line in transcript.items():
                color = "red" if speaker == "Khách hàng" else "blue"
                st.markdown(f"<span style='color:{color}; font-size: 20px;'><strong>{speaker}:</strong> {line}</span>", unsafe_allow_html=True)
    else:
        st.warning("Vui lòng tải lên tệp âm thanh để bắt đầu.")

elif st.session_state.get("sidebar_action", "storage") == "storage":
    st.markdown("### 📦 Kho lưu trữ")
    st.markdown("Chức năng này sẽ được cập nhật trong các phiên bản sau.")
    st.warning("Chức năng này hiện chưa khả dụng.")

# ---- Footer ----
st.markdown("---")
st.caption("© 2025 DeliverTalk | Được phát triển bởi nhóm <strong style='color:#ff4b4;'>F4 SOICT</strong>", unsafe_allow_html=True)