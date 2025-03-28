<template>
  <div class="wrapper">
    <Header />
    
    <div class="content">
      <router-view />
    </div>
    
    <Footer />
  </div>
</template>

<script>
import Header from './components/ComHeader.vue';
import Footer from './components/ComFooter.vue';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  }
};
</script>

<style>
/* ===== RESET & GLOBAL STYLES ===== */
html, body {
  height: 100%;
  margin: 0;
  font-family: "Poppins", sans-serif;
  background: radial-gradient(circle at top, #0f172a, #111827);
  color: #e2e8f0;
  overflow-x: hidden;
}

/* ===== WRAPPER LAYOUT ===== */
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ===== MAIN CONTENT ===== */
.content {
  flex: 1;
  padding: 100px 5% 30px;
  transition: all 0.3s ease-in-out;
  opacity: 0;
  animation: fadeIn 0.6s ease-in-out forwards;
}

/* ===== HEADER (Glassmorphism) ===== */
.header {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 95%;
  background: rgba(0, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  padding: 20px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #00eaff;
  box-shadow: 0px 5px 25px rgba(0, 255, 255, 0.2);
  z-index: 1000;
  border-radius: 15px;
}

/* ===== FOOTER ===== */
.footer {
  background: rgba(30, 41, 59, 0.85);
  color: #94a3b8;
  text-align: center;
  padding: 20px 0;
  font-size: 14px;
  font-weight: 500;
  border-radius: 15px 15px 0 0;
  box-shadow: 0px -5px 15px rgba(0, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

/* ===== BUTTONS & LINKS (Neon Effect) ===== */
button, a {
  background: linear-gradient(135deg, #00eaff, #008cff);
  border: none;
  padding: 13px 24px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  text-decoration: none;
  text-align: center;
  box-shadow: 0px 4px 15px rgba(0, 255, 255, 0.4);
}

button:hover, a:hover {
  background: linear-gradient(135deg, #008cff, #00eaff);
  transform: scale(1.05);
  box-shadow: 0px 6px 20px rgba(0, 255, 255, 0.6);
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

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
  .content {
    padding-top: 120px;
    padding-bottom: 40px;
  }
  .header {
    width: 98%;
  }
}

</style>
