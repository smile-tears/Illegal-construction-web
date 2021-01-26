<template>
  <a-modal
    :title="modalData.title"
    :width="1000"
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
        <a-form-item label="摘要" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['remark', {}]" />
        </a-form-item>
		    <a-form-item label="内容" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <!--<a-textarea rows="5" cols="100" :disabled="modalData.disabled" v-decorator="['content', {}]" />-->
          <wang-editor @change="handleChange" :disabled="modalData.disabled" :value="editorData"></wang-editor>

          <!--<div id="demo1" ref="editor"></div>-->
          <!--<button type="button" class="btn" @click="getEditorData">获取当前内容</button>-->
          <!--<h3>内容预览</h3>-->
          <!--<textarea name="" id="" cols="170" rows="20" readonly v-model="editorData"></textarea>-->
        </a-form-item>

        <a-form-item
          label="附件上传"
          :label-col="labelCol" :wrapper-col="wrapperCol"
        >
          <a-upload
            :disabled="modalData.disabled"
            name="file"
            :action="BASE_URL+'/upload'"
            :multiple="true"
            :file-list="fileList2"
            @change="handleFileChange2"
          >
            <a-button v-if="!modalData.disabled">
              <a-icon type="upload" />附件上传
            </a-button>
          </a-upload>
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
//import WEditor from 'wangeditor'
import { WangEditor } from '@/components'

const BASE_URL = process.env.NODE_ENV === 'production' ? '' : '/api'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['modalData'],
  components: {
    WangEditor
  },
  created () {
  },
  data () {
    return {
      BASE_URL: BASE_URL,
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
            return text === 1 ? '未读' : '已读'
          }
        }
      ],
      userList:[],
      fileList2: [],
      editorData: ''
    }
  },
  watch: {
    modalData (modalData) {
      this.form.resetFields()
      this.editorData = ""
      if (modalData.visible === true) {
        this.$nextTick(() => {
          delete this.modalData.record.delTag
          this.userList = this.modalData.record.messageReceiveList
          this.editorData = this.modalData.record.content
//          var values = []
//          for(var i in this.messageReceiveList){
//            values.push( this.messageReceiveList[i].user.id )
//          }
//          this.value = values


          var fileName2 = this.modalData.record.fileName
          var filePath2 = this.modalData.record.filePath
          this.fileList2 = []
          if (fileName2 && fileName2 !== '') {
            fileName2 = fileName2.split(',')
            filePath2 = filePath2.split(',')
            for (var i = 0; i < fileName2.length; i++) {
              var obj = {
                uid: i,
                name: fileName2[i],
                status: 'done',
                path: filePath2[i],
                url: BASE_URL + filePath2[i],
              }
              this.fileList2.push(obj)
            }
          }

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

    handleFileChange2({ fileList }) {
      this.fileList2 = fileList
    },
    handleChange(editorContent){
      console.log("editorContent",editorContent);
      this.editorData = editorContent;
    },
    handleOk () {

      if(!this.modalData.disabled){
        // 触发表单验证
        this.form.validateFields((err, values) => {
          // 验证表单没错误
          if (!err) {
            // console.log('form values', values)
//          var api = values.id === undefined ? messagePost : messagePost
            var filePath2 = []
            var fileName2 = []
            this.fileList2.forEach((file) => {
              var result = null
              if (file.response !== undefined) {
                result = file.response.result
                filePath2.push(result.url)
                fileName2.push(result.fileName)
              } else {
                filePath2.push(file.path)
                fileName2.push(file.name)
              }
            })
            if (filePath2.length > 0) {
              values.filePath = filePath2.join(',')
              values.fileName = fileName2.join(',')
            }

            var api = messagePost
            values["content"] = this.editorData
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
      this.onChange(this.value)
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

<style scoped lang="scss">
  /deep/.w-e-toolbar {
    flex-wrap:wrap;
  }
</style>