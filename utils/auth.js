/**
 * 使用cookie把token存到本地（持久化）=》（和localStorage功能一样）
 */
import Cookies from 'js-cookie'

// 存储的key名字
const TokenKey = 'hr-admin-token-137'

// 获取token
export function getToken () {
  return Cookies.get(TokenKey)
}
// 存储token
export function setToken (token) {
  return Cookies.set(TokenKey, token)
}
// 删除token
export function removeToken () {
  return Cookies.remove(TokenKey)
}
