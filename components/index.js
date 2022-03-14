/**
 * 插件形式：注册全局公共组件
 * vue插件写法：{install(Vue){}}
 * 插件生效：Vue.use(plugins)=>需要到入口main.js注册
 */
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import UploadImg from './UploadImg'
import ScreenFull from './ScreenFull'
import Lang from './Lang'

// 定义数据：里边放入全局公共组件
const components = [Lang, PageTools, UploadExcel, UploadImg, ScreenFull]

export default {
  /**
   *
   * @param {*} Vue
   */
  install (Vue) {
    // 注册全局组件
    // Vue.component('PageTools', PageTools)
    // Vue.component('UploadExcel', UploadExcel)
    components.forEach(cp => {
      // cp.name 作为批量注册组件的标签名
      Vue.component(cp.name, cp)
    })
  }
}

