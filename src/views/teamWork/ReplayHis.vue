<template>
  <a-card :bordered="false">
    <div id="container" style="width: 100%; height:100%; min-height:500px">
    </div>

    <div class="input-card">
      <h4>轨迹回放控制</h4>
      <div class="input-item">
        <input type="button" class="btn" value="开始动画" id="start" @click="startAnimation()"/>
        <input type="button" class="btn" value="暂停动画" id="pause" @click="pauseAnimation()"/>
      </div>
      <div class="input-item">
        <input type="button" class="btn" value="继续动画" id="resume" @click="resumeAnimation()"/>
        <input type="button" class="btn" value="停止动画" id="stop" @click="stopAnimation()"/>
      </div>
    </div>
  </a-card>

</template>
<style>
  .input-card .btn{
    margin-right: 1.2rem;
    width: 9rem;
  }

  .input-card .btn:last-child{
    margin-right: 0;
  }
</style>
<script>
  export default {
    components: {
    },
    name: 'ReplayHis',
    data () {
      return {
        marker: null,
        lineArr: []
      }
    },
    mounted () {
      this.amapView()
    },
    methods: {
      amapView(){
        var _this = this
        // JSAPI2.0 使用覆盖物动画必须先加载动画插件
        AMap.plugin('AMap.MoveAnimation', function(){
          var marker, lineArr = [[116.478935,39.997761],[116.478939,39.997825],[116.478912,39.998549],[116.478912,39.998549],[116.478998,39.998555],[116.478998,39.998555],[116.479282,39.99856],[116.479658,39.998528],[116.480151,39.998453],[116.480784,39.998302],[116.480784,39.998302],[116.481149,39.998184],[116.481573,39.997997],[116.481863,39.997846],[116.482072,39.997718],[116.482362,39.997718],[116.483633,39.998935],[116.48367,39.998968],[116.484648,39.999861]];

          var map = new AMap.Map("container", {
            resizeEnable: true,
//            center: [116.397428, 39.90923],
            zoom: 17
          });

          marker = new AMap.Marker({
            map: map,
            position: [116.478935,39.997761],
            icon: "https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png",
            offset: new AMap.Pixel(-13, -26),
          });

          // 绘制轨迹
          var polyline = new AMap.Polyline({
            map: map,
            path: lineArr,
            showDir:true,
            strokeColor: "#28F",  //线颜色
            // strokeOpacity: 1,     //线透明度
            strokeWeight: 6,      //线宽
            // strokeStyle: "solid"  //线样式
          });

          var passedPolyline = new AMap.Polyline({
            map: map,
            strokeColor: "#AF5",  //线颜色
            strokeWeight: 6,      //线宽
          });


          marker.on('moving', function (e) {
            passedPolyline.setPath(e.passedPath);
          });

          _this.lineArr = lineArr
          _this.marker = marker
          map.setFitView()
        })
      },

      amapView14() {
        var lineArr = [[116.478935,39.997761],[116.478939,39.997825],[116.478912,39.998549],[116.478912,39.998549],[116.478998,39.998555],[116.478998,39.998555],[116.479282,39.99856],[116.479658,39.998528],[116.480151,39.998453],[116.480784,39.998302],[116.480784,39.998302],[116.481149,39.998184],[116.481573,39.997997],[116.481863,39.997846],[116.482072,39.997718],[116.482362,39.997718],[116.483633,39.998935],[116.48367,39.998968],[116.484648,39.999861]];
        var marker

        var map = new AMap.Map("container", {
          resizeEnable: true,
          center: [116.397428, 39.90923],
          zoom: 17
        });

        marker = new AMap.Marker({
          map: map,
          position: [116.478935,39.997761],
          icon: "https://webapi.amap.com/images/car.png",
          offset: new AMap.Pixel(-26, -13),
          autoRotation: true,
          angle:-90,
        });

        // 绘制轨迹
        var polyline = new AMap.Polyline({
          map: map,
          path: lineArr,
          showDir:true,
          strokeColor: "#28F",  //线颜色
          // strokeOpacity: 1,     //线透明度
          strokeWeight: 6,      //线宽
          // strokeStyle: "solid"  //线样式
        });

        var passedPolyline = new AMap.Polyline({
          map: map,
          // path: lineArr,
          strokeColor: "#AF5",  //线颜色
          // strokeOpacity: 1,     //线透明度
          strokeWeight: 6,      //线宽
          // strokeStyle: "solid"  //线样式
        });


        marker.on('moving', function (e) {
          passedPolyline.setPath(e.passedPath);
        });
        this.lineArr = lineArr
        this.marker = marker

        map.setFitView();
      },
      startAnimation () {
        var lineArr = this.lineArr
        this.marker.moveAlong(lineArr, {
          // 每一段的时长
          duration: 200,
          // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
          autoRotation: true,
        });
      },
      pauseAnimation () {
        this.marker.pauseMove()
      },
      resumeAnimation () {
        this.marker.resumeMove()
      },
      stopAnimation () {
        this.marker.stopMove()
      }

    }
  }
</script>
