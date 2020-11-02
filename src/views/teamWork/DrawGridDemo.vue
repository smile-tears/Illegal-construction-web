<template>
  <a-row :gutter="8">

    <a-col :span="24">

      <a-card :bordered="false">
        <div>
          <div id="container" style="width: 100%;min-height:500px"></div>

          <div class="input-card" style="width: 120px">
            <button class="btn" @click="createPolygon()" style="margin-bottom: 5px">新建</button>
            <button class="btn" @click="closePolygon()">结束编辑</button>
            <button class="btn" @click="clearPolygon()">清除选中覆盖物</button>
            <button class="btn" @click="getPath()">获取坐标数组</button>

          </div>
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
        map: null,
        polyEditor:null,
        polygon:null
      }
    },
    mounted () {
      this.amapView()
    },
    methods: {
      amapView () {
        var _this = this
        const map = new AMap.Map('container',{
          zoom:13,
          center:[118.76979, 32.066336]
        })

        //配置编辑已有的覆盖物
        var path1 = [[118.766614,32.074773],[118.771764,32.078118],[118.784295,32.077682],[118.783609,32.059353]]
        var polygon1 = new AMap.Polygon({
          path: path1
        })
        map.add([polygon1])
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
      }
    }
  }
</script>
