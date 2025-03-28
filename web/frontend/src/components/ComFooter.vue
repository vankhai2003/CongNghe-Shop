<template>
    <footer class="footer">
        <div class="footer-container">
            <div class="social-links">
                <a href="https://www.facebook.com/vankhai1003" target="_blank">
                    <img src="@/assets/icons8-facebook-logo.svg" alt="Facebook">
                </a>
                <a href="https://www.youtube.com" target="_blank">
                    <img src="@/assets/icons8-youtube-logo.svg" alt="YouTube">
                </a>
                <a href="https://www.instagram.com" target="_blank">
                    <img src="@/assets/icons8-instagram-logo.svg" alt="Instagram">
                </a>
            </div>
            <div class="footer-text">
                © 2025 FastFood. All rights reserved.
            </div>
            <div class="footer-contact">
                <a href="mailto:phankhai2003.xxxx@gmail.com">
                    ✉ <span>phankhai2003.xxxx@gmail.com</span>
                </a>
            </div>
        </div>
    </footer>
</template>

<style>
/* 🌍 Footer Sticky - Hiện đại & Mượt mà */
html, body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #0A0F1E; /* Màu nền tối công nghệ */
}

/* 🚀 Footer Glassmorphism */
.footer {
    background: rgba(17, 30, 57, 0.85);
    backdrop-filter: blur(15px);
    color: white;
    text-align: center;
    padding: 30px 0;
    width: 100%;
    margin-top: auto;
    box-shadow: 0px -10px 30px rgba(0, 183, 255, 0.4);
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
    transition: all 0.3s ease-in-out;
    position: relative;
}

/* 🌟 Footer Glowing Effect */
.footer::before {
    content: "";
    position: absolute;
    top: -8px;
    left: 50%;
    width: 150px;
    height: 5px;
    background: linear-gradient(90deg, #00E5FF, #00FF99);
    border-radius: 10px;
    transform: translateX(-50%);
    box-shadow: 0px 0px 15px rgba(0, 255, 255, 0.7);
    animation: glowBar 2s infinite alternate;
}

/* 📌 Container Căn Giữa */
.footer-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    flex-wrap: wrap;
    padding: 15px 30px;
}

/* 🔗 Biểu tượng mạng xã hội */
.social-links a img {
    width: 28px;
    margin: 0 12px;
    transition: transform 0.4s ease, filter 0.3s ease;
    filter: drop-shadow(0px 0px 8px rgba(0, 255, 255, 0.5));
}

.social-links a img:hover {
    transform: scale(1.2) rotate(5deg);
    filter: drop-shadow(0px 0px 18px rgba(0, 255, 255, 0.9));
}

/* 📜 Nội dung trung tâm - Hiệu ứng chữ Neon */
.footer-text {
    flex: 1;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    background: linear-gradient(90deg, #00E5FF, #00FF99);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: neonText 3s infinite alternate;
}

/* 📧 Email liên hệ */
.footer-contact a {
    color: #FFD700;
    text-decoration: none;
    font-weight: bold;
    font-size: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s ease-in-out;
    position: relative;
}

.footer-contact a:hover {
    color: #00E676;
    text-decoration: underline;
}

.footer-contact a span {
    display: inline-block;
    transition: transform 0.3s ease-in-out;
}

.footer-contact a:hover span {
    transform: translateX(5px);
}

.footer-contact a::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: #FFD700;
    transform: scaleX(0);
    transition: transform 0.3s ease-in-out;
}

.footer-contact a:hover::after {
    transform: scaleX(1);
}

/* 🌟 Hiệu ứng chữ neon */
@keyframes neonText {
    0% { text-shadow: 0 0 10px #00E5FF; }
    100% { text-shadow: 0 0 20px #00FF99; }
}

/* ✨ Hiệu ứng Glow cho thanh phía trên */
@keyframes glowBar {
    0% { box-shadow: 0px 0px 10px rgba(0, 255, 255, 0.5); }
    100% { box-shadow: 0px 0px 20px rgba(0, 255, 255, 0.9); }
}

/* 📱 Responsive Mobile */
@media (max-width: 768px) {
    .footer-container {
        flex-direction: column;
        text-align: center;
        gap: 20px;
    }

    .social-links {
        margin-bottom: 15px;
    }

    .footer-text {
        font-size: 14px;
    }
}

</style>
