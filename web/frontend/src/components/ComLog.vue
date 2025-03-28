<template>
  <div class="login-container">
    <h2>Đăng Nhập</h2>
    <input v-model="username" placeholder="Tên đăng nhập" />
    <input v-model="password" type="password" placeholder="Mật khẩu" />
    <button class="btdk" @click="login" :disabled="loading">
      {{ loading ? "Đang xử lý..." : "Đăng Nhập" }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from "axios";
import eventBus from "@/router/eventBus";

export default {
  data() {
    return {
      username: "",
      password: "",
      error: "",
      loading: false,
    };
  },
  methods: {
    async login() {
  this.error = "";
  if (!this.username || !this.password) {
    this.error = "Vui lòng nhập đầy đủ thông tin!";
    return;
  }

  this.loading = true;
  try {
    const response = await axios.post("http://localhost:3000/api/users/login", {
      username: this.username,
      password: this.password,
    });

    localStorage.setItem("token", response.data.token); // Lưu token + role +++++++
    eventBus.emit("loginSuccess", response.data);

    if (response.data.role === "admin") {
      this.$router.push("/admin/products"); // Chuyển thẳng vào trang admin
    } else {
      this.$router.push("/");
    }
  } catch (error) {
    this.error = error.response?.data?.message || "Đăng nhập thất bại";
  } finally {
    this.loading = false;
  }
}
  },
};
</script>



<style scoped>
.login-container {
  max-width: 420px;
  margin: 50px auto;
  padding: 40px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  text-align: center;
  color: #00eaff;
  animation: fadeIn 0.6s ease-in-out;
  border: 1px solid rgba(0, 255, 255, 0.3);
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

h2 {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 25px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #00eaff;
  text-shadow: 0 0 8px rgba(0, 255, 255, 0.8);
}

input {
  width: 100%;
  padding: 14px;
  margin: 12px 0;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  background: rgba(0, 255, 255, 0.2);
  color: #00eaff;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

input::placeholder {
  color: rgba(0, 255, 255, 0.6);
  font-style: italic;
}

input:focus {
  background: rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
  transform: scale(1.02);
}

.btdk {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #00eaff, #007eff);
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  margin-top: 15px;
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.5);
}

.btdk:hover {
  background: linear-gradient(135deg, #007eff, #00eaff);
  transform: translateY(-3px);
  box-shadow: 0px 12px 24px rgba(0, 255, 255, 0.7);
}

.btdk:disabled {
  background: gray;
  cursor: not-allowed;
  box-shadow: none;
}

.error {
  margin-top: 15px;
  font-weight: bold;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  background: rgba(255, 0, 0, 0.3);
  color: #ff4d4d;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
}

p {
  font-size: 14px;
  color: #00eaff;
  margin-top: 20px;
  text-shadow: 0 0 8px rgba(0, 255, 255, 0.6);
}
</style>
