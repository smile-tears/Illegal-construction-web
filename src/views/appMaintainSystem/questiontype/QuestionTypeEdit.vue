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
          <a-input :disabled="modalData.disabled" v-decorator="['typeName', { rules: [{ required: true, message: '类型名称必填！' }] }]" />
        </a-form-item>
        <a-form-item label="行政区划代码" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['areaCode', { }]" />
        </a-form-item>
        <a-form-item label="大类码" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['bigCode', { rules: [{ required: true, message: '大类码必填！' }] }]" />
        </a-form-item>
        <a-form-item label="小类码" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['smallCode', {}]" />
        </a-form-item>
        <a-form-item label="分数" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['score', {}]" />
        </a-form-item>
        <a-form-item label="别名" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['alias', {}]" />
        </a-form-item>
        <a-form-item label="快捷名称" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['shortcutName', {}]" />
        </a-form-item>
        <a-form-item label="处理时限" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['processTimeLimit', {}]" />
        </a-form-item>

        <a-form-item label="父级问题类型" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-tree-select
            :disabled="modalData.disabled"
            v-decorator="['pid', { rules: [{ required: true, message: '父级问题类型必填！' }] }]"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            placeholder="Please select"
            tree-default-expand-all
          ></a-tree-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { questionTypePost, questionTypePut, questionTypeTree } from '@/api/questionType'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['modalData'],
  created() {
    this.getQuestionTypeTree()
  },
  data() {
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
      confirmLoading: false,
      treeData: []
    }
  },
  watch: {
    modalData(modalData) {
      this.form.resetFields()
      if (modalData.visible === true) {
        this.$nextTick(() => {
          delete this.modalData.record.delTag
          this.form.setFieldsValue({ ...this.modalData.record })
        })
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    // console.log('form::', this.form)
  },
  methods: {
    handleOk() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          // console.log('form values', values)
          var api = values.id === undefined ? questionTypePost : questionTypePut
          api(values)
            .then(res => {
              if (res.code === 200) {
                this.$emit('handleModalEvent', res)
                this.getQuestionTypeTree()
                this.handleCancel()
              } else {
                this.$message.error(res.message)
              }
            })
            .catch(() => {})
        }
      })
    },
    handleCancel() {
      this.modalData.visible = false
    },
    getQuestionTypeTree() {
      questionTypeTree()
        .then(res => {
          if (res.code === 200) {
            this.treeData = res.result
          }
        })
        .catch(() => {})
    }
  }
}
</script>
