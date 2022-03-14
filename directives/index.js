/**
 * 封装全局指令
 * 语法：
 * Vue.directive('指令名称', {
    // 会在当前指令作用的dom元素 插入之后执行
    // options 里面是指令的表达式
    inserted: function (dom,options) {
    }
})
 */

// imgerror指令：处理图片加载异常，如果加载失败显示一个默认图片=》提供个img元素使用
// 例如：<img :src="src" v-imgerror="defaultSrc" />
const imgerror = {
  inserted (dom, options) {
    // 图片加载失败会触发回调函数执行
    dom.onerror = () => {
      // options.value 获取指令绑定的变量值
      dom.src = options.value
    }
  }
}

const focus = {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
}

export { imgerror, focus }

