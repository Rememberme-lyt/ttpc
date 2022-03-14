<template>
  <div :class="classObj" class="app-wrapper">
    <!-- 移动端菜单自适应判断 -->
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <!-- 菜单 -->
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <!-- 头部 -->
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
      </div>
      <!-- 、动态内容组件（渲染二级路由） -->
      <app-main />
    </div>
  </div>
</template>

<script>
// 导入 =》头部 、菜单、动态内容组件（渲染二级路由）
import { Navbar, Sidebar, AppMain } from './components'
// 移动端菜单自适应
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  // 合并混入对象（局部）
  mixins: [ResizeMixin],
  computed: {
    sidebar () {
      return this.$store.state.app.sidebar
    },
    device () {
      return this.$store.state.app.device
    },
    fixedHeader () {
      return this.$store.state.settings.fixedHeader
    },
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside () {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
