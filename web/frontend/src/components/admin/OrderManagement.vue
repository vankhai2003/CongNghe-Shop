<template>
  <div>
    <h2>Quản lý đơn hàng</h2>
    <p>📦 Tổng số đơn hàng: {{ orders.length }}</p>

    <div class="order-list">
      <div class="order-item" v-for="order in orders" :key="order._id">
        <h3>Đơn hàng #{{ order._id }}</h3>
        <p>👤 Khách hàng: <b>{{ order.customer.name }}</b></p>
        <p>📞 Số điện thoại: {{ order.customer.phone }}</p>
        <p>🏠 Địa chỉ: {{ order.customer.address }}</p>
        <p>🛒 Trạng thái: <b>{{ order.customer.status }}</b></p>
        <p>💰 Tổng tiền: {{ order.totalPrice.toLocaleString("vi-VN") }} VNĐ</p>

        <button @click="deleteOrder(order._id)">🗑 Xóa</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      orders: [],
    };
  },

  mounted() {
    this.fetchOrders();
  },

  methods: {
    // 🟢 Lấy danh sách đơn hàng
    async fetchOrders() {
      try {
        console.log("🔄 Đang lấy danh sách đơn hàng...");
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Bạn chưa đăng nhập!");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get("http://localhost:3000/api/orders/all", config);
        
        this.orders = response.data.map(order => ({
          _id: order._id,
          customer: {
            name: order.customer?.name || "Không có tên",
            phone: order.customer?.phone || "Không có số điện thoại",
            address: order.customer?.address || "Không có địa chỉ",
            status: order.customer?.status || "Đang xử lý",
          },
          totalPrice: order.items.reduce((total, item) => total + item.price * item.quantity, 0),
        }));
        
      } catch (error) {
        console.error("❌ Lỗi khi lấy đơn hàng:", error);
      }
    },

    // 🗑 Xóa đơn hàng
    async deleteOrder(orderId) {
      console.log("🗑 Đang xóa đơn hàng với ID:", orderId);
      
      if (!confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("❌ Bạn chưa đăng nhập!");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        await axios.delete(`http://localhost:3000/api/orders/${orderId}`, config);

        this.orders = this.orders.filter(order => order._id !== orderId);
        alert("✅ Đơn hàng đã được xóa!");
      } catch (error) {
        console.error("❌ Lỗi khi xóa đơn hàng:", error.response?.data || error.message);
        alert(`❌ Lỗi: ${error.response?.data?.message || "Không thể xóa đơn hàng"}`);
      }
    },
  },
};
</script>

<style scoped>
/* 🌍 Tổng thể */
h2 {
  text-align: center;
  color: #ffffff;
  margin-bottom: 25px;
  font-size: 26px;
  font-weight: bold;
  text-transform: uppercase;
}

/* 📦 Danh sách đơn hàng */
.order-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  padding: 10px;
  justify-content: center;
}

/* 🎨 Mỗi đơn hàng */
.order-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  position: relative;
  overflow: hidden;
  color: white;
}

.order-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.2);
}

/* 🏷 Tiêu đề đơn hàng */
h3 {
  color: #f1c40f;
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: bold;
}

/* 📝 Thông tin đơn hàng */
p {
  font-size: 14px;
  color: #ecf0f1;
  margin: 6px 0;
  line-height: 1.6;
}

p b {
  color: #f39c12;
}

/* 💰 Tổng tiền */
p:last-child {
  font-weight: bold;
  color: #e74c3c;
  font-size: 18px;
}

/* 🗑 Nút Xóa */
button {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  margin-top: 15px;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  width: 100%;
}

button:hover {
  background: linear-gradient(135deg, #c0392b, #a93226);
  transform: scale(1.1);
}

/* 🔥 Hiệu ứng động */
.order-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #f1c40f, #e67e22);
  transition: left 0.3s ease-in-out;
}

.order-item:hover::before {
  left: 0;
}

/* 📱 Responsive cho mobile */
@media (max-width: 768px) {
  .order-list {
    grid-template-columns: 1fr;
  }
  .order-item {
    padding: 15px;
  }
  h2 {
    font-size: 22px;
  }
  h3 {
    font-size: 18px;
  }
  p {
    font-size: 13px;
  }
  button {
    font-size: 13px;
    padding: 10px 14px;
  }
}
</style>
