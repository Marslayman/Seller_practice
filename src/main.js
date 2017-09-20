// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import FormatTime from './timeFilter'
import 'common/stylus/index.styl'

Vue.filter('formattime', FormatTime.formatTime)
Vue.config.productionTip = false
/* 将axios对象赋值到vue的$http上，确保axios可以在全局被识别 */
Vue.prototype.$http = axios
axios.defaults.baseURL = '/api'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
