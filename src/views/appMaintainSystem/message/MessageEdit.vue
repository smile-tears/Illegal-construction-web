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
        <a-form-item label="主题" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['title', {}]" />
        </a-form-item>
		    <a-form-item label="内容" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-textarea rows="5" cols="100" :disabled="modalData.disabled" v-decorator="['content', {}]" />
        </a-form-item>

        <a-form-item label="发送给" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-tree-select
            v-show="!modalData.disabled"
            show-search
            treeNodeFilterProp="title"
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
          <a-button @click="selectAll" v-show="!modalData.disabled">全选</a-button>
          <a-table
            v-show="modalData.disabled"
            :columns="userColumns"
            :data-source="userList"
            rowKey="id"
          >
          </a-table>
        </a-form-item>



      </a-form>
    </a-spin>


  </a-modal>
</template>

<script>
import { messagePost } from '@/api/message'
import { getSubCompanyUserTree } from '@/api/manage'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['modalData'],
  created () {
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
      treeData: null,
      value: undefined,
      messageReceiveList: [],
      userColumns:[
        {
          title: '姓名',
          dataIndex: 'user.username',
          key: 'user.username'
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          customRender: function (text, record, index) {
            return text === 1 ? '已读' : '未读'
          }
        }
      ],
      userList:[]
    }
  },
  watch: {
    modalData (modalData) {
      this.form.resetFields()
      if (modalData.visible === true) {
        this.$nextTick(() => {
          delete this.modalData.record.delTag
          this.userList = this.modalData.record.messageReceiveList
//          var values = []
//          for(var i in this.messageReceiveList){
//            values.push( this.messageReceiveList[i].user.id )
//          }
//          this.value = values
          this.form.setFieldsValue({ ...this.modalData.record })
        })
      }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
    // console.log('form::', this.form)
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
  },
  methods: {
    handleOk () {

      if(!this.modalData.disabled){
        // 触发表单验证
        this.form.validateFields((err, values) => {
          // 验证表单没错误
          if (!err) {
            // console.log('form values', values)
//          var api = values.id === undefined ? messagePost : messagePost
            var api = messagePost
            values["messageReceiveList"] = this.messageReceiveList
            api(values)
              .then(res => {
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
      }else{
        console.log("查看，确定。")
        this.modalData.visible = false
      }

    },
    handleCancel () {
      this.modalData.visible = false
    },
    selectAll() {
      console.log("selectAll")
      this.value = []
      this.selectUser(this.treeData);
    },
    selectUser(data){
      data.forEach(element => {
        if (element.type == 'user') this.value.push(element.value)
        if (element.children && element.children.length > 0) this.selectUser(element.children)
      })
    },
    recursionUserTree (data) {
      data.forEach(element => {
        if (element.type != 'user') element.disabled = true
        if (element.children && element.children.length > 0) this.recursionUserTree(element.children)
      })
    },
    onChange (value) {
      this.value = value
      var params = []
      this.value.forEach(element => {
        params.push({
          user: {
            id:element
          },
          status:1
        })
      })
      this.messageReceiveList = params
    }
  }
}
</script>
