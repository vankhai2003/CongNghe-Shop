<template>
  <div>
    <!-- Slider hình ảnh -->
    <div class="header-image">
      <img v-for="(image, index) in sliderImages" :key="index" :src="image" :alt="'Ảnh ' + (index + 1)"
        :class="{ 'active': currentIndex === index }">

      <div class="dots">
        <div v-for="(image, index) in sliderImages" :key="index" class="dot"
          :class="{ 'active': currentIndex === index }" @click="changeImage(index)">
        </div>
      </div>

      <button class="nav-button prev" @click="prevImage">❮</button>
      <button class="nav-button next" @click="nextImage">❯</button>
    </div>

    <!-- Bộ lọc sản phẩm -->
    <div class="filters">
      <input type="text" v-model="searchQuery" placeholder="Tìm kiếm sản phẩm..." />
      <select v-model="selectedCategory">
        <option value="">Tất cả danh mục</option>
        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
      </select>
      <input type="number" v-model.number="minPrice" placeholder="Giá tối thiểu" />
      <input type="number" v-model.number="maxPrice" placeholder="Giá tối đa" />
      <select v-model="sortOption">
        <option value="">Mặc định</option>
        <option value="asc">Giá tăng dần</option>
        <option value="desc">Giá giảm dần</option>
      </select>
    </div>

    <!-- Nhận dữ liệu từ ComProduct.vue -->
    <ComProduct @products-loaded="updateProducts" />

    <!-- Danh sách sản phẩm -->
    <div class="product-container">
      <div v-for="product in paginatedProducts" :key="product._id" class="product-item"
        @click="goToProductDetail(product._id)" style="cursor: pointer;">
        <img :src="product.image" :alt="product.name" />
        <h3>{{ product.name }}</h3>
        <p>{{ formatPrice(product.price) }}</p>
      </div>
    </div>

    <!-- Phân trang -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Trước</button>
      <span>Trang {{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Sau</button>
    </div>
  </div>
</template>

<script>
import ComProduct from './ComProduct.vue';

export default {
  name: 'ComHome',
  components: { ComProduct },

  data() {
    return {
      products: [],
      currentPage: 1,
      originalProducts: [],
      itemsPerPage: 20,
      searchQuery: '',
      selectedCategory: '',
      minPrice: null,
      maxPrice: null,
      sortOption: '',
      sliderImages: [
        'https://lh3.googleusercontent.com/g9BZyzCGbzcLoEU_IEFyDlC4ecxlfSRx1StR9LuDYmAeQPxcZ2J-SjW09BdZUu6VKWtU1k9gLLe7bKPoPaiaf_pnZyZnhte8Gw=rw-w2304',
        'https://lh3.googleusercontent.com/cofsekSEpfzV_lqJrmmhNesLeI1UW8QqwgR5hAUBq1-fG9_ZOextOH5ZDMwziSeQEEjmc5FGHbKVd8PuioC-l8NoLUgoqx5qRw=w1920-rw',
        'https://lh3.googleusercontent.com/XzEGUfZGwNS9A4Yymq0Gf-fgbZylEv3lw_GJoV4t-fVnL6_aRLFsdUfHNn12YLBH48n-iUX0wFOQY6adZnCGzsIQVv8aTgc=w1920-rw',
        'https://lh3.googleusercontent.com/XMWKvitNn26gbTYdrH59rfSTTF-dOwmBptwOrOVfEVc2-lBgBu_-1Cyj8hh7yqQP7xrVFhdzi3Xk4zc4c3vRFVOmcKbiMW4=w1920-rw',
        'https://lh3.googleusercontent.com/6PpPM7BauNsanr_CqBbIL_TK_RPaKmbsK37QccECQBydK_wd_uT36kVdn2bE2e_JyNFfGDp9gTJ3Mu8HCguDdo__JbM8fxEO=w1920-rw',
        'https://lh3.googleusercontent.com/8kdEKKXbIctsjJLrLFsKH-F_7AH6t63nDiNUDjyFJlZSobGnuOwgsy9eglZ0AizUpXfk1gzi0gZAVp6B4yXHslJDjAj-Wgw=w1920-rw'
      ],
      currentIndex: 0,
      intervalTime: 3000,
      slideInterval: null
    };
  },

  computed: {
    filteredProducts() {
      let filtered = [...this.originalProducts]; // Luôn lọc từ danh sách gốc để tránh ghi đè dữ liệu

      if (this.searchQuery) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      if (this.selectedCategory && this.selectedCategory !== "") {
        filtered = filtered.filter(product =>
          product.category.toLowerCase().trim() === this.selectedCategory.toLowerCase().trim()
        );
      }

      if (this.minPrice !== null && this.minPrice !== '') {
        filtered = filtered.filter(product => product.price >= this.minPrice);
      }

      if (this.maxPrice !== null && this.maxPrice !== '') {
        filtered = filtered.filter(product => product.price <= this.maxPrice);
      }

      if (this.sortOption === 'asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (this.sortOption === 'desc') {
        filtered.sort((a, b) => b.price - a.price);
      }

      return filtered;
    },

    categories() {
      return [...new Set(this.products.map(product => product.category))].filter(Boolean);
    },

    paginatedProducts() {
      return this.filteredProducts.slice(
        (this.currentPage - 1) * this.itemsPerPage,
        this.currentPage * this.itemsPerPage
      );
    },

    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    }
  },


  methods: {
    updateProducts(products) {
      console.log('📦 Nhận dữ liệu từ ComProduct:', products);
      this.products = products;
      this.originalProducts = [...products];
    },

    goToProductDetail(productId) {
      this.$router.push({ name: 'ProductDetail', params: { id: productId } });
    },

    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },

    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },

    formatPrice(price) {
      return price.toLocaleString('vi-VN') + " VNĐ";
    },

    changeImage(index) {
      this.currentIndex = index;
      this.restartSlideInterval();
    },

    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.sliderImages.length;
    },

    prevImage() {
      this.currentIndex = (this.currentIndex - 1 + this.sliderImages.length) % this.sliderImages.length;
    },

    restartSlideInterval() {
      clearInterval(this.slideInterval);
      this.slideInterval = setInterval(this.nextImage, this.intervalTime);
    }
  },

  mounted() {
    this.slideInterval = setInterval(this.nextImage, this.intervalTime);
  },

  beforeUnmount() {
    clearInterval(this.slideInterval);
  }
};
</script>




<style scoped>
/* === RESET CSS === */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

body {
  background: linear-gradient(135deg, #050a30, #0f172a);
  color: #f1f5f9;
  overflow-x: hidden;
}

/* === SLIDER === */
.header-image {
  position: relative;
  width: 100%;
  max-width: 1300px;
  height: 500px;
  margin: 20px auto;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0px 10px 40px rgba(0, 255, 255, 0.6);
}

.header-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  filter: brightness(90%) contrast(120%);
}

.header-image img.active {
  opacity: 1;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 255, 255, 0.2);
  border: 2px solid #00eaff;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 14px;
  border-radius: 50%;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease-in-out;
}

.nav-button:hover {
  background: rgba(0, 255, 255, 0.5);
}

.prev {
  left: 20px;
}

.next {
  right: 20px;
}

/* === FILTERS === */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin: 25px auto;
  padding: 20px;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  box-shadow: 0px 6px 18px rgba(0, 255, 255, 0.3);
}

.filters input,
.filters select {
  padding: 14px;
  font-size: 16px;
  border: 2px solid #00eaff;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  color: #050505;
  outline: none;
  transition: 0.3s;
}

.filters input::placeholder {
  color: #ccc;
}

.filters input:focus,
.filters select:focus {
  border-color: #00ffcc;
  background: rgba(255, 255, 255, 0.2);
}

/* === PRODUCT LIST === */
.product-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
  max-width: 1300px;
  margin: 0 auto;
}

.product-item {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  box-shadow: 0px 6px 20px rgba(0, 255, 255, 0.4);
  transition: transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
}

.product-item:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0px 10px 30px rgba(0, 255, 255, 0.6);
}

.product-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
}

.product-item h3 {
  margin-top: 12px;
  font-size: 18px;
  font-weight: bold;
  color: #00eaff;
}

.product-item p {
  margin-top: 5px;
  font-size: 16px;
  font-weight: bold;
  color: #ff00ff;
}

/* === PAGINATION === */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
}

.pagination button {
  padding: 12px 20px;
  margin: 0 10px;
  background: linear-gradient(135deg, #00eaff, #0084ff);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s ease-in-out, transform 0.2s;
}

.pagination button:hover {
  background: linear-gradient(135deg, #00ffcc, #005eff);
  transform: scale(1.05);
}

.pagination button:disabled {
  background: rgba(255, 255, 255, 0.3);
  cursor: not-allowed;
}

.pagination span {
  font-weight: bold;
  margin: 0 12px;
  color: #00eaff;
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: center;
  }

  .filters input,
  .filters select {
    width: 90%;
  }

  .header-image {
    height: 350px;
  }

  .product-container {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .product-item img {
    height: 160px;
  }

  .pagination button {
    padding: 10px 16px;
    font-size: 14px;
  }
}
</style>