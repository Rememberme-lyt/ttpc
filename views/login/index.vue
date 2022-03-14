<template>
  <div class="login-container">
    <!-- 表单 -->
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <!-- 登录title -->
      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" alt="" />
        </h3>
      </div>
      <!-- 手机号 -->
      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="mobile"
          v-model="loginForm.mobile"
          placeholder="请输入手机号"
          name="mobile"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <!-- 小眼睛=》控制密码是否可见 -->
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <!-- 登录按钮 -->
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
      >
        Login
      </el-button>
      <!-- 提示语=》练习使用的手机号和密码 -->
      <div class="tips">
        <span style="margin-right: 20px">账号: 13800000002-9</span>
        <span> 密码: 123456</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validMobile } from '@/utils/validate'
import { mapActions } from 'vuex'
export default {
  name: 'Login',
  data () {
    // 使用函数校验手机号
    /**
     * value 用户输入的手机号
     * callback(函数) 校验通过=》callback() | 校验失败=》 callback(new Error('错误提示'))
     */
    const validateMobile = (rule, value, callback) => {
      if (!validMobile(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        // 通过（必须写）
        callback()
      }
    }
    return {
      // 表单数据=》跟后台登录接口保持一致
      loginForm: {
        mobile: '13800000002',
        password: '123456'
      },
      // 表单校验规则
      loginRules: {
        mobile: [{ required: true, trigger: 'blur', validator: validateMobile }],
        password: [{ min: 6, max: 10, required: true, message: '密码长度为6~10位', trigger: 'blur' }]
      },
      loading: false,
      passwordType: 'password',
      // 存储回跳地址
      redirect: undefined
    }
  },
  watch: {
    // 监控路由参数的变化
    $route: {
      handler: function (route) {
        // 存储上次访问页面地址
        console.log('路由参数监控：', route)
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions('user', ['getTokenAction']),
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin () {
      // 表单整体校验
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          // 开启loading加载
          this.loading = true
          console.log('进行登录')
          try {
            await this.getTokenAction(this.loginForm)
            // 存储完token，跳转页面
            this.$router.replace(this.redirect || '/')
          } catch (error) {
            console.log(error)
          }

          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
//  1. 没有加scoped可以在不使用/deep/的作用下覆盖子组件样式
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #68b0fe; // 将输入框颜色改成蓝色
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
// style中使用@前边加上~才能被识别
.login-container {
  background-image: url("~@/assets/common/login.jpg"); // 设置背景图片
  background-position: center; // 将图片位置设置为充满整个屏幕
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.7); // 输入登录表单的背景色
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
// 2. 这里覆盖样式需要使用深度作用选择符
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
