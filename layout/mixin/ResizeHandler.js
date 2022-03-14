import store from '@/store'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

// 混入对象=》可以把混入对象中定义的所有组件的api加入到另外一个组件中
// 好处：1. 复用 2. 易于管理
export default {
  watch: {
    $route (route) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        store.dispatch('app/closeSideBar', { withoutAnimation: false })
      }
    }
  },
  beforeMount () {
    // 监听窗口宽度变化
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy () {
    // 解绑事件
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  created () {
    // console.log('layout创建之后')
  },
  mounted () {
    // console.log('layout渲染之后')
    const isMobile = this.$_isMobile()
    if (isMobile) {
      store.dispatch('app/toggleDevice', 'mobile')
      store.dispatch('app/closeSideBar', { withoutAnimation: true })
    }
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_isMobile () {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    $_resizeHandler () {
      if (!document.hidden) {
        const isMobile = this.$_isMobile()
        store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          store.dispatch('app/closeSideBar', { withoutAnimation: true })
        }
      }
    }
  }
}
