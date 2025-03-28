<template>
  <div class="contact-page">
    <h1>Liên Hệ Với Chúng Tôi</h1>
    <div class="contact-info">
      <a href="https://www.facebook.com/vankai.11102k3" target="_blank">
        <i class="facebook"></i> Facebook
      </a>
      <a href="https://zalo.me/0911405484" target="_blank">
        <i class="zalo"></i> Zalo
      </a>
      <a href="tel:0911405484">
        <i class="phone"></i> 0911405484
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComLienHe'
}
</script>

<style scoped>
.contact-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
}

.contact-info a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  font-size: 18px;
}

.contact-info i {
  margin-right: 10px;
  font-size: 24px;
}

</style>