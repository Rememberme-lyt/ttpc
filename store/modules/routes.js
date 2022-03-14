import { constantRoutes } from '@/router'
export default {
  namespaced: true,
  state: {
    // 菜单数据
    menuList: []
  },
  mutations: {
    // 存储菜单数据
    setMenuList (state, canLook) {
      // 菜单数据 = 静态路由 + 根据权限动态追加
      state.menuList = [...constantRoutes, ...canLook]
    }
  }
}
