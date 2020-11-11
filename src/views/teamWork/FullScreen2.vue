<template>
  <a-row id="fullContainer" :gutter="8">

    <a-col :span="24">

      <a-card :bordered="false">
        <div>
          <div id="container" style="width: 100%;min-height:500px" :style="{height: getHeight}"></div>

          <div class="input-card" style="width: 120px">
            <button class="btn" @click="createPolygon()" style="margin-bottom: 5px">新建</button>
            <button class="btn" @click="closePolygon()">结束编辑</button>
            <button class="btn" @click="clearPolygon()">清除选中覆盖物</button>
            <button class="btn" @click="getPath()">获取坐标数组</button>

          </div>
        </div>
      </a-card>
    </a-col>

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
  import qs from 'qs'

  export default {
    components: {
      RegisterList
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
        divHeight:618,
        isFullScreen:false
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
          zoom:13,
//          center:[118.76979, 32.066336]
          center:[120.299768,31.575841]
        })

        if(_this.gridCommunitys.length > 0){

          for(var i in _this.gridCommunitys){
            var grid = _this.gridCommunitys[i];
            if(grid["gridPosition"]){
              var polygon1 = new AMap.Polygon({
                path: JSON.parse(grid["gridPosition"])
              })
              map.add([polygon1])

              var content =  '<div>'+grid.gridName + '</div>'
                            + '<div><button>视频通话</button></div>';
              var infoWindow = new AMap.InfoWindow({
                anchor: 'top-left',
                content:content
              });
              infoWindow.open(map,grid["coordinate"].split(","))
            }
          }

//          for(var i in _this.grids){
//            var polygon1 = new AMap.Polygon({
//              path: _this.grids[i]
//            })
//            map.add([polygon1])
//
//            var infoWindow = new AMap.InfoWindow({
//              anchor: 'top-left',
//              content: '这是信息窗体！这是信息窗体！',
//            });
////            _this.gridCommunitys.coordinate
//            infoWindow.open(map,[120.299768,31.575841])
//          }
        }else{
          //配置编辑已有的覆盖物
          var path1 = [[118.766614,32.074773],[118.771764,32.078118],[118.784295,32.077682],[118.783609,32.059353]]
          var polygon1 = new AMap.Polygon({
            path: path1
          })
          map.add([polygon1])
        }


        map.setFitView()
        this.map = map
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
        polygon1.on('dblclick', () => {
          _this.polygon = polygon1
          polyEditor.setTarget(polygon1);
          polyEditor.open();
        })

        this.polyEditor = polyEditor
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
        console.log('this',this)
        var params = {}

        gridCommunityList(qs.stringify(params))
          .then(res => {
            _this.gridCommunitys = res.result.data

//            var grids = [];
//            for(var i in _this.gridCommunitys){
//              if(_this.gridCommunitys[i]["gridPosition"]){
//                grids.push(JSON.parse(_this.gridCommunitys[i]["gridPosition"]));
//              }
//            }
//            _this.grids = grids;
            _this.amapView()

          })
          .catch(err => {
            // Do something
          })
      }
    }
  }
</script>
