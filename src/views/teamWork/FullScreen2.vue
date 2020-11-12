<template>
  <a-row id="fullContainer" :gutter="8">

    <a-col :span="24">

      <a-card :bordered="false">
        <div>
          <div id="container" style="width: 100%;min-height:500px" :style="{height: getHeight}"></div>

          <!--<div class="input-card" style="width: 120px">-->
            <!--<button class="btn" @click="createPolygon()" style="margin-bottom: 5px">新建</button>-->
            <!--<button class="btn" @click="closePolygon()">结束编辑</button>-->
            <!--<button class="btn" @click="clearPolygon()">清除选中覆盖物</button>-->
            <!--<button class="btn" @click="getPath()">获取坐标数组</button>-->

          <!--</div>-->
        </div>
      </a-card>
    </a-col>

    <div id="gridContainer" class="input-card" style="width: 400px">
      <a-table rowKey="id" :columns="columns" :data-source="gridCommunitys" :pagination="false">

        <span slot="action" slot-scope="text, record">
          <a @click="callVideo(record)">视频通话</a>
        </span>
      </a-table>
    </div>

    <div id="amapContainer" class="input-card" style="width: 60px">
      <a-icon v-if="!isFullScreen" type="fullscreen" :style="{ fontSize: '30px'}" @click="fullScreen()"/>
      <a-icon v-else="isFullScreen" type="fullscreen-exit" :style="{ fontSize: '30px'}"  @click="exitFullScreen()"/>
    </div>
  </a-row>

</template>
<style>
  #fullContainer:fullscreen {
    width: 100vw;
    height: 100vh;
    background: grey;
  }

  #amapContainer{
    position: absolute;
    bottom: initial;
    right: 0rem;
    top: 0rem;
  }
  #gridContainer{
    position: absolute;
    bottom: initial;
    left: 0rem;
    top: 0rem;
  }
  #gridContainer .ant-table-tbody > tr > td {
    padding: 6px 6px;
    overflow-wrap: break-word;
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
</style>
<script>
  //import AMap from 'AMap'
  import RegisterList from './register/List'
  import { gridCommunityList } from '@/api/gridCommunity'
  import { companyManageList } from '@/api/companyManage'
  import qs from 'qs'
  import  Vue from "vue/dist/vue.esm.js"
  import config from '@/config/defaultSettings'
  import { STable } from '@/components'

  export default {
    components: {
      RegisterList,STable
    },
    name: 'FullScreen',
    data () {
      return {
        el:null,
        map: null,
        polyEditor:null,
        polygon:null,
        grids:[],
        gridCommunitys:[],
        companyManages:[],
        divHeight:618,
        isFullScreen:false,
        markerArr: [],

        columns : [
          {
            title: '网格',
            dataIndex: 'gridName',
            key: 'gridName',
            width: 80
          },
          {
            title: '负责人',
            dataIndex: 'name',
            key: 'name',
            width: 100
          },
          {
            title: '电话',
            key: 'managerContactNum',
            dataIndex: 'managerContactNum',
            width: 120
          },
          {
            title: '操作',
            key: 'action',
            width: 80,
            scopedSlots: { customRender: 'action' },
          },
        ]


      }
    },
    computed: {
      // 滚动区高度
      // (业务需求：手机屏幕高度减去头部标题和底部tabbar的高度，当然这2个高度也是可以动态获取的)
      getHeight: function() {
        return this.divHeight + 'px';
      }
    },
    mounted () {
//      this.initCaseReportData()
//      this.amapView()
      window.onresize = () =>{
        //只要窗口高度发生变化，就会进入这里面，在这里就可以写，回到聊天最底部的逻辑
//        console.log('document.body.clientHeight ',document.body.clientHeight )
//        console.log(this.divHeight,window.screen.height)
        if(document.body.clientHeight !==  window.screen.height) {
          this.isFullScreen = false
        }else{
          this.isFullScreen = true
        }
      }
    },
    created () {
      this.loadData();
    },
    methods: {
      amapView () {
        var _this = this

        this.el = document.getElementById('fullContainer')
        this.divHeight =  document.body.clientHeight-200
        if(this.map)this.map.destroy()
        const map = new AMap.Map('container',{
          zoom:14,
//          center:[118.76979, 32.066336]
          center:[120.299768,31.575841]
        })


        var polyEditor = new AMap.PolygonEditor(map);
        //新增覆盖物
        polyEditor.on('add', function (data) {
          console.log(data);
          var polygon = data.target;
          polyEditor.addAdsorbPolygons(polygon);
          polygon.on('dblclick', () => {
            //获取坐标
            console.log('polygon.path',polygon.getPath( ))
            console.log(JSON.stringify(_this.parsePath(polygon.getPath())))
            _this.polygon = polygon
            polyEditor.setTarget(polygon);
            polyEditor.open();
          })
          _this.polygon = polygon
        })
        var polygonArr = [];
        if(_this.gridCommunitys.length > 0){

          for(var i in _this.gridCommunitys){
            var grid = _this.gridCommunitys[i];
            var polygon1 = new AMap.Polygon({
              path: JSON.parse(grid["gridPosition"])
            })
            polygonArr.push(polygon1)
          }

        }

        for(var j in polygonArr){
          (function (j) {
            var polygon2 = polygonArr[j];
            polygon2.on('click', () => {
              _this.polygon = polygon2
//              polyEditor.setTarget(polygon2);
//              polyEditor.open();

              var grid = _this.gridCommunitys[j];
              var content =  "<div><p>" +grid.gridName + "</p>"
                + "<p class='input-item'><a @click='callVedio(\""+grid.gridName+"\")'>视频通话</a></p>"
                + "</div>";

              let InfoContent = Vue.extend({
                template:content,
                methods:{
                  callVedio(i){
                    window.open( config.chatUrl );
                  }
                }
              })
              let component = new InfoContent().$mount()
              var infoWindow = new AMap.InfoWindow({
                anchor: 'top-left'
              });
              infoWindow.setContent(component.$el)
              infoWindow.open(_this.map,grid["coordinate"].split(","));
            })
          })(j)
        }
        map.add(polygonArr);



        //此处获取所有公司marker
        for(var i in _this.companyManages){
          var company = _this.companyManages[i]
          var marker = new AMap.Marker({
            position: new AMap.LngLat(company.lng, company.lat),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            title: company.companyName
          });
          _this.markerArr.push(marker);
        }


//        map.add(marker)

        map.on("zoomchange",function(arg1){
          console.log("map.getZoom():",map.getZoom());
          if(map.getZoom() < 14){
            map.add(polygonArr);
            _this.hideMarker();
          }else{
            map.remove(polygonArr);
            _this.showMarker();
          }

        })

        map.setFitView()
        this.map = map

        this.polyEditor = polyEditor
      },

      callVideo(record){
        window.open( config.chatUrl );
      },

      showMarker(){
        for(var i in this.markerArr){
          // 将创建的点标记添加到已有的地图实例：
          this.map.add(this.markerArr[i]);
        }
      },
      hideMarker(){
        for(var i in this.markerArr){
          // 将创建的点标记添加到已有的地图实例：
          this.map.remove(this.markerArr[i]);
        }
      },

      getPath(){
        if(this.polygon){
          var arr = this.parsePath(this.polygon.getPath())
          console.log('path:'+JSON.stringify(arr))
        }else{
          console.log("没有选中的多边形")
        }
      },
      parsePath (path) {
        var arr = []
        path.forEach(function (item) {
          arr.push([item.lng,item.lat])
        })
        return arr
      },
      createPolygon () {
        const polyEditor = this.polyEditor
        polyEditor.close();
        polyEditor.setTarget();
        polyEditor.open();
      },
      clearPolygon () {
        if(this.polygon){
          this.polyEditor.removeAdsorbPolygons(this.polygon)
          this.polyEditor.close()
          this.map.remove([this.polygon])
        }else{
          console.log("没有选中的多边形")
        }
      },
      closePolygon () {
        this.polyEditor.close()
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

      loadData () {
        var _this = this

        gridCommunityList(qs.stringify({}))
          .then(res => {
            var gridCommunitys = res.result.data

            var grids = [];
            for(var i in gridCommunitys){
              if(gridCommunitys[i]["gridPosition"]){
                grids.push(gridCommunitys[i]);
              }
            }
            _this.gridCommunitys = grids;

            companyManageList(qs.stringify({}))
              .then(res => {

                _this.companyManages = res.result.data;
                _this.amapView()

              })
              .catch(err => {
                // Do something
              })


          })
          .catch(err => {
            // Do something
          })
      }
    }
  }
</script>
