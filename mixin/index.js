/**
 * mixin 混入全局公共方法=》做权限控制
 */
import store from '@/store'
export default {
  data () {
    return {
      mixinData: '我是混入的数据'
    }
  },
  methods: {
    /**
     * 控制页面下的功能是否可用（可点击）:
     * 1. 获取登录人的权限points数组
     * 2. 根据数组中是否包含某个points值=》控制页面下按钮是否可见
     * @param {*} pointCode 能否点击code标识
     */
    canClick (pointCode) {
      const { userInfo } = store.state.user
      // 1. 如果传入的pointCode存在 就返回true 2. 如果传入的pointCode不存在 就返回false
      return userInfo.roles?.points.includes(pointCode)
    }
  }
}
