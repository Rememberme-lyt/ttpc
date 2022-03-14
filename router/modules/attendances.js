/**
 * 考勤路由规则
 */
// 公共布局
import Layout from '@/layout'

export default {
  path: '/attendances',
  component: Layout,
  children: [
    {
      path: '', // 空或和父路由路径一样会被默认加载
      name: 'attendances', // 权限的标识（和后台返回数据要一致）
      component: () => import('@/views/attendances/index'),
      // 配置左侧菜单信息
      meta: {
        title: '考勤', // 菜单名字
        icon: 'skill' // 菜单图标
      }
    }
  ]
}
