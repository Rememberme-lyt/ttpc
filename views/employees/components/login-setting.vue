<template>
  <div class="app-container">
    <!-- 放置表单 -->
    <el-form ref="form" label-width="60px" :model="userInfo" :rules="rules">
      <el-form-item label="姓名:" prop="username">
        <el-input v-model="userInfo.username" style="width: 300px" />
      </el-form-item>
      <el-form-item label="密码:">
        <el-input v-model="userInfo.password" disabled style="width: 300px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateUserName">更新</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveUserDetailById } from '@/api/employees'
export default {
  props: {
    // 接收用户详情数据
    userInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      rules: {
        username: [{ required: true, min: 2, max: 10, message: '用户名必填！', trigger: 'change' }]
      }
    }
  },
  methods: {
    // 更新用户名
    async updateUserName () {
      try {
        await this.$refs.form.validate()
        await saveUserDetailById(this.userInfo)
        this.$message.success('更新成功')
        // 校验通过
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
