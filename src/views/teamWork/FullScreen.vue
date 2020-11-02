<template>
  <a-row id="fullContainer" :gutter="8">

    <a-col :span="6">
      <div>
        <a-row :gutter="24">
          <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '24px' }">
            <chart-card :loading="loading" :hasFooter="false" title="今日上报数" :total="reportData['上报'] | NumberFormat">
              <a-tooltip title="指标说明" slot="action">
                <a-icon type="info-circle-o" />
              </a-tooltip>
              <div>
                <!--<mini-pie />-->
                <!--<trend flag="up" style="margin-right: 16px;">-->
                  <span slot="term">自采案件</span>
                  <span slot="term">{{0 | NumberFormat}}</span>
                  <!--12%-->
                <!--</trend>-->
                <!--<trend flag="down">-->
                  <!--11%-->
                <!--</trend>-->
              </div>
              <div>
                <span slot="term">市局下派</span>
                <span slot="term">{{0 | NumberFormat}}</span>
              </div>
            </chart-card>
          </a-col>
          <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '24px' }">
            <chart-card :loading="loading" :hasFooter="false" title="今日处置数" :total="reportData['处置'] | NumberFormat">
              <a-tooltip title="指标说明" slot="action">
                <a-icon type="info-circle-o" />
              </a-tooltip>
              <div>
                <span slot="term">自采案件</span>
                <span slot="term">{{0 | NumberFormat}}</span>
              </div>
              <div>
                <span slot="term">市局下派</span>
                <span slot="term">{{0 | NumberFormat}}</span>
              </div>
            </chart-card>
          </a-col>
          <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
            <chart-card :loading="loading" :hasTotal="false" :hasFooter="false" title="案件数量" :divHeight="285">
              <div>
                <stacking-bar :data="barData2" :xArr="areaArr" :style="{padding:'0px'}"/>
                <!--<bar :data="barData" :style="{padding:'0px'}"/>-->
              </div>
              <a-tooltip title="指标说明" slot="action">
                <a-icon type="info-circle-o" />
              </a-tooltip>
            </chart-card>
          </a-col>
          <a-col :sm="24" :md="24" :xl="24" :style="{ marginBottom: '24px' }">
            <chart-card :loading="loading" :hasFooter="true" title="今日结案数" :total="reportData['结案'] | NumberFormat" :divHeight="285">  <!--: :style="{marginBottom: '0px' }" marginTop="-48"-->
              <a-tooltip title="指标说明" slot="action">
                <a-icon type="info-circle-o" />
              </a-tooltip>
              <div>
                <mini-pie />
                <!--<mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" height="8px" />-->
              </div>
              <template slot="footer">转化率 <span>60%</span></template>
            </chart-card>
          </a-col>
        </a-row>
      </div>
    </a-col>
    <a-col :span="12">

      <a-card :bordered="false">
        <div>
          <div id="container" style="width: 100%;min-height:500px" :style="{height: getHeight}">
          </div>
        </div>
      </a-card>
    </a-col>

    <a-col :span="6">
      <a-card :bordered="false">
        <!--<Button @click="handleInfiniteOnLoad">测试加载</Button>-->
        <div
          v-infinite-scroll="handleInfiniteOnLoad"
          class="demo-infinite-container"
          :style="{height: getHeight}"
          :infinite-scroll-disabled="busy"
          :infinite-scroll-distance="10"
        >
          <a-descriptions  layout="vertical" size="small"  v-for="(item, index) in data">
            <a-descriptions-item label="案件编号">
              <a  @click="showCase(item)">{{item.caseNo}}</a>
            </a-descriptions-item>
            <a-descriptions-item label="状态">
              <a-badge :color="caseColors[item.state]" :text="statusObj[item.status]" />
            </a-descriptions-item>
            <a-descriptions-item label="上报人">
              {{item.reportor}}
            </a-descriptions-item>
            <a-descriptions-item label="案件来源">
              {{item.casesource}}
            </a-descriptions-item>
            <a-descriptions-item label="案件类型">
              {{item.caseType}}
            </a-descriptions-item>
            <a-descriptions-item label="案件样本">
              {{item.sampleName}}
            </a-descriptions-item>
            <a-descriptions-item label="上报时间">
              {{item.reporTime}}
            </a-descriptions-item>
            <a-descriptions-item label="案件描述" span="1">
              <Ellipsis :length="10" tooltip>{{ item.caseDesc }}</Ellipsis>
            </a-descriptions-item>
            <a-descriptions-item label="操作">
              <button class="btn" @click="info(item)">处置</button>
            </a-descriptions-item>

          </a-descriptions>

        <!--<a-list size="large"-->
          <!--:pagination="{-->
          <!--current: pagination.current,-->
          <!--pageSize: pagination.pageSize,-->
          <!--total: pagination.total,-->
          <!--'show-size-changer': true,-->
          <!--'show-quick-jumper': true,-->
          <!--'show-total': total => `共 ${total} 条`-->
          <!--}">-->
          <!--&lt;!&ndash;:pagination="{showSizeChanger: true, showQuickJumper: false, pageSize: 5, total: 50}"&ndash;&gt;-->

          <!--<a-list-item :key="index" v-for="(item, index) in data">-->
            <!--<a-list-item-meta :description="item.caseType">-->
              <!--&lt;!&ndash;<a-avatar slot="avatar" size="large" shape="square" :src="item.avatar"/>&ndash;&gt;-->
              <!--<a slot="title">{{ item.casesource }}</a>-->
            <!--</a-list-item-meta>-->
            <!--<div class="list-content">-->
              <!--<div class="list-content-item">-->
                <!--&lt;!&ndash;<span>样本</span>&ndash;&gt;-->
                <!--<p>{{ item.sampleName }}</p>-->
              <!--</div>-->
              <!--<div class="list-content-item">-->
                <!--&lt;!&ndash;<span>上报时间</span>&ndash;&gt;-->
                <!--<p>{{ item.reporTime }}</p>-->
              <!--</div>-->
            <!--</div>-->
            <!--<div class="list-content">-->
              <!--<div class="list-content-item">-->
                <!--<span>案件描述</span>-->
                <!--<p>-->
                  <!--<Ellipsis :length="10" tooltip>{{ item.caseDesc }}</Ellipsis>-->
                <!--</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</a-list-item>-->
        <!--</a-list>-->

          <div style="text-align: center;" v-if="data.length >= pagination.pageSize">
            <a @click="loadMore()">加载更多</a>
          </div>
        </div>
      </a-card>
    </a-col>

    <div id="amapContainer" class="input-card" style="width: 60px">
      <a-icon v-if="!isFullScreen" type="fullscreen" :style="{ fontSize: '30px'}" @click="fullScreen()"/>
      <a-icon v-else="isFullScreen" type="fullscreen-exit" :style="{ fontSize: '30px'}"  @click="exitFullScreen()"/>
    </div>

    <Edit :modalData="modalData" @handleModalEvent="handleModalEvent"></Edit>
  </a-row>

</template>
<style>
  #fullContainer:fullscreen {
    width: 100vw;
    height: 100vh;
    background: grey;
  }
  .statistics_bg{
    background: deepskyblue;
    text-align: center;
    color: white;
    padding: 20px;
  }
  .statistics_title{
    font-size: 20px;
  }
  .statistics_content{
    font-size: 35px;
  }
  #amapContainer{
    position: absolute;
    bottom: initial;
    right: 0rem;
    top: 0rem;
  }
  .amap-logo{
    display: none;
  }
  .amap-copyright{
    opacity:0;
  }
  .demo-infinite-container {
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    overflow: auto;
    padding: 8px 24px;
    height: 300px;
  }
  .demo-loading-container {
    position: absolute;
    bottom: 40px;
    width: 100%;
    text-align: center;
  }
  .ant-descriptions{
    border-bottom: solid 1px rgba(183, 182, 179, 1);
    margin-bottom: 5px;
  }
</style>
<script>
  import { ChartCard, MiniPie, MiniArea, MiniBar, MiniProgress, StackingBar, Bar, Trend, Ellipsis } from '@/components'
  import { mixinDevice } from '@/utils/mixin'
  import { caseInfoCityList2,caseReportData } from '@/api/case'
  import ReportEdit from '@/views/appMaintainSystem/case/ReportEdit'
  import Edit from '@/views/teamWork/commandCenter/Edit'
  import qs from 'qs'
  import { mapGetters } from 'vuex'
  import config from '@/config/defaultSettings'
  import caseConfig from '@/api/caseConfig'
  const caseType = caseConfig.caseType
  const statusObj = caseConfig.caseStatusObj
  const caseColors = caseConfig.caseColors
  import infiniteScroll from 'vue-infinite-scroll';
  import notification from 'ant-design-vue/es/notification'
  import ADescriptions from 'ant-design-vue/es/descriptions'
  const ADescriptionsItem = ADescriptions.Item
  import 'ant-design-vue/es/descriptions/style/index.less'
  import  Vue from "vue/dist/vue.esm.js"
  //import AMap from 'AMap'

  const barData = []
  for (let i = 0; i < 12; i += 1) {
    barData.push({
      x: `${i + 1}月`,
      y: Math.floor(Math.random() * 1000) + 200
    })
  }
  var barData2 = []
  var typeArr = ["上报",'结案','处置']
  var areaArr = ["玄武",'秦淮','建邺',"鼓楼",'浦口','栖霞',"雨花台",'江宁','六合','溧水','高淳']
  for(var i in typeArr){
    var itemObj = {
      name:typeArr[i]
    }
    for(var j in areaArr){
      itemObj[areaArr[j]] = Math.floor(Math.random() * 100)
    }
    barData2.push(itemObj)
  }

  export default {
    components: {
      ChartCard, Trend, MiniPie, MiniArea, MiniBar, StackingBar, Bar, MiniProgress, Ellipsis, ADescriptions, ADescriptionsItem,
      Edit
    },
    directives: { infiniteScroll },
    name: 'TestAmap',
    data () {
      return {
        loading: true,
        pagination: {
          pageNo: 1,
          pageSize: 4,
          totalPage:0,
          total: 0
        },
        modalData: {},
        reportData: {},
//        modalData: {
//          record:{},
//          selectTab:{
//            options:[]
//          }
//        },
        caseType:{},
        caseColors: caseColors,
        activeKey:"",

        map: null,
        polyEditor:null,
        polygon:null,
        el:null,
        divHeight:918,
        data:[],
        barData,
        barData2,
        areaArr,
        statusObj,
        wsUrl: config.wsUrl,

        isFullScreen:false,
        listLoading: false,
        busy: false,
      }
    },
    computed: {
      // 滚动区高度
      // (业务需求：手机屏幕高度减去头部标题和底部tabbar的高度，当然这2个高度也是可以动态获取的)
      getHeight: function() {
        return this.divHeight + 'px';
      },
      ...mapGetters(['userInfo'])
    },
    mounted () {
      this.initCaseReportData()
//      this.amapView()
      window.onresize = () =>{
        //只要窗口高度发生变化，就会进入这里面，在这里就可以写，回到聊天最底部的逻辑
//        console.log('document.body.clientHeight ',document.body.clientHeight )
//        console.log(this.divHeight,window.screen.height)
        if(document.body.clientHeight !==  window.screen.height) {
//        if(this.divHeight !==  window.screen.height - 48) {
//          this.divHeight =  document.body.clientHeight-200
          this.isFullScreen = false
        }else{
          this.isFullScreen = true
        }
      }
    },
    created () {
      this.initWebSocket();
      this.loadData()
      this.caseType = caseType

      setTimeout(() => {
        this.loading = !this.loading
      }, 1000)
    },

    destroyed() {
      this.websock.close() //离开路由之后断开websocket连接
    },
    methods: {
      amapView (points) {
        console.log('points',points)
        console.log('this.points',this.points)
        const _this = this
        this.el = document.getElementById('fullContainer')
//        this.divHeight =  document.body.clientHeight-200
        if(this.map)this.map.destroy()
        this.map = new AMap.Map('container',{
          zoom:13,
          center:[118.76979, 32.066336]
        })
        var map = this.map
        var styles = [{
          url:"imgs/1.png",
          size:new AMap.Size(32,32),
          offset:new AMap.Pixel(-16,-30)
        },
          {
            url:"imgs/2.png",
            size:new AMap.Size(32,32),
            offset:new AMap.Pixel(-16,-30)
          },
          {
            url:"imgs/3.png",
            size:new AMap.Size(48,48),
            offset:new AMap.Pixel(-24,-45),
            textColor:'#CC0066'
          }];

        var cluster = this.cluster
//      清理原来的点标记
        if (this.points) {
          map.remove(this.points)
        }

        this.points = points
        const gridSize = 60
        this.count = points.length;
        //添加聚合组件
        map.plugin(["AMap.MarkerClusterer"],function() {
          cluster = new AMap.MarkerClusterer(
            map,     // 地图实例
            points, // 海量点数据，数据中需包含经纬度信息字段 lnglat
            {
              //styles: styles
              gridSize: gridSize, // 设置网格像素大小
              renderClusterMarker: _this._renderClusterMarker, // 自定义聚合点样式
              renderMarker: _this._renderMarker // 自定义非聚合点样式
            });
          _this.cluster = cluster
          map.setFitView()
        })
        map.on('click',function(){
          _this.closeInfoWindow()
        })
        setTimeout(function () {
          map.setFitView()
        },3000)
      },
      _renderClusterMarker (context) {
        var count = this.count
        var factor = Math.pow(context.count / count, 1 / 18);
        var div = document.createElement('div');
        var Hue = 180 - factor * 180;
        var bgColor = 'hsla(' + Hue + ',100%,40%,0.7)';
        var fontColor = 'hsla(' + Hue + ',100%,90%,1)';
        var borderColor = 'hsla(' + Hue + ',100%,40%,1)';
        var shadowColor = 'hsla(' + Hue + ',100%,90%,1)';
        div.style.backgroundColor = bgColor;
        var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
        div.style.width = div.style.height = size + 'px';
        div.style.border = 'solid 1px ' + borderColor;
        div.style.borderRadius = size / 2 + 'px';
        div.style.boxShadow = '0 0 5px ' + shadowColor;
        div.innerHTML = context.count;
        div.style.lineHeight = size + 'px';
        div.style.color = fontColor;
        div.style.fontSize = '14px';
        div.style.textAlign = 'center';
        context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
        context.marker.setContent(div)
      },
      _renderMarker (context) {
        var _this = this
        var content = '<div style="background-color: hsla(180, 100%, 50%, 0.3); height: 18px; width: 18px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 3px;"></div>';
        var offset = new AMap.Pixel(-9, -9);
        context.marker.setContent(content)
        context.marker.setOffset(offset)
        context.marker.on('click', function(e) {
          var record = context.data[0]
          //console.log('e:',e);
          //console.log('您在[ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ]的位置点击了地图！');
          _this.openInfoWindow([e.lnglat.getLng(),e.lnglat.getLat()],record)
        });
      },

      openInfoWindow(coordinate,record){
        console.log('record',record)
        //coordinate [118.76979, 32.066336]
        //构建信息窗体中显示的内容
        var _this = this
        var content = "<div style=\"padding:7px 0px 0px 0px;\"><h4>案件详情</h4>"
        var picArr = []
        if(record){
          content = content + "<p class='input-item'>案件编号 : "+ (record.caseNo?record.caseNo:'') + "</p>"
          content = content + "<p class='input-item'>案件来源 : "+ (record.casesource?record.casesource:'')
          content = content +"    上报人 :"+ (record.reportor?record.reportor:'') + "</p>"
          content = content +"<p class='input-item'>案件类型 : "+ (record.casetype?record.casetype:'')
          content = content +"    上报时间 : "+ (record.reporTime?record.reporTime:'') +"</p>"
          content = content +"<p class='input-item'>案件样本 : "+ (record.sampleName?record.sampleName:'') +"</p>"
            +"<p class='input-item'>案件描述 : "+ (record.caseDesc?record.caseDesc:'') +"</p>"
            +"<p class='input-item'>案件位置描述 : "+ (record.locationDesc?record.locationDesc:'') +"</p>"
//        if(record.files.length > 0){
//          picArr = record.files
//          content += "<div>"
//          for(var i in picArr){
////            content = content + "<div><img src='http://localhost:8088"+ picArr[i].url +"'><div>"
//            content = content + "<img class='caseImg' title=\"点击看大图\" @click='showCarousel(\""+ i +"\")' src='/api"+ picArr[i].thumbUrl +"'>"
//            if(  i%3 === 2 ){
//              content = content + "</div><div>"
//            }
//          }
//          content += "</div>"
//        }
//        content = content + "<p class='input-item'><a @click='confirmCase(\""+record.id+"\")'>立案处理</a></p>"
          content = content + "</div>"
        }
        const picArrJson = JSON.parse(JSON.stringify(picArr))
        for(var i in picArrJson){
          picArrJson[i].url = "/api"+picArrJson[i].url
        }

        let InfoContent = Vue.extend({
          template:content,
          methods:{
            showCarousel(i){
              console.log(picArrJson)
              _this.$refs.bigPic.loadData(picArrJson,i)
            }
          }
        })
        let component = new InfoContent().$mount()
        console.log("component",component)
        var infoWindow = new AMap.InfoWindow({
          anchor: 'top-center'
        });
        infoWindow.setContent(component.$el)
        infoWindow.open(this.map,coordinate)
        this.infoWindow = infoWindow
      },
      closeInfoWindow(){
        if(this.infoWindow){
          this.infoWindow.close()
        }
      },
      showCase(record) {
        console.log('showCase',record)
        var lnglat = [record.lng,record.lat]
        this.openInfoWindow(lnglat,record)
      },

//      地图全屏
      fullScreen() {
        var el = this.el
        this.divHeight = window.screen.height -48
        this.isFullScreen = true
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
          wscript;

        if(typeof rfs != "undefined" && rfs) {
          rfs.call(el);
          return;
        }

        if(typeof window.ActiveXObject != "undefined") {
          wscript = new ActiveXObject("WScript.Shell");
          if(wscript) {
            wscript.SendKeys("{F11}");
          }
        }
      },
      exitFullScreen() {
        var el = this.el
        this.divHeight = 918
        this.isFullScreen = false
        var el= document,
          cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
          wscript;

        if (typeof cfs != "undefined" && cfs) {
          cfs.call(el);
          return;
        }

        if (typeof window.ActiveXObject != "undefined") {
          wscript = new ActiveXObject("WScript.Shell");
          if (wscript != null) {
            wscript.SendKeys("{F11}");
          }
        }
      },
      initCaseReportData () {
        var _this = this
        caseReportData()
          .then(res => {
            console.log('caseReportData().res.result',res.result)
            _this.reportData = res.result
          })
          .catch(err => {
            // Do something
          })
      },

      changeTab (activeKey){
        this.activeKey = activeKey
        this.selectTab = this.caseType[activeKey]
      },
      //查看案件详情
      info (record) {
        for(let key  in this.caseType){
          if(caseType[key].status == record.status){
            this.changeTab(key)
          }
        }

        this.modalData = {
          record: JSON.parse(JSON.stringify(record)),
          visible: true,
          disabled: true,
          title: this.activeKey,
          selectTab: this.selectTab
        }
      },
      loadData () {
        var _this = this
        console.log('this',this)
        var params = {
          pageNo: 1,
          pageSize: this.pagination.pageSize
        }

        caseInfoCityList2(qs.stringify(params))
          .then(res => {
//            this.data = res.result.data.concat(this.data)
            _this.data = res.result.data
            _this.pagination.pageNo = res.result.pageNo
            _this.pagination.totalPage = res.result.totalPage
            _this.pagination.total = res.result.totalCount

            _this.data.forEach(function(row){
              row.weight = 1
              row.lnglat = [row.lng,row.lat]
            })
            _this.amapView(_this.data)
//            this.listLoading = false
          })
          .catch(err => {
            // Do something
          })
      },
//      加载下一页数据  数据按倒序排列
      loadMore(){
        var _this = this
        this.listLoading = true
        console.log('this',this)

        if(this.pagination.pageNo >= this.pagination.totalPage){
          notification.info({
            message: 'Info',
            description: '没有更多数据加载'
          })
        }else{
          var params = {
            pageNo: this.pagination.pageNo+1,
            pageSize: this.pagination.pageSize
          }

          caseInfoCityList2(qs.stringify(params))
            .then(res => {

              if(res.result.data.length > 0){
                _this.data = _this.data.concat(res.result.data)
                _this.pagination.pageNo = res.result.pageNo
                _this.pagination.totalPage = res.result.totalPage
                _this.pagination.total = res.result.totalCount

                _this.data.forEach(function(row){
                  row.weight = 1
                  row.lnglat = [row.lng,row.lat]
                })
                _this.amapView(_this.data)
              }else{
                notification.info({
                  message: 'Info',
                  description: '没有更多数据加载'
                })
              }
              this.listLoading = false
            })
            .catch(err => {
              // Do something
            })
        }

      },
      initWebSocket() { //初始化weosocket
        this.userId = this.userInfo.id
        this.wsUri= this.wsUrl + '/screen/' + new Date().getTime() + this.userId
        this.websock = new WebSocket(this.wsUri)
        this.websock.onmessage = this.websocketonmessage
        this.websock.onopen = this.websocketonopen
        this.websock.onerror = this.websocketonerror
        this.websock.onclose = this.websocketclose
      },
      websocketonopen() { //连接建立之后执行send方法发送数据
        this.isWebSocket = true;
        console.log("链接成功！", this.isWebSocket)
        // this.websocketsend(JSON.stringify(actions));
      },
      websocketonerror() {//连接建立失败重连
        this.$message.info("重新建立链接中");
        this.initWebSocket();
      },
      websocketonmessage(e) { //数据接收
        console.log("resdata", e.data)
        try{
          const resdata = JSON.parse(e.data);

          this.data = resdata.caseList.result.data
          this.reportData = resdata.reportData.result
          this.pagination.total = res.caseList.result.totalCount

//          var addnode = resdata.destnodeid
//          for(let key  in this.caseType){
//            if(this.caseType[key].status == resdata.destnodeid){
//              this.caseType[key]['count'] += 1
//            }
//          }

        }catch (e){
          console.log('websocketonmessage',e)
        }
      },
      websocketclose(e) {  //关闭
        this.isWebSocket = false;
        this.websock.close();
        console.log('断开连接', e);
      },

      handleInfiniteOnLoad() {
        const data = this.data;
        this.listLoading = true;

        this.loadData()
//        if (data.length > 14) {
//          this.$message.warning('Infinite List loaded all');
          this.busy = true;
//          this.loading = false;
//          return;
//        }
//        this.fetchData(res => {
//          this.data = data.concat(res.results);
//          this.loading = false;
//        });
      },
      handleModalEvent (res) {
        this.loadData()
      },

    }
  }
</script>
