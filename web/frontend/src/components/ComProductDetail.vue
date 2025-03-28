<template>
  <main>
    <div class="product-detail">
      <div class="product-left">
        <div class="product-image">
          <img :src="selectedImage || product.image" :alt="product.name" />
        </div>
        <div class="product-thumbnails">
          <img v-for="(img, index) in product.images" :key="index" :src="img" @click="selectedImage = img"
            :class="{ active: selectedImage === img }" />
        </div>
      </div>

      <div class="product-info">
        <h2>{{ product.name }}</h2>
        <p class="product-price" v-if="product.price">{{ product.price.toLocaleString('vi-VN') }} VNĐ</p>

        <p class="product-description" v-if="product.description">{{ product.description }}</p>

        <div class="quantity-control">
          <button @click="decrementQuantity">-</button>
          <span>{{ quantity }}</span>
          <button @click="incrementQuantity">+</button>
        </div>

        <div class="product-actions">
          <button v-if="user" class="buy-now" @click="buyNow">MUA NGAY</button>
          <button v-if="user" class="add-to-cart" @click="addToCart">THÊM VÀO GIỎ HÀNG</button>
          <p v-else class="login-message">Bạn cần đăng nhập để mua sản phẩm.</p>
        </div>

        <div class="promotion">
          <p><strong>Khuyến mãi liên quan:</strong></p>
          <ul>
            <li>🚚 Miễn phí vận chuyển cho đơn từ 200.000đ.</li>
            <li>💳 Giảm 100.000đ triệu khi thanh toán bằng VNPAY-QR.</li>
          </ul>
        </div>

      </div>
    </div>
  </main>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

export default {
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const quantity = ref(1);
    const product = ref({});
    const errorMessage = ref('');
    const user = ref(null);

    // 🟢 Hàm lấy thông tin sản phẩm
    const fetchProduct = async () => {
      try {
        const id = route.params.id;
        const response = await axios.get(`http://localhost:3000/api/products/${id}`);
        product.value = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        errorMessage.value = "Không tìm thấy sản phẩm.";
      }
    };

    // 🟢 Hàm lấy thông tin user từ API
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token'); // 🛑 Lấy token từ localStorage
        if (!token) return; // 🛑 Nếu không có token thì không gọi API

        const response = await axios.get('http://localhost:3000/api/users', {
          headers: { Authorization: `Bearer ${token}` }, // 🛑 Gửi token trong header
        });

        user.value = response.data;
      } catch (error) {
        console.error('Lỗi khi lấy thông tin user:', error);
      }
    };

    // 🟢 Khi component mount, lấy sản phẩm & user
    onMounted(() => {
      fetchProduct();
      fetchUser();
    });

    // 🟢 Theo dõi URL thay đổi, cập nhật sản phẩm
    watch(() => route.params.id, fetchProduct);

    // 🛒 Thêm vào giỏ hàng & chuyển đến giỏ hàng
    const addToCart = async () => {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user || !user._id) {
        console.error("❌ Không có userId, vui lòng đăng nhập!");
        return;
      }

      try {
        const response = await axios.post('http://localhost:3000/api/cart/add', {
          userId: user._id,
          productId: product.value._id,
          quantity: quantity.value || 1
        });

        console.log("✅ Đã thêm vào giỏ hàng:", response.data);

        // 🔥 Cập nhật localStorage để ComCart.vue nhận được thay đổi
        localStorage.setItem('cart', JSON.stringify(response.data.cartItems));
      } catch (error) {
        console.error("❌ Lỗi khi thêm vào giỏ hàng:", error.response ? error.response.data : error.message);
      }
    };

    const selectedImage = ref("");
    watch(product, () => {
      selectedImage.value = product.value.image || "default-image.jpg";
    });

    // 🛒 Mua ngay: Thêm vào giỏ hàng rồi chuyển qua thanh toán
    const buyNow = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Bạn cần đăng nhập để mua hàng!");
          return;
        }

        await axios.delete("http://localhost:3000/api/cart/clear", {
          headers: { Authorization: `Bearer ${token}` },
        });

        await axios.post(
          "http://localhost:3000/api/cart/add",
          {
            productId: props.product._id,
            quantity: quantity.value,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        router.push("/checkout"); // 🔥 Dùng router thay vì window.location.href
      } catch (error) {
        console.error("Lỗi khi mua ngay:", error);
        alert("Lỗi khi mua hàng, vui lòng thử lại!");
      }
    };

    // 🔼 Tăng số lượng sản phẩm
    const incrementQuantity = () => {
      if (product.value.stock > 0 && quantity.value < product.value.stock) {
        quantity.value++;
      }
    };

    // 🔽 Giảm số lượng sản phẩm
    const decrementQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--;
      }
    };

    return {
      product,
      quantity,
      selectedImage,
      addToCart,
      buyNow,
      incrementQuantity,
      decrementQuantity,
      errorMessage,
      user,
    };
  },
};
</script>


<style>
/* 🌟 Reset & Global Styles */
html, body {
  margin: 0;
  padding: 0;
  font-family: "Poppins", sans-serif;
  background: linear-gradient(135deg, #0a0f1e, #1c2333);
  color: #e2e8f0;
}

/* 🌟 Layout chính */
.product-detail {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 40px;
  max-width: 1200px;
  margin: auto;
  padding: 40px;
  background: rgba(20, 20, 40, 0.9);
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
}

/* 📌 Bố cục hình ảnh sản phẩm */
.product-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 420px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 255, 255, 0.15);
}

.product-image img {
  width: 100%;
  height: auto;
  transition: transform 0.3s ease;
}

.product-image img:hover {
  transform: scale(1.05);
}

/* 🔄 Hình thu nhỏ của sản phẩm */
.product-thumbnails {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 15px;
}

.product-thumbnails img {
  width: 65px;
  height: 65px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.product-thumbnails img:hover {
  transform: scale(1.1);
}

.product-thumbnails img.active {
  border-color: #00eaff;
  transform: scale(1.1);
}

/* 📝 Phần thông tin sản phẩm */
.product-info {
  flex: 1;
  max-width: 500px;
}

.product-info h2 {
  font-size: 28px;
  font-weight: bold;
  color: #00eaff;
}

/* 💲 Giá sản phẩm */
.product-price {
  font-size: 26px;
  font-weight: bold;
  color: #ff9800;
  margin-bottom: 15px;
}

/* 🔼🔽 Tăng giảm số lượng sản phẩm */
.quantity-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 16px 0;
  background: #222;
  border-radius: 30px;
  padding: 8px 16px;
  box-shadow: 0px 3px 10px rgba(0, 255, 255, 0.2);
}

.quantity-control button {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #00eaff, #008cff);
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantity-control button:hover {
  transform: scale(1.1);
}

.quantity-control span {
  font-size: 20px;
  font-weight: bold;
  color: #00eaff;
}

/* 🛒 Nút mua hàng */
.product-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.add-to-cart, .buy-now {
  flex: 1;
  padding: 14px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

.buy-now {
  background: linear-gradient(135deg, #ff9800, #ff5722);
  color: white;
  box-shadow: 0 4px 10px rgba(255, 87, 34, 0.3);
}

.buy-now:hover {
  background: linear-gradient(135deg, #e64a19, #ff9800);
}

.add-to-cart {
  background: linear-gradient(135deg, #008cff, #00eaff);
  color: white;
}

.add-to-cart:hover {
  background: linear-gradient(135deg, #00eaff, #008cff);
}

/* 🎁 Phần khuyến mãi */
.promotion {
  background: linear-gradient(to right, #ff9800, #ff5722);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  margin-top: 25px;
}

.promotion p {
  font-weight: bold;
  font-size: 18px;
  color: white;
  margin-bottom: 10px;
}

.promotion ul {
  list-style: none;
  padding: 0;
}

.promotion li {
  font-size: 16px;
  color: white;
  padding: 5px 0;
}

/* 📱 Responsive cho mobile */
@media (max-width: 768px) {
  .product-detail {
    flex-direction: column;
    padding: 20px;
  }

  .product-actions {
    flex-direction: column;
  }
}

</style>
