import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
// 导入动态路由跳转规则
import approvalsRouter from './modules/approvals'
import departmentsRouter from './modules/departments'
import employeesRouter from './modules/employees'
import permissionRouter from './modules/permission'
import attendancesRouter from './modules/attendances'
import salarysRouter from './modules/salarys'
import settingRouter from './modules/setting'
import socialRouter from './modules/social'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
/**
 * asyncRoutes 动态路由（需要有权限，才能访问的页面）
 * 后期：根据登录人的权限，动态生成的（过滤）
 */
export const asyncRoutes = [
  departmentsRouter,
  settingRouter,
  employeesRouter,
  permissionRouter,
  approvalsRouter,
  attendancesRouter,
  salarysRouter,
  socialRouter
]
/**
 * constantRoutes 静态路由（不需要权限，所有人都能看的页面）
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true // 不在菜单显示
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    // hidden: true,
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/import',
    component: Layout,
    hidden: true, // 不显示到左侧 不参与遍历
    children: [{
      path: '',
      component: () => import('@/views/import')
    }]
  }
  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
  // 动态路由追加到这里

]

// 工厂函数=》创建路由实例
const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }), // 每次切换页面让滚动条回到顶部
  // routes: [...constantRoutes, ...asyncRoutes] // 和并静态和动态路由跳转规则
  routes: constantRoutes // 默认只有静态路由
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// 重置路由
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
// 导出路由实例
export default router
