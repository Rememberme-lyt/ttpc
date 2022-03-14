<template>
  <el-calendar v-if="show" v-model="currentDate">
    <!-- 通过具名插槽dateCell自定义单天的结构样式
    date日期对象=》new Date
    data 年-月-日=》当天信息
     -->
    <template #dateCell="{ date, data }">
      <div class="date-content">
        <!-- 展示天 -->
        <span class="text"> {{ formatDay(data.day) }}</span>
        <!-- 如果是周六周日显示995 -->
        <span v-if="isWeek(date)" class="rest">休</span>
      </div>
    </template>
  </el-calendar>
</template>

<script>
export default {
  data () {
    return {
      show: true,
      currentDate: new Date()
    }
  },
  watch: {
    async '$i18n.locale' (newValue) {
      console.log('监控到多语言切换了：', newValue)
      // 监听多语言变化=》手动销毁日历，让他重新创建=》解决星期切换不翻译问题
      // 1. 先销毁
      this.show = false
      await this.$nextTick()
      // 注意：等到销毁之后
      // 2. 在创建（刷新）
      this.show = true
    }
  },
  methods: {
    // time 格式化 '2021-11-10'
    formatDay (time) {
      // console.log(time)
      return time.split('-')[2]
    },
    // 判断是否是周六或周日
    isWeek (date) {
      return date.getDay() === 6 || date.getDay() === 0
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-calendar-day {
  height: 50px;
}
// 日历内容自定义样式
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
// 休息时间
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
// 当前日期
::v-deep .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
</style>
