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

        <a-form-item label="菜单名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            :disabled="modalData.disabled"
            v-decorator="['menuName', { rules: [{ required: true, message: '菜单名称必填！' }] }]"
          />
        </a-form-item>

        <a-form-item label="菜单链接" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            :disabled="modalData.disabled"
            v-decorator="['menuLink', {}]"
          />
        </a-form-item>

        <a-form-item label="菜单标识" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            :disabled="modalData.disabled"
            v-decorator="['name', {}]"
          />
        </a-form-item>

        <a-form-item label="组件名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            :disabled="modalData.disabled"
            v-decorator="['component', {}]"
          />
        </a-form-item>

        <a-form-item label="重定向" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            :disabled="modalData.disabled"
            v-decorator="['redirect', {}]"
          />
        </a-form-item>

        <a-form-item label="外部链接" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            :disabled="modalData.disabled"
            v-decorator="['target', {}]"
          />
        </a-form-item>

        <a-form-item label="是否显示" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-select
            style="width: 368px"
            :disabled="modalData.disabled"
            v-decorator="['visible', { rules: [{ required: true, message: '是否显示必填！' }] },]"
          >
            <a-select-option :value="0">是</a-select-option>
            <a-select-option :value="1">否</a-select-option>
          </a-select>
          <!-- <a-input v-decorator="['visible', {}]" /> -->
        </a-form-item>
        <a-form-item label="显示顺序" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input-number :disabled="modalData.disabled" :min="0" v-decorator="['showOrder', {}]" />
        </a-form-item>

        <a-form-item label="父级菜单" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-tree-select
            :disabled="modalData.disabled"
            v-decorator="['supMenuid', { rules: [{ required: true, message: '父级菜单必填！' }] }]"
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
import { menuPost, menuPut, menuTree } from '@/api/menu'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['modalData'],
  created () {
    this.getMenuTree()
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
      confirmLoading: false,
      treeData: []
    }
  },
  watch: {
    modalData (modalData) {
      this.form.resetFields()
      if (modalData.visible === true) {
        this.$nextTick(() => {
          delete this.modalData.record.delTag
          if (!this.modalData.record.id) {
            this.modalData.record.visible = 0
          }
          this.form.setFieldsValue({ ...this.modalData.record })
        })
      }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
    // console.log('form::', this.form)
  },
  methods: {
    handleOk () {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          // console.log('form values', values)
          var api = values.id === undefined ? menuPost : menuPut
          api(values)
            .then(res => {
              if (res.code === 200) {
                this.$emit('handleModalEvent', res)
                this.getMenuTree()
                this.handleCancel()
              } else {
                this.$message.error(res.message)
              }
            })
            .catch(() => {})
        }
      })
    },
    handleCancel () {
      this.modalData.visible = false
    },
    getMenuTree () {
      menuTree()
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
