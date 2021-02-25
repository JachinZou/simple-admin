import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import request from '@/common/request'
import config from '@/setting'
import { isLogin } from '@/common/authority'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/dd',
    name: 'ttt',
    component: () => import('../views/Home.vue')
    // meta: {
    //   belongTo: 'asdf1',
    //   belongTo: 'asdf1'
    // }
  },
  {
    path: '/ss',
    name: 'sss',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      anymous: true
    },
    component: () => import('../views/login.vue')
  },
  {
    path: '*',
    name: 'notFound',
    meta: {
      anymous: true
    },
    component: () => import('../components/error-page/404-notfound.vue')
  }
]

const router = new VueRouter({
  mode: config.history ? 'history' : 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  request.cancelAll().then(() => {
    if (!isLogin() && !to.meta.anymous) {
      next('login')
    } else {
      next()
    }
  })
})

export default router
