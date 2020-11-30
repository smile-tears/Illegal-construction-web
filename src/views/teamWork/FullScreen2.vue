<template>
  <a-row id="fullContainer" :gutter="8">
    <a-col :span="7">
      <div>
        <a-row :gutter="24">
          <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '24px' }">
            <chart-card
              :loading="loading"
              :hasFooter="false"
              :divHeight="0"
              title="今日上报数"
              :total="reportData['今日上报数'] | NumberFormat"
            >
              <a-tooltip title="指标说明" slot="action">
                <a-icon type="info-circle-o" />
              </a-tooltip>
              <!--<div>-->
              <!--<span slot="term">自采案件</span>-->
              <!--<span slot="term">{{0 | NumberFormat}}</span>-->
              <!--</div>-->
              <!--<div>-->
              <!--<span slot="term">市局下派</span>-->
              <!--<span slot="term">{{0 | NumberFormat}}</span>-->
              <!--</div>-->
            </chart-card>
          </a-col>
          <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '24px' }">
            <chart-card
              :loading="loading"
              :hasFooter="false"
              :divHeight="0"
              title="今日处置数"
              :total="reportData['今日处置数'] | NumberFormat"
            >
              <a-tooltip title="指标说明" slot="action">
                <a-icon type="info-circle-o" />
              </a-tooltip>
              <!--<div>-->
              <!--<span slot="term">自采案件</span>-->
              <!--<span slot="term">{{0 | NumberFormat}}</span>-->
              <!--</div>-->
              <!--<div>-->
              <!--<span slot="term">市局下派</span>-->
              <!--<span slot="term">{{0 | NumberFormat}}</span>-->
              <!--</div>-->
            </chart-card>
          </a-col>
        </a-row>
      </div>

      <a-card>
        <a-table
          rowKey="id"
          :columns="columns"
          :data-source="userListData"
          :style="{ height: getHeight2 }"
          :pagination="{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            'show-size-changer': true,
          }"
          @change="change"
        >
          <span slot="action" slot-scope="text, record">
            <!--<a @click="callVideo(record)">视频通话</a>-->
            <a-tooltip @click="callVideo(record)" title="视频通话">
              <a-icon type="audio" />
            </a-tooltip>

            <a-tooltip @click="queryCompanyList(record)" title="公司列表" style="padding-left: 10px">
              <a-icon type="search" />
            </a-tooltip>
          </span>
        </a-table>
      </a-card>
    </a-col>

    <a-col :span="17">
      <a-card :bordered="false">
        <div>
          <div id="container" style="width: 100%; min-height: 500px" :style="{ height: getHeight }"></div>

          <!--<div class="input-card" style="width: 120px">-->
          <!--<button class="btn" @click="createPolygon()" style="margin-bottom: 5px">新建</button>-->
          <!--<button class="btn" @click="closePolygon()">结束编辑</button>-->
          <!--<button class="btn" @click="clearPolygon()">清除选中覆盖物</button>-->
          <!--<button class="btn" @click="getPath()">获取坐标数组</button>-->

          <!--</div>-->
        </div>
      </a-card>
    </a-col>



    <div id="amapContainer" class="input-card" style="width: 320px">
      <div class="input-item" style="width: 110px">
        <input
          type="button"
          class="btn"
          value="开启未处置案件"
          :hidden="!showUndealCase"
          id="startUnDealCase"
          @click="loadUndealCase()"
        />
        <input
          type="button"
          class="btn"
          value="关闭未处置案件"
          :hidden="showUndealCase"
          id="stopUnDealCase"
          @click="closeUndealCase()"
        />
      </div>
      <div class="input-item" style="width: 100px">
        <input
          type="button"
          class="btn"
          value="开启人员定位"
          :hidden="!showPerson"
          id="startPerson"
          @click="loadUserPosition()"
        />
        <input
          type="button"
          class="btn"
          value="关闭人员定位"
          :hidden="showPerson"
          id="stopPerson"
          @click="closeUserPosition()"
        />
      </div>
      <div class="input-item" style="width: 80px">
        <input type="button" class="btn" value="人员轨迹" id="personHis" @click="showTracking()" />
      </div>
      <!--<a-icon v-if="!isFullScreen" type="fullscreen" :style="{ fontSize: '30px'}" @click="fullScreen()"/>-->
      <!--<a-icon v-else type="fullscreen-exit" :style="{ fontSize: '30px'}"  @click="exitFullScreen()"/>-->
    </div>

    <CompanyListModel :modalData="modalData1"></CompanyListModel>
    <Trajectory :modalData="modalData3"></Trajectory>
  </a-row>
</template>
<style>
#fullContainer:fullscreen {
  width: 100vw;
  height: 100vh;
  background: grey;
}

#amapContainer {
  position: absolute;
  bottom: initial;
  right: 0rem;
  top: 0rem;
  display: inline-block;
}
#amapContainer > .input-item{
  float:left;
}

#amapContainer > .input-item > .btn {
  margin: auto;
}


</style>
<script>
//import AMap from 'AMap'
import { ChartCard } from '@/components'
import RegisterList from './register/List'
import CompanyListModel from './CompanyListModel'
import Trajectory from '@/views/appMaintainSystem/case/Trajectory'

import { gridCommunityList, jPush } from '@/api/gridCommunity'
import { caseReport, caseInfoFind2, userList, userPosition, companyByUser } from '@/api/case'
import qs from 'qs'
import Vue from 'vue/dist/vue.esm.js'
import config from '@/config/defaultSettings'
import { STable } from '@/components'

export default {
  components: {
    RegisterList,
    STable,
    ChartCard,
    CompanyListModel,
    Trajectory,
  },
  name: 'FullScreen',
  data() {
    return {
      el: null,
      map: null,
      polyEditor: null,
      polygon: null,
      grids: [],
      //        gridCommunitys:[],
      //        companyManages:[],
      divHeight: 787,
      isFullScreen: false,
      markerArr: [],
      reportData: {
        今日上报数: 0,
        今日待处置数: 0,
        今日处置数: 0,
      },

      infoWindow: null,
      undealCase: [], //未处置事件
      unDealPoint: [],
      showUndealCase: true,
      unDealCluster: null,
      userPositions: [], //当前人员点位
      showPerson: true,
      personCluster: null,

      userListData: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },

      loading: true,

      modalData1: {},
      modalData2: {},
      modalData3: {},

      columns: [
        {
          title: '网格',
          dataIndex: 'gridName',
          key: 'gridName',
          align: 'center',
          width: 100,
        },
        {
          title: '负责人',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          width: 100,
        },
        {
          title: '电话',
          key: 'telephone',
          dataIndex: 'telephone',
          align: 'center',
          width: 120,
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 80,
          scopedSlots: { customRender: 'action' },
        },
      ],
    }
  },
  computed: {
    // 滚动区高度
    // (业务需求：手机屏幕高度减去头部标题和底部tabbar的高度，当然这2个高度也是可以动态获取的)
    getHeight: function () {
      return this.divHeight + 'px'
    },
    getHeight2: function () {
      return this.divHeight - 135 + 'px'
    },
  },
  mounted() {
    //      this.initCaseReportData()
    //      this.amapView()
    window.onresize = () => {
      //只要窗口高度发生变化，就会进入这里面，在这里就可以写，回到聊天最底部的逻辑
      //        console.log('document.body.clientHeight ',document.body.clientHeight )
      //        console.log(this.divHeight,window.screen.height)
      if (document.body.clientHeight !== window.screen.height) {
        this.isFullScreen = false
      } else {
        this.isFullScreen = true
      }
    }
  },
  created() {
    this.loadData()
    this.loadUser()
    this.loadCaseReport()
    setTimeout(() => {
      this.loading = !this.loading
    }, 100)
  },
  methods: {
    amapView() {
      var _this = this

      this.el = document.getElementById('fullContainer')
      //        this.divHeight =  document.body.clientHeight-200

      //        this.divHeight = 780;
      if (this.map) this.map.destroy()
      const map = new AMap.Map('container', {
        zoom: 14,
        //          center:[118.76979, 32.066336]
        //          center:[120.299768,31.575841]
        center: [120.284693, 31.688431],
      })

      //        map.setFitView()
      this.map = map

      this.loadUndealCase();
      //        this.polyEditor = polyEditor
    },

    callVideo(record) {
      var _config = config;
      var result = this.pushMobile(record.id,function () {
        window.open(_config.chatUrl, 'chat', null, null)
      })
    },
    pushMobile(id,successFunc) {
      jPush(id)
        .then((res) => {
          if (res.result != '0') {
            this.$message.error('推送手机消息失败，错误信息：'+res.result);
          } else {
            this.$message.success('推送手机消息成功');
            successFunc();
          }
        })
        .catch(() => {})
    },
    queryCompanyList(record) {
      var _this = this
      var userId = record.id

      this.modalData1 = {
        record: { safetyOffice: userId },
        visible: true,
        disabled: false,
        title: '负责单位列表（' + record.username + '）',
      }
    },

    loadData() {
      var _this = this

      var info = []
      //        info.push("<div class='input-card content-window-card'><div><img style=\"float:left;width:67px;height:16px;\" src=\" https://webapi.amap.com/images/autonavi.png \"/></div> ");
      //        info.push("<div style=\"padding:7px 0px 0px 0px;\"><h4>高德软件</h4>");
      //        info.push("<p class='input-item'>电话 : 010-84107000   邮编 : 100102</p>");
      //        info.push("<p class='input-item'>地址 :北京市朝阳区望京阜荣街10号首开广场4层</p></div></div>");
      var infoWindow = new AMap.InfoWindow({
        content: info.join(''), //使用默认信息窗体框样式，显示信息内容
      })
      _this.infoWindow = infoWindow

      setTimeout(function () {
        _this.amapView()
      }, 100)
    },

    _renderClusterMarker: function (context) {
      var count = this.unDealPoint.length
      var factor = Math.pow(context.count / count, 1 / 18)
      var div = document.createElement('div')
      var Hue = 180 - factor * 180
      var bgColor = 'hsla(' + Hue + ',100%,40%,0.7)'
      var fontColor = 'hsla(' + Hue + ',100%,90%,1)'
      var borderColor = 'hsla(' + Hue + ',100%,40%,1)'
      var shadowColor = 'hsla(' + Hue + ',100%,90%,1)'
      div.style.backgroundColor = bgColor
      var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20)
      div.style.width = div.style.height = size + 'px'
      div.style.border = 'solid 1px ' + borderColor
      div.style.borderRadius = size / 2 + 'px'
      div.style.boxShadow = '0 0 5px ' + shadowColor
      div.innerHTML = context.count
      div.style.lineHeight = size + 'px'
      div.style.color = fontColor
      div.style.fontSize = '14px'
      div.style.textAlign = 'center'
      context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
      context.marker.setContent(div)
    },
    _renderMarker2: function (context) {
      var _this = this
      var map = this.map
      var content =
        '<div style="background-color: hsla(180, 100%, 50%, 0.3); height: 18px; width: 18px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 3px;"></div>'
      var offset = new AMap.Pixel(-9, -9)
      var data = context.data[0]
      context.marker.setContent(content)
      context.marker.setOffset(offset)
      context.marker.on('click', function (e) {
        console.log('e:', e)

        var infoWindow = _this.infoWindow
        var info = []
        info.push('<div style="padding:7px 0px 0px 0px;"><h4>人员（' + data.name + '）</h4>')
        info.push("<a class='btn' @click='callVedio(\"" + data.userid + '")\'>视频通话</a>')
        info.push('</div>')

        let InfoContent = Vue.extend({
          template: info.join(''),
          methods: {
            callVedio(managerId) {
              _this.pushMobile(managerId,function () {
                window.open(config.chatUrl, 'chat', null, null)
              })
            },
          },
        })
        let component = new InfoContent().$mount()

        infoWindow.setContent(component.$el)
        infoWindow.open(
          map,
          context.marker.getPosition(data.lnt, data.lat) // 窗口信息的位置
        )
      })
    },

    //未处置事件marker
    _renderMarker: function (context) {
      var _this = this
      var map = this.map
//      var content =
//        '<div style="background-color: hsla(348,100%,62%,0.3); height: 18px; width: 18px; border: 1px solid hsl(357,67%,48%); border-radius: 12px; box-shadow: hsl(351,100%,67%) 0px 0px 3px;"></div>'
      var content = '<div style="background: url(http://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png); background-size:cover; height: 30px; width: 20px;"></div>';
      var offset = new AMap.Pixel(-9, -9)
      var data = context.data[0]
      context.marker.setContent(content)
      context.marker.setOffset(offset)
      context.marker.on('click', function (e) {
        var infoWindow = _this.infoWindow
        var info = []
        info.push('<div style="padding:7px 0px 0px 0px;">');
        info.push('<h4>基础信息</h4>');
        if(data.title)info.push("<p class='input-item'>标题：" + data.title + '</p>');
        if(data.companyName)info.push("<p class='input-item'>被检测单位：" + data.companyName + '</p>');
        info.push("<p class='input-item'>安全员：" + data.reportorName + "<a class='btn' @click='callVedio(\"" + data.reportor + '")\'>视频通话</a>' + '</p>');
        if(data.locationDesc)info.push("<p class='input-item'>地址：" + data.locationDesc + '</p>');
        if(data.manager)info.push("<p class='input-item'>负责人：" + data.manager + '</p>');
        if(data.managerMobile)info.push("<p class='input-item'>联系电话：" + data.managerMobile + '</p>');
        info.push("</div>");

        let InfoContent = Vue.extend({
          template: info.join(''),
          methods: {
            callVedio(managerId) {
              _this.pushMobile(managerId,function () {
                window.open(config.chatUrl, 'chat', null, null)
              })
            },
          },
        })
        let component = new InfoContent().$mount()

        infoWindow.setContent(component.$el)
        infoWindow.open(
          map,
          context.marker.getPosition(data.lnt, data.lat) // 窗口信息的位置
        )
      })
    },

    loadCaseReport() {
      caseReport()
        .then((res) => {
          if (res.code === 200) {
            this.reportData = res.result
          }
        })
        .catch((err) => {
          // Do something
        })
    },

    closeUndealCase() {
      this.showUndealCase = true
      if (this.unDealCluster) {
        this.unDealCluster.setMap(null)
        this.unDealCluster = null
      }
    },
    loadUndealCase() {
      var _this = this
      _this.showUndealCase = false
      const gridSize = 60

      caseInfoFind2(qs.stringify({ status: 1 }))
        .then((res) => {
          if (res.code === 200) {
            _this.undealCase = res.result.data
            var points = [],
              markers = []

            for (var i in _this.undealCase) {
              var point = JSON.parse(JSON.stringify(_this.undealCase[i]))
              if (point.lng && point.lat) {
                point['weight'] = 1
                point['lnglat'] = [point.lng, point.lat]
                points.push(point)
              }
            }

            _this.unDealPoint = points

            var cluster
            var map = _this.map
            //添加聚合组件
            cluster = new AMap.MarkerClusterer(map, points, {
              gridSize: gridSize,
//              styles: styles
              renderClusterMarker: _this._renderClusterMarker, // 自定义聚合点样式
              renderMarker: _this._renderMarker, // 自定义非聚合点样式
            })
            _this.unDealCluster = cluster
            //              map.setFitView();
          }
        })
        .catch((err) => {
          // Do something
        })
    },


    closeUserPosition() {
      this.showPerson = true
      if (this.personCluster) {
        this.personCluster.setMap(null)
        this.personCluster = null
      }
    },

    loadUserPosition() {
      var _this = this
      _this.showPerson = false
      const gridSize = 60

      var styles = [
        {
          url: 'https://a.amap.com/jsapi_demos/static/images/blue.png',
          size: new AMap.Size(32, 32),
          offset: new AMap.Pixel(-16, -16),
        },
        {
          url: 'https://a.amap.com/jsapi_demos/static/images/green.png',
          size: new AMap.Size(32, 32),
          offset: new AMap.Pixel(-16, -16),
        },
        {
          url: 'https://a.amap.com/jsapi_demos/static/images/orange.png',
          size: new AMap.Size(36, 36),
          offset: new AMap.Pixel(-18, -18),
        },
        {
          url: 'https://a.amap.com/jsapi_demos/static/images/red.png',
          size: new AMap.Size(48, 48),
          offset: new AMap.Pixel(-24, -24),
        },
        {
          url: 'https://a.amap.com/jsapi_demos/static/images/darkRed.png',
          size: new AMap.Size(48, 48),
          offset: new AMap.Pixel(-24, -24),
        },
      ]

      userPosition(qs.stringify({}))
        .then((res) => {
          if (res.code === 200) {
            _this.userPositions = res.result
            var points = []

            for (var i in _this.userPositions) {
              var point = JSON.parse(JSON.stringify(_this.userPositions[i]))
              if (point.lng && point.lat) {
                point['weight'] = 1
                point['lnglat'] = [point.lng, point.lat]
                points.push(point)
              }
            }

            var cluster
            var map = _this.map
            //添加聚合组件
            cluster = new AMap.MarkerClusterer(
              map, // 地图实例
              points, // 海量点数据，数据中需包含经纬度信息字段 lnglat
              {
                gridSize: gridSize, // 设置网格像素大小
                styles: styles,
//                renderMarker: _this._renderMarker2,
              }
            )
            _this.personCluster = cluster
          }
        })
        .catch((err) => {
          // Do something
        })
    },

    loadUser() {
      var params = {
        // pid: this.GridNode.value,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
      }

      //获取用户列表
      userList(qs.stringify({}))
        .then((res) => {
          if (res.code === 200) {
            this.userListData = res.result.data
            this.pagination.total = res.result.totalCount
          }
        })
        .catch((err) => {
          // Do something
        })
    },
    change(pagination, filters, sorter) {
      this.pagination = pagination
      this.loadUser()
    },

    showTracking() {
      this.modalData3 = { title: '人员轨迹', visible: true }
    },
  },
}
</script>
