import { createWebHistory, createRouter } from "vue-router";
import Home from '@/components/ComHome.vue';
import GioiThieu from '@/components/ComGioiTh.vue';
import LienHe from '@/components/ComLienHe.vue';
import TinTuc from '@/components/ComTinTuc.vue';
import ProductDetail from '@/components/ComProductDetail.vue';
import Cart from '@/components/ComCart.vue';
import Register from "@/components/ComRegister.vue";
import ComLog from "@/components/ComLog.vue";
import CheckoutCart from '@/components/CheckoutCart.vue';
import Profile from "@/components/Profile.vue";
import OrderManagement from '../components/admin/OrderManagement.vue';
import ProductManagement from '../components/admin/ProductManagement.vue';
import UserManagement from '../components/admin/UserManagement.vue';
import HomePage from '../components/admin/HomePage.vue';

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/gioithieu",
    name: "GioiThieu",
    component: GioiThieu
  },
  {
    path: "/lienhe",
    name: "LienHe",
    component: LienHe
  },
  {
    path: "/tintuc",
    name: "TinTuc",
    component: TinTuc
  },
  {
    path: "/product/:id",
    name: "ProductDetail",
    component: ProductDetail
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  },
  {
    path: "/comLog",
    name: "ComLog",
    component: ComLog
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckoutCart
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile
  },
  {
    path: '/home-page',
    name: 'HomePage',
    component: HomePage,
    meta: { requiresAuth: true, role: 'user' },
  },
  {
    path: "/admin/orders",
    name: "OrderManagement",
    component: OrderManagement,
    meta: { requiresAuth: true, role: "admin" } // Chỉ admin mới vào được
  },
  {
    path: "/admin/products",
    name: "ProductManagement",
    component: ProductManagement,
    meta: { requiresAuth: true, role: "admin" }
  },
  {
    path: "/admin/users",
    name: "UserManagement",
    component: UserManagement,
    meta: { requiresAuth: true, role: "admin" }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("currentUser")); // Lấy user từ localStorage

  // Nếu route yêu cầu đăng nhập nhưng chưa đăng nhập thì chuyển hướng đến trang login
  if (to.meta.requiresAuth && !user) {
    next("/comLog");
  } else if (to.meta.requiresAuth && user) {
    // Nếu route yêu cầu quyền admin mà user không phải admin => Chặn truy cập
    if (to.meta.role === "admin" && user.role !== "admin") {
      next("/"); // Chuyển về trang chủ nếu không có quyền
    } else {
      next(); // Cho phép truy cập nếu có quyền
    }
  } else {
    next(); // Cho phép truy cập nếu không yêu cầu đăng nhập
  }
});


export default router;
