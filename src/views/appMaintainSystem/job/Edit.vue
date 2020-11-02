<template>
  <a-modal
    :title="title"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    :footer="footer"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :layout="formLayout"
        :form="form">

        <a-form-item
          label="岗位名称"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            :disabled="isDetail"
            v-decorator="['jobName',
              {rules: [{ required: true, message: '请输入岗位名称'}]}
            ]"
          />
        </a-form-item>
        <a-form-item
          label="岗位编码"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            :disabled="isDetail"
            v-decorator="['jobCode', {}]" />
        </a-form-item>
        <a-form-item
          label="岗位简称"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            :disabled="isDetail"
            v-decorator="['jobMask', {}]" />
        </a-form-item>
        <a-form-item
          label="描述"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-textarea
            :disabled="isDetail"
            v-decorator="['jobDesc', {}]" />
        </a-form-item>
        <a-form-item
          label="排序"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input-number
            :disabled="isDetail"
            :min="0" v-decorator="['showOrder', {}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import ATreeSelect from 'ant-design-vue/es/tree-select'
import 'ant-design-vue/es/tree-select/style/index.less'
import { postJobMask } from '@/api/manage'
import pick from 'lodash.pick'

export default {
  name: 'Edit',
  components: {
    ATreeSelect
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
      footer: undefined,
      formLayout: 'horizontal',
      visible: false,
      confirmLoading: false,
      mdl: {},
      title: '',
      isDetail: false,
      rowId: ''
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
    console.log('form::', this.form)
  },
  created () {

  },
  methods: {
    init () {
      this.rowId = ''
      this.mdl = {
        jobName: '',
        jobCode: '',
        jobMask: '',
        jobDesc: '',
        showOrder: 1
      }
    },
    add (id, title) {
      this.init()
      this.edit({}, title)
    },
    edit (record, title) {
      this.footer = undefined
      this.isDetail = false
      this.rowId = record.id
      this.mdl = Object.assign(this.mdl, record)
      this.visible = true
      this.title = title
      debugger
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'jobName', 'jobCode', 'jobMask', 'jobDesc', 'showOrder'))
      })
    },
    detail (record, title){
      this.edit (record, title)
      this.isDetail = true
      this.footer = null
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleOk () {
      const _this = this
      if(this.isDetail){
        this.visible = false
        return
      }
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          console.log('form values', values)
          if (this.rowId !== '') {
            values['id'] = this.rowId
          }
          _this.confirmLoading = true
          postJobMask(values)
          .then(res => {
            _this.$message.success('保存成功')
            _this.$emit('ok')
          }).catch(() => {
            _this.$message.error('保存失败')
            // Do something
          }).finally(() => {
            _this.confirmLoading = false
            _this.close()
          })
        }
      })
    },
    handleCancel () {
      this.close()
    }

  }
}
</script>
