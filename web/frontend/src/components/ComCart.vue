<template>
  <div v-if="!isCheckout" class="cart-container">
    <h2 class="cart-title">🛒 Giỏ hàng của bạn</h2>

    <div v-if="cart.length > 0">
      <div v-for="item in cart" :key="item._id" class="cart-item">
        <img v-if="item.productId?.image" :src="item.productId.image" alt="Ảnh sản phẩm" class="cart-product-image" />
        <div class="cart-product-info">
          <h3 class="cart-product-name">{{ item.productId?.name || "Không có tên" }}</h3>
          <p class="cart-product-price">{{ formatPrice(item.productId?.price) }}</p>
        </div>
        <div class="cart-quantity-controls">
          <button @click="updateQuantity(item, -1)" :disabled="item.quantity <= 1" class="cart-btn-quantity">-</button>
          <span class="cart-quantity">{{ item.quantity }}</span>
          <button @click="updateQuantity(item, 1)" class="cart-btn-quantity">+</button>
        </div>
        <button @click="removeFromCart(item)" class="cart-btn-remove">X</button>
      </div>

      <h3 class="cart-total-price">Tổng tiền: {{ formatPrice(totalPrice) }}</h3>
      <button @click="checkout" class="cart-btn-checkout">🛍 Thanh toán</button>
    </div>

    <p v-else class="empty-cart">🛑 Giỏ hàng trống!</p>
  </div>

  <!-- Hiển thị trang thanh toán khi bấm nút -->
  <CheckoutCart v-if="isCheckout" :cart="cart" />

</template>

<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import CheckoutCart from "./CheckoutCart.vue";


export default {
  components: { CheckoutCart },
  setup() {
    const cart = ref([]);
    const user = ref(null);
    const isCheckout = ref(false); // Biến kiểm tra trạng thái


    // 🔄 Hàm lấy dữ liệu giỏ hàng
    const fetchCart = async () => {
      if (!user.value?._id) {
        console.warn("⚠️ Không tìm thấy user ID!");
        return;
      }
      try {
        const response = await axios.get(`http://localhost:3000/api/cart?userId=${user.value._id}`);
        cart.value = response.data.filter(item => item.productId?.image); // ✅ Lọc bỏ sản phẩm lỗi
      } catch (error) {
        console.error("❌ Lỗi lấy giỏ hàng:", error);
      }
    };

    // 🔄 Cập nhật số lượng sản phẩm
    const updateQuantity = async (item, change) => {
      if (!user.value?._id) return;
      try {
        await axios.put("http://localhost:3000/api/cart/update", {
          userId: user.value._id,
          itemId: item._id,
          quantity: item.quantity + change,
        });
        fetchCart();
      } catch (error) {
        console.error("❌ Lỗi cập nhật số lượng:", error);
      }
    };

    // ❌ Xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = async (item) => {
      if (!user.value?._id) return;
      try {
        await axios.delete("http://localhost:3000/api/cart/remove", {
          data: { userId: user.value._id, itemId: item._id },
        });
        fetchCart();
      } catch (error) {
        console.error("❌ Lỗi xóa sản phẩm:", error);
      }
    };

    // 🔢 Tính tổng tiền
    const totalPrice = computed(() =>
      cart.value.reduce((total, item) => total + (item.productId?.price || 0) * item.quantity, 0)
    );

    const checkout = () => {
      isCheckout.value = true; // Ẩn giỏ hàng, hiển thị CheckoutCart.vue
    };


    // 💲 Định dạng giá tiền
    const formatPrice = (price) => (price ? `${price.toLocaleString("vi-VN")} VNĐ` : "0 VNĐ");

    // ⏳ Lấy dữ liệu khi component được mount
    onMounted(() => {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        user.value = JSON.parse(savedUser);
        if (user.value?._id) fetchCart();
      } else {
        console.warn("⚠️ Không tìm thấy user, không thể tải giỏ hàng!");
      }
    });

    return {
      cart,
      updateQuantity,
      removeFromCart,
      isCheckout,
      checkout,
      totalPrice,
      formatPrice,
    };
  },
};
</script>

<style>
:root {
  --primary-color: #00eaff; /* Màu xanh neon công nghệ */
  --secondary-color: #ff007f; /* Màu hồng neon hiện đại */
  --background-color: rgba(0, 0, 0, 0.6); /* Glassmorphism */
  --border-radius: 14px;
  --shadow-glow: 0 0 15px rgba(0, 255, 255, 0.6);
}

/* 🛒 Container chính */
.cart-container {
  max-width: 650px;
  margin: 50px auto;
  padding: 30px;
  border-radius: var(--border-radius);
  background: var(--background-color);
  backdrop-filter: blur(15px);
  box-shadow: var(--shadow-glow);
  transition: all 0.3s ease-in-out;
}

.cart-container:hover {
  transform: scale(1.03);
}

/* 📌 Tiêu đề */
.cart-title {
  text-align: center;
  font-size: 30px;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--primary-color);
  text-shadow: var(--shadow-glow);
}

/* 📦 Mục trong giỏ hàng */
.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 2px solid rgba(0, 255, 255, 0.3);
  transition: background 0.3s ease-in-out;
}

.cart-item:hover {
  background: rgba(0, 255, 255, 0.1);
  box-shadow: var(--shadow-glow);
}

/* 🖼 Ảnh sản phẩm */
.cart-product-image {
  width: 85px;
  height: 85px;
  border-radius: var(--border-radius);
  object-fit: cover;
  transition: transform 0.4s ease;
}

.cart-product-image:hover {
  transform: scale(1.15);
}

/* 📝 Thông tin sản phẩm */
.cart-product-info {
  flex: 1;
  margin-left: 20px;
}

.cart-product-name {
  font-size: 20px;
  font-weight: bold;
  color: white;
}

.cart-product-price {
  color: var(--secondary-color);
  font-weight: bold;
  font-size: 18px;
}

/* 🔢 Điều khiển số lượng */
.cart-quantity-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cart-btn-quantity {
  background: var(--primary-color);
  color: black;
  border: none;
  padding: 10px 15px;
  border-radius: var(--border-radius);
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: var(--shadow-glow);
}

.cart-btn-quantity:hover {
  background: white;
  color: var(--primary-color);
}

.cart-quantity {
  font-size: 20px;
  font-weight: bold;
  color: white;
}

/* ❌ Nút xóa */
.cart-btn-remove {
  background: var(--secondary-color);
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: var(--border-radius);
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: var(--shadow-glow);
}

.cart-btn-remove:hover {
  background: white;
  color: var(--secondary-color);
}

/* 💰 Tổng tiền */
.cart-total-price {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-top: 25px;
  color: white;
  text-shadow: var(--shadow-glow);
}

/* 🛍 Nút thanh toán */
.cart-btn-checkout {
  display: block;
  width: 100%;
  padding: 16px;
  font-size: 20px;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: var(--border-radius);
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: var(--shadow-glow);
}

.cart-btn-checkout:hover {
  filter: brightness(1.2);
  transform: translateY(-4px);
}

/* 🛑 Giỏ hàng trống */
.empty-cart {
  text-align: center;
  font-size: 20px;
  color: white;
  margin-top: 25px;
}

/* 📱 Responsive */
@media (max-width: 500px) {
  .cart-container {
    padding: 20px;
  }

  .cart-product-image {
    width: 75px;
    height: 75px;
  }

  .cart-product-name {
    font-size: 18px;
  }

  .cart-btn-checkout {
    font-size: 18px;
  }
}
</style>
