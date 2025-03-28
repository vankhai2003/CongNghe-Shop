<template>
  <div>
    <h2>Quản lý sản phẩm</h2>
    <div class="button-container">
      <button @click="showAddModal">Thêm sản phẩm</button>
    </div>

    <div class="product-list">
      <p>🟡 Tổng số sản phẩm: {{ products.length }}</p>
      <div class="product-item" v-for="product in products" :key="product._id">
        <img :src="product.image" alt="Product Image" />
        <h3>{{ product.name }}</h3>
        <p>Giá: {{ product.price.toLocaleString('vi-VN') }} VNĐ</p>
        <p>Danh mục: {{ product.category }}</p>
        <p>Tình trạng: {{ product.stock > 0 ? 'Còn hàng' : 'Hết hàng' }}</p>
        <p>Mô tả: {{ product.description }}</p>
        <button @click="startEditProduct(product)">Sửa</button>
        <button @click="confirmDelete(product._id)">Xóa</button>
      </div>
    </div>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>{{ isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm' }}</h3>
        <label>Tên sản phẩm:</label>
        <input type="text" v-model="currentProduct.name" />

        <label>Giá:</label>
        <input type="number" v-model="currentProduct.price" />

        <label>Danh mục:</label>
        <input type="text" v-model="currentProduct.category" />

        <label>Số lượng:</label>
        <input type="number" v-model="currentProduct.stock" />

        <label>Hình ảnh URL:</label>
        <input type="text" v-model="currentProduct.image" />

        <label>Mô tả sản phẩm:</label>
        <textarea v-model="currentProduct.description"></textarea>

        <button @click="saveProduct">{{ isEdit ? 'Lưu' : 'Thêm' }}</button>
        <button @click="closeModal">Hủy</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      products: [],
      showModal: false,
      isEdit: false,
      currentProduct: this.getEmptyProduct(),
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    getEmptyProduct() {
      return { _id: null, name: "", price: 0, category: "", stock: 0, image: "", description:"" };
    },

    async fetchProducts() {
      try {
        console.log("🔄 Fetching products...");
        const response = await axios.get("http://localhost:3000/api/products");
        this.products = response.data;
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách sản phẩm:", error);
      }
    },

    showAddModal() {
      this.isEdit = false;
      this.currentProduct = this.getEmptyProduct();
      this.showModal = true;
    },

    startEditProduct(product) {
      this.isEdit = true;
      this.currentProduct = Object.assign({}, product);
      this.showModal = true;
    },

    async saveProduct() {
  if (!this.currentProduct.name || this.currentProduct.price <= 0) {
    alert("Vui lòng nhập đầy đủ thông tin sản phẩm!");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // Ép kiểu số trước khi gửi API
    this.currentProduct.price = Number(this.currentProduct.price);
    this.currentProduct.stock = Number(this.currentProduct.stock);

    let response;
    if (this.isEdit) {
      response = await axios.put(
        `http://localhost:3000/api/products/${this.currentProduct._id}`,
        this.currentProduct,
        config
      );
      const index = this.products.findIndex(p => p._id === this.currentProduct._id);
      if (index !== -1) {
        this.products.splice(index, 1, response.data);
      }
    } else {
      response = await axios.post(
        "http://localhost:3000/api/products",
        this.currentProduct,
        config
      );
      this.products.push(response.data); // Cập nhật danh sách ngay sau khi thêm sản phẩm
    }

    this.closeModal(); // Đóng modal sau khi sửa hoặc thêm mới

  } catch (error) {
    console.error("❌ Lỗi khi lưu sản phẩm:", error);
  }
},


    confirmDelete(id) {
      if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        this.deleteProduct(id);
      }
    },

    async deleteProduct(id) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Bạn chưa đăng nhập!");
          return;
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };

        await axios.delete(`http://localhost:3000/api/products/${id}`, config);
        this.products = this.products.filter(p => p._id !== id); // Xóa sản phẩm khỏi danh sách mà không cần gọi lại API
      } catch (error) {
        console.error("❌ Lỗi khi xóa sản phẩm:", error);
      }
    },

    closeModal() {
      this.showModal = false;
      this.currentProduct = this.getEmptyProduct();
    },
  },
};
</script>

<style scoped>
body {
  background: #0f172a;
  color: #e2e8f0;
  font-family: 'Poppins', sans-serif;
}

h2 {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  color: #e2e8f0;
  margin-bottom: 20px;
  text-transform: uppercase;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

button {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  padding: 12px 18px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  box-shadow: 0px 4px 10px rgba(79, 172, 254, 0.5);
}

button:hover {
  transform: scale(1.05);
  box-shadow: 0px 6px 15px rgba(79, 172, 254, 0.7);
}

button:active {
  transform: scale(0.98);
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
}

.product-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  width: 240px;
  margin: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.product-item img {
  max-width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
}

.product-item h3 {
  font-size: 18px;
  margin: 10px 0;
  font-weight: bold;
}

.product-item p {
  margin: 5px 0;
  font-size: 14px;
  color: #94a3b8;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  padding: 20px;
  border-radius: 12px;
  width: 450px;
  max-width: 95%;
  text-align: left;
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
}

.modal-content h3 {
  text-align: center;
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: bold;
  color: #e2e8f0;
}

.modal-content label {
  font-weight: bold;
  display: block;
  margin-top: 10px;
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

.modal-content textarea {
  resize: vertical;
  min-height: 60px;
}

.modal-content button {
  margin-top: 15px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.modal-content button:first-of-type {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
}

.modal-content button:first-of-type:hover {
  transform: scale(1.05);
}

.modal-content button:last-of-type {
  background: #e11d48;
  color: white;
}

.modal-content button:last-of-type:hover {
  background: #be123c;
}
</style>
