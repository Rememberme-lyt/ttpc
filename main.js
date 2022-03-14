import Vue from 'vue'

// 重置浏览器默认css样式
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

// 导入element组件库
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
if (process.env.NODE_ENV === 'development') {
  require('element-ui/lib/theme-chalk/index.css')
}

// 导入项目的全局样式
import '@/styles/index.scss' // global css

// 导入根组件
import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon // 加载内置图标文件
// 添加路由拦截（保安）
import '@/permission' // permission control

// 1. 导入全局指令
import * as directs from '@/directives'
import ComponentPlugin from '@/components/index'

// 导入全局混入mixin对象
import mixinFn from '@/mixin'
import echartPlugin from '@/utils/echartPlugin'
import i18n from '@/lang'

// console.log('导入所有指令对象：', directs)
// 2. 注册全局指令（批量注册多个）
// Object.keys()=>遍历一个对象，把对象上所有的key属性名都放到数组中返回
Object.keys(directs).forEach(name => {
  // 批量注册多个指令
  Vue.directive(name, directs[name])
})
// set ElementUI lang to EN
// 注册组件库
// Vue.use(ElementUI)
Vue.use(ElementUI, {
  i18n: (k, v) => i18n.t(k, v)
})
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.use(ComponentPlugin)
Vue.use(echartPlugin)
// 全局混入（所有页面都会拥有混入对象中的属性）
Vue.mixin(mixinFn)

// 获取环境变量
console.log('获取环境变量:', process.env)
// 重写原生js日志放=》使用场景：process.env判断是production环境就重写
// console.log = console.table = () => { }

Vue.config.productionTip = false
// 初始化vue页面
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
