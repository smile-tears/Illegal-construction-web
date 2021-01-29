<template>
  <a-modal
    v-if="modalData.title !== undefined"
    :title="modalData.title"
    :width="800"
    :visible="modalData.visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <a-button @click="handleCancel"> 取消 </a-button>
      <a-button v-if="!modalData.view && modalData.page == 0" @click="handleOk(0)"> 暂存 </a-button>
      <a-button v-if="!modalData.view && modalData.page == 0" type="primary" @click="handleOk(1)"> 上报 </a-button>
      <a-button v-if="!modalData.view && modalData.page == 1" type="primary" @click="handleOk(2)"> 处置 </a-button>
    </template>

    <a-form :layout="formLayout" :form="form">
      <div>
        <div class="caseDetailTitle">基础信息</div>
        <a-form-item label="id" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="false">
          <a-input v-decorator="['id', {}]" />
        </a-form-item>
        <a-form-item label="标题" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input v-if="!modalData.view && modalData.page == 0" v-decorator="['title', {}]" />
          <span v-if="modalData.view || modalData.page != 0">{{ modalData.record.title }}</span>
        </a-form-item>

        <a-form-item label="被检单位" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-select
            v-if="!modalData.view && modalData.page == 0"
            show-search
            placeholder=""
            option-filter-prop="children"
            :filter-option="filterOption"
            @change="handleCompanyChange"
            v-decorator="['companyId', {}]"
          >
            <a-select-option
              v-for="companyManage in companyManageDataList"
              :key="companyManage.id"
              :value="companyManage.id"
            >
              {{ companyManage.companyName }}
            </a-select-option>
          </a-select>
          <span v-if="modalData.view || modalData.page != 0">{{ modalData.record.companyName }}</span>
        </a-form-item>

        <a-form-item label="一级问题类型" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">

          <span v-if="modalData.view || modalData.page != 0">{{ modalData.record.typeName2 }}</span>
        </a-form-item>

        <a-form-item label="二级问题类型" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">

          <span v-if="modalData.view || modalData.page != 0">{{ modalData.record.typeName }}</span>
        </a-form-item>

        <a-form-item label="其它问题类型" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" style="width: 735px">
          <span v-if="modalData.view || modalData.page != 0">{{ modalData.record.otherQuestionType }}</span>
        </a-form-item>

        <a-form-item label="地址" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" style="width: 735px">
          <a-textarea
            v-if="!modalData.view && modalData.page == 0"
            v-decorator="['locationDesc', { rules: [{ required: true, message: '位置描述必填！' }] }]"
            :auto-size="{ minRows: 2, maxRows: 6 }"
          />
          <span v-if="modalData.view || modalData.page != 0">{{ modalData.record.locationDesc }}</span>
        </a-form-item>

        <a-form-item label="负责人" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-tree-select
            v-if="!modalData.view  && modalData.page == 0"
            show-search
            v-decorator="['manager', {}]"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="personTreeData"
            placeholder
            tree-default-expand-all
          ></a-tree-select>
          <span v-if="modalData.view || modalData.page != 0">{{ modalData.record.manager }}</span>
        </a-form-item>

        <a-form-item label="联系电话" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input
            v-if="!modalData.view && modalData.page == 0"
            v-decorator="[
              'managerMobile',
              {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: '请输入数字！',
                    transform: (value) => {
                      return Number(value)
                    },
                  },
                ],
              },
            ]"
          />
          <span v-if="modalData.view  || modalData.page != 0">{{ modalData.record.managerMobile }}</span>
        </a-form-item>

        <a-form-item label="安全员" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-tree-select
            v-if="!modalData.view  && modalData.page == 0"
            :disabled="true"
            show-search
            v-decorator="['reportor', {}]"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="personTreeData"
            placeholder
            tree-default-expand-all
          ></a-tree-select>
          <span v-if="modalData.view || modalData.page != 0">{{ modalData.record.reportorName }}</span>
        </a-form-item>

        <a-form-item label="联系电话" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input
            v-if="!modalData.view && modalData.page == 0"
            v-decorator="[
              'reportorMobile',
              {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: '请输入数字！',
                    transform: (value) => {
                      return Number(value)
                    },
                  },
                ],
              },
            ]"
          />
          <span v-if="modalData.view  || modalData.page != 0">{{ modalData.record.reportorMobile }}</span>
        </a-form-item>

        <a-form-item label="检查场所" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input  v-if="!modalData.view && modalData.page == 0" v-decorator="['site', {}]"/>
          <span v-if="modalData.view  || modalData.page != 0">{{ modalData.record.site }}</span>
        </a-form-item>

        <!-- <a-form-item label="所属网格" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-select
            v-if="!modalData.view && modalData.page == 0"
            show-search
            placeholder=""
            option-filter-prop="children"
            :filter-option="filterOption"
            v-decorator="['gridId', {}]"
          >
            <a-select-option v-for="grid in gridDataList" :key="grid.id" :value="grid.id">
              {{ grid.gridName }}
            </a-select-option>
          </a-select>
          <span v-if="modalData.view  || modalData.page != 0">{{ modalData.record.gridName }}</span>
        </a-form-item> -->

        <a-form-item label="处置时限" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-input
            v-if="!modalData.view && modalData.page == 0"
            v-decorator="[
              'limittimes',
              {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: '请输入数字！',
                    transform: (value) => {
                      return Number(value)
                    },
                  },
                ],
              },
            ]"
            style="width: 200px"
          />
          <span v-if="modalData.view  || modalData.page != 0">{{ modalData.record.limittimes }}</span>（小时）
        </a-form-item>

        <a-form-item label="经度" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" style="width: 735px">
          <a-input v-if="!modalData.view  && modalData.page == 0" v-decorator="['lng', {}]" style="width: 110px" />
          <span v-if="modalData.view || modalData.page != 0">{{ modalData.record.lng }}</span>
          <span style="margin-left: 10px">纬度：</span>
          <a-input v-if="!modalData.view  && modalData.page == 0" v-decorator="['lat', {}]" style="width: 110px" />
          <span v-if="modalData.view || modalData.page != 0">{{ modalData.record.lat }}</span>
          <a-button v-if="!modalData.view  && modalData.page == 0" @click="selectPosition" style="margin-left: 10px">位置</a-button>
          <a-modal
            title="地图定位"
            :width="1000"
            :visible="mapVisible"
            :maskClosable="false"
            @cancel="
              () => {
                this.mapVisible = false
              }
            "
            @ok="handleMapOk"
            class="mapModal"
          >
            <div id="container1" class="map" style="width: 100%; height: 600px"></div>
            <div class="search">
              <span>请输入关键字：</span> <br />
              <a-input id="tipinput" />
            </div>
            <div class="position">
              <span>经度：</span>
              <a-input v-decorator="['lnglat.lng', {}]" style="width: 140px" />
              <div class="line"></div>
              <span>纬度：</span>
              <a-input v-decorator="['lnglat.lat', {}]" style="width: 140px" />
            </div>
          </a-modal>
        </a-form-item>

        

        <a-form-item label="备注" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" style="width: 735px">
          <a-textarea
            v-if="!modalData.view && modalData.page == 0"
            v-decorator="['caseDesc', { rules: [{ required: true, message: '备注必填！' }] }]"
            :auto-size="{ minRows: 2, maxRows: 6 }"
          />
          <span v-if="modalData.view || modalData.page != 0">{{ modalData.record.caseDesc }}</span>
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
            :file-list="fileList"
            @change="handleFileChange"
          >
            <a-button v-if="!modalData.view && modalData.page == 0">
              <a-icon type="upload" />附件上传
            </a-button>
          </a-upload>
        </a-form-item>

        <a-form-item label="图片上传" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" style="width: 735px">
          <a-upload
            :disabled="modalData.view"
            name="avatar"
            :action="BASE_URL + '/upload-avatar'"
            :multiple="true"
            list-type="picture-card"
            :file-list="imageList"
            @preview="handlePreview"
            @change="handleImageChange"
          >
            <a-icon v-if="!modalData.view && modalData.page == 0" type="plus" />
            <div v-if="!modalData.view && modalData.page == 0" class="ant-upload-text">上传图片</div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handlePreviewCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-form-item>
      </div>
      <div v-if="modalData.page != 0">
        <div class="caseDetailTitle">案件处置</div>
        <a-form-item label="处置结果" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-select
            v-if="!modalData.view"
            show-search
            placeholder=""
            option-filter-prop="children"
            :filter-option="filterOption"
            v-decorator="['handleState', {}]"
          >
            <a-select-option :value="0"> 未处置 </a-select-option>
            <a-select-option :value="1"> 已处置 </a-select-option>
          </a-select>
          <span v-if="modalData.view">{{ modalData.record.handleState === 1 ? '已处置' : '未处置' }}</span>
        </a-form-item>

        <a-form-item label="处置意见" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" style="width: 735px">
          <a-textarea
            v-if="!modalData.view"
            v-decorator="['handleIdea', { rules: [{ required: true, message: '处理意见必填！' }] }]"
            :auto-size="{ minRows: 2, maxRows: 6 }"
          />
          <span v-if="modalData.view">{{ modalData.record.handleIdea }}</span>
        </a-form-item>
        <a-form-item
          label="附件上传"
          :label-col="{span: 3}"
          :wrapper-col="{span: 21}"
          style="width: 735px"
        >
          <a-upload
            :disabled="modalData.view"
            name="file"
            :action="BASE_URL+'/upload'"
            :multiple="true"
            :file-list="fileList2"
            @change="handleFileChange2"
          >
            <a-button v-if="!modalData.view">
              <a-icon type="upload" />附件上传
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="图片上传" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" style="width: 735px">
          <a-upload
            :disabled="modalData.view"
            name="avatar"
            :action="BASE_URL + '/upload-avatar'"
            :multiple="true"
            list-type="picture-card"
            :file-list="imageList2"
            @preview="handlePreview"
            @change="handleImageChange2"
          >
            <a-icon v-if="!modalData.view" type="plus" />
            <div v-if="!modalData.view" class="ant-upload-text">上传图片</div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handlePreviewCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-form-item>
      </div>
    </a-form>
  </a-modal>
</template>

<script>
const BASE_URL = process.env.NODE_ENV === 'production' ? '' : '/api'
import { gridCommunityList } from '@/api/gridCommunity'
import { companyManageList } from '@/api/companyManage'
import { getSubCompanyTree, getSubCompanyUserTree } from '@/api/manage'
import { caseInfoCityPost, caseInfoCityPut, caseInfoFileCityDelete, caseInfoCityList } from '@/api/case'
import qs from 'qs'
import moment from 'moment'
import { mapGetters } from 'vuex'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['modalData'],
  data() {
    return {
      BASE_URL: BASE_URL,
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
      formLayout: 'inline',
      confirmLoading: false,

      deptTreeData: [],
      personTreeData: [],

      previewVisible: false,
      previewImage: '',
      imageList: [],
      fileList: [],
      imageList2: [],
      fileList2: [],
      gridDataList: [],
      companyManageDataList: [],
      mapVisible: false,
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  watch: {
    modalData(modalData) {
      this.form.resetFields()
      if (modalData.visible === true) {
        this.$nextTick(() => {
          // 案件上报
          var imageName = this.modalData.record.imageName
          var imagePath = this.modalData.record.imagePath
          this.imageList = []
          if (imageName && imageName !== '') {
            imageName = imageName.split(',')
            imagePath = imagePath.split(',')
            for (var i = 0; i < imageName.length; i++) {
              var obj = {
                uid: i,
                name: imageName[i],
                status: 'done',
                path: imagePath[i],
                url: BASE_URL + imagePath[i],
              }
              this.imageList.push(obj)
            }
          }
          var fileName = this.modalData.record.fileName
          var filePath = this.modalData.record.filePath
          this.fileList = []
          if (fileName && fileName !== '') {
            fileName = fileName.split(',')
            filePath = filePath.split(',')
            for (var i = 0; i < fileName.length; i++) {
              var obj = {
                uid: i,
                name: fileName[i],
                status: 'done',
                path: filePath[i],
                url: BASE_URL + filePath[i],
              }
              this.fileList.push(obj)
            }
          }

          // 案件处置
          var imageName2 = this.modalData.record.imageName2
          var imagePath2 = this.modalData.record.imagePath2
          this.imageList2 = []
          if (imageName2 && imageName2 !== '') {
            imageName2 = imageName2.split(',')
            imagePath2 = imagePath2.split(',')
            for (var i = 0; i < imageName2.length; i++) {
              var obj = {
                uid: -i,
                name: imageName2[i],
                path: imagePath2[i],
                status: 'done',
                url: BASE_URL + imagePath2[i],
              }
              this.imageList2.push(obj)
            }
          }
          var fileName2 = this.modalData.record.fileName2
          var filePath2 = this.modalData.record.filePath2
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

          if (this.modalData.record.id === undefined) {
            this.form.setFieldsValue({
              reportor: window.sessionStorage.getItem('id'),
              ...this.modalData.record,
            })
          } else {
            this.form.setFieldsValue({ ...this.modalData.record })
          }
        })
      }
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    // console.log('form::', this.form)
  },
  created() {
    this.getSubCompanyUserTree()
    this.gridList()
    this.companyManageList()
  },
  methods: {
    handleCompanyChange(value) {
      this.companyManageDataList.forEach((companyManage) => {
        if (companyManage.id === value && companyManage.grid !== undefined && companyManage.grid !== '') {
          this.form.setFieldsValue({
            gridId: companyManage.grid,
          })
        }
      })
    },
    dateFormat(time) {
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
    selectPosition() {
      this.mapVisible = true
      var that = this
      this.$nextTick(() => {
        // eslint-disable-next-line no-undef
        var config = {
          zoom: 13,
          resizeEnable: true,
        }
        if (that.lnglat && that.lnglat.lng && that.lnglat.lat) config.center = [that.lnglat.lng, that.lnglat.lat]
        // eslint-disable-next-line no-undef
        var map = new AMap.Map('container1', config)
        // 为地图注册click事件获取鼠标点击出的经纬度坐标
        var marker
        var offset = new AMap.Pixel(-13, -30)
        map.on('click', function (e) {
          var lnglat = {
            lng: e.lnglat.getLng(),
            lat: e.lnglat.getLat(),
          }
          that.lnglat = lnglat
          that.form.setFieldsValue({ lnglat: lnglat })
          // 重新添加标记
          if (marker) {
            marker.setMap(null)
            marker = null
          }
          marker = new AMap.Marker({
            icon: '/img/poi-marker-red.png',
            position: [e.lnglat.getLng(), e.lnglat.getLat()],
            offset: offset,
          })
          marker.setMap(map)
        })
        // 初始化标记
        if (that.lnglat && that.lnglat.lng && that.lnglat.lat) {
          marker = new AMap.Marker({
            icon: '/img/poi-marker-red.png',
            position: [that.lnglat.lng, that.lnglat.lat],
            offset: offset,
          })
          marker.setMap(map)
        }
        // 输入提示
        var autoOptions = {
          input: 'tipinput',
        }
        // eslint-disable-next-line no-undef
        AMap.plugin(['AMap.PlaceSearch', 'AMap.AutoComplete'], function () {
          // eslint-disable-next-line no-undef
          var auto = new AMap.AutoComplete(autoOptions)
          // eslint-disable-next-line no-undef
          var placeSearch = new AMap.PlaceSearch({
            map: map,
          }) // 构造地点查询类
          auto.on('select', select) // 注册监听，当选中某条记录时会触发
          function select(e) {
            placeSearch.setCity(e.poi.adcode)
            placeSearch.search(e.poi.name) // 关键字查询查询
          }
        })
      })
    },
    handleMapOk() {
      this.mapVisible = false
      this.form.setFieldsValue(this.lnglat)
    },
    handleOk(status) {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          Object.assign(values, {
            // reportTime: this.dateFormat(new Date()),
            status: status,
          })
          // 案件上报
          var imagePath = []
          var imageName = []
          this.imageList.forEach((file) => {
            var result = null
            if (file.response !== undefined) {
              result = file.response.result
              imagePath.push(result.url)
              imageName.push(result.fileName)
            } else {
              imagePath.push(file.path)
              imageName.push(file.name)
            }
          })
          if (imagePath.length > 0) {
            values.imagePath = imagePath.join(',')
            values.imageName = imageName.join(',')
          }

          var filePath = []
          var fileName = []
          this.fileList.forEach((file) => {
            var result = null
            if (file.response !== undefined) {
              result = file.response.result
              filePath.push(result.url)
              fileName.push(result.fileName)
            } else {
              filePath.push(file.path)
              fileName.push(file.name)
            }
          })
          if (filePath.length > 0) {
            values.filePath = filePath.join(',')
            values.fileName = fileName.join(',')
          }

          // 案件处置
          var imagePath2 = []
          var imageName2 = []
          this.imageList2.forEach((file) => {
            var result = null
            if (file.response !== undefined) {
              result = file.response.result
              imagePath2.push(result.url)
              imageName2.push(result.fileName)
            } else {
              imagePath2.push(file.path)
              imageName2.push(file.name)
            }
          })
          if (imagePath2.length > 0) {
            values.imagePath2 = imagePath2.join(',')
            values.imageName2 = imageName2.join(',')
          }

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
            values.filePath2 = filePath2.join(',')
            values.fileName2 = fileName2.join(',')
          }

          var api = values.id === undefined ? caseInfoCityPost : caseInfoCityPut
          api(values)
            .then((res) => {
              this.$emit('handleModalEvent', res)
              this.handleCancel()
            })
            .catch((err) => {})
        }
      })
    },
    gridList() {
      gridCommunityList()
        .then((res) => {
          if (res.code === 200) {
            this.gridDataList = res.result.data
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch((err) => {
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
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleCancel() {
      this.modalData.visible = false
    },
    handlePreviewCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleImageChange({ fileList }) {
      this.imageList = fileList
    },
    handleImageChange2({ fileList }) {
      this.imageList2 = fileList
    },
    handleFileChange({ fileList }) {
      this.fileList = fileList
    },
    handleFileChange2({ fileList }) {
      this.fileList2 = fileList
    },
    handleRemove(obj) {
      var id = obj.response.result.id
      if (id !== undefined) {
        caseInfoFileCityDelete(qs.stringify({ id: id }))
          .then((res) => {
            if (res.code === 200) {
              //
            }
          })
          .catch(() => {})
      }
    },
    getSubCompanyUserTree() {
      getSubCompanyUserTree()
        .then((res) => {
          if (res.code === 200) {
            this.personTreeData = res.result
          }
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .ant-form-item {
  width: 360px;
}
.caseDetailTitle {
  background: #f0f2f5;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  padding: 10px 24px;
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
.position span {
  font-weight: bold;
}
.position .line {
  height: 10px;
}
</style>
