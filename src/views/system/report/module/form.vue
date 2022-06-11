<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="500px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item
        label="报告号"
        prop="projNum"
      >
        <el-input
          v-model.number="form.projNum"
          style="width: 370px;"
        />
      </el-form-item>

      <el-form-item
        label="项目名称"
        prop="projName"
      >
        <el-input
          v-model="form.projName"
          style="width: 370px;"
        />
      </el-form-item>

      <el-form-item
        label="底稿路径"
        prop="filePath"
      >
        <el-input
          v-model="form.filePath"
          style="width: 370px;"
        />
      </el-form-item>

      <el-form-item
        label="对应模块"
        prop="module"
      >
        <el-input
          v-model="form.module"
          style="width: 370px;"
        />
      </el-form-item>

      <el-form-item
        label="对应子模块"
        prop="subModule"
      >
        <el-input
          v-model="form.subModule"
          style="width: 370px;"
        />
      </el-form-item>

      <el-form-item
        label="被审计部门"
        prop="auditDept"
      >
        <el-input
          v-model="form.auditDept"
          style="width: 370px;"
        />
      </el-form-item>

      <el-form-item
        label="涉及系统"
        prop="relSys"
      >
        <el-input
          v-model="form.relSys"
          style="width: 370px;"
        />
      </el-form-item>

      <el-form-item
        label="缺陷数量"
        prop="probNum"
      >
        <el-input
          v-model.number="form.probNum"
          style="width: 370px;"
        />
      </el-form-item>
    
     <el-form-item
        label="报告人"
        prop="reporterName"
      >
        <el-input
          v-model="form.reporterName"
          style="width: 370px;"
        />
      </el-form-item>

      <el-form-item
        label="备注"
        prop="comments"
      >
        <el-input
          v-model="form.comments"
          style="width: 370px;"
        />
      </el-form-item>

      <el-form-item
        label="创建日期"
        prop="createDate"
      >
        <el-input
          v-model="form.createDate"
          style="width: 370px;"
        />
      </el-form-item>

      <el-form-item
        label="完成日期"
        prop="finishDate"
      >
        <el-input
          v-model="form.finishDate"
          style="width: 370px;"
        />
      </el-form-item>

      <el-form-item
        label="报告日期"
        prop="reportDate"
      >
        <el-input
          v-model="form.reportDate"
          style="width: 370px;"
        />
      </el-form-item>
      
     

    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="text"
        @click="crud.cancelCU"
      >
        取消
      </el-button>
      <el-button
        :loading="crud.status.cu === 2"
        type="primary"
        @click="crud.submitCU"
      >
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { form } from '@/components/Crud/crud'

const defaultForm = {
  id: null,
  projNum: 1,
  projName: '',
  filePath: '',
  module: '',
  subModule: '',
  auditDept: '',
  relSys: '',
  probNum: 0,
  comments: '',
  createDate: '2022-06-10 21:30:23',
  finishDate: '2022-06-10 21:30:23',
  reportDate: '2022-06-10 21:30:23',
  reporterName: 'reporter1'
}
export default {
  mixins: [form(defaultForm)],
  props: {
    // jobStatus: {
    //   type: Array,
    //   required: true
    // }
  },
  data() {
    return {
      rules: {
        projNum: [
          { required: true, message: '请输入报告号', trigger: 'blur', type: 'number' }
        ],
        projName: [
          { required: true, message: '请输入项目名称', trigger: 'blur'}
        ],
        filePath: [
          { required: true, message: '请输入底稿路径', trigger: 'blur' }
        ],
        module: [
          { required: true, message: '请输入对应模块', trigger: 'blur' }
        ],
        subModule: [
          { required: false, message: '请输入对应子模块', trigger: 'blur' }
        ],
        auditDept: [
          { required: true, message: '请输入被审计部门', trigger: 'blur' }
        ],
        relSys: [
          { required: true, message: '请输入涉及系统', trigger: 'blur' }
        ],
        probNum: [
          { required: true, message: '请输入缺陷数量', trigger: 'blur', type: 'number' }
        ],
        comments: [
          { required: false, message: '请输入备注', trigger: 'blur' }
        ],
        createDate: [
          { required: true, message: '请输入创建日期', trigger: 'change'}
        ],
        finishDate: [
          { required: true, message: '请输入完成日期', trigger: 'change' }
        ],
        reportDate: [
          { required: true, message: '请输入报告日期', trigger: 'change' }
        ],
        reporterName: [
          { required: true, message: '请输入报告人姓名', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
