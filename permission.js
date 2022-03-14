import router, { asyncRoutes } from './router' // 路由实例
import store from './store' // vue实例
// 页面加载loading
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

// 白名单（不需要token也能访问的页面）
const whiteList = ['/login', '/404']
/**
 * to 去哪
 * from 从哪来
 * next（函数）是否放行（访问页面）
 */
router.beforeEach(async (to, from, next) => {
  // start progress bar开启进度条
  NProgress.start()
  if (store.getters.token) {
    // 1. 有token
    if (to.path === '/login') {
      // 如果是登录页跳到首页
      next('/')
    } else {
      next()
      // 在这里获取登录人信息
      if (!store.getters.name) {
        const roles = await store.dispatch('user/getUserInfoAction')
        console.log('权限数据：', roles)
        /**
         * 权限控制=》页面访问权限
         * 思路步骤：
         * 1. 获取当前登录人可以访问页面的身份标识
         * 2. 根据这个身份标识(menus)和asyncRoutes（动态路由）对比=》留下有身份标识的页面路由规则
         * 3. 把上一步留下有身份标识的页面路由规则=》动态追加到路由规则routes数组中
         */
        const canLook = asyncRoutes.filter(route => {
          // 根据这个身份标识(menus)和route子路由默认首页name对比=》存在就留下
          // 注意：route.children[0].name 和 权限点的code 要一致
          return roles.menus.includes(route.children[0].name)
        })
        console.log('获取当前登录人可以看的页面：', canLook)
        // 存储菜单数据
        store.commit('routes/setMenuList', canLook)
        // 把动态路由添加到应用的路由系统里=> 动态追加到静态路由后边
        router.addRoutes([...canLook, { path: '*', redirect: '/404', hidden: true }])
      }
    }
  } else {
    // 2. 没有token
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }

  // finish progress bar关闭进度条
  NProgress.done()
})

// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
