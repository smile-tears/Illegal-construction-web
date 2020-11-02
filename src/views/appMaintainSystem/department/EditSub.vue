<template>
  <a-modal
    :title="title"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :layout="formLayout"
        :form="form">

        <!--<a-input v-decorator="['supSubCompanyId', {}]" type="hidden" />

        <a-form-item
          label="上级分部"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-decorator="['supSubCompanyName', {}]" disabled />
        </a-form-item>-->

        <a-form-item
          label="上级分部"
          :label-col="labelCol"
          :wrapper-col="wrapperCol">
          <a-tree-select
            v-decorator="['supSubCompanyId',
              {rules: [{ required: true, message: '请选择上级分部'}]}
            ]"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="subTreeData"
            placeholder="请选择上级分部"
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-item>

        <a-form-item
          label="分部编号"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-decorator="['subCompanyCode', {}]" />
        </a-form-item>

        <a-form-item
          label="分部名称"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-decorator="['subCompanyName', {}]" />
        </a-form-item>

        <a-form-item
          label="状态"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-radio-group v-decorator="['canceled',{ initialValue: '0' }]">
            <a-radio value="0">启用</a-radio>
            <a-radio value="1">封存</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          label="排序"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input-number v-decorator="['showOrder', { initialValue: '1' }]" />
        </a-form-item>

        <a-form-item
          label="是否独立站点"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-radio-group v-decorator="['aloneSite',{ initialValue: '1' }]">
            <a-radio value="0">是</a-radio>
            <a-radio value="1">否</a-radio>
          </a-radio-group>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import ATreeSelect from 'ant-design-vue/es/tree-select'
import 'ant-design-vue/es/tree-select/style/index.less'
import { postSubCompany } from '@/api/manage'
import pick from 'lodash.pick'

export default {
  name: 'EditSub',
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
      formLayout: 'horizontal',
      title: '',
      visible: false,
      confirmLoading: false,
      subTreeData: [],
      mdl: {},
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
        subCompanyName: '',
        subCompanyCode: '',
        supSubCompanyId: '',
        supSubCompanyName: '',
        canceled: '0',
        showOrder: 1,
        aloneSite: '1'
      }
    },
    add (id, title) {
      this.init()
      this.edit({ supSubCompanyId: id, supSubCompanyName: title })
      this.title = '新建分部'
    },
    edit (record) {
      this.subTreeData = this.$attrs.subTreeData
      this.title = '编辑分部'
      this.rowId = record.id
      this.mdl = Object.assign(this.mdl, record)
      if(this.mdl.canceled>= 0 && this.mdl.canceled != null)this.mdl.canceled = this.mdl.canceled.toString()
      if(this.mdl.aloneSite>= 0 && this.mdl.aloneSite != null)this.mdl.aloneSite = this.mdl.aloneSite.toString()
      console.log('this.mdl', this.mdl)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id', 'subCompanyName', 'subCompanyCode', 'supSubCompanyId', 'canceled', 'showOrder'))
      })
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleOk () {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          console.log('form values', values)
          if (this.rowId !== '') {
            values['id'] = this.rowId
          }
          _this.confirmLoading = true
          delete values.supDeptName
          postSubCompany(values)
          .then(res => {
            if(res.code === 200){
              _this.$message.success('保存成功')
              _this.$emit('ok')
            }
            _this.close()
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
