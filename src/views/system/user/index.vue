<template>
  <div>
    <div class="head-container">
      <!--增删改查按钮-->
      <crudOperation></crudOperation>
    </div>
    <!--用户列表信息表格-->
    <el-table
        v-loading="crud.loading"
        :data="crud.tableData"
        style="width: 100%"
        highlight-current-row
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          fixed
          prop="username"
          label="用户名"
          width="150">
      </el-table-column>
      <el-table-column
          prop="nickName"
          label="昵称"
          width="120">
      </el-table-column>
      <el-table-column
          prop="gender"
          label="性别"
          width="120">
      </el-table-column>
      <el-table-column
          prop="phone"
          label="电话"
          width="200">
      </el-table-column>
      <el-table-column
          prop="email"
          label="邮箱"
          width="200">
      </el-table-column>
      <el-table-column
          prop="dept.name"
          label="部门"
          width="120">
      </el-table-column>
      <el-table-column
          prop="enabled"
          label="状态"
          width="120">
        <template slot-scope="scope">
          <el-switch ref="enabled"
                     v-model="scope.row.enabled"></el-switch>
        </template>
      </el-table-column>
      <el-table-column
          :show-overflow-tooltip="true"
          prop="createTime"
          label="创建日期"
          width="200">
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
        :page-size.sync="crud.page.size"
        :total="crud.page.total"
        :current-page.sync="crud.page.page"
        style="margin-top: 8px;"
        layout="total, prev, pager, next, sizes"
        @size-change="crud.sizeChangeHandler"
        @current-change="crud.pageChangeHandler"
    />
    <!--用户信息编辑弹窗-->
    <el-dialog append-to-body title="用户信息" :visible.sync="dialogFormVisible" width="680px">
      <el-form :model="form" :inline="true" size="small" label-width="66px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.gender" style="width: 178px">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.enabled">
            <el-radio
                v-for="item in user_status"
                :label="item.value"
                :key="item.label"
            >{{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="deptData" placeholder="请选择部门" ref="deptSelect">
            <el-option v-model="deptData" style="height: max-content;width: 100%;padding: 0">
              <el-tree
                  :props="props"
                  :load="loadDept"
                  lazy
                  style="width: 100%"
                  @node-click="setDept">
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位">
          <el-select v-model="jobDatas" multiple placeholder="请选择岗位" @change="changeJob">
            <el-option v-for="item in jobs" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select
              v-model="roleDatas"
              multiple
              placeholder="请选择角色"
              @change="changeRole"
          >
            <el-option
                v-for="item in roles"
                :key="item.name"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser(form)">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>

import Element from 'element-ui'
import store from "@/store"
import CRUD, {presenter} from '@/components/Crud/crud'

import crudOperation from '@/components/Crud/CRUD.operation'

export default {
  name: "User",
  cruds() {
    return CRUD({title: '用户', url: 'api/users'})
  },
  components: {crudOperation},
  mixins: [presenter()],
  created() {
    //获取当前登录用户的信息
    store.dispatch('GetInfo').then(() => {
      this.crud.optShow = {
        add: true,
        edit: true,
        delete: true,
        download: true
      }
    })
    console.log('UserVM', this)
  },

  data() {
    return {
      jobDatas: [],
      roleDatas: [],
      user_status: [{label: '激活', value: true}, {label: '禁用', value: false}],
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf',
      },
      jobs: [],
      roles: [],
      deptData: {},
      depts: [],
      dialogFormVisible: false,
      form: {}
    }
  },
  methods: {
    //点击新增用户按钮时, 随机生成预设值，方便快速新增用户，
    initForm() {
      this.form = {
        username: 'user' + Math.round(Math.random() * 10000),
        email: Math.round(Math.random() * 100000000) + '@qq.com',
        dept: {id: 7},
        nickName: 'fan3',
        id: null,
        phone: 13242000000 + Math.round(Math.random() * 1000000),
        roles: [{id: 2}],
        enabled: true,
        gender: '男',
        jobs: [],
      }
      this.deptData = '研发部'
      this.roleDatas = [2]
      this.jobDatas = [11]
    },
    //点击状态按钮时，发送请求给后端对用户状态进行修改
    handleCurrentChange(selectRow) {
      if (!selectRow) return
      this.mapForm(selectRow)
      this.$request.put('api/users', this.form).then(() => {
        this.crud.refresh()
      });
    },
    //让选中的数据显示到框框里面
    mapForm(selectRow) {
      this.deptData = selectRow.dept.name
      this.roleDatas = selectRow.roles.map(value => value.id)
      this.jobDatas = selectRow.jobs.map(value => value.id)
      this.form = {...selectRow}
    },
    //选中某一行时
    handleSelectionChange(rows) {
      this.crud.selectData = rows
    },
    //发送新增、编辑、删除用户请求给后端
    updateUser(data) {
      let op = this.$store.state.operation
      console.log("提交给后端/api/users接口的数据", data)
      this.$request({url: 'api/users', method: op, data: data}).then(() => {
        Element.Message.success("操作成功")
        this.dialogFormVisible = false
        this.crud.refresh()
      })
    },
    //由于select组件绑定的Jobs里面只有数字组成的数组[1,2,3]，而不是对象如[{id:1},{id:2}]，需要进行转化
    changeRole() {
      this.form.roles = this.roleDatas.map(value => {
        return {id: value}
      })
    },
    //由于select组件绑定的Jobs里面只有数字组成的数组[1,2,3]，而不是对象如[{id:1},{id:2}]，需要进行转化
    changeJob() {
      this.form.jobs = this.jobDatas.map(value => {
        return {id: value}
      })
    },
    //点击部门后，改变部门框显示的值
    setDept(node) {
      this.form.dept = {id: node.id}
      this.deptData = node.name
      this.$refs.deptSelect.visible = false
    },
    // 获取弹窗内部门数据，树形组件的节点信息获取
    loadDept(node, resolve) {
      //pid代表上级部门的id
      let pid = node.level === 0 ? null : node.data.id
      this.$request.get('api/dept', {params: {enable: true, pid}}).then(res => {
        this.depts = res.content
        resolve(this.depts);
      })
    },
    //点击新增、编辑、删除按钮时
    [CRUD.HOOK.updateOperation](crud, op) {
      if (op === 'post') this.initForm()
      if (op === 'put') this.mapForm(this.crud.selectData[0])
      this.$store.commit('SET_OP', op)
      this.dialogFormVisible = op !== 'delete'
      if (op !== 'delete') this.getJobAndRole()
      else {
        this.crud.dleChangePage()
        this.updateUser(this.crud.selectData.map(value => value.id))
      }
    },
    //获取树形组件中的岗位和角色信息
    getJobAndRole() {
      this.$request.get('api/job?page=0&size=9999&enabled=true').then(res => {
        this.jobs = res.content
      })
      this.$request.get('api/roles/all').then(res => {
        this.roles = res
      })
    },
  }
}
</script>

<style scoped>

</style>
