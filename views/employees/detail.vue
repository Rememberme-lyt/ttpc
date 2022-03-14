<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <!-- 页签组件 -->
        <el-tabs v-model="seled">
          <el-tab-pane name="account" label="登录账户设置">
            <LoginSetting :user-info="userInfo" />
          </el-tab-pane>
          <el-tab-pane name="detail" label="个人详情">
            <UserInfo :user-info="userInfo" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
// 导入员工详情子组件（正常放一起）
import LoginSetting from './components/login-setting.vue'
import UserInfo from './components/user-info.vue'
// 导入获取员工详情信息的接口
import { getUserDetailById } from '@/api/user'
export default {
  components: {
    LoginSetting,
    UserInfo
  },
  data () {
    return {
      // 当前选中的页签
      seled: 'detail',
      // 员工详情数据
      userInfo: {}
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo () {
      const userInfo = await getUserDetailById(this.$route.params.id)
      console.log('用户详情数据：', userInfo)
      this.userInfo = userInfo
    }
  }
}
</script>
