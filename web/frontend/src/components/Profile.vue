<template>
  <div class="profile-container">
    <h2>Thông tin cá nhân</h2>
    <div v-if="user">
      <p><strong>Tên đăng nhập:</strong> {{ user.username }}</p>
      <div v-if="!editing">
        <p><strong>Địa chỉ:</strong> {{ user.address || "Chưa cập nhật" }}</p>
        <p><strong>Số điện thoại:</strong> {{ user.phone || "Chưa cập nhật" }}</p>
        <button class="bths" @click="startEditing">Chỉnh sửa thông tin</button>
      </div>
      <div v-else>
        <form @submit.prevent="saveChanges">
          <label>
            <strong>Địa chỉ:</strong>
            <input v-model="editedUser.address" type="text" placeholder="Nhập địa chỉ mới" />
          </label>
          <br />
          <label>
            <strong>Số điện thoại:</strong>
            <input v-model="editedUser.phone" type="text" placeholder="Nhập số điện thoại mới" />
          </label>
          <br />
          <button class="bths save" type="submit">Lưu thay đổi</button>
          <button class="bths cancel" @click="cancelEdit">Hủy</button>
        </form>
      </div>
    </div>
    <div v-else>
      <p>Vui lòng đăng nhập để xem thông tin cá nhân của bạn.</p>
    </div>

    <!-- 🛒 Lịch sử đơn hàng -->
    <h2>🛒 Lịch sử đơn hàng</h2>
    <div v-if="orders.length > 0">
      <div class="order-item" v-for="order in orders" :key="order._id">
        <h3>Đơn hàng #{{ order._id }}</h3>
        <p>📦 Trạng thái: <b>{{ order.status }}</b></p>
        <p>💰 Tổng tiền: {{ formatPrice(order.totalPrice) }}</p>
        <ul>
          <li v-for="item in order.items" :key="item.productId">
            {{ item.productName }} - SL: {{ item.quantity }} - {{ formatPrice(item.price) }}
          </li>
        </ul>
      </div>
    </div>
    <p v-else>📭 Bạn chưa có đơn hàng nào.</p>

    <button class="bths logout" @click="logout">Đăng xuất</button>
  </div>
</template>

<script>
import axios from "axios";
import eventBus from "@/router/eventBus";

export default {
  name: "UserProfile",
  data() {
    return {
      user: null,
      editing: false,
      editedUser: null,
      orders: [],
    };
  },
  async created() {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser) {
        this.user = currentUser;
        await this.fetchOrders(); // 🟢 Lấy danh sách đơn hàng theo userId
      } else {
        alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
        this.$router.push("/login");
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin người dùng:", error);
    }
  },
  methods: {
    async fetchOrders() {
      try {
        if (!this.user || !this.user._id) {
          console.warn("❌ Không có thông tin user hoặc user._id");
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("❌ Không có token xác thực");
          return;
        }

        const response = await axios.get("http://localhost:3000/api/orders/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data)) {
          // 🔥 Chuyển userId của order thành string để so sánh chính xác
          this.orders = response.data.filter(order => String(order.userId) === String(this.user._id));
        } else {
          console.warn("❌ API không trả về danh sách đơn hàng hợp lệ.");
          this.orders = [];
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy đơn hàng:", error);
      }
    },
    formatPrice(price) {
      return price ? `${price.toLocaleString("vi-VN")} VNĐ` : "0 VNĐ";
    },
    startEditing() {
      this.editing = true;
      this.editedUser = { ...this.user };
    },
    logout() {
      if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        localStorage.removeItem("currentUser");
        eventBus.emit("logout");
        this.$router.push("/");
      }
    },
    saveChanges() {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(this.editedUser.phone)) {
        alert("Số điện thoại không hợp lệ. Vui lòng nhập lại.");
        return;
      }

      this.user = { ...this.editedUser };
      localStorage.setItem("currentUser", JSON.stringify(this.user));
      this.editing = false;
      alert("Thông tin đã được cập nhật!");
    },
    cancelEdit() {
      this.editing = false;
    },
  },
};
</script>



<style scoped>
/* ----- PROFILE CONTAINER (GLASSMORPHISM) ----- */
.profile-container {
  max-width: 600px;
  margin: 60px auto;
  padding: 30px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  font-family: "Poppins", sans-serif;
  transition: all 0.3s ease-in-out;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

h2 {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 20px;
}

p {
  font-size: 16px;
  color: #ddd;
  margin: 10px 0;
}

/* ----- BUTTON STYLE (NEON EFFECT) ----- */
.bths {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  margin: 10px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.bths:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}

.bths.save {
  background: linear-gradient(135deg, #00f260, #0575e6);
  color: white;
}

.bths.cancel {
  background: linear-gradient(135deg, #555, #333);
  color: white;
}

.bths.logout {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
}

/* ----- INPUT STYLE (FUTURISTIC) ----- */
input {
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.3s ease-in-out;
}

input:focus {
  border-color: #00f260;
  box-shadow: 0 0 10px #00f260;
  outline: none;
}

/* ----- ORDER ITEM (MODERN CARD) ----- */
.order-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 18px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  margin-top: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.order-item h3 {
  font-size: 20px;
  font-weight: bold;
}

.order-item p {
  font-size: 15px;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  font-size: 14px;
  padding: 6px 0;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
}

ul li:last-child {
  border-bottom: none;
}

/* ----- RESPONSIVE DESIGN ----- */
@media (max-width: 768px) {
  .profile-container {
    max-width: 90%;
    padding: 20px;
  }

  .bths {
    width: 100%;
    padding: 12px;
  }

  input {
    font-size: 14px;
    padding: 10px;
  }
}
</style>
