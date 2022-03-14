<template>
  <div class="setting-container">
    <div class="app-container">
      <el-card>
        <!-- 默认插槽=》内容 -->
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="padding: 10px 0">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="show = true"
              >
                新增角色
              </el-button>
            </el-row>
            <!-- 表格=》渲染列表数据 -->
            <el-table :data="list">
              <!-- el-table-column代表一列=》所有列加起来代表一行数据 -->
              <el-table-column label="序号" type="index" width="120" />
              <el-table-column label="角色名称" prop="name" width="240" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <!-- 默认插槽 -->
                <template #default="{ row }">
                  <!-- 获取当前行数据 -->
                  <!-- <p>{{ row }}</p> -->
                  <el-button
                    size="small"
                    type="success"
                    @click="openAssingPerm(row)"
                  >
                    分配权限
                  </el-button>
                  <el-button size="small" type="primary" @click="editRole(row)">
                    编辑
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="delRole(row.id)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                :current-page="query.page"
                :page-size="query.pagesize"
                :total="total"
                layout="prev,pager,next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <h1>黑马137</h1>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 新增角色 -->
    <el-dialog
      :title="roleForm.id ? '编辑角色' : '新增角色'"
      :visible.sync="show"
      width="40%"
      @close="close"
    >
      <!-- 表单 -->
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="show = false">取消</el-button>
        <el-button type="primary" @click="addRole">确定</el-button>
      </span>
    </el-dialog>
    <!-- 给角色分配权限点 -->
    <AssignPerm ref="perm" :show-assign-dialog.sync="showAssignDialog" />
  </div>
</template>

<script>
import { getRoleList, deleteRole, addRole, getRoleDetail, updateRole } from '@/api/setting'
import AssignPerm from './components/assign-perm.vue'
export default {
  components: {
    AssignPerm
  },
  data () {
    return {
      showAssignDialog: false,
      // 显示弹层
      show: false,
      // 表单数据（新增|编辑）
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
      },
      // 角色列表
      list: [],
      // 查询参数
      query: {
        page: 1, // 页码
        pagesize: 10 // 每页条数
      },
      total: 0 // 数据总条数
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 打开给角色分配权限弹层
    openAssingPerm (role) {
      console.log('当前角色：', role)
      this.showAssignDialog = true
      // 调用子组件方法回显数据
      this.$refs.perm.getPerms(role.id)
    },
    // 打开编辑角色=》回显数据
    async editRole (currRole) {
      console.log('当前编辑的角色数据：', currRole)
      // 查询接口回显当前编辑的角色数据
      const res = await getRoleDetail(currRole.id)
      this.roleForm = res
      this.show = true
    },
    // 新增角色 | 编辑角色
    async addRole () {
      try {
        await this.$refs.roleForm.validate()
        //  校验通过走到这
        if (this.roleForm.id) {
          // 编辑
          await updateRole(this.roleForm)
        } else {
          // 新增
          await addRole(this.roleForm)
        }

        this.query.page = 1
        this.getList()
        this.show = false
        this.$message.success('操作成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 弹层关闭
    close () {
      console.log('弹层关闭')
      // 重置表单校验和数据
      this.$refs.roleForm.resetFields()
      // 手动重置
      this.roleForm = {
        name: '',
        description: ''
      }
    },
    // 删除角色
    async delRole (id) {
      /**
       * 1. 用户确认后
       * 2. 调用接口删除
       * 3. 刷新列表
       */
      try {
        await this.$confirm('确认删除吗？')
        // 点击确定走到这
        await deleteRole(id)
        this.query.page = 1
        this.getList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log('点击取消')
      }
    },
    // 切换分页
    changePage (currPage) {
      console.log(currPage)
      this.query.page = currPage
      this.getList()
    },
    // 获取角色列表
    async getList () {
      const { total, rows } = await getRoleList(this.query)
      console.log(rows)
      this.list = rows
      this.total = total
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
