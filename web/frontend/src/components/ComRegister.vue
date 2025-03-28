<template>
  <div class="register-container">
    <h2>Đăng ký tài khoản</h2>
    <input v-model="username" placeholder="Tên đăng nhập" />
    <input v-model="password" type="password" placeholder="Mật khẩu" />
    <input v-model="confirmPassword" type="password" placeholder="Xác nhận mật khẩu" />
    <button class="btdn" @click="register" :disabled="loading">
      {{ loading ? "Đang xử lý..." : "Đăng ký" }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      error: "",
      success: "",
      loading: false, // Thêm trạng thái loading
    };
  },
  methods: {
    resetMessages() {
      this.error = "";
      this.success = "";
    },
    async register() {
      this.resetMessages();

      if (!this.username || !this.password || !this.confirmPassword) {
        this.error = "Vui lòng điền đầy đủ thông tin";
        return;
      }
      if (this.password.length < 6) {
        this.error = "Mật khẩu phải có ít nhất 6 ký tự";
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.error = "Mật khẩu không trùng khớp";
        return;
      }

      this.loading = true;
      try {
        await axios.post("http://localhost:3000/api/users/register", {
        username: this.username,
        password: this.password,
});


        this.success = "Đăng ký thành công! Đang chuyển hướng...";
        setTimeout(() => {
          this.$router.push("/Comlog");
        }, 1000);
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          "Lỗi khi đăng ký. Vui lòng thử lại sau.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 40px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0px 10px 30px rgba(0, 255, 255, 0.3);
  text-align: center;
  color: #00ffff;
  animation: fadeIn 0.5s ease-in-out;
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
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #00ffff;
  text-shadow: 0 0 10px #00ffff;
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
  color: #00ffff;
  transition: all 0.3s ease-in-out;
}

input::placeholder {
  color: rgba(0, 255, 255, 0.7);
}

input:focus {
  background: rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.btdn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #00ffff, #007bff);
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  margin-top: 15px;
  text-shadow: 0 0 5px #fff;
}

.btdn:hover {
  background: linear-gradient(135deg, #00ccff, #0055ff);
  transform: translateY(-2px);
  box-shadow: 0px 8px 16px rgba(0, 255, 255, 0.4);
}

.btdn:disabled {
  background: gray;
  cursor: not-allowed;
  box-shadow: none;
}

.error {
  margin-top: 15px;
  font-weight: bold;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  background: rgba(255, 0, 0, 0.2);
  color: #ff4d4d;
}

.success {
  margin-top: 15px;
  font-weight: bold;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  background: rgba(0, 255, 0, 0.2);
  color: #00ff80;
}

p {
  font-size: 14px;
  color: #ddd;
  margin-top: 20px;
}
</style>