import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import RoomsPage from "../pages/RoomsPage";
import IntroducePage from "../pages/IntroducePage";
import Admin from "../pages/Admin";
import UserProfile from "../pages/UserProfile";

const publicRoutes = [
    { path: "/", component: HomePage },
    { path: "/login", component: LoginPage },
    { path: "/register", component: RegisterPage },
    { path: "/rooms", component: RoomsPage },
    { path: "/introduce", component: IntroducePage },
    { path: "/userprofile", component: UserProfile },
    { path: "/admin", component: Admin },

];

const privateRoutes = [

];

export { publicRoutes, privateRoutes };