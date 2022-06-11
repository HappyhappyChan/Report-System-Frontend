<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- <eHeader :dict="dict" :permission="permission" /> -->
      <eHeader :permission="permission" />
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="projNum" label="报告号" />
      <el-table-column prop="projName" label="项目名称" />
      <el-table-column prop="filePath" label="底稿路径" />
      <el-table-column prop="module" label="对应模块" />
      <el-table-column prop="subModule" label="对应子模块" />
      <el-table-column prop="auditDept" label="被审计部门" />
      <el-table-column prop="relSys" label="涉及系统" />
      <el-table-column prop="probNum" label="缺陷数量" />
      <el-table-column prop="comments" label="备注" />
      <!-- <el-table-column prop="comments" label="排序">
        <template slot-scope="scope">
          {{ scope.row.jobSort }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnabled(scope.row, scope.row.enabled)"
          />
        </template>
      </el-table-column> -->
      <el-table-column prop="createDate" label="创建日期" />
      <el-table-column prop="finishDate" label="完成日期" />
      <el-table-column prop="reportDate" label="报告日期" />
      <el-table-column prop="reporterName" label="报告人" />
      <!--   编辑与删除   -->
      <!-- <el-table-column
        v-if="checkPer(['admin','report:edit','report:del'])" -->
      <el-table-column
        v-permission="['admin','report:edit','report:del']"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
    <!--表单渲染-->
    <!-- <eForm :job-status="dict.job_status" /> -->
    <eForm />
  </div>
</template>

<script>
import crudReprot from '@/api/report'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, { presenter } from '@/components/Crud/crud'
import crudOperation from '@/components/Crud/CRUD.operation'
import pagination from '@/components/Crud/Pagination'
import udOperation from '@/components/Crud/UD.operation'
export default {
  name: 'Report',
  components: { eHeader, eForm, crudOperation, pagination, udOperation },
  cruds() {
    return CRUD({
      title: '报告',
      url: 'api/report',
      // sort: ['reportId,asc', 'id,desc'],
      sort: ['id,desc'],
      crudMethod: { ...crudReprot }
    })
  },
  mixins: [presenter()],
  // 数据字典
//   dicts: ['job_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'report:add'],
        edit: ['admin', 'report:edit'],
        del: ['admin', 'report:del']
      }
    }
  },
  methods: {
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.job_status[val] + '" ' + data.name + '岗位, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // eslint-disable-next-line no-undef
        crudJob.edit(data).then(() => {
          // eslint-disable-next-line no-undef
          this.crud.notify(this.dict.label.job_status[val] + '成功', 'success')
        }).catch(err => {
          data.enabled = !data.enabled
          console.log(err.data.message)
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
