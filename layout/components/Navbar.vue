<template>
  <div class="navbar">
    <!-- 控制菜单折叠展开 -->
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <!-- 面包屑 -->
    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <!-- 公司信息 -->
    <div class="app-breadcrumb">
      <!-- 江苏传智播客教育科技股份有限公司
      $t('翻译文件的属性路径')
       -->
      {{ $t("navbar.title") }}
      <span class="breadBtn">体验版</span>
    </div>

    <!-- 右侧登录人信息 -->
    <div class="right-menu">
      <!-- 国际化 -->
      <Lang class="ricon" />
      <!-- 全屏组件 -->
      <ScreenFull class="ricon" />
      <el-dropdown class="avatar-container" trigger="hover">
        <!-- 登录人信息 -->
        <div class="avatar-wrapper">
          <!-- <img src="@/assets/common/bigUserHeader.png" class="user-avatar" /> -->
          <img v-imgerror="defPhoto" :src="avatar" class="user-avatar" />

          <span class="name">{{ name }}</span>
          <i class="el-icon-caret-bottom" style="color: #fff" />
        </div>
        <!-- 下拉菜单 -->
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://gitee.com">
            <el-dropdown-item> 项目地址 </el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// 导入加载失败显示的默认图片
import defPhoto from '@/assets/common/bigUserHeader.png'

export default {
  components: {
    // Breadcrumb,
    Hamburger
  },
  data () {
    return {
      defPhoto
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout () {
      /**
       * 1. 用户确认
       * 2. 点击确定执行退出
       */
      try {
        await this.$confirm('确定退出人资中台吗，亲?', '提示')
        // 点击确定走到这里
        console.log('点击确定')
        this.$store.dispatch('user/logoutAction')
        this.$router.replace('/login')
      } catch (error) {
        console.log('点击取消')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  // background: #fff;
  background-image: -webkit-linear-gradient(left, #5b8cff, #3d6df8);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  // 公司样式
  .app-breadcrumb {
    display: inline-block;
    font-size: 18px;
    line-height: 50px;
    margin-left: 10px;
    color: #ffffff;
    cursor: text;
    .breadBtn {
      background: #84a9fe;
      font-size: 14px;
      padding: 0 10px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      border-radius: 10px;
      margin-left: 15px;
    }
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    .ricon {
      display: inline-block;
      vertical-align: middle;
      margin-right: 15px;
    }
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      // 右侧头像等显示控制
      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 15px;
          vertical-align: middle;
        }
        .name {
          color: #fff;
          vertical-align: middle;
          margin-left: 5px;
        }
        .user-dropdown {
          color: #fff;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
