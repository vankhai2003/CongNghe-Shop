<template>
  <div class="intro-container">
    <h1 class="intro-title">Chào mừng đến với Express!</h1>
    <p class="intro-text">
      FastFood Express là nền tảng bán đồ ăn nhanh trực tuyến, nơi bạn có thể đặt hàng nhanh chóng với những món ăn ngon
      nhất.
    </p>
    <p class="intro-text">
      Chúng tôi cung cấp đa dạng các loại burger, pizza, gà rán và nhiều món ăn hấp dẫn khác, đảm bảo giao hàng tận nơi
      nhanh chóng.
    </p>
    <div class="intro-image-container">
      <img src="" alt=" Image" class="intro-image">
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComGioiTh'
}
</script>

<style scoped>
/* 🌍 Container chính */
.intro-container {
  max-width: 950px;
  margin: 60px auto;
  padding: 35px;
  text-align: center;
  border-radius: 16px;
  background: linear-gradient(135deg, #0A192F, #1E3A8A); /* Gradient xanh đậm công nghệ */
  box-shadow: 0 12px 25px rgba(0, 183, 255, 0.3); /* Glow xanh neon */
  transition: all 0.3s ease-in-out;
  color: white;
}

.intro-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 183, 255, 0.5);
}

/* 🎯 Tiêu đề */
.intro-title {
  font-size: 32px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  background: linear-gradient(90deg, #00E5FF, #00FF99);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: neonText 2s infinite alternate;
}

/* 📜 Nội dung */
.intro-text {
  font-size: 18px;
  color: #D1ECFF;
  line-height: 1.8;
  margin-bottom: 14px;
  font-weight: 500;
  transition: color 0.3s ease-in-out;
}

.intro-text:hover {
  color: #00E5FF;
}

/* 🖼️ Hình ảnh */
.intro-image-container {
  margin-top: 25px;
}

.intro-image {
  width: 100%;
  max-width: 550px;
  height: auto;
  border-radius: 12px;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.intro-image:hover {
  transform: scale(1.08);
  box-shadow: 0 10px 20px rgba(0, 183, 255, 0.4);
}

/* 🔥 Hiệu ứng neon cho chữ */
@keyframes neonText {
  0% { text-shadow: 0 0 10px #00E5FF; }
  100% { text-shadow: 0 0 25px #00FF99; }
}

/* 📱 Responsive */
@media (max-width: 768px) {
  .intro-container {
    max-width: 90%;
    padding: 25px;
  }

  .intro-title {
    font-size: 26px;
  }

  .intro-text {
    font-size: 16px;
  }

  .intro-image {
    max-width: 100%;
  }
}

</style>
