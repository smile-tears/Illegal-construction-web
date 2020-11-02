<template>
  <a-modal
    :title="title"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <department-info
      ref="departmentInfo"
    >
    </department-info>
  </a-modal>
</template>

<script>
import DepartmentInfo from './DepartmentInfo'

export default {
  name: 'DepartmentDetail',
  components: {
    DepartmentInfo
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      formLayout: 'horizontal',
      title: '',
      visible: false,
      confirmLoading: false,
      mdl: {},
      rowId: ''
    }
  },
  beforeCreate () {
  },
  created () {

  },
  mounted () {
  },

  methods: {
    loadData (record) {
      this.visible = true
      if(record.type === "subCompany")
        this.title = '分部详情'
      if(record.type === "department")
        this.title = '部门详情'

      this.$nextTick(() => {
        console.log('this.$refs.departmentInfo',this.$refs.departmentInfo)
        if (this.$refs.departmentInfo)
          console.log('this.$refs',this.$refs.departmentInfo)
          this.$refs.departmentInfo.loadData(record.type, record.id)
      })
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleOk () {
      this.close()
    },
    handleCancel () {
      this.close()
    }

  }
}
</script>
