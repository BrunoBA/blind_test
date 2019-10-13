import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Playlists from './views/Playlists'
import Login from './views/Login'
import Track from './views/Track'

import store from "./store";

Vue.use(Router)

const loginGuard = (to, from, next) => {
  console.log(store.getters.authToken == null || store.getters.authToken == "null")
  if (store.getters.authToken == null || store.getters.authToken == "null") {
    router.push('/')
  }
  next()
}

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/playlists',
      name: 'playlists',
      component: Playlists,
      beforeEnter: loginGuard
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/track/:id',
      name: 'track',
      component: Track,
    }
  ]
})

export default router