<template>
  <a-modal
    :title="modalData.title"
    :width="600"
    :visible="modalData.visible"
    :footer="null"
    :maskClosable="false"
    @cancel="handleCancel"
    class="modal"
  >
    <a-tabs default-active-key="1" @change="handleTabChange" :animated="false">
      <a-tab-pane key="1" tab="角色信息">
        <a-form :layout="formLayout" :form="form">
          <a-form-item label="角色id" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="false">
            <a-input :disabled="modalData.disabled" v-decorator="['id', {}]" />
          </a-form-item>
          <a-form-item label="角色名称" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
            <a-input :disabled="modalData.disabled" v-decorator="['roleName', {rules: [{ required: true, message: '角色名称'}]}]" />
          </a-form-item>
          <a-form-item label="角色描述" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
            <a-textarea allow-clear :rows="3" :disabled="modalData.disabled" v-decorator="['roleDesc', {}]" />
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="2" tab="成员列表" force-render>
        <a-table
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :columns="columns"
          :data-source="data"
          rowKey="id"
          :pagination="{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            'show-size-changer': true,
            'show-quick-jumper': true,
            'show-total': total => `共 ${total} 条`
          }"
          @change="change"
        >
        </a-table>
      </a-tab-pane>
      <div slot="tabBarExtraContent" class="btn-container">
        <a-button type="primary" v-show="key == 1" @click="handleOk">保存</a-button>
        <a-button type="primary" v-show="key == 2" @click="addUser">新建</a-button>
        <a-button type="danger" v-show="key == 2" @click="delUser">批量删除</a-button>
      </div>
    </a-tabs>
    <a-modal
      title="添加人员"
      :width="500"
      :visible="visible2"
      :maskClosable="false"
      @cancel="handleCancel2"
      @ok="handleOk2"
      class="modal"
    >
      <a-tree-select
        show-search
        :treeData="treeData"
        style="width: 100%"
        :value="value"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        placeholder="Please select"
        allow-clear
        multiple
        tree-default-expand-all
        @change="onChange"
      ></a-tree-select>
    </a-modal>
  </a-modal>
</template>

<script>
import { rolePost, rolePut, userRolePost, userRoleDelete, userRoleList } from '@/api/role'
import { getSubCompanyUserTree } from '@/api/manage'
import qs from 'qs'
const columns = [
  {
    title: '用户名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '登录账号',
    dataIndex: 'username',
    key: 'username'
  }
]
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['modalData'],
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
      key: 1,
      data: [],
      columns: columns,
      selectedRowKeys: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      visible2: false,
      treeData: null,
      value: undefined
    }
  },
  watch: {
    modalData (modalData) {
      this.form.resetFields()
      if (modalData.visible === true) {
        this.$nextTick(() => {
          delete this.modalData.record.delTag
          this.form.setFieldsValue({ ...this.modalData.record })
        })
        this.loadUserList()
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
          var api = values.id === undefined ? rolePost : rolePut
          api(values)
            .then(res => {
              this.$emit('handleModalEvent', res)
              this.handleCancel()
            })
            .catch(() => {})
        }
      })
    },
    handleOk2 () {
      var roleId = this.modalData.record.id
      var params = []
      this.value.forEach(element => {
        params.push({
          roleId: roleId,
          userId: element
        })
      })
      userRolePost(params)
        .then(res => {
          if (res.code === 200) {
            this.handleCancel2()
            this.loadUserList()
          }
        })
        .catch(() => {})
    },
    addUser () {
      this.visible2 = true
    },
    delUser () {
      userRoleDelete(this.selectedRowKeys)
        .then(res => {
          if (res.code === 200) {
            this.loadUserList()
          }
        })
        .catch(() => {})
    },
    handleCancel () {
      this.modalData.visible = false
    },
    handleCancel2 () {
      this.visible2 = false
    },
    handleTabChange (key) {
      this.key = key
      if (key == '2' && this.treeData == null) {
        getSubCompanyUserTree()
          .then(res => {
            if (res.code === 200) {
              this.recursionUserTree(res.result)
              this.treeData = res.result
            }
          })
          .catch(() => {
            // Do something
          })
      }
    },
    loadUserList () {
      var param = {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        roleId: this.modalData.record.id
      }
      userRoleList(qs.stringify(param))
        .then(res => {
          if (res.code === 200) {
            this.data = res.result.data
          }
        })
        .catch(() => {
          // Do something
        })
    },
    recursionUserTree (data) {
      data.forEach(element => {
        if (element.type != 'user') element.disabled = true
        if (element.children && element.children.length > 0) this.recursionUserTree(element.children)
      })
    },
    onSelectChange (selectedRowKeys) {
      // console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys
    },
    change (pagination, filters, sorter) {
      this.pagination = pagination
      // this.loadData()
    },
    onChange (value) {
      this.value = value
    }
  }
}
</script>

<style lang="less" >
  .modal div.ant-modal-body {
    padding: 10px;
  }
  .btn-container button{
    margin: 0 3px;
  }
</style>
