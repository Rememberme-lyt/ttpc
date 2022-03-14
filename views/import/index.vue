<template>
  <div class="app-container">
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <div slot="header">
        <span>批量导入员工</span>
      </div>
      <!-- card body -->
      <!-- 上传excel组件 -->
      <UploadExcel :before-upload="beforeUpload" :on-success="onSuccess" />
    </el-card>
  </div>
</template>

<script>
// 转换excel时间
import { formatExcelDate } from '@/utils'
// 批量新增员工接口
import { importEmployees } from '@/api/employees'

export default {
  methods: {
    /**
     * file 选择的excel文件
     * 上传之前校验：
     * 1. 校验大小
     * 2. 校验文件格式
     * 校验通过 return true | 校验失败 return false（必须）
     */
    beforeUpload (file) {
      console.log('选择的excel文件:', file)
      // 只有返回true才会触发onSuccess函数
      return true
    },
    /**
     * 读取excel中数据
     */
    async onSuccess ({ header, results }) {
      // console.log('读取excel的数据-表头', header)
      // console.log('读取excel的数据-数据', results)
      // console.log('转换中文key结果：', this.transformResults(results))
      // 调用接口批量新增员工
      await importEmployees(this.transformResults(results))
      // 返回员工管理页面
      this.$router.back()
    },
    /**
     * 需求：把results中中文属性转换成英文属性
     * results 转换的excel数据
     */
    transformResults (results) {
      /**
       * 思路：
       * 1. 准备中英转换的对照关系map
       * 2. 遍历results把读取的员工信息的中文属性根据map转换成英文属性
       */
      // 根据excel中字段去定义(中英对照表)
      const userMap = {
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 准备一个新数组=》存储转换完的结果
      const newResults = []
      results.forEach(user => {
        // 准备一个新对象=》存储转换成英文属性的用户信息
        const newUser = {}
        // 把中文属性的user转成英文属性的newUser
        for (const key in user) {
          // key 中文属性=》转成英文属性
          const enKey = userMap[key]
          if (enKey === 'timeOfEntry' || enKey === 'correctionTime') {
            // excel时间转换(读取excel时间多70年)
            newUser[enKey] = formatExcelDate(user[key], '-')
          } else {
            newUser[enKey] = user[key]
          }
        }
        newResults.push(newUser)
      })
      return newResults
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

