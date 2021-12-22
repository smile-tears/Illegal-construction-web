<template>
  <a-modal
    :title="modalData.title"
    :width="600"
    :visible="modalData.visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :layout="formLayout" :form="form">
        <a-form-item label="id" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="false">
          <a-input :disabled="modalData.disabled" v-decorator="['id', {}]" />
        </a-form-item>
        <a-form-item label="类型名称" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['typeName', {}]" />
        </a-form-item>
        <a-form-item label="所属一级类型" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-select
            :disabled="modalData.disabled"
            show-search
            :filter-option="filterOption"
            v-decorator="['fstLvlType.id', {}]"
          >
            <a-select-option
              v-for="fstLvlType in fstLvlTypeList"
              :key="fstLvlType.id"
              :value="fstLvlType.id"
            >
              {{ fstLvlType.typeName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="显示顺序" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input-number :disabled="modalData.disabled" v-decorator="['showOrder', {}]" :precision="0" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { questionTypePost, questionTypePut, questionTypeFstLvl, questionTypeSecLvl } from '@/api/questionType'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['modalData'],
  created() {},
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      formLayout: 'horizontal',
      confirmLoading: false,
      fstLvlTypeList: []
    }
  },
  watch: {
    modalData(modalData) {
      this.form.resetFields()
      if (modalData.visible === true) {
        this.$nextTick(() => {
          delete this.modalData.record.delTag
          this.form.setFieldsValue({ ...this.modalData.record })
          this.getFstLvl()
        })
      }
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    // console.log('form::', this.form)
  },
  methods: {
    getFstLvl() {
      questionTypeFstLvl()
        .then(res => {
          this.fstLvlTypeList = res.result
        }).catch(err => {})
    },
    handleOk() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          // console.log('form values', values)
          var api = values.id === undefined ? questionTypePost : questionTypePut
          api(values)
            .then((res) => {
              if (res.code === 200) {
                this.$emit('handleModalEvent', res)
                this.handleCancel()
              } else {
                this.$message.error(res.message)
              }
            })
            .catch(() => {})
        }
      })
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleCancel() {
      this.modalData.visible = false
    },
  },
}
</script>
