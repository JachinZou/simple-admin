import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import Authentication from './auth'

Vue.use(Vuex)

const vuexPersistInstance = new VuexPersistence({
  storage: window.sessionStorage
})

export default new Vuex.Store({
  modules: {
    Authentication
  },
  plugins: [vuexPersistInstance.plugin]
})
