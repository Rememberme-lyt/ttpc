<template>
  <el-dialog
    class="assign-role"
    title="分配角色"
    :visible="showRoleDialog"
    @close="close"
  >
    <!-- 这里准备多选框 -->
    <el-checkbox-group v-model="selRoles">
      <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id">
        {{ role.name }}
      </el-checkbox>
      <!-- <el-checkbox label="2"> cto </el-checkbox>
      <el-checkbox label="3"> fe </el-checkbox> -->
    </el-checkbox-group>

    <template #footer>
      <el-button type="primary" size="small" @click="saveRoles">确定</el-button>
      <el-button size="small" @click="$emit('update:showRoleDialog', false)">
        取消
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
// 获取角色列表
import { getRoleList } from '@/api/setting'
// 获取用户之前分配过的角色列表
import { getUserDetailById } from '@/api/user'
// 保存分配的角色
import { assignRoles } from '@/api/employees'
export default {
  props: {
    // 父组件传过来的变量=》控制弹层显示隐藏
    showRoleDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 选中角色（多选）
      selRoles: [],
      // 角色列表
      roleList: [],
      // 用户ID
      userId: ''
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 保存选中的角色
    async saveRoles () {
      /**
       * 1. 调用接口存储选中角色=》入库
       * 2. 关闭弹层
       */
      await assignRoles({ id: this.userId, roleIds: this.selRoles })
      this.$message.success('分配成功')
      this.$emit('update:showRoleDialog', false)
    },
    // 获取用户之前选择过的角色列表
    /**
     * id 用户ID
     */
    async getUserRoles (id) {
      const { roleIds } = await getUserDetailById(id)
      // 回显选中
      this.selRoles = roleIds || []
      //  存储用户ID
      this.userId = id
      console.log('当前用户选过：', roleIds)
    },
    // 获取角色列表
    async getRoleList () {
      const { rows } = await getRoleList({ page: 1, pagesize: 1000 })
      console.log('角色列表：', rows)
      this.roleList = rows
    },
    // 弹层关闭执行
    close () {
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>
