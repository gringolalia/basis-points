import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
// import Basis from 'getbasis/src/js/basis'
// import 'getbasis/src/css/basis

// Vue.use(Basis)'

Vue.config.productionTip = false

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
