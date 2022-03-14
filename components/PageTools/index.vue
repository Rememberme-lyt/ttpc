<template>
  <div class="page-tools">
    <!-- 左侧 -->
    <div class="left">
      <div class="tips">
        <i class="el-icon-info" />
        <!-- <span>本月: 社保在缴 公积金在缴</span> -->
        <slot name="left">
          <!-- 不传=》默认显示 -->
          我是左边
        </slot>
      </div>
    </div>
    <div class="right">
      <!-- 右侧 -->
      <!-- <el-button type="primary" size="small">历史归档</el-button>
      <el-button type="primary" size="small">导出</el-button> -->
      <slot name="right" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageTools' // 作为组件注册的标签名

}
</script>

<style lang="scss" scoped>
.page-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .tips {
    line-height: 34px;
    padding: 0px 15px;
    border-radius: 5px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
    i {
      margin-right: 10px;
      color: #409eff;
    }
  }
}
</style>
