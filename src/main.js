import Vue from 'vue'

import 'normalize.css/normalize.css' 

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' 

import '@/styles/index.scss' 

import App from './App'
import store from './store'
import router from './router'

import '@/icons' 
import '@/permission' 

//引入相关API请求接口
import API from './api'
Vue.prototype.$API = API

//引入CategorySelect全局组件
import CategorySelect from "@/components/CategorySelect";
Vue.component(CategorySelect.name,CategorySelect)

//引入HintButton全局组件
import HintButton from '@/components/HintButton'
Vue.component(HintButton.name,HintButton)

if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
