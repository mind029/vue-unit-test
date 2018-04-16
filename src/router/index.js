import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import Api from '@/pages/Api'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/apiTest',
      name: 'apiTest',
      component: Api
    }
  ]
})
