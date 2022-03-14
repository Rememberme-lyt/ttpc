<template>
  <div class="app-container">
    <!-- 个人信息 -->
    <el-form ref="fm" label-width="100px" :model="userInfo" :rules="rules">
      <!--手机 聘用形式  -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="部门" prop="departmentName">
            <el-input v-model="userInfo.departmentName" />
          </el-form-item>
        </el-col>
      </el-row>
      <!--手机 聘用形式  -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="userInfo.mobile" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 工号 入职时间 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="入职时间" prop="timeOfEntry">
            <el-date-picker
              v-model="userInfo.timeOfEntry"
              type="date"
              class="inputW"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 员工照片 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="员工头像">
            <!-- 放置上传图片=> 放置图片上传云服务器组件 -->
            <UploadImg :staff-photo.sync="userInfo.staffPhoto" />
            <!-- <el-image :src="require('@/assets/common/head.jpg')"></el-image> -->
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 保存个人信息 -->
      <el-row class="inline-info" type="flex" justify="center">
        <el-col :span="12">
          <el-button type="primary" @click="hSaveUserDetailById">
            保存更新
          </el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { saveUserDetailById } from '@/api/employees'
import { mapActions } from 'vuex'

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
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    ...mapActions('user', ['getUserInfoAction']),
    hSaveUserDetailById () {
      this.$refs.fm.validate(async flag => {
        if (!flag) return
        await saveUserDetailById(this.userInfo)
        // 更新右上角显示的登录人信息=》重新调用 vuex的action方法
        this.getUserInfoAction()
        this.$message.success('更新成功')
      })
    }
  }
}
</script>
