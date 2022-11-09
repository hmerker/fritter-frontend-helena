import Vue from "vue";
import VueRouter from "vue-router";
import HomePage from "./components/Home/HomePage.vue";
import FreetsPage from "./components/Freet/FreetsPage.vue";
import ExplorePage from "./components/Freet/ExplorePage.vue";
import IndividualFreetPage from "./components/Freet/IndividualFreetPage.vue";
import IndividualSharedFreetPage from "./components/SharedFreet/IndividualSharedFreetPage.vue";
import AccountPage from "./components/Account/AccountPage.vue";
import ProfilePage from "./components/Account/ProfilePage.vue";
import CreateAccountPage from "./components/Login/CreateAccountPage.vue";
import LoginPage from "./components/Login/LoginPage.vue";
import NotFound from "./NotFound.vue";

Vue.use(VueRouter);

const routes = [
  {path: "/", name: "Home", component: HomePage},
  {path: "/feed", name: "Feed", component: FreetsPage},
  {path: "/explore", name: "Explore", component: ExplorePage},
  {path: "/freet", name: "IndividualFreet", component: IndividualFreetPage},
  {path: "/sharedFreet", name: "IndividualSharedFreet", component: IndividualSharedFreetPage},
  {path: "/account", name: "Account", component: AccountPage},
  {path: "/user", name: "Profile", component: ProfilePage},
  {path: "/create", name: "Create", component: CreateAccountPage},
  {path: "/login", name: "Login", component: LoginPage},
  {path: "*", name: "Not Found", component: NotFound},
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name !== "Home" && to.name !== "Login" && to.name !== "Create" && !router.app.$store.state.username) {
      return next({name: "Login"});
    }
    if ((to.name === "Create" || to.name === "Login") && router.app.$store.state.username) {
      return next({name: "Account"});
    }
  }

  next();
});

export default router;
