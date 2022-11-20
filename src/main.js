import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import VueParticles from 'vue-particles'  
import 'font-awesome/css/font-awesome.min.css'
Vue.use(VueParticles)

// 事件总线
var EventBus = new Vue()
Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus
    }
  }
})

Vue.config.productionTip = false  

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
