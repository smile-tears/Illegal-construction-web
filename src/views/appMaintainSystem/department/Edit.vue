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

        <a-form-item
          label="上级部门"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <!--<a-input v-decorator="['supDeptName', {}]" disabled />-->
          <a-tree-select
            v-decorator="['supDeptId'
            ]"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="orgTree"
            placeholder="请选择上级部门"
            @change="onChangeSubDep"
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-item>

        <a-form-item
          label="所属分部"
          :label-col="labelCol"
          :wrapper-col="wrapperCol">
          <a-tree-select
            v-decorator="['subCompanyId',
              {rules: [{ required: true, message: '请选择所属分部'}]}
            ]"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            @change="onChangeSubCom"
            placeholder="请选择所属分部"
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-item>

        <a-form-item
          label="部门编号"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input
            v-decorator="['departmentCode',
              {rules: [{ required: true, message: '请输入部门编号' }]}
            ]"
          />
        </a-form-item>

        <a-form-item
          label="部门名称"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-decorator="['departmentName', {
            rules: [{ required: true, message: '请输入部门名称' }]
          }]" />
        </a-form-item>

        <a-form-item
          label="部门简称"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-input v-decorator="['departmentMask']" />
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
          label="描述"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-textarea v-decorator="['departmentDesc', {}]" />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import ATreeSelect from 'ant-design-vue/es/tree-select'
import 'ant-design-vue/es/tree-select/style/index.less'
import { postDepartment, getSubCompanyTree2 } from '@/api/manage'
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
      formLayout: 'horizontal',
      title: '',
      visible: false,
      confirmLoading: false,
      mdl: {},
      rowId: '',
//      subCompanyArr: [],
      orgTree: [],
      treeData: []
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
        departmentCode: '',
        departmentName: '',
        departmentMask: '',
        departmentDesc: '',
        canceled: '0',
        showOrder: 1,
        supDeptId: '',
        subCompanyId: ''
      }
    },
    //为组织结构树中的分部节点增加disabled属性
    parseDepartmentTree (treeData) {
      for(var i in treeData) {
        if(treeData[i].type === "subCompany") {
          treeData[i].disabled = true
          if(treeData[i]["children"] && treeData[i]["children"].length > 0 ) {
            this.parseDepartmentTree(treeData[i]["children"])
          }
        }
      }
    },

    findParentSubCompany (node) {
      console.log('findParentSubCompany', node)
      if (node.$parent.$options.propsData.dataRef.type === "subCompany") {
        this.form.setFieldsValue({
          subCompanyId: node.$parent.$options.propsData.value
        });
      }else{
        this.findParentSubCompany(node.$parent)
      }
    },
    onChangeSubDep (value, label, extra) { //上级部门变化，所属分部默认更改为上级部门的最近所属分部
//      this.subCompanyId = value
      this.findParentSubCompany(extra.triggerNode)
    },
    onChangeSubCom (value) {//所属分部修改后，上级部门默认更改为空
      this.form.setFieldsValue({
        supDeptId: ''
      });
    },

    add (id, subCompanyId, type) {
//      this.subCompanyArr = subCompanyArr
      this.init()
      var record = {}
      if(type === "subCompany"){
        record = { subCompanyId: id }
      } else {
        record = { supDeptId: id , subCompanyId:subCompanyId}
      }
      this.edit(record)
      this.title = '新建部门'
    },
    edit (record) {
      console.log('edit this', this)
      //this.orgTree = Object.assign([], this.$attrs.orgTree)
      this.orgTree = JSON.parse(JSON.stringify(this.$attrs.orgTree))
      this.parseDepartmentTree(this.orgTree)
//      this.orgTree = treeData
      this.treeData = this.$attrs.subTreeData
      this.title = "编辑部门"
      console.log('record', record)
      this.rowId = record.id
      this.mdl = Object.assign(this.mdl, record)
      if(this.mdl.canceled>= 0 && this.mdl.canceled != null)this.mdl.canceled = this.mdl.canceled.toString()
      console.log('this.mdl', this.mdl)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'departmentCode', 'departmentName', 'departmentMask', 'departmentDesc', 'canceled', 'showOrder',  'supDeptId', 'subCompanyId'))
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
          console.log('values',values)
          if(!values.supDeptId || values.supDeptId == undefined || values.supDeptId == ''){
            values.supDeptId = values.subCompanyId
          }
          //values['supDeptId'] = this.mdl.supDeptId
          _this.confirmLoading = true
          postDepartment(values)
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
