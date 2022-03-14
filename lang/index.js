import Vue from 'vue' // 引入Vue
import VueI18n from 'vue-i18n' // 引入国际化的插件包
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包

// 引入自定义中文包
import customZH from './zh'
// 引入自定义英文包
import customEN from './en'
import ck from 'js-cookie'

Vue.use(VueI18n) // 全局注册国际化包

// 创建国际化插件的实例
const i18n = new VueI18n({
  // 1. 指定使用什么语言包
  locale: ck.get('lang-status') || 'zh',
  // 2. 放语言包配置文件
  messages: {
    // 英文环境下的语言数据
    en: {
      ...elementEN,
      ...customEN
    },
    // 中文环境下的语言数据
    zh: {
      ...elementZH,
      ...customZH
    }
  }

})
// 导出多语实例
export default i18n
