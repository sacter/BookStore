// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import axios from './http/axios'
import $ from 'jquery'
import 'iview/dist/styles/iview.css'
import {URL} from './config/index'

import '../static/Ueditor/ueditor.config.js'
import '../static/Ueditor/ueditor.all.min.js'
import '../static/Ueditor/lang/zh-cn/zh-cn.js'
import '../static/Ueditor/ueditor.parse.min.js'

Vue.config.productionTip = false
Vue.use(iView)
Vue.prototype.$axios = axios
Vue.prototype.URL = URL
Vue.prototype.$ = Vue.prototype.jQuery = window.$ = $

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
