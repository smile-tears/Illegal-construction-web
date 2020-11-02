// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission' // permission control
import './utils/filter' // global filter
import './components/global.less'
import { Dialog } from '@/components'

import { Button, Tree, Divider, Table, Pagination, Select, TreeSelect, Carousel } from 'ant-design-vue'
// bus状态管理
import EventBus from 'vue-happy-bus'
Vue.component(Button.name, Button)
Vue.component(Tree.name, Tree)
Vue.component(Divider.name, Divider)
Vue.component(Table.name, Table)
Vue.component(Pagination.name, Pagination)
Vue.component(Select.name, Select)
Vue.component(TreeSelect.name, TreeSelect)
Vue.component(Carousel.name, Carousel)

Vue.config.productionTip = false
Vue.prototype.$EventBus = EventBus
// mount axios Vue.$http and this.$http
Vue.use(VueAxios)
Vue.use(Dialog)

new Vue({
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
