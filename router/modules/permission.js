/**
 * 权限管理路由规则
 */
// 公共布局
import Layout from '@/layout'

export default {
  path: '/permission',
  component: Layout,
  children: [
    {
      path: '', // 空或和父路由路径一样会被默认加载
      name: 'permission', // 权限的标识
      component: () => import('@/views/permission/index'),
      // 配置左侧菜单信息
      meta: {
        title: '权限管理', // 菜单名字
        icon: 'lock' // 菜单图标
      }
    }
  ]
}
