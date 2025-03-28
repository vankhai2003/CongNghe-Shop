<template>
  <div>
    <header>
      <div class="container">
        <div class="logo">
          <a href="/">
            <img src="@/assets/logo-full-Photoroom.png" alt="Restaurant Logo" style="width: 150px;" />
          </a>
        </div>
        <nav>
          <ul>
            <li><router-link to="/">Trang Chủ</router-link></li>
            <template v-if="!isAdmin">
              <li><router-link to="/gioithieu">Giới Thiệu</router-link></li>
              <!-- <li><router-link to="/lienhe">Liên Hệ</router-link></li> -->
              <!-- <li><router-link to="/tintuc">Tin Tức</router-link></li> -->
            </template>

            <li v-if="!user"><router-link to="/register">Đăng ký</router-link></li>
            <li v-if="!user"><router-link to="/Comlog">Đăng Nhập</router-link></li>

            <template v-if="isAdmin">
              <li><router-link to="/admin/orders">Quản Lý Đơn Hàng</router-link></li>
              <li><router-link to="/admin/products">Quản Lý Sản Phẩm</router-link></li>
              <li><router-link to="/admin/users">Quản Lý Người Dùng</router-link></li>
            </template>
          </ul>
        </nav>
        <div class="cta">
          <router-link to="/cart" class="cta-button">🛒 Giỏ Hàng</router-link>
        </div>
        <div v-if="user" class="user-info">
          <router-link :to="{ name: 'Profile' }">
            <p class="dropdown-toggle">Xin chào, {{ user.username }}</p>
          </router-link>
          <div v-if="dropdownVisible" class="dropdown-menu">
            <button @click="logout">Đăng Xuất</button>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
import eventBus from '@/router/eventBus';

export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem('currentUser')) || null,
      dropdownVisible: false,
    };
  },
  computed: {
    isAdmin() {
      return this.user && this.user.role === 'admin';
    },
  },
  created() {
    eventBus.on('loginSuccess', (user) => {
      this.user = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
    });

    eventBus.on('logout', () => {
      this.user = null;
      localStorage.removeItem('currentUser');
    });

    window.addEventListener('storage', this.syncUserState);
  },
  beforeUnmount() {
    // Dừng lắng nghe sự kiện khi component bị hủy
    eventBus.off('loginSuccess');
    eventBus.off('logout');
    window.removeEventListener('storage', this.syncUserState); // Hủy lắng nghe sự kiện 'storage'
  },
  methods: {
    logout() {
      eventBus.emit('logout');
      this.$router.push('/'); // Điều hướng về trang chủ sau khi đăng xuất
    },

    syncUserState(event) {
      if (event.key === 'currentUser') {
        this.user = event.newValue ? JSON.parse(event.newValue) : null;
      }
    },

    // Chuyển trạng thái hiển thị dropdown
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    }
  },
};
</script>

<style scoped>
/* ===== RESET ===== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  padding-top: 80px;
  font-family: 'Poppins', sans-serif;
  color: #ffffff;
  background: linear-gradient(135deg, #0a0a0a, #1c1c1c);
  overflow-x: hidden;
}

/* ===== HEADER ===== */
header {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 95%;
  z-index: 1000;
  background: rgba(20, 20, 30, 0.75);
  backdrop-filter: blur(20px);
  border-radius: 15px;
  padding: 15px 30px;
  box-shadow: 0px 5px 25px rgba(0, 255, 255, 0.15);
  transition: all 0.3s ease-in-out;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* ===== LOGO ===== */
.logo img {
  max-height: 50px;
  transition: transform 0.3s ease-in-out;
}

.logo img:hover {
  transform: scale(1.05);
}

/* ===== MENU ===== */
nav ul {
  list-style: none;
  display: flex;
  align-items: center;
}

nav ul li {
  margin: 0 15px;
}

nav ul li a {
  text-decoration: none;
  color: #0ff;
  font-size: 16px;
  font-weight: 600;
  position: relative;
  transition: all 0.3s ease-in-out;
}

nav ul li a::after {
  content: "";
  display: block;
  height: 3px;
  width: 0;
  background: linear-gradient(90deg, #0ff, #8000ff);
  transition: width 0.3s ease-in-out;
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
}

nav ul li a:hover {
  color: #8000ff;
}

nav ul li a:hover::after {
  width: 100%;
}

/* ===== GIỎ HÀNG ===== */
.cta-button {
  padding: 12px 24px;
  font-weight: 600;
  background: linear-gradient(135deg, #00e6e6, #8000ff);
  color: white;
  border-radius: 50px;
  box-shadow: 0px 5px 20px rgba(0, 255, 255, 0.3);
  transition: all 0.3s ease-in-out;
  text-decoration: none;
}

.cta-button:hover {
  transform: scale(1.08);
  box-shadow: 0px 8px 25px rgba(0, 255, 255, 0.5);
}

/* ===== USER INFO ===== */
.user-info {
  display: flex;
  align-items: center;
  position: relative;
}

.user-info p {
  font-size: 16px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.user-info p:hover {
  color: #0ff;
}

/* ===== DROPDOWN MENU ===== */
.dropdown-menu {
  position: absolute;
  top: 50px;
  right: 0;
  background: rgba(10, 10, 20, 0.9);
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0px 4px 20px rgba(0, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
  min-width: 180px;
  animation: fadeIn 0.3s ease-in-out;
}

.dropdown-menu button {
  background: none;
  border: none;
  color: white;
  font-size: 14px;
  padding: 10px 0;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.dropdown-menu button:hover {
  color: #0ff;
}

/* ===== ANIMATIONS ===== */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  nav ul {
    flex-direction: column;
    text-align: center;
  }

  nav ul li {
    margin: 10px 0;
  }

  .cta-button {
    margin-top: 10px;
  }
}

</style>
