// 快捷访问
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userInfo.staffPhoto, // 登录人头像
  mobile: state => state.user.userInfo.mobile,
  name: state => state.user.userInfo.username, // 登录人昵称
  dept: state => state.user.userInfo.departmentName, // 登录人部门
  work: state => state.user.userInfo.workNumber // 登录人部门

}
export default getters
