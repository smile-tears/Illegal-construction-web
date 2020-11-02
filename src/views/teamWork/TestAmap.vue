<template>
    <a-row :gutter="8">
      <a-col :span="14">

        <a-card :bordered="false">
          <register-list></register-list>
        </a-card>
      </a-col>

      <a-col :span="10">
        <a-card :bordered="false" style="margin-bottom: 8px;">
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
        </a-card>

        <a-card :bordered="false">
          <div>
            <div id="container" style="width: 100%;min-height:500px"></div>
          </div>
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
</style>
<script>
//import AMap from 'AMap'
import RegisterList from './register/List'

export default {
  components: {
    RegisterList
  },
  name: 'TestAmap',
  data () {
    return {
      markerArr:[[118.76979, 32.066336],[118.77979, 32.066336],[118.76979, 32.077336]]
    }
  },
  mounted () {
    this.amapView()
  },
  methods: {
    amapView () {
      // var map = new AMap.Map('container');
      const map = new AMap.Map('container',{
        zoom:13,
        center:[118.76979, 32.066336]
      })
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
      // 聚合点数据应该是一组包含经纬度信息的数组。lnglat 为经纬度信息字段，weight 字段为可选数据，表示权重值，以权重高的点为中心进行聚合。
      var points = [
        { weight: 8, lnglat: ["118.76979", "32.066336"], myid:'001' },
        { weight: 1,  lnglat: ["118.77979", "32.066336"], myid:'002' },
        { weight: 1, lnglat: ["118.76979", "32.046336"], myid:'003' },
        { weight: 1, lnglat: ["118.76979", "32.096336"], myid:'004' },
        { weight: 1, lnglat: ["118.73979", "32.066336"], myid:'005' }
      ];

      const gridSize = 60
      var count = points.length;

      var _renderClusterMarker = function (context) {
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
      };
      var _renderMarker = function(context) {
        var content = '<div style="background-color: hsla(180, 100%, 50%, 0.3); height: 18px; width: 18px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 3px;"></div>';
        var offset = new AMap.Pixel(-9, -9);
        context.marker.setContent(content)
        context.marker.setOffset(offset)
        context.marker.on('click', function(e) {
          console.log('e:',e);
        });
      }

      var cluster;
      //添加聚合组件
      map.plugin(["AMap.MarkerClusterer"],function() {
        cluster = new AMap.MarkerClusterer(
          map,     // 地图实例
          points, // 海量点数据，数据中需包含经纬度信息字段 lnglat
          {
            //styles: styles
            gridSize: gridSize, // 设置网格像素大小
            renderClusterMarker: _renderClusterMarker, // 自定义聚合点样式
            renderMarker: _renderMarker // 自定义非聚合点样式
          });
      });
      map.setFitView()


      function openInfo(myid,marker,e){
        new SimpleInfoWindow({
          infoTitle: '<strong>案件信息</strong>',
          infoBody: '<p class="my-desc"><span id="last-time"></span><br/><table id="chwin"></table></p>',
          //基点指向marker的头部位置
          offset: new AMap.Pixel(-45, -31)
        }).open(map, marker.getPosition());
      }
    },
  }
}
</script>
