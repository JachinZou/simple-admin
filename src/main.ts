import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { RequestMixin } from '@/common/request'

import '@/assets/style/index.scss'

Vue.config.productionTip = false
Vue.mixin(RequestMixin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
