<template>
  <el-dialog
    :title="form.id ? '编辑部门' : '新增部门'"
    :visible="show"
    width="60%"
    @close="close"
  >
    <!-- 新增部门表单=》默认插槽 -->
    <el-form ref="addForm" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="form.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="form.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- 必须要v-model -->
        <el-select
          v-model="form.manager"
          style="width: 80%"
          placeholder="请选择"
        >
          <!-- 默认插槽：选项列表 -->
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="form.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- 底部=》具名插槽 -->
    <span slot="footer">
      <el-button @click="$emit('close-dialog', false)">取消</el-button>
      <el-button type="primary" @click="addDept">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getEmployeeSimple } from '@/api/employees'
import { addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
export default {
  props: {
    // 父组件传进来，控制dialog是否显示
    show: {
      type: Boolean,
      default: false
    },
    // 当前操作部门（父）
    currDept: {
      type: Object,
      default: () => ({})
    },
    // 所有部门数据
    allDepts: {
      type: Array,
      default: () => []
    }
  },
  data () {
    /**
     * value 输入的部门编码
     * callback 是否验证通过=》通过 callback() | 不通过 callback(new Error('错误信息'))
     */
    const validateCode = (rules, value, callback) => {
      /**
       * 需求：新增部门输入的部门编码全局唯一
       * 1. 获取所有部门数据
       * 2. 根据当前输入对比
       */
      let flag
      if (this.form.id) {
        // 编辑=》当前编辑部门自身已经存在的code编码不能算重复=》排除自身
        flag = this.allDepts.some((item) => item.code === value && value !== this.currDept.code)
      } else {
        // 新增
        flag = this.allDepts.some((item) => item.code === value)
      }

      if (flag) {
        // 有重复
        callback(new Error('部门编码重复'))
      } else {
        // 没有重复
        callback()
      }
    }

    return {
      // 表单数据
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 表单校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: ['blur', 'change'] },
          { validator: validateCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: ['blur', 'change'] }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: ['blur', 'change'] }
        ]
      },
      // 部门负责人列表
      peoples: []
    }
  },
  created () {
    this.getPeoples()
  },
  methods: {
    // 编辑回显数据
    /**
     * id 部门ID
     */
    async getDepartDetail (id) {
      const detail = await getDepartDetail(id)
      console.log(detail)
      this.form = detail
    },
    // 获取下拉部门负责人数据
    async getPeoples () {
      const peoples = await getEmployeeSimple()
      console.log('负责人列表：', peoples)
      this.peoples = peoples
    },
    // 弹层关闭执行
    close () {
      console.log('弹层关闭执行')
      this.$emit('close-dialog', false)
      // 清理表单输入和校验
      this.$refs.addForm.resetFields()
      // 手动重置表单数据(为编辑部门清除表单数据做准备)
      // 清除编辑时回显的数据
      this.form = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    },
    // 新增/编辑部门
    async addDept () {
      // 整体校验
      try {
        await this.$refs.addForm.validate()
        // console.log('校验通过')
        /**
         * 1. 调用接口新增
         * 2. 组织架构列表刷新
         * 3. 关闭弹层
         */
        if (this.form.id) {
          // 编辑
          await updateDepartments(this.form)
        } else {
          // 新增
          // 需要pid=》1. pid的值是父部门id（新增子部门） 2. pid是空（新增顶级部门）
          await addDepartments({ ...this.form, pid: this.currDept.id || '' })
        }
        // 通知父组件更新列表
        this.$emit('update-list')
        this.$message.success('操作成功')
        this.$emit('close-dialog', false)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
