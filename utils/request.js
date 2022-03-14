import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

// create an axios instance
const service = axios.create({
  // 后台请求基础地址（动态）
  /**
   * process.env:{}  环境变量（node）=> webpack提供
   * 1. dev 开发环境 =》后台地址dev，例如：localhost:3000/api(临时)
   * 2. prod 生产环境 =》后台地址prod，例如：http://ihrm-java.itheima.net/api（正式）
   * 3. stage 灰度环境
   * 好处：可以无缝切换不同环境的请求地址
   */
  baseURL: process.env.VUE_APP_BASE_API // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000 // request timeout
})

// request interceptor
// 发请求之前先执行
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // 统一添加token
    // store.state.user.token
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
// 请求成功之后先执行（页面还没拿到数据）
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const { success, message, data } = response.data
    // 因为参数传错后台也返回200，所以在这里处理异常
    if (success) {
      // 请求成功
      // 给页面返回数据
      return data
    } else {
      // 请求失败
      // 错误提示
      Message({
        message: message,
        type: 'error',
        duration: 3 * 1000
      })
      // 对外抛出错误
      return Promise.reject(new Error(message))
    }
  },
  error => {
    // 正常：200以外走到这里
    // console.log('err' + error) // for debug
    console.dir(error)
    /**
     * 需求：出现401，重新登录
     * 实现：
     * 1. 判断是401情况
     * 2. 删除之前登录存储的数据
     * 3. 错误提示
     * 4. 跳转登录页（携带出现401页面的地址=》目的是为了重新登录后，回到上次访问的页面）
     */
    if (error.response && error.response.status === 401) {
      // 处理某些页面多个请求多次401重复跳转问题，造成重新登录后不能正确跳转到上次访问页面问题
      if (router.currentRoute.path === '/login') return
      store.dispatch('user/logoutAction')
      // 错误提示
      Message({
        message: error.response.data.message,
        type: 'error',
        duration: 3 * 1000
      })
      router.replace(`/login?redirect=${router.currentRoute.path}`)
    }

    return Promise.reject(error)
  }
)

export default service
