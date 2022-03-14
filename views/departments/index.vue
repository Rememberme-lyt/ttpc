<template>
  <div class="department-container">
    <div class="app-container">
      <!-- 插槽基础知识总结：
      1.默认插槽 =》1个 默认名字叫default  =》传入结构
      2.具名插槽 =》多个 自己起的名字 =》传入结构
      3.作用域插槽 =》基于前两种=》接收数据（子传父）
       -->
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <!-- 具名插槽header=》传入面板头部结构 -->
        <template #header>
          <!-- 用一个行列布局 -->
          <el-row>
            <el-col :span="20">
              <span>{{ company.name }}</span>
            </el-col>
            <el-col :span="4">
              <el-row type="flex" justify="end">
                <!-- 两个内容 -->
                <el-col>负责人</el-col>
                <!-- 下拉菜单 element -->
                <el-col>
                  <el-dropdown>
                    <span> 操作<i class="el-icon-arrow-down" /> </span>
                    <el-dropdown-menu slot="dropdown">
                      <!-- 添加顶级部门=》参数空传 -->
                      <el-dropdown-item @click.native="addDept()">
                        添加子部门
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>

        <!-- 默认插槽=》传入面板内容 -->
        <el-tree
          :data="departData"
          :props="defaultProps"
          default-expand-all
          @node-click="handleNodeClick"
        >
          <template #default="{ data }">
            <!-- 单个树的项结构 -->
            <el-row style="width: 100%">
              <!-- 显示部门名 -->
              <el-col :span="20">
                <span>{{ data.name }}</span>
              </el-col>
              <!-- 部门操作按钮 -->
              <el-col :span="4">
                <el-row type="flex" justify="end">
                  <!-- 两个内容 -->
                  <el-col>{{ data.manager || "--" }}</el-col>
                  <el-col>
                    <!-- 下拉菜单 element -->
                    <el-dropdown>
                      <span> 操作<i class="el-icon-arrow-down" /> </span>
                      <!-- 下拉菜单 -->
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="addDept(data, 1)">
                          添加子部门
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="addDept(data, 2)">
                          编辑部门
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="delDept(data)">
                          删除部门
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-tree>
      </el-card>
    </div>
    <!-- 新增部门 -->
    <AddDept
      ref="editDept"
      :show="show"
      :all-depts="allDepts"
      :curr-dept="currDept"
      @update-list="getDepartData"
      @close-dialog="show = $event"
    />
  </div>
</template>

<script>
import { getDepartments, delDepartments } from '@/api/departments'
import { transformTreeData } from '@/utils'
// 导入新增部门组件
import AddDept from './components/add-dept.vue'
export default {
  components: {
    AddDept
  },
  data () {
    return {
      show: false,
      // 所有部门数据
      allDepts: [],
      // 组织架构树形数据
      departData: [
        // {
        //   name: '总裁办'
        // },
        // {
        //   name: '财务部',
        //   children: [{
        //     name: '税务'
        //   }]
        // }
      ],
      // 公司信息
      company: { name: '', manager: 'CEO' },
      // 修改树形中属性名=》场景：后台返回数据属性名不叫lable，子不叫children
      defaultProps: {
        children: 'children',
        label: 'name' // 后台返回叫name
      },
      // 当前操作部门数据
      currDept: null
    }
  },
  created () {
    this.getDepartData()
  },
  methods: {
    // 新增部门
    /**
     * currDept 当前要添加子部门的父部门
     * type 1 代表新增  2 代表修改
     */
    addDept (currDept, type) {
      console.log(type === 1 ? '新增' : '编辑')
      // 存储当前操作的部门
      this.currDept = currDept
      if (type === 2) {
        // 编辑需要调用接口回显数据
        //  this.$refs.editDept === AddDept组件this
        this.$refs.editDept.getDepartDetail(currDept.id)
      }
      this.show = true
    },
    // 删除部门数据
    async delDept (currData) {
      console.log('当前要删除的部门数据：', currData)
      /**
       * 1. 用户确认
       * 2. 确定了=》判断如果是父部门，下边有子部门不能删除
       * 3. 如果是没有子集的部门可以删除=》调用接口删除
       * 4. 重新获取树形数据
       */
      try {
        await this.$confirm(`确认要删除${currData.name}吗？`, '提示')
        // 确定走到这里
        if (currData.children && currData.children.length > 0) {
          return this.$message.error('包含子的父部门不能删，先删除子！')
        }
        await delDepartments(currData.id)
        // 刷新列表
        this.getDepartData()
        this.$message.success('删除成功！')
      } catch (error) {
        // 点击取消
        console.log(error)
      }
    },
    // 获取部门数据
    async getDepartData () {
      const { companyName, depts } = await getDepartments()
      console.table(depts)
      this.company.name = companyName
      this.allDepts = depts
      // 注意：调用一次，避免引用问题
      this.departData = transformTreeData(depts)
    },
    handleNodeClick (data) {
      console.log(data)
    }
  }
}
</script>

<style lang="scss" scoped>
//深度作用选择符： less 中使用 /deep/   | scss 中使用 ::v-deep
::v-deep .el-tree-node__content {
  margin: 3px 0;
  font-size: 14px;
}
</style>
