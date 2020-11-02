<template>
  <a-row :gutter="8">

    <a-col :span="24">

      <a-card :bordered="false">
        <div id="drawGridDiv">
          <div id="container" style="width: 100%;min-height:500px"></div>
        </div>
      </a-card>
    </a-col>


  </a-row>

</template>
<script>
  //import AMap from 'AMap'

  export default {
    components: {

    },

    name: 'DrawGrid',
    data () {
      return {
        eventBus: this.$EventBus(this),
        map: null,
        polyEditor:null,
        polygon:null,
        positionValue:null
      }
    },
    created() {


    },
    mounted () {
      document.querySelector('#drawGridDiv').parentNode.style.padding = 0;
      document.querySelector('#drawGridDiv').parentNode.parentNode.parentNode.parentNode.parentNode.style.padding = 0;
      let record = this.$attrs.record;
      let position = record.coordinate!=''&&record.coordinate!=null?record.coordinate.split(",").map(Number):'';
      this.positionValue = position;
      this.amapView();

    },
    methods: {
      amapView () {
        var positionValue = this.positionValue;
        var _this = this;
        const map = new AMap.Map('container',{
          zoom:13,
          center:[118.76979, 32.066336]
        })
        //添加默认的icon
        var endIcon = new AMap.Icon({
          size: new AMap.Size(25, 34),
          image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
          imageSize: new AMap.Size(135, 40),
          imageOffset: new AMap.Pixel(-95, -3)
        });

        var endMarker = null;
        if(positionValue!='' && positionValue!=null)
        {
          endMarker = new AMap.Marker({
            position: new AMap.LngLat(...positionValue),
            icon: endIcon,
            offset: new AMap.Pixel(-13, -30)
          });
          map.add(endMarker);
        }

        //为鼠标添加点击事件
        map.on('click', function(e) {
          if(endMarker == null)
          {
            endMarker = new AMap.Marker({
              position: new AMap.LngLat(e.lnglat.getLng(),e.lnglat.getLat()),
              icon: endIcon,
              offset: new AMap.Pixel(-13, -30)
            });
            map.add(endMarker);
          }
          endMarker.setPosition([e.lnglat.getLng(),e.lnglat.getLat()])
          _this.$emit('positionValue',e.lnglat.getLng()+','+e.lnglat.getLat())
        });
        // 创建一个 icon

        // 将 icon 传入 marker

      },

    }
  }
</script>
