<template>
  <!-- 分配权限的弹层 -->
  <el-dialog
    title="分配权限(一级为路由页面查看权限-二级为按钮操作权限)"
    :visible="showAssignDialog"
    @close="closeAssignDialog"
  >
    <!-- 权限点数据展示 -->
    <el-tree
      ref="tree"
      :data="list"
      :props="{ label: 'name' }"
      show-checkbox
      check-strictly
      default-expand-all
      node-key="id"
    />
    <template #footer>
      <el-button @click="closeAssignDialog">取消</el-button>
      <el-button type="primary" @click="savePerm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getPermissionList } from '@/api/permisson'
import { getRoleDetail, assignPerm } from '@/api/setting'
import { transformTreeData } from '@/utils'

export default {
  props: {
    showAssignDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 权限点列表
      list: [],
      // 角色ID
      roleId: ''
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 保存选中的权限点
    async savePerm () {
      // {id:角色id, permIds:[] 所有选中的节点的id组成的数组}
      // this.$refs.tree.getCheckedKeys() 获取树形中选中权限点
      await assignPerm({ id: this.roleId, permIds: this.$refs.tree.getCheckedKeys() })
      this.$message.success('分配成功')
      this.$emit('update:showAssignDialog', false)
    },
    // 获取角色之前选过的权限点
    /**
     * id 角色ID
     */
    async getPerms (id) {
      // 存储角色ID
      this.roleId = id
      const { permIds } = await getRoleDetail(id)
      console.log(permIds)
      // 回显=>调用树形组件的setCheckedKeys([])
      this.$refs.tree.setCheckedKeys(permIds)
    },
    // 获取权限点列表
    async getList () {
      const list = await getPermissionList()
      console.table(list)
      this.list = transformTreeData(list)
    },
    closeAssignDialog () {
      // 重置树选中为空：[]
      this.$refs.tree.setCheckedKeys([])
      this.$emit('update:showAssignDialog', false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
