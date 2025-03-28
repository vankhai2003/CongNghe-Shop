<template>
  <div class="checkout-container">
    <h2 class="checkout-title">🛍 Xác nhận đơn hàng</h2>

    <div v-if="cart && cart.length > 0">
      <div v-for="item in cart" :key="item._id" class="checkout-item">
        <img v-if="item.productId?.image" :src="item.productId.image" alt="Ảnh sản phẩm"
          class="checkout-product-image" />
        <div class="checkout-product-info">
          <h3 class="checkout-product-name">{{ item.productId?.name || "Không có tên" }}</h3>
          <p class="checkout-product-price">{{ formatPrice(item.productId?.price) }}</p>
          <p class="checkout-quantity">Số lượng: {{ item.quantity }}</p>
        </div>
      </div>

      <h3 class="checkout-total-price">Tổng tiền: {{ formatPrice(totalPrice) }}</h3>

      <!-- Form nhập thông tin khách hàng -->
      <div class="customer-info">
        <label>Họ và tên:</label>
        <input v-model="customer.name" type="text" placeholder="Nhập họ và tên" required />

        <label>Địa chỉ:</label>
        <input v-model="customer.address" type="text" placeholder="Nhập địa chỉ giao hàng" required />

        <label>Số điện thoại:</label>
        <input v-model="customer.phone" type="text" placeholder="Nhập số điện thoại" required />
      </div>

      <!-- Chọn phương thức thanh toán -->
      <div class="payment-method">
        <label>Chọn phương thức thanh toán:</label>
        <select v-model="paymentMethod">
          <option value="cod">Thanh toán khi nhận hàng (COD)</option>
          <option value="momo">MoMo</option>
          <option value="vnpay">VNPAY-QR</option>
        </select>
      </div>

      <button @click="placeOrder" class="checkout-btn-confirm">✅ Xác nhận & Đặt hàng</button>
    </div>

    <p v-else class="empty-cart">🛑 Không có sản phẩm trong giỏ hàng!</p>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import axios from "axios";

export default {
  props: ["cart", "userId"],
  setup(props, { emit }) {
    const customer = ref({ name: "", address: "", phone: "" });
    const paymentMethod = ref("cod");
    const totalPrice = computed(() =>
      props.cart.reduce((total, item) => total + (item.productId?.price || 0) * item.quantity, 0)
    );
    const formatPrice = (price) => (price ? `${price.toLocaleString("vi-VN")} VNĐ` : "0 VNĐ");

    const placeOrder = async () => {
      if (!customer.value.name || !customer.value.address || !customer.value.phone) {
        alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        alert("🔒 Bạn cần đăng nhập để đặt hàng!");
        return;
      }

      try {
        const orderData = {
          userId: props.userId,
          customer: customer.value,
          items: props.cart.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price,
          })),
          paymentMethod: paymentMethod.value, // Gửi phương thức thanh toán
        };

        const response = await axios.post("http://localhost:3000/api/orders", orderData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 201) {
          if (paymentMethod.value === "momo") {
            window.location.href = response.data.momoUrl;
          } else if (paymentMethod.value === "vnpay") {
            window.location.href = response.data.vnpayUrl;
          } else {
            alert("🎉 Đặt hàng thành công!");
            await clearCart();
            customer.value = { name: "", address: "", phone: "" };
            emit("order-success");
            window.location.href = "/";
          }
        } else {
          alert("⚠️ Đặt hàng thất bại! Vui lòng thử lại.");
        }
      } catch (error) {
        console.error("❌ Lỗi khi đặt hàng:", error);
        alert(error.response?.data?.message || "⚠️ Lỗi server, vui lòng thử lại!");
      }
    };

    const clearCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        await axios.delete("http://localhost:3000/api/cart/clear", {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("❌ Lỗi xóa giỏ hàng:", error);
      }
    };

    return {
      customer,
      paymentMethod,
      totalPrice,
      formatPrice,
      placeOrder,
    };
  },
};
</script>


<style>
/* 🚀 Container chính */
.checkout-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  background: rgba(10, 25, 47, 0.95);
  /* Màu nền đậm chất công nghệ */
  border-radius: 16px;
  box-shadow: 0 0 15px rgba(0, 238, 255, 0.5);
  /* Hiệu ứng glow xanh neon */
  transition: all 0.3s ease-in-out;
}

.checkout-container:hover {
  box-shadow: 0 0 25px rgba(0, 238, 255, 0.8);
}

/* 🎯 Tiêu đề */
.checkout-title {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  color: #00E5FF;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0 0 10px #00E5FF;
  animation: neonGlow 1.5s infinite alternate;
}

/* 🌟 Danh sách sản phẩm */
.checkout-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 238, 255, 0.2);
}

.checkout-item:hover {
  transform: scale(1.02);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 10px rgba(0, 238, 255, 0.3);
}

/* 🖼 Hình ảnh sản phẩm */
.checkout-product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 15px;
  border: 2px solid rgba(0, 238, 255, 0.5);
}

/* 📝 Thông tin sản phẩm */
.checkout-product-info {
  flex-grow: 1;
  color: #D1ECFF;
}

.checkout-product-name {
  font-size: 18px;
  font-weight: bold;
}

.checkout-product-price {
  font-size: 16px;
  font-weight: bold;
  color: #00E5FF;
}

.checkout-quantity {
  font-size: 14px;
  color: #ccc;
}

/* 💰 Tổng tiền */
.checkout-total-price {
  text-align: right;
  font-size: 1.4em;
  font-weight: bold;
  margin-top: 20px;
  color: #ff6b6b;
  text-shadow: 0 0 10px rgba(255, 107, 107, 0.8);
}

/* 🛒 Form nhập thông tin khách hàng */
.customer-info {
  margin-top: 25px;
  padding: 15px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 238, 255, 0.3);
  backdrop-filter: blur(10px);
}

.customer-info label {
  display: block;
  font-weight: 600;
  margin-top: 12px;
  color: #00E5FF;
  text-transform: uppercase;
}

.customer-info input {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  transition: all 0.3s ease;
  outline: none;
  border: 1px solid rgba(0, 238, 255, 0.3);
}

.customer-info input:focus {
  background: rgba(0, 0, 0, 0.7);
  box-shadow: 0 0 12px rgba(0, 238, 255, 0.8);
  border: 1px solid rgba(0, 238, 255, 0.8);
}

/* ✅ Nút đặt hàng */
.checkout-btn-confirm {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #00E5FF, #007bff);
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 20px;
  border-radius: 10px;
  font-size: 1.2em;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 12px rgba(0, 238, 255, 0.3);
}

.checkout-btn-confirm:hover {
  background: linear-gradient(135deg, #007bff, #0056b3);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 238, 255, 0.5);
}

/* 🔥 Hiệu ứng giỏ hàng trống */
.empty-cart {
  text-align: center;
  font-size: 1.2em;
  color: #ff6b6b;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(255, 107, 107, 0.8);
}

/* 🌟 Hiệu ứng neon */
@keyframes neonGlow {
  0% {
    text-shadow: 0 0 10px #00E5FF;
  }

  100% {
    text-shadow: 0 0 20px #00E5FF;
  }
}

/* 📱 Responsive */
@media (max-width: 768px) {
  .checkout-container {
    max-width: 90%;
    padding: 20px;
  }

  .checkout-title {
    font-size: 24px;
  }

  .checkout-product-image {
    width: 70px;
    height: 70px;
  }

  .checkout-product-name {
    font-size: 16px;
  }

  .checkout-product-price {
    font-size: 14px;
  }

  .checkout-btn-confirm {
    font-size: 1em;
    padding: 12px;
  }
}

.payment-method {
  margin-top: 15px;
  padding: 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 238, 255, 0.3);
}

.payment-method label {
  font-weight: bold;
  color: #00E5FF;
}

.payment-method select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(0, 238, 255, 0.3);
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
}
</style>
