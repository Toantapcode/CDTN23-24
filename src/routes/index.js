import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import RoomsPage from "../pages/RoomsPage";
import IntroducePage from "../pages/IntroducePage";
import Admin from "../Admin"
import UserProfile from "../pages/UserProfile";
import Dashboard from "../Admin/pages/Dashboard";
import BookingPage from "../pages/BookingPage";
import ContactPage from "../pages/component/contact";


const publicRoutes = [
    { path: "/", component: HomePage, title: 'Trang chủ'  },
    { path: "/login", component: LoginPage, title: 'Đăng nhập'  },
    { path: "/register", component: RegisterPage, title: 'Đăng ký'  },
    { path: "/rooms", component: RoomsPage, title: 'Phòng'  },
    { path: "/introduce", component: IntroducePage, title: 'Giới thiệu'  },
    { path: "/userprofile", component: UserProfile, title: 'Thông tin cá nhân'  },
    { path: "/bookingpage", component: BookingPage, title: 'Đặt phòng'  },
    { path: "/contact", component: ContactPage, title: 'Liên hệ'  },

]; 

const privateRoutes = [
    { path: "/admin", component: Admin, title: 'Quản lý'  },
    { path: "/dashboard", component: Dashboard, title: 'Thông tin'  },
];

export { publicRoutes, privateRoutes };