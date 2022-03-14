<template>
  <div class="permission-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <div slot="header">
          <el-row type="flex" justify="space-between" align="middle">
            <span>权限管理</span>
            <!-- 1. 添加的是页面访问权限（type=1） -->
            <el-button type="primary" @click="addPerm(1, '0')">
              添加权限
            </el-button>
          </el-row>
        </div>
        <!-- card body=》权限点树形table列表 -->
        <el-table border :data="list" row-key="id">
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="code" label="标识" />
          <el-table-column prop="description" label="描述" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <!-- 权限类型：type=1 页面访问权限 type=2页面下操作功能权限（没有子，不能添加） -->
              <!-- 2. 添加的是页面下功能权限（type=2） -->
              <el-button
                v-if="row.type === 1"
                type="text"
                @click="addPerm(2, row.id)"
              >
                添加
              </el-button>
              <el-button type="text" @click="editPerm(row.id)">编辑</el-button>
              <el-button type="text" @click="delPerm(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 新增权限点=》1. 页面访问（能不能看） 2. 页面下功能（能不能点） -->
    <el-dialog
      :visible.sync="showDialog"
      :title="formData.id ? '编辑权限' : '新增权限'"
      @close="resetForm"
    >
      <!-- 表单内容 -->
      <el-form ref="form" label-width="100px" :model="formData" :rules="rules">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="权限启用">
          <el-switch
            v-model="formData.enVisible"
            active-text="启用"
            active-value="1"
            inactive-text="不启用"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: right">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="submitPerm">{{
            formData.id ? "编辑" : "新增"
          }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, addPermission, delPermission, getPermissionDetail, updatePermission } from '@/api/permisson'
// 导入树形数据转换方法
import { transformTreeData } from '@/utils'
export default {
  data () {
    return {
      // 权限点列表
      list: [],
      showDialog: false,
      // 新增/编辑 权限
      formData: {
        enVisible: '1', //  权限是否启用 0-不启用/1-启用
        name: '', // 权限点名称
        code: '', // 权限标识（身份标识=》权限控制就用它判断）
        description: '', // 权限描述
        type: '', // 权限类型 1-页面访问 2-页面下功能
        pid: '' // 添加到哪个节点下 =》	权限点父节点ID（'0'代表是页面权限 | '604f7df5f900be1850edb152'代表页面下功能权限）
      },
      rules: {
        name: [{ required: true, message: '权限点名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限点标识不能为空', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 每次弹层关闭重置表单数据
    resetForm () {
      console.log('弹层关闭了')
      /**
       * 1. 手动重置（数据）
       * 2. 调用表单方法重置（数据+校验）=》只限于加了校验规则的表单数据
       */
      this.formData = {
        enVisible: '1', //  权限是否启用 0-不启用/1-启用
        name: '', // 权限点名称
        code: '', // 权限标识（身份标识=》权限控制就用它判断）
        description: '', // 权限描述
        type: '', // 权限类型 1-页面访问 2-页面下功能
        pid: '' // 添加到哪个节点下 =》	权限点父节点ID（'0'代表是页面权限 | '604f7df5f900be1850edb152'代表页面下功能权限）
      }
      this.$refs.form.resetFields()
    },
    // 打开新增权限点弹层
    /**
     * type 权限类型 1-页面访问 2-页面下功能
     * pid 添加到哪个节点下 =》	权限点父节点ID（'0'代表是页面权限 | '604f7df5f900be1850edb152'代表页面下功能权限）
     */
    addPerm (type, pid) {
      /**
       * 为新增权限做准备
       * 1. 存储当前type和pid到formData
       * 2. 打开弹层
       */
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    // 打开编辑权限点弹层
    async editPerm (id) {
      /**
       * 思路：
       * 1. 获取待编辑权限点数据=》回填数据
       * 2. 打开弹层
       * 3. 用户基于回填数据=》修改=》点击确定
       */
      const perm = await getPermissionDetail(id)
      console.log('详情：', perm)
      this.formData = perm
      this.showDialog = true
    },
    // 删除权限点
    /**
     * currPerm:{} 当前权限点
     */
    async delPerm (currPerm) {
      console.log('当前权限点:', currPerm)
      try {
        /**
         * 1. 用户确认后删（避免误操作）
         * 2. 判断是否有子（没有子才能删）
         * 3. 调用接口删除
         * 4. 刷新列表
         */
        await this.$confirm(`确认删除${currPerm.name}吗？`)
        // 点击确定走到这
        if (currPerm.children && currPerm.children.length) {
          // 有子
          return this.$message.error('不能直接删除父权限')
        }
        // 没有子
        await delPermission(currPerm.id)
        this.getList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 点击确定新增权限|编辑权限
    async submitPerm () {
      /**
       * 思路步骤：
       * 1. 表单整体校验
       * 2. 调用接口新增/更新=>关闭弹层
       * 3. 刷新列表
       */
      try {
        await this.$refs.form.validate()
        // 校验通过
        if (this.formData.id) {
          // 编辑
          await updatePermission(this.formData)
        } else {
          // 新增
          await addPermission(this.formData)
        }

        this.showDialog = false
        this.getList()
        this.$message.success('操作成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 获取权限点列表
    async getList () {
      const list = await getPermissionList()
      console.table(list)
      this.list = transformTreeData(list)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
