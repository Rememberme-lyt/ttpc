/**
 * 审批路由规则
 */
// 公共布局
import Layout from '@/layout'

export default {
  path: '/approvals',
  component: Layout,
  children: [
    {
      path: '', // 空或和父路由路径一样会被默认加载
      name: 'approvals', // 权限的标识
      component: () => import('@/views/approvals/index'),
      // 配置左侧菜单信息
      meta: {
        title: '审批', // 菜单名字
        icon: 'tree-table' // 菜单图标
      }
    }
  ]
}
