<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <div slot="header">
          <PageTools>
            <!-- 插入到left插槽位置 -->
            <template #left>
              <span>总记录数：100条</span>
            </template>
            <!-- 插入到right插槽位置 -->
            <template #right>
              <el-button
                v-if="canClick('p-em-import')"
                type="warning"
                size="small"
                @click="$router.push('/import')"
              >
                导入excel
              </el-button>
              <el-button
                :loading="downloadLoading"
                type="danger"
                size="small"
                @click="exportData"
              >
                导出excel
              </el-button>
              <el-button
                v-if="canClick('p-em-add')"
                type="primary"
                size="small"
                @click="showDialog = true"
              >
                新增员工
              </el-button>
            </template>
          </PageTools>
        </div>
        <div>
          <!-- table列表
          prop 指定某一列数据作为排序列
          order 升序ascending（小-大）/降序descending（大-小）
          -->
          <el-table
            :data="list"
            :default-sort="{ prop: 'workNumber', order: 'ascending' }"
            border
          >
            <!-- 定义一行要显示哪些数据（按列） -->
            <el-table-column type="index" label="序号" />
            <el-table-column prop="username" label="姓名" />
            <el-table-column prop="staffPhoto" label="头像">
              <template #default="{ row }">
                <el-image
                  class="round"
                  :src="row.staffPhoto"
                  @click="showCode(row.staffPhoto)"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column sortable prop="workNumber" label="工号" />
            <el-table-column label="聘用形式">
              <!-- 1. 使用作用域插槽获取当前行数据 2. 格式化数据 -->
              <template #default="{ row }">
                {{ formatForm(row.formOfEmployment) }}
              </template>
            </el-table-column>
            <el-table-column prop="departmentName" label="部门" />
            <el-table-column sortable prop="correctionTime" label="入职时间" />
            <el-table-column label="账户状态">
              <el-switch v-model="qy" />
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="280">
              <template #default="{ row }">
                <el-button
                  type="text"
                  size="small"
                  @click="$router.push(`/employees/detail/${row.id}`)"
                >
                  查看
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="openRoleDialog(row)"
                >
                  分配角色
                </el-button>
                <el-button type="text" size="small" @click="delElp(row)">
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
            <el-pagination
              background
              :current-page="query.page"
              :page-size="query.size"
              :total="total"
              :page-sizes="[10, 5, 2]"
              layout="prev, pager, next,sizes"
              @current-change="changePage"
              @size-change="changeSize"
            />
          </el-row>
        </div>
      </el-card>
    </div>
    <!-- 新增员工弹层 -->
    <AddEmp :show-dialog="showDialog" @close-dialog="showDialog = $event" />
    <!-- 显示头像二维码的弹层 -->
    <el-dialog title="头像二维码" :visible.sync="showCodeDialog" width="30%">
      <el-row type="flex" justify="center">
        <!-- canvas元素（画布）=》专门用来绘图 -->
        <canvas ref="qr" />
      </el-row>
    </el-dialog>
    <!-- 分配角色 -->
    <AssingRole ref="roleDialog" :show-role-dialog.sync="showRoleDialog" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
// 导入枚举类型
import EnumTypes from '@/api/constant/employees'
// console.log('枚举对象：', EnumTypes)
// 导入新增员工组件
import AddEmp from './components/add-employee.vue'
// 导入给员工分配角色
import AssingRole from './components/assign-role.vue'
// 导入绘制二维码插件
import qrcode from 'qrcode'
export default {
  components: {
    AddEmp,
    AssingRole
  },
  data () {
    return {
      showRoleDialog: false,
      showCodeDialog: false,
      downloadLoading: false, // 导出loading
      showDialog: false,
      qy: true,
      // 根据封装的接口=》1. 拿到什么数据 2. 需要传什么参数
      // 员工列表
      list: [],
      query: {
        page: 1, // 页码
        size: 10 // 每页条数
      },
      total: 0 // 数据总数量
    }
  },
  created () {
    this.getList()
    console.log('全局混入：', this.mixinData, this.canClick)
  },
  methods: {
    // 打开分配角色弹层
    // row 当前点击员工数据
    openRoleDialog (row) {
      console.log('当前点击员工数据:', row)
      this.showRoleDialog = true
      // 获取用户之前选择过的角色列表
      this.$refs.roleDialog.getUserRoles(row.id)
    },
    // 点击头像显示对应头像地址的二维码
    /**
     * url 存到二维码中的头像地址
     */
    async showCode (url) {
      /**
       * 思路步骤：
       * 1. 判断url是否存在
       * 2. 打开弹层
       * 3. 借助qrcode实现二维码的绘制=》二维码中存储的是用户的头像地址
       */
      if (!url) return
      this.showCodeDialog = true // 数据驱动视图=》视图的更新是异步的
      // 借助qrcode实现二维码的绘制=》二维码中存储的是用户的头像地址
      // // dom为一个canvas的dom对象， info为转化二维码存储的信息
      // 怎么获取异步更新之后最新的dom
      // QrCode.toCanvas(dom, info)
      // 绘制二维码之前=》先打开弹层=》canvas还没有渲染=》解决：this.$nextTick(callback:fn)
      await this.$nextTick()
      // 等异步渲染完=》走到这里
      console.log('canvas:', this.$refs.qr)
      qrcode.toCanvas(this.$refs.qr, url)
      // qrcode.toCanvas(this.$refs.qr, 'https://www.baidu.com')
    },
    // 导出某页员工数据
    async exportData () {
      // 1. 开始导出
      this.downloadLoading = true
      // 2. 使用Excel导出插件导出数据（核心）
      // 准备需要导出的员工信息map映射关系（根后台返回用户数据字段顺序保持一致）
      // 指定导出哪些员工的信息
      const userMap = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '工号': 'workNumber',
        '转正日期': 'correctionTime',
        '部门': 'departmentName'
      }
      // 根据映射关系获取导出的表头
      // 中文key属性的数组
      const header = Object.keys(userMap)
      const enHeader = Object.values(userMap)
      // 接下来把list员工列表数据转换成二维数据=》[[],[],...]
      const data = this.transformList(this.list, enHeader)
      console.log(header, enHeader, data)
      // import('@/utils/Export2Excel') 按需加载一个js模块（懒加载）
      const excel = await import('@/utils/Export2Excel')
      console.log('excel导出方法：', excel)
      excel.export_json_to_excel({
        // 表头 必填
        // header: ['姓名', '工资', '职位'], // 导出数据的表头
        header,
        // 表头对应的具体数据 必填
        // data: [
        //   ['刘备', 20000, 'CEO'],
        //   ['关羽', 10000, '财务'],
        //   ['张飞', 5000, '保安']
        // ],
        data,
        filename: `elm-list-${Date.now()}`, // 导出下载的文件名称
        autoWidth: true, // 导出excel列宽度是否自适应
        bookType: 'xlsx' // 导出生成的文件类型
      })
      // 3. 导出成功关闭loading
      this.downloadLoading = false
    },
    // 把list员工列表转成二维数组=》[[员工信息],[员工信息],...]
    transformList (list, enHeader) {
      /**
       * 思路：
       * 1. 准备一个空数据存储转换结果
       * 2. 遍历list根据enHeader转换
       * 3. 返回转换结果
       */
      const secondArray = []
      list.forEach(user => {
        // 核心：user对象换成数组 => []
        // 准备一个数组，放置user对象中的值(根据enHeader有的才放入)
        const itemArray = []
        for (const key in user) {
          if (enHeader.includes(key)) {
            // 处理聘用关系=>转换数字
            if (key === 'formOfEmployment') {
              itemArray.push(this.formatForm(user[key]))
            } else {
              itemArray.push(user[key])
            }
          }
        }
        secondArray.push(itemArray)
      })
      return secondArray
    },
    // 删除某个员工
    async delElp (row) {
      console.log(row)
      /**
       * 1. 用户确认后
       * 2. 调用接口删除
       * 3. 刷新列表
       */
      try {
        await this.$confirm(`确认删除员工${row.username}吗？`)
        // 确定
        await delEmployee(row.id)
        // this.query.page = 1
        // element组件问题：删除完最后一页数据=》页码显示正确，但是数据还是请求的已经删完最后一页数据
        /**
         * 1. 计算最新页数=》判断页码是否正确
           2. 不正确重新赋值
         */
        const newPage = Math.ceil((this.total - 1) / this.query.size)
        // if (newPage > 0) {
        //   this.query.page = newPage
        // }
        if (this.query.page > newPage) {
          // 不正确修复，重新赋值
          this.query.page = newPage
        }
        this.getList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    // type 格式化聘用形式：1 代表正式 2 代表非正式
    formatForm (type) {
      // console.log(EnumTypes.hireType)
      /**
       * 1. 根据数组生成映射关系=》{1:'正式',2:'非正式'}
       * 2. 根据映射关系获取value值
       */
      const map = {}
      EnumTypes.hireType.forEach(item => {
        map[item.id] = item.value
      })
      // console.log(map)
      return map[type]
    },
    // 切换分页
    changePage (currPage) {
      console.log(currPage)
      this.query.page = currPage
      this.getList()
    },
    // 切换条数
    changeSize (currSize) {
      console.log(currSize)
      this.query.size = currSize
      this.getList()
    },
    // 获取员工列表
    async getList () {
      const { total, rows } = await getEmployeeList(this.query)
      console.log(rows)
      this.list = rows
      this.total = total
    }
  }
}
</script>

<style lang="scss">
.round {
  width: 80px;
  height: 80px;
  border-radius: 80px;
}
</style>
