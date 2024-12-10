import HomePage from "../component/pages/HomePage";
import LoginPage from "../component/pages/LoginPage";
import RegisterPage from "../component/pages/RegisterPage";

const publicRoutes = [
    { path: "/", component: HomePage },
    { path: "/login", component: LoginPage },
    { path: "/register", component: RegisterPage },
];

const privateRoutes = [

];

export { publicRoutes, privateRoutes };