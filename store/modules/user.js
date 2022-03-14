/**
 * 存储登录人相关信息
 */
// 导入持久化token方法
import * as auth from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
// console.log('所有导出方法：', auth)
export default {
  namespaced: true,
  // 1. 定义变量（响应式的）
  state: {
    // 登录成功的token=》鉴权使用
    token: auth.getToken() || null,
    // 登录人信息（昵称、头像、权限等）
    userInfo: {}
  },
  // 2. 修改变量（定义修改变量的方法）（同步）
  mutations: {
    /**
     *
     * @param {*} state 获取变量对象
     * @param {*} token 外部调用传入的参数
     */
    setToken (state, token) {
      // 1. 内存存
      state.token = token
      // 2. 本地存（cookie）
      auth.setToken(token)
    },
    delToken (state) {
      state.token = null
      auth.removeToken()
    },
    // 存储登录人信息
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    },
    // 删除登录人信息
    delUserInfo (state) {
      state.userInfo = {}
    }
  },
  // 2. 一般定义后台请求方法（异步）
  actions: {
    // 退出登录
    logoutAction ({ commit }) {
      /**
       * 1. 后台退出=》调用接口
       * 2. 前端退出=》清除本地数据
       * 3. 重置路由（动态追加路由的缓存）
       * 4. 清除routes模块中菜单数据，只留下静态路由
       */
      commit('delToken')
      commit('delUserInfo')
      resetRouter()
      // commit 只能调用当前模块的mutations方法
      // commit != this.$store.commit()
      // commit('routes/setMenuList', [], { root: true }) === this.$store.commit('routes/setMenuList', [])
      commit('routes/setMenuList', [], { root: true })
    },
    // 获取登录人信息
    async getUserInfoAction ({ commit }) {
      /**
       * 1. 发请求获取登录人信息
       * 2. 通过commit调用mutations方法存储
       */
      const userInfo = await getUserInfo()
      // 依赖上一步用户ID，获取用户头像u
      // debugger
      const photoInfo = await getUserDetailById(userInfo.userId)
      // console.log('权限数据：', userInfo, photoInfo)
      commit('setUserInfo', { ...userInfo, ...photoInfo })
      return userInfo.roles
    },
    // 登录请求方法
    /**
     *
     * @param {*} context:{commit:调用mutations方法}
     * @param {*} formData:{mobile,password} 外部调用传入参数
     */
    async getTokenAction ({ commit }, formData) {
      const token = await login(formData)
      console.log('token:', token)
      commit('setToken', token)
    }
  }
}
