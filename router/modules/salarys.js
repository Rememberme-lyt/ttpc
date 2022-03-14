/**
 * 工资路由规则
 */
// 公共布局
import Layout from '@/layout'

export default {
  path: '/salarys',
  component: Layout,
  children: [
    {
      path: '', // 空或和父路由路径一样会被默认加载
      name: 'salarys', // 权限的标识
      component: () => import('@/views/salarys/index'),
      // 配置左侧菜单信息
      meta: {
        title: '工资', // 菜单名字
        icon: 'money' // 菜单图标
      }
    }
  ]
}
