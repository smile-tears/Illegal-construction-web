<template>
    <a-row :gutter="8">
      <a-col :span="18">

        <a-card :bordered="false">
          <register-list
            ref="registerList"
            @showCase="showCase"
            @showMarker="amapView"
          ></register-list>
        </a-card>
      </a-col>

      <a-col :span="6">
        <!--<a-card :bordered="false" style="margin-bottom: 8px;">
          <a-col :span="12">
            <div class="statistics_bg">
              <div class="statistics_title">待立案案件</div>
              <div class="statistics_content">1003</div>
            </div>
          </a-col>
          <a-col :span="12">
            <div class="statistics_bg">
              <div class="statistics_title">专项普查</div>
              <div class="statistics_content">1003</div>
            </div>
          </a-col>
        </a-card>-->

        <a-card :bordered="false">
          <div>
            <div id="container" style="width: 100%;max-height:500px" :style="{height: getHeight}"></div>
          </div>

          <carousel-pic ref="bigPic"></carousel-pic>

        </a-card>
      </a-col>

    </a-row>


</template>
<style>
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
.content-window-card{
  position: relative;
  width: 23rem;
  padding: 0.75rem 0 0 1.25rem;
  box-shadow: none;
  bottom: 0;
  left: 0;
}

.content-window-card p{
  height: 2rem;
}
.ant-carousel{
  width: 300px;
}
.ant-carousel >>> .slick-slide {
  text-align: center;
}
.caseImg{
  width: 100px;
}
</style>
<script>
//import AMap from 'AMap'
import  Vue from "vue/dist/vue.esm.js"
import RegisterList from './List'
import CarouselPic from './CarouselPic'

export default {
  components: {
    RegisterList,
    CarouselPic
  },
  name: 'Register',
  data () {
    return {
//      markerArr:[[118.76979, 32.066336],[118.77979, 32.066336],[118.76979, 32.077336]],
      divHeight:500,
      count: 0,
      map: null,
      points:[],
      cluster: null,
      infoWindow: null
    }
  },
  computed: {
    // 滚动区高度
    // (业务需求：手机屏幕高度减去头部标题和底部tabbar的高度，当然这2个高度也是可以动态获取的)
    getHeight: function() {
      this.divHeight =  document.body.clientHeight-200
      return this.divHeight + 'px';
    }
  },
  mounted () {
//    this.map = new AMap.Map('container');
    window.onresize = () =>{
      //只要窗口高度发生变化，就会进入这里面，在这里就可以写，回到聊天最底部的逻辑
      if(document.body.clientHeight !==  window.screen.height) {
        this.divHeight =  document.body.clientHeight-200
      }
    }

    // 聚合点数据应该是一组包含经纬度信息的数组。lnglat 为经纬度信息字段，weight 字段为可选数据，表示权重值，以权重高的点为中心进行聚合。
//    var points = [
//      { weight: 8, lnglat: ["118.76979", "32.066336"], myid:'001' },
//      { weight: 1,  lnglat: ["118.77979", "32.066336"], myid:'002' },
//      { weight: 1, lnglat: ["118.76979", "32.046336"], myid:'003' },
//      { weight: 1, lnglat: ["118.76979", "32.096336"], myid:'004' },
//      { weight: 1, lnglat: ["118.73979", "32.066336"], myid:'005' }
//    ];
//    this.amapView(points)
  },
  methods: {
    amapView (points) {
      console.log('points',points)
      console.log('this.points',this.points)
      const _this = this
//      this.map = new AMap.Map('container',{
//        zoom:13,
//        center:[118.76979, 32.066336]
//      })
      if(this.map)this.map.destroy()
      this.map = new AMap.Map('container',{
        zoom:13,
        center:[118.76979, 32.066336]
      })
      var map = this.map
      /*const map = new AMap.Map('container',{
        zoom:13,
        center:[118.76979, 32.066336]
      })
      for(var i in this.markerArr){
        var marker = new AMap.Marker({
          position: this.markerArr[i],   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: '南京'+ i
        });
        map.add(marker);
      }*/
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
      },1000)
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
//      console.log('context',context)
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
//      console.log('content',content)

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
//          ,
//          confirmCase(id) {
//            console.log('confirmCase.id:',id)
//            _this.$refs.registerList.confirmCase({id:id})
//            _this.closeInfoWindow()
//          }
        }
      })
//      let InfoContent = Vue.extend(RegisterDetail)
      let component = new InfoContent().$mount()
      console.log("component",component)
      var infoWindow = new AMap.InfoWindow({
        anchor: 'top-center'
//        content: component.$el
//          '这是信息窗体！这是信息窗体！',
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
      console.log("Register:",record)
      var lnglat = [record.lng,record.lat]
      this.openInfoWindow(lnglat,record)
    }

  }
}
</script>
