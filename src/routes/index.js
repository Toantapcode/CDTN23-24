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
    { path: "/", component: HomePage },
    { path: "/login", component: LoginPage },
    { path: "/register", component: RegisterPage },
    { path: "/rooms", component: RoomsPage },
    { path: "/introduce", component: IntroducePage },
    { path: "/userprofile", component: UserProfile },
    { path: "/bookingpage", component: BookingPage },
    { path: "/contact", component: ContactPage },

];

const privateRoutes = [
    { path: "/admin", component: Admin },
    { path: "/dashboard", component: Dashboard },
];

export { publicRoutes, privateRoutes };