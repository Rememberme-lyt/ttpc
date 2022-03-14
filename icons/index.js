import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
// 注册全局图标组件
Vue.component('svg-icon', SvgIcon)
// webpack语法=》加载内置的svg图标
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
