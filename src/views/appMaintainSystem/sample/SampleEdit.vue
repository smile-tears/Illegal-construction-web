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
        <a-form-item label="样本名称" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['sampleName', {}]" />
        </a-form-item>
        <a-form-item label="关联网格" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <!-- <a-input :disabled="modalData.disabled" v-decorator="['gridId', {}]" /> -->
          <a-tree-select
            :disabled="modalData.disabled"
            v-decorator="['gridCommunity.id', {}]"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="gridTreeData"
            placeholder=""
            tree-default-expand-all
          ></a-tree-select>
        </a-form-item>
        <a-form-item label="父级样本" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-tree-select
            :disabled="modalData.disabled"
            v-decorator="['supSampleId', { rules: [{ required: true, message: '父级样本必填！' }] }]"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="sampleTreeData"
            placeholder=""
            tree-default-expand-all
          ></a-tree-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { samplePost, samplePut, sampleTree } from '@/api/sample'
import { gridTree } from '@/api/gridCommunity'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['modalData'],
  created() {
    this.getSampleTree()
    this.getGridTree()
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
      gridTreeData: [],
      sampleTreeData: []
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
          var api = values.id === undefined ? samplePost : samplePut
          values.gridCommunity = values.gridCommunity.id === undefined ? null : values.gridCommunity
          api(values)
            .then(res => {
              if (res.code === 200) {
                this.$emit('handleModalEvent', res)
                this.getSampleTree()
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
    getSampleTree() {
      sampleTree()
        .then(res => {
          if (res.code === 200) {
            this.sampleTreeData = res.result
          }
        })
        .catch(() => {})
    },
    getGridTree() {
        gridTree()
          .then(res => {
            if (res.code === 200) {
              this.gridTreeData = res.result
            }
          })
          .catch(() => {
          })
      }
  }
}
</script>
