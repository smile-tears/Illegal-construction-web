<template>
  <a-modal
    :title="modalData.title"
    :width="800"
    :visible="modalData.visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    :destroyOnClose="true"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <a-button @click="handleCancel" >
        取消
      </a-button>
      <a-button v-if="!isView" type="primary" @click="handleOk">
        提交
      </a-button>
    </template>

    <div class="caseDetailTitle">基础信息</div>
    <a-card :bordered="false">
      <detail-list :col="2">
        <detail-list-item term="案件编号">{{modalData && modalData.record && modalData.record.caseNo}}</detail-list-item>
        <detail-list-item term="案件来源">{{modalData && modalData.record && modalData.record.casesource}}</detail-list-item>
        <detail-list-item term="案件类型">{{modalData && modalData.record && modalData.record.caseType}}</detail-list-item>
        <detail-list-item term="所属网格">{{modalData && modalData.record && modalData.record.gridName}}</detail-list-item>
        <detail-list-item term="责任部门">{{modalData && modalData.record && modalData.record.managerDept}}</detail-list-item>
        <detail-list-item term="责任人">{{modalData && modalData.record && modalData.record.name}}</detail-list-item>
        <detail-list-item term="样本">{{modalData && modalData.record && modalData.record.sampleName}}</detail-list-item>
        <detail-list-item term="处置时限">{{modalData && modalData.record && modalData.record.limittimes}}</detail-list-item>
        <detail-list-item term="案件计数">{{modalData && modalData.record && modalData.record.casecount}}</detail-list-item>
        <detail-list-item term="上报人">{{modalData && modalData.record && modalData.record.reportor}}</detail-list-item>
        <detail-list-item term="联系方式">{{modalData && modalData.record && modalData.record.contract}}</detail-list-item>
        <detail-list-item term="上报时间">{{modalData && modalData.record && modalData.record.reporTime}}</detail-list-item>
        <detail-list-item term="标记">{{modalData && modalData.record && modalData.record.mark}}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="案件描述">{{modalData && modalData.record && modalData.record.caseDesc}}</detail-list-item>
        <!--<detail-list-item term="经纬度">{{modalData && modalData.record && modalData.record.lng}}-{{modalData && modalData.record && modalData.record.lat}}</detail-list-item>-->
        <detail-list-item term="位置描述">{{modalData && modalData.record && modalData.record.locationDesc}}</detail-list-item>
      </detail-list>
    </a-card>

    <div v-if="!isView && this.modalData.seen" class="caseDetailTitle">案件处置</div>
    <a-form v-if="!isView && this.modalData.seen" :layout="formLayout" :form="form">
      <!--<a-form-item label="id" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="false">-->
        <!--<a-input :disabled="modalData.disabled" v-decorator="['id', {}]" />-->
      <!--</a-form-item>-->


      <a-form-item label="主办人" v-if="this.modalData && this.modalData.selectTab && this.modalData.selectTab.status==2" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-tree-select
          v-decorator="['suggest.sponsor', { rules: [{ required: true, message: '主办人必填！' }] }]"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="personTreeData"
          placeholder
          tree-default-expand-all
        ></a-tree-select>
      </a-form-item>
      <a-form-item label="协办人" v-if="this.modalData && this.modalData.selectTab && this.modalData.selectTab.status==2" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-tree-select
          v-decorator="['suggest.coOrganizer', {}]"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="personTreeData"
          placeholder
          tree-default-expand-all
        ></a-tree-select>
      </a-form-item>
      <a-form-item label="处理" :label-col="{span: 3}" :wrapper-col="{span: 21}" style="width: 735px">
        <a-select
            v-decorator="['suggest.result', { rules: [{ required: true, message: '处理必填！' }] }]"
            @change="changeResult">
          <a-select-option v-for="(option, index) in ( modalData && modalData.selectTab && this.modalData.selectTab.options)" :value="`${option.value}`">
            {{option.label}}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="核查人" v-if="modalData && modalData.selectTab && this.modalData.selectTab.status==4 && this.suggest.result==5"
                   :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-tree-select
          v-decorator="['suggest.verifier', { rules: [{ required: true, message: '核查人必填！' }] }]"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="personTreeData"
          placeholder
          tree-default-expand-all
        ></a-tree-select>
      </a-form-item>

      <a-form-item label="延期时间" v-if="this.suggest.result==8"
                   :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-date-picker  show-time v-decorator="['suggest.enddate', { rules: [{ required: true, message: '延期时间必填！' }] }]" placeholder="请输入延期时间" style="width: 100%"/>
      </a-form-item>

      <a-form-item label="留言内容" :label-col="{span: 3}" :wrapper-col="{span: 21}" style="width: 735px">
        <a-input
          v-decorator="['suggest.idea', {}]"
          type="textarea" />
      </a-form-item>
      <a-form-item
        label="附件上传"
        :label-col="{span: 3}"
        :wrapper-col="{span: 21}"
        style="width: 735px"
      >
        <a-upload
          name="file"
          :action="BASE_URL+'/upload'"
          :multiple="true"
          :file-list="suggest.fileList"
          :remove="handleRemove"
          @change="handleFileChange"
        >
          <a-button>
            <a-icon type="upload" />附件上传
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item
        label="图片上传"
        :label-col="{span: 3}"
        :wrapper-col="{span: 21}"
        style="width: 735px"
      >
        <a-upload
          name="avatar"
          :action="BASE_URL+'/upload-avatar'"
          :multiple="true"
          list-type="picture-card"
          :file-list="suggest.imageList"
          :remove="handleRemove"
          @preview="handlePreview"
          @change="handleImageChange"
        >
          <div v-if="suggest.imageList.length < 8">
          <a-icon type="plus" />
          <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handlePreviewCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </a-form-item>
    </a-form>


    <div class="caseDetailTitle">案件流程</div>
    <a-card :bordered="false">
      <detail-list :col="1">
        <a-timeline>
          <a-timeline-item v-for="(option, index) in this.requestLogs" color="green">
            <p>操作人：{{option.operator}}</p>
            <p>操作步骤：{{statusObj[option.status]}}</p>
            <p>操作意见：{{option.idea}}</p>
            <p>操作时间：{{option.operatetime}}</p>
            <p v-if="option.status==2">主办人：{{option.sponsor}}</p>
            <p v-if="option.status==2">协办人：{{option.coOrganizer}}</p>
            <p v-if="option.status==4">核查人：{{option.verifier}}</p>
            <p v-if="option.result==8">延期时间：{{option.enddate}}</p>
            <p>
              <a-upload
                name="file"
                :action="BASE_URL+'/upload'"
                :multiple="true"
                :disabled="true"
                :file-list="option.fileList"
                :remove="handleRemove"
                @change="handleFileChange"
              >
              </a-upload>
            </p>
            <p>
              <a-upload
                name="avatar"
                :action="BASE_URL+'/upload-avatar'"
                :multiple="true"
                :disabled="true"
                list-type="picture-card"
                :file-list="option.imageList"
                :remove="handleRemove"
                @preview="handlePreview"
                @change="handleImageChange"
              >
              </a-upload>
            </p>
          </a-timeline-item>
        </a-timeline>
      </detail-list>
    </a-card>

  </a-modal>
</template>

<script>
const BASE_URL = process.env.NODE_ENV === 'production' ? '' : '/api'
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item
import { getSubCompanyUserTree } from '@/api/manage'
import { caseInfoRequestLogCityList,caseInfoRequestLogCityPost, caseInfoRequestLogCityPut } from '@/api/case'
import caseConfig from '@/api/caseConfig'
const statusObj = caseConfig.caseStatusObj
import Timeline from 'ant-design-vue/es/timeline'
import 'ant-design-vue/es/timeline/style/index.less'
import qs from 'qs'
import moment from 'moment'
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
  components : {
    'a-timeline':Timeline,
    'a-timeline-item':Timeline.Item,
    DetailList,
    DetailListItem
  },
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
      isView: false,
      formLayout: 'inline',
      confirmLoading: false,
      previewVisible: false,
      previewImage: '',
      personTreeData: [],
      statusObj:[],
      requestLogs: [],
      imageList: [],
      fileList: [],

      suggest:{
        idea:"",
        result:"",
        fileList:[],
        imageList: []
      }
    }
  },
  watch: {
    modalData (modalData) {
      var _this = this
      this.form.resetFields()
      if (modalData.visible === true) {
        this.$nextTick(() => {

          console.log('this.modalData.selectTab',this.modalData.selectTab)
          this.modalData.record.mark = (this.modalData.record.importantCase===0?"重大案件":"") +"-"+(this.modalData.record.repeatCase===0?"重复案件":"")

          //如果是分派，主办人默认上报人
          if(this.modalData.record.status == 2){
            this.suggest.sponsor = this.modalData.record.reportorId
            this.$nextTick(() => {
              this.form.setFieldsValue({
                suggest:{
                  sponsor:this.modalData.record.reportorId
                }
              })
            })
          }

          _this.isView= false
          if (this.modalData.record.status == 3 || this.modalData.record.status==5){
            if( !this.modalData.selectTab.options){//只查看详情
              _this.isView= true
            }
            var params = {
              id: this.modalData.record.requestLogId2,
              receivetime: moment().format('YYYY-MM-DD HH:mm:ss')
            }
            caseInfoRequestLogCityPut(params)
              .then(res => {
                console.log("caseInfoRequestLogCityPut",params)
              })
          }
//          var files = this.modalData.record.files
//          this.fileList = []
//          this.imageList = []
//          if (files) {
//            files.forEach(file => {
//              var obj = {
//                uid: file.id,
//                name: file.fileName,
//                status: 'done',
//                url: '/api' + file.url,
//                thumbUrl: '/api' + file.thumbUrl,
//                response: {
//                  result: file
//                }
//              }
//              if (file.fileType === 0) {
//                this.fileList.push(obj)
//              } else {
//                this.imageList.push(obj)
//              }
//            })
//          }

          var param = {}
          if (this.modalData.record.id) param.caseid = this.modalData.record.id
          caseInfoRequestLogCityList( qs.stringify(param) )
            .then(res => {
              var requestLogs = res.result.data
              _this.requestLogs = requestLogs
              if(requestLogs && requestLogs.length > 0){
                requestLogs.forEach(requestLog => {
                  var files = requestLog.files
                  requestLog.fileList = []
                  requestLog.imageList = []
                  if (files) {
                    files.forEach(file => {
                      var obj = {
                        uid: file.id,
                        name: file.fileName,
                        status: 'done',
                        url: BASE_URL + file.url,
                        thumbUrl: BASE_URL + file.thumbUrl,
                        response: {
                          result: file
                        }
                      }
                      if (file.fileType === 0) {
                        requestLog.fileList.push(obj)
                      } else {
                        requestLog.imageList.push(obj)
                      }
                    })
                  }
                })
              }

            })
            .catch(() => {})

        })
      }

    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
    // console.log('form::', this.form)
  },
  created () {
    this.statusObj = statusObj
    this.getSubCompanyUserTree()
    this.initData()
    var _this = this
    _this.isView= false
    if (this.modalData.record && (this.modalData.record.status == 3 || this.modalData.record.status==5)){
      if( !this.modalData.selectTab.options){//只查看详情
        _this.isView= true
      }
    }
  },
  methods: {
    initData () {
      this.suggest = {
        idea:"",
        result:"",
        fileList:[],
        imageList: []
      }
    },
    handleOk () {
      var _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
//        if (( (status === 1 || status === 2) && !err) || status === 0 || status === -1) {

        values.suggest.caseid = _this.modalData.record.id
        if(this.modalData.record.status == 3 || this.modalData.record.status == 5){
          values.suggest.id = _this.modalData.record.requestLogId2
        }
        values.suggest.status = _this.modalData.selectTab.status

        if(values.suggest.enddate){
          values.suggest.enddate = values.suggest.enddate.format('YYYY-MM-DD HH:mm:ss')
        }

        // 整理附件
        var list = []
        _this.suggest.fileList.forEach(element => {
          if (element.response) list.push(element.response.result)
        })
        // 整理图片
        _this.suggest.imageList.forEach(element => {
          if (element.response) list.push(element.response.result)
        })
        values.suggest.files = list
        caseInfoRequestLogCityPost(values.suggest)
          .then(res => {
            this.$emit('handleModalEvent', res)
            this.handleCancel()
          })
          .catch(() => {})
//        }
      })
    },
    getSubCompanyUserTree () {
      getSubCompanyUserTree()
        .then(res => {
          if (res.code === 200) {
            this.personTreeData = res.result
          }
        })
        .catch(() => {})
    },
    handleCancel () {
      this.close()
      this.initData()
    },
    close (){
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
      this.suggest.imageList = fileList
    },
    handleFileChange ({ fileList }) {
      this.suggest.fileList = fileList
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
    changeResult(selectedKey, node){
      this.suggest.result = selectedKey
      if( selectedKey == 5 ){
        this.suggest.verifier = this.modalData.record.reportorId
        this.$nextTick(() => {
          this.form.setFieldsValue({
            suggest:{
              verifier:this.modalData.record.reportorId
            }
          })
        })

      }
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

.caseDetailTitle {
  background: #f0f2f5;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  padding: 10px 24px;
}

/*.ant-modal-wrap{*/
/*overflow: hidden;*/
/*}*/
/*.ant-modal-content{*/
/*overflow: auto;*/
/*height: 700px;*/
/*}*/

</style>
