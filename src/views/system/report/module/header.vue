<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-input v-model="query.blurry" clearable size="small" placeholder="输入项目名称或报告人名字搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
    <date-range-picker v-model="query.createTime" class="date-item" />
    <!-- <el-input v-model="query.blurry" clearable size="small" placeholder="输入报告人名字搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" /> -->
    <!-- <el-select v-model="query.enabled" clearable size="small" placeholder="状态" class="filter-item" style="width: 90px" @change="crud.toQuery">
      <el-option v-for="item in dict.dict.job_status" :key="item.value" :label="item.label" :value="item.value" />
    </el-select> -->
    <rrOperation />
  </div>
</template>

<script>
import { header } from '@/components/Crud/crud'
import rrOperation from '@/components/Crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'
export default {
  components: { rrOperation, DateRangePicker },
  mixins: [header()],
  props: {
    dict: {
      type: Object,
      required: true
    },
    permission: {
      type: Object,
      required: true
    }
  }
}
</script>
