<template>
  <div>
    <h2 class="menu-title">Danh sách sản phẩm</h2>

    <div v-if="loading">Đang tải...</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <slot :products="products"></slot> <!-- Truyền dữ liệu thông qua slot -->
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      products: [],
      loading: true,
      errorMessage: null
    };
  },

  async created() {
    await this.fetchProducts();
  },

  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get("http://localhost:3000/api/products");
        this.products = response.data;
        this.$emit("products-loaded", this.products); // Phát sự kiện để truyền dữ liệu
      } catch (error) {
        console.error("❌ Lỗi khi tải sản phẩm:", error);
        this.errorMessage = "Không thể tải danh sách sản phẩm!";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* 🌍 Hiệu ứng Glassmorphism tổng thể */
.container {
  padding: 20px;
  max-width: 1200px;
  margin: auto;
  backdrop-filter: blur(12px);
  background: rgba(17, 30, 57, 0.75);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 183, 255, 0.3);
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease-in-out;
}

/* 🔥 Tiêu đề neon */
.menu-title {
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  color: #00e5ff;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 20px;
  position: relative;
  text-shadow: 0px 0px 15px rgba(0, 229, 255, 0.8);
  animation: neonText 3s infinite alternate;
}

/* 🌀 Hiệu ứng neon loading */
.loading {
  font-size: 18px;
  font-weight: bold;
  color: #ff9800;
  animation: pulseGlow 1.5s infinite alternate;
}

/* ❌ Hiển thị lỗi */
.error {
  font-size: 16px;
  color: #ff3b3b;
  background: rgba(255, 0, 0, 0.2);
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(255, 0, 0, 0.4);
}

/* 🌐 Danh sách sản phẩm */
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
  justify-content: center;
}

/* 📦 Item sản phẩm với hiệu ứng Cyberpunk 3D */
.product-item {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  color: white;
  padding: 18px;
  border-radius: 14px;
  text-align: center;
  box-shadow: 0 6px 12px rgba(0, 255, 255, 0.2);
  transition: transform 0.4s ease-in-out, box-shadow 0.4s;
  cursor: pointer;
  transform-style: preserve-3d;
  border: 1px solid rgba(0, 255, 255, 0.2);
  position: relative;
}

/* 💡 Glow Effect khi hover */
.product-item:hover {
  transform: translateY(-10px) scale(1.06) rotateX(5deg);
  box-shadow: 0 10px 25px rgba(0, 255, 255, 0.6);
  border-color: rgba(0, 255, 255, 0.6);
}

/* 🌟 Hiệu ứng chữ Neon */
@keyframes neonText {
  0% {
    text-shadow: 0 0 10px #00e5ff;
  }

  100% {
    text-shadow: 0 0 20px #00ff99;
  }
}

/* 🔥 Hiệu ứng phát sáng khi loading */
@keyframes pulseGlow {
  0% {
    text-shadow: 0px 0px 8px #ff9800;
  }

  100% {
    text-shadow: 0px 0px 20px #ff5722;
  }
}

/* 📱 Responsive Mobile */
@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  .menu-title {
    font-size: 24px;
  }

  .product-item {
    padding: 15px;
  }
}
</style>