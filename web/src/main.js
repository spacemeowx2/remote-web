import Vue from 'vue'
import VueMaterial from 'vue-material'
import App from './App'
import 'vue-material/dist/vue-material.css'

Vue.config.productionTip = false

Vue.use(VueMaterial)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
