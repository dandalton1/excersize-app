import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import About from './views/About.vue';
import Login from './views/Login.vue';
import SignUp from './views/SignUp.vue';
import MyAccount from './views/MyAccount.vue';
import MyFriends from './views/MyFriends.vue';
import Walk from './views/Walk.vue';
import Goal from './views/Goal.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/sign-up",
      name: "sign-up",
      component: SignUp
    },
    {
      path: "/my-account",
      name: "my-account",
      component: MyAccount
    },
    {
      path: "/my-friends",
      name: "my-friends",
      component: MyFriends
    },
    {
      path: "/walk",
      name: "walk",
      component: Walk
    },
    {
      path: "/goal",
      name: "goal",
      component: Goal
    }
  ]
});
