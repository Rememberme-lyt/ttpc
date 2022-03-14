/**
 * 社保路由规则
 */
// 公共布局
import Layout from '@/layout'

export default {
  path: '/social',
  component: Layout,
  children: [
    {
      path: '', // 空或和父路由路径一样会被默认加载
      name: 'social', // 权限的标识
      component: () => import('@/views/social/index'),
      // 配置左侧菜单信息
      meta: {
        title: '社保', // 菜单名字
        icon: 'table' // 菜单图标
      }
    }
  ]
}
