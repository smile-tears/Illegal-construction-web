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
        <a-form-item label="经度" :label-col="labelCol" :wrapper-col="wrapperCol" >
          <a-input :disabled="modalData.disabled" v-decorator="['lng', {}]" style="width: 110px" />
          <span style="margin-left: 10px">纬度：</span>
          <a-input :disabled="modalData.disabled" v-decorator="['lat', {}]" style="width: 110px" />
          <a-button v-if="!modalData.disabled" @click="selectPosition" style="margin-left: 10px">位置</a-button>
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
      gridDataList: [],
      mapVisible: false
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

<style lang="less" scoped>
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

