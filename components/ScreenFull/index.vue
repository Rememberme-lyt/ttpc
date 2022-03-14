<template>
  <!-- 放置一个图标 -->
  <div>
    <!-- svg-icon是渲染svg图标的全局组件
    icon-class传入svg文件名
    1. 不是全屏 fullscreen
    2. 是全屏 exit-fullscreen
     -->
    <svg-icon
      :icon-class="isFull ? 'exit-fullscreen' : 'fullscreen'"
      class="fullscreen"
      @click="toggleSf"
    />
  </div>
</template>

<script>
import sf from 'screenfull'
export default {
  name: 'ScreenFull',
  data () {
    return {
      // 是否是全屏状态
      isFull: false
    }
  },
  created () {
    // 监听全屏切换
    sf.on('change', () => {
      console.log('全屏切换了：', sf)
      // if (sf.isFullscreen) {
      //   // 全屏状态
      //   this.isFull = sf.isFullscreen
      // } else {
      //   // 不是全屏
      //   this.isFull = sf.isFullscreen
      // }
      this.isFull = sf.isFullscreen
    })
  },
  beforeDestroy () {
    // 解绑事件
    sf.off('change')
  },
  methods: {
    // 开启/关闭
    toggleSf () {
      if (!sf.isEnabled) {
        return this.$message.warning('你的浏览器不支持全屏功能！')
      }
      // 自动切换
      sf.toggle()
    }
  }
}
</script>

<style lang="scss" scoped>
.fullscreen {
  width: 20px;
  height: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
