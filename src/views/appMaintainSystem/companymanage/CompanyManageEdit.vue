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
        <a-form-item label="公司名称" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['companyName', {}]" />
        </a-form-item>
        <a-form-item label="公司地址" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['address', {}]" />
        </a-form-item>
        <a-form-item label="公司法人" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input :disabled="modalData.disabled" v-decorator="['legalPerson', {}]" />
        </a-form-item>
        <a-form-item label="网格" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-select
            :disabled="modalData.disabled"
            show-search
            placeholder=""
            option-filter-prop="children"
            style="width: 200px"
            :filter-option="filterOption"
            v-decorator="['grid', {}]" 
          >
            <a-select-option v-for="(grid) in gridDataList" :key="grid.id" :value="grid.id" >
              {{grid.gridName}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :label-col="labelCol" :wrapper-col="wrapperCol"
          label="附件"
        >
          <a-upload
            :disabled="modalData.disabled"
            name="file"
            :action="BASE_URL+'/upload'"
            :multiple="true"
            :file-list="fileList"
            :remove="handleRemove"
            @change="handleFileChange"
          >
            <a-button v-if="!modalData.disabled">
              <a-icon type="upload" />附件上传
            </a-button>
          </a-upload>
        </a-form-item>
        <!-- <a-form-item label="父级公司管理" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-tree-select
            :disabled="modalData.disabled"
            v-decorator="['pid', { rules: [{ required: true, message: '父级公司管理必填！' }] }]"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            placeholder="Please select"
            tree-default-expand-all
          ></a-tree-select>
        </a-form-item> -->
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { companyManagePost, companyManagePut } from '@/api/companyManage'
import {gridCommunityList} from '@/api/gridCommunity'
const BASE_URL = process.env.NODE_ENV === 'production' ? '' : '/api'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['modalData'],
  created() {
    this.gridList()
  },
  data() {
    return {
      BASE_URL: BASE_URL,
      fileList: [],
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
      treeData: [],
      gridDataList: []
    }
  },
  watch: {
    modalData(modalData) {
      this.form.resetFields()
      if (modalData.visible === true) {
        this.$nextTick(() => {
          delete this.modalData.record.delTag

          var fileName = this.modalData.record.fileName
          var filePath = this.modalData.record.filePath

          this.fileList = []
          if (fileName && fileName !== '') {
            fileName = fileName.split(',')
            filePath = filePath.split(',')
            for (var i=0; i< fileName.length; i++) {
              var obj = {
                uid: i,
                name: fileName[i],
                fileName: fileName[i],
                status: 'done',
                url: BASE_URL + filePath[i],
                // response: {
                //   result: file
                // }
              }
              this.fileList.push(obj)
            }
          }
          this.form.setFieldsValue({ ...this.modalData.record })
        })
      }
    },
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
          var filePath = []
          var fileName = []
          this.fileList.forEach(file => {
            var result = null
            if (file.response !== undefined) {
              result = file.response.result
            } else {
              result = file
            }
            
            filePath.push(result.url)
            fileName.push(result.fileName)
          })
          if (filePath.length > 0) {
            values.filePath = filePath.join(',')
            values.fileName = fileName.join(',')
          }
          var api = values.id === undefined ? companyManagePost : companyManagePut
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
    handleFileChange ({ fileList }) {
      this.fileList = fileList
    },
    handleRemove (obj) {
      // var id = obj.response.result.id
      // if (id !== undefined) {
      //   caseInfoFileCityDelete(qs.stringify({ id: id }))
      //     .then(res => {
      //       if (res.code === 200) {
      //         //
      //       }
      //     })
      //     .catch(() => {})
      // }
    },
    handleCancel() {
      this.modalData.visible = false
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    gridList() {
      gridCommunityList()
        .then(res => {
          if (res.code === 200) {
            this.gridDataList = res.result.data
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          // Do something
        })
    }
  },
}
</script>
