import request from '@/utils/request'
/**
 * @description: 获取角色列表
 * @param {*} params:{page:页码, pagesize:每页几条数据}
 * @return {*}
 */
export function getRoleList (params) {
  return request({
    url: '/sys/role',
    params
  })
}

/**
 *
 * @param {*} data 给角色分配权限 {id:角色id, permIds:[] 所有选中的节点的id组成的数组}
 * @returns
 */
export function assignPerm (data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}

/**
 * @description: 删除角色
 * @param {*} id 角色id
 * @return {*}
 */
export function deleteRole (id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

/**
 * @description: 新增角色
 * @param {*} data {name,description}
 * @return {*}
 */
export function addRole (data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}

/**
 * @description: 获取角色详情
 * @param {*} id 角色id
 * @return {*}
 */
export function getRoleDetail (id) {
  return request({
    url: `/sys/role/${id}`
  })
}

/**
 * @description: 编辑角色
 * @param {*} data
 * @return {*}
 */
export function updateRole (data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}
