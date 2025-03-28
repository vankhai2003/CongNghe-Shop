<template>
  <div>
    <h2>Quản lý người dùng</h2>
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên tài khoản</th>
          <th>Quyền</th>
          <th>Ngày tạo</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>{{ user._id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.role }}</td>
          <td>{{ new Date(user.createdAt).toLocaleString("vi-VN") }}</td>
          <td>
            <button @click="editUser(user)">Sửa</button>
            <button @click="deleteUser(user._id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Sửa User -->
    <div v-if="editingUser" class="modal">
      <div class="modal-content">
        <h3>Sửa thông tin người dùng</h3>
        <label>Username:</label>
        <input v-model="editingUser.username" />

        <label>Quyền:</label>
        <select v-model="editingUser.role">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button @click="updateUser">Lưu</button>
        <button @click="editingUser = null">Hủy</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      users: [],
      editingUser: null, // Lưu user đang chỉnh sửa
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        console.log("🔄 Đang lấy danh sách người dùng...");
        const response = await axios.get("http://localhost:3000/api/users");
        this.users = response.data;
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách người dùng:", error);
      }
    },

    // Xóa user
    async deleteUser(userId) {
      if (confirm("Bạn có chắc chắn muốn xóa user này?")) {
        try {
          await axios.delete(`http://localhost:3000/api/users/${userId}`);
          this.users = this.users.filter(user => user._id !== userId);
          alert("Xóa user thành công!");
        } catch (error) {
          console.error("❌ Lỗi khi xóa user:", error);
        }
      }
    },

    // Bật modal sửa user
    editUser(user) {
      this.editingUser = { ...user }; // Sao chép dữ liệu để chỉnh sửa
    },

    // Cập nhật user
    async updateUser() {
      try {
        await axios.put(`http://localhost:3000/api/users/${this.editingUser._id}`, {
          username: this.editingUser.username,
          role: this.editingUser.role
        });

        // Cập nhật lại danh sách user sau khi sửa
        this.fetchUsers();
        alert("Cập nhật user thành công!");
        this.editingUser = null; // Đóng modal
      } catch (error) {
        console.error("❌ Lỗi khi cập nhật user:", error);
      }
    }
  }
};
</script>

<style scoped>
/* ----- GLOBAL STYLES ----- */
body {
  font-family: "Poppins", sans-serif;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: #ffffff;
  margin: 0;
  padding: 0;
}

h2 {
  text-align: center;
  margin-top: 20px;
  font-size: 28px;
  color: #38bdf8;
}

/* ----- TABLE STYLES ----- */
table {
  width: 90%;
  margin: 20px auto;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0px 4px 12px rgba(0, 255, 255, 0.3);
  border-radius: 12px;
  overflow: hidden;
}

th, td {
  padding: 14px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

th {
  background: #1e3a8a;
  color: #ffffff;
  font-size: 16px;
  text-transform: uppercase;
}

tr:hover {
  background: rgba(255, 255, 255, 0.1);
  transition: background 0.3s ease;
}

/* ----- BUTTON STYLES ----- */
button {
  padding: 10px 16px;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.edit {
  background: #22c55e;
  color: white;
}

.delete {
  background: #ef4444;
  color: white;
}

button:hover {
  transform: scale(1.1);
}

/* ----- MODAL ----- */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease-in-out;
}

.modal-content {
  background: rgba(255, 255, 255, 0.1);
  padding: 24px;
  border-radius: 12px;
  width: 35%;
  text-align: center;
  box-shadow: 0px 6px 15px rgba(0, 255, 255, 0.3);
}

.modal-content h3 {
  color: #38bdf8;
  font-size: 22px;
}

.modal-content input,
.modal-content select {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 15px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
