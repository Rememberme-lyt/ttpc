/**
 * 组织架构路由规则
 */
// 公共布局
import Layout from '@/layout'

export default {
  path: '/departments',
  component: Layout,
  children: [
    {
      path: '', // 空或和父路由路径一样会被默认加载
      name: 'departments', // 权限的标识
      component: () => import('@/views/departments/index'),
      // 配置左侧菜单信息
      meta: {
        title: '组织架构', // 菜单名字
        icon: 'tree' // 菜单图标
      }
    }
  ]
}
