import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/HomeView.vue";
import Login from "@/views/LoginView.vue";
import Register from "@/views/RegisterView.vue";
import History from "@/views/HistoryView.vue";
import Contact from "@/views/ContactView.vue";
import Profile from "@/views/ProfileView.vue";
import Brasil from "@/views/BrazilView.vue";
import ActiveAccount from "@/views/ActiveAccountView.vue";
import ManagerPassword from "@/views/ManagerPasswordView.vue";
import CookiesPolicy from "@/views/CookiesPolicyView.vue";
import TermsOfUse from "@/views/TermsOfUseView.vue";
import PrivacyPolicy from "@/views/PrivacyPolicyView.vue";
import UpdatePassword from "@/views/UpdatePasswordView.vue";


// lazy-loaded
//const BoardAdmin = () => import("./views/BoardAdmin.vue")
//const BoardModerator = () => import("./views/BoardModerator.vue")
//const BoardUser = () => import("./views/BoardUser.vue")

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/activeAccount",
    component: ActiveAccount,
  },
  {
    path: "/contact",
    component: Contact,
  },
  {
    path: "/history",
    component: History,
  },
  {
    path: "/cookiesPolicy",
    component: CookiesPolicy,
  },
  {
    path: "/termsOfUse",
    component: TermsOfUse,
  },
  {
    path: "/privacyPolicy",
    component: PrivacyPolicy,
  },
  {
    path: "/profile",
    name: "profile",
    // lazy-loaded
    component: Profile,
  },
  // {
  //   path: "/admin",
  //   name: "admin",
  //   // lazy-loaded
  //   component: BoardAdmin,
  // },
  // {
  //   path: "/mod",
  //   name: "moderator",
  //   // lazy-loaded
  //   component: BoardModerator,
  // },
  {
    path: "/brasil",
    name: "brasil",
    // lazy-loaded
    component: Brasil,
  },
  {
    path: "/managerPassword",
    component: ManagerPassword,
  },
  {
    path: "/updatePassword",
    component: UpdatePassword,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/home', '/history', '/contact', '/activeAccount', '/managerPassword', '/cookiesPolicy', '/termsOfUse', '/privacyPolicy', '/updatePassword'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (authRequired && (!loggedIn || !token || loggedIn == '' || token == '')) {
    next('/login');
  } else {
    next();
  }
});

export default router;