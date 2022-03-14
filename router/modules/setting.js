/**
 * 公司设置路由规则
 */
// 公共布局
import Layout from '@/layout'

export default {
  path: '/setting',
  component: Layout,
  children: [
    {
      path: '', // 空或和父路由路径一样会被默认加载
      name: 'settings', // 权限的标识
      component: () => import('@/views/setting/index'),
      // 配置左侧菜单信息
      meta: {
        title: '公司设置', // 菜单名字
        icon: 'setting' // 菜单图标
      }
    }
  ]
}
