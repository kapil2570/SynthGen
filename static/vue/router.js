
import about from "./components/about.js";
import home from "./components/home.js";
import Registration from "./components/registration.js";
import Login from "./components/login.js";

const routes = [
    {
        path: "/",
        component: home,
        name: "home"
    },
    {
        path: "/about",
        component: about,
        name: "About"
    },
    {
        path: '/register',
        component: Registration,
        name: 'Register'
    },
    {
        path: '/login',
        component: Login,
        name: 'Login'
    },
    {
        path: "*",
        redirect: "/"
    }
];


const router = new VueRouter({
    routes
});

export default router;