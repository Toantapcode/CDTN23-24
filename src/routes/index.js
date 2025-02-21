import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import RoomsPage from "../pages/RoomsPage";
import IntroducePage from "../pages/IntroducePage";
import Admin from "../pages/Admin";

const publicRoutes = [
    { path: "/", component: HomePage },
    { path: "/login", component: LoginPage },
    { path: "/register", component: RegisterPage },
    { path: "/rooms", component: RoomsPage },
    { path: "/introduce", component: IntroducePage },
];

const privateRoutes = [
    { path: "/admin", component: Admin },

];

export { publicRoutes, privateRoutes };