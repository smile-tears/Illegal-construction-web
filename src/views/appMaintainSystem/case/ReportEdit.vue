<template>
  <a-modal
    :title="modalData.title"
    :width="800"
    :visible="modalData.visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <a-button @click="handleCancel" >
        取消
      </a-button>
      <a-button @click="handleOk(0)"  >
        暂存
      </a-button>
      <a-button type="primary" @click="handleOk(1)" >
        上报
      </a-button>

    </template>
    <a-form :layout="formLayout" :form="form">
      <a-form-item label="id" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="false">
        <a-input v-decorator="['id', {}]" />
      </a-form-item>
      <a-form-item label="标题" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input :disabled="modalData.disabled" v-decorator="['title', {}]" />
      </a-form-item>
      <a-form-item label="上报人" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
        <a-tree-select
          :disabled="modalData.disabled"
          v-decorator="['reportor', {}]"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="personTreeData"
          placeholder
          tree-default-expand-all
        ></a-tree-select>
      </a-form-item>
      <!-- <a-form-item label="上报时间" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input :disabled="true" v-decorator="['reportTime', {}]" />
      </a-form-item> -->
      <a-form-item label="处置时限" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
        <a-input :disabled="modalData.disabled" v-decorator="['limittimes', {}]" />
      </a-form-item>
      <a-form-item
        label="备注"
        :label-col="{span: 3}"
        :wrapper-col="{span: 21}"
        style="width: 735px"
      >
        <a-textarea
          :disabled="modalData.disabled"
          v-decorator="['caseDesc', { rules: [{ required: true, message: '备注必填！' }] }]"
          :auto-size="{ minRows: 2, maxRows: 6 }"
        />
      </a-form-item>

      <a-form-item label="公司" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
        <a-select
          :disabled="modalData.disabled"
          show-search
          placeholder=""
          option-filter-prop="children"
          style="width: 200px"
          :filter-option="filterOption"
          v-decorator="['companyId', {}]" 
        >
          <a-select-option v-for="(companyManage) in companyManageDataList" :key="companyManage.id" :value="companyManage.id" >
            {{companyManage.companyName}}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="所属网格" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
        <a-select
          :disabled="modalData.disabled"
          show-search
          placeholder=""
          option-filter-prop="children"
          style="width: 200px"
          :filter-option="filterOption"
          v-decorator="['gridId', {}]" 
        >
          <a-select-option v-for="(grid) in gridDataList" :key="grid.id" :value="grid.id" >
            {{grid.gridName}}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="位置描述"
        :label-col="{span: 3}"
        :wrapper-col="{span: 21}"
        style="width: 735px"
      >
        <a-textarea
          :disabled="modalData.disabled"
          v-decorator="['locationDesc', { rules: [{ required: true, message: '位置描述必填！' }] }]"
          :auto-size="{ minRows: 2, maxRows: 6 }"
        />
      </a-form-item>


      <!-- <a-form-item
        label="附件上传"
        :label-col="{span: 3}"
        :wrapper-col="{span: 21}"
        style="width: 735px"
      >
        <a-upload
          name="file"
          :action="BASE_URL+'/upload'"
          :multiple="true"
          :file-list="fileList"
          :remove="handleRemove"
          @change="handleFileChange"
        >
          <a-button>
            <a-icon type="upload" />附件上传
          </a-button>
        </a-upload>
      </a-form-item> -->
      <a-form-item
        label="图片上传"
        :label-col="{span: 3}"
        :wrapper-col="{span: 21}"
        style="width: 735px"
      >
        <a-upload
          :disabled="modalData.disabled"
          name="avatar"
          :action="BASE_URL+'/upload-avatar'"
          :multiple="true"
          list-type="picture-card"
          :file-list="imageList"
          @preview="handlePreview"
          @change="handleImageChange"
        >
          <a-icon type="plus" />
          <div class="ant-upload-text">上传图片</div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handlePreviewCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
const BASE_URL = process.env.NODE_ENV === 'production' ? '' : '/api'
import {gridCommunityList} from '@/api/gridCommunity'
import { companyManageList } from '@/api/companyManage'
import { getSubCompanyTree, getSubCompanyUserTree } from '@/api/manage'
import { caseInfoCityPost, caseInfoCityPut, caseInfoFileCityDelete, caseInfoCityList } from '@/api/case'
import qs from 'qs'
import moment from 'moment'
import { mapGetters } from 'vuex'
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['modalData'],
  data () {
    return {
      BASE_URL: BASE_URL,
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      },
      formLayout: 'inline',
      confirmLoading: false, 
 
      deptTreeData: [],
      personTreeData: [],
       
      previewVisible: false,
      previewImage: '',
      imageList: [],
      fileList: [],
      reportImageList: [],
      reportFileList: [],   
      gridDataList: [],
      companyManageDataList: []
 
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    modalData (modalData) {
      this.form.resetFields()
      if (modalData.visible === true) {
        this.$nextTick(() => {
          // 重置数据
          var fileName = this.modalData.record.fileName
          var filePath = this.modalData.record.filePath

          this.imageList = []
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
              this.imageList.push(obj)
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
  },
  created () {
    this.getSubCompanyUserTree()
    this.gridList()
    this.companyManageList()
  },
  methods: {
    dateFormat (time) {
        var date = new Date(time)
        var year = date.getFullYear()
      /* 在日期格式中，月份是从0开始的，因此要加0
        * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
        * */
        var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        // 拼接
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
    },
    handleOk (status) {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          Object.assign(values, {
            reportTime: this.dateFormat(new Date()),
            status: status
          })
          var filePath = []
          var fileName = []
          this.imageList.forEach(file => {
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
          var api = values.id === undefined ? caseInfoCityPost : caseInfoCityPut
          api(values)
            .then((res) => {
              this.$emit('handleModalEvent', res)
              this.handleCancel()
            })
            .catch((err) => {
            })
        }
      })
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
    },
    companyManageList() {
      companyManageList()
        .then((res) => {
          this.companyManageDataList = res.result.data
        })
        // eslint-disable-next-line handle-callback-err
        .catch((err) => {
          // Do something
        })
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    handleCancel () {
      this.modalData.visible = false
    },
    handlePreviewCancel () {
      this.previewVisible = false
    },
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleImageChange ({ fileList }) {
      this.imageList = fileList
    },
    handleFileChange ({ fileList }) {
      this.fileList = fileList
    },
    handleRemove (obj) {
      var id = obj.response.result.id
      if (id !== undefined) {
        caseInfoFileCityDelete(qs.stringify({ id: id }))
          .then(res => {
            if (res.code === 200) {
              //
            }
          })
          .catch(() => {})
      }
    },
    getSubCompanyUserTree () {
      getSubCompanyUserTree()
        .then(res => {
          if (res.code === 200) {
            this.personTreeData = res.result
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-form-item {
  width: 360px;
}

.search {
  background: white;
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px;
  width: 216px;
}
.search span {
  font-weight: bold;
}
.position {
  background: white;
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 10px;
}
.position span{
  font-weight: bold;
}
.position .line {
  height: 10px;
}
</style>
