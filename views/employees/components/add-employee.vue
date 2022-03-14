<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="close">
    <!-- 表单 -->
    <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="formData.username"
          style="width: 50%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          v-model="formData.mobile"
          style="width: 50%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width: 50%"
          placeholder="请选择入职时间"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          v-model="formData.formOfEmployment"
          style="width: 50%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          v-model="formData.workNumber"
          style="width: 50%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          style="width: 50%"
          placeholder="请选择部门"
          @focus="showDept = true"
        />
        <!--
          需求：选择部门，显示到上边输入框
         -->
        <el-row v-show="showDept" class="selBox">
          <!-- 关闭按钮 -->
          <i class="el-icon-circle-close" @click="showDept = false" />
          <el-tree
            ref="tree"
            :data="departData"
            :props="{ label: 'name' }"
            @node-click="selDept"
          ></el-tree>
        </el-row>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width: 50%"
          placeholder="请选择转正时间"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template #footer>
      <el-button @click="$emit('close-dialog')">取消</el-button>
      <el-button type="primary" @click="addEmpl">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import EnumTypes from '@/api/constant/employees'
import { addEmployee } from '@/api/employees'
// 部门选择
import { getDepartments } from '@/api/departments'
import { transformTreeData, parseTime } from '@/utils'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 控制部门选择显示隐藏
      showDept: false,
      // 部门数据
      departData: [],
      // 聘用形式列表
      hireType: EnumTypes.hireType,
      // 表单数据=》结合后台新增员工api文档
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        timeOfEntry: '', // 入职时间
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        correctionTime: '' // 转正时间
      },
      // 校验规则
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: ['blur', 'change'] }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: ['blur', 'change'] }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getDepartData()
  },
  methods: {
    // 选择部门
    selDept (currDept) {
      console.log('当前选中的部门：', currDept)
      this.formData.departmentName = currDept.name
      // 选完关闭
      this.showDept = false
    },
    // 获取部门数据
    async getDepartData () {
      const { depts } = await getDepartments()
      this.departData = transformTreeData(depts)
    },
    // 新增员工提交
    async addEmpl () {
      try {
        await this.$refs.addForm.validate()
        // 校验通过
        this.formData.correctionTime = parseTime(this.formData.correctionTime, '{y}-{m}-{d}')
        this.formData.timeOfEntry = parseTime(this.formData.timeOfEntry, '{y}-{m}-{d}')
        await addEmployee(this.formData)
        // 刷新列表
        // this.$parent 获取父组件实例 =>父组件的this
        console.log('组件：', this)
        this.$parent.getList()
        this.$message.success('新增员工成功')
        this.$emit('close-dialog')
      } catch (error) {
        console.log(error)
      }
    },
    // 关闭弹层执行
    close () {
      console.log('关闭弹层执行')
      this.$emit('close-dialog')
      // 重置表单的校验和数据
      this.$refs.addForm.resetFields()
    }
  }
}
</script>

<style lang="scss">
.selBox {
  width: 280px;
  border: 1px solid #eee;
  position: relative;
  .el-icon-circle-close {
    position: absolute;
    top: 6px;
    right: 6px;
    color: red;
    font-size: 20px;
    z-index: 10;
    cursor: pointer;
  }
}
</style>
