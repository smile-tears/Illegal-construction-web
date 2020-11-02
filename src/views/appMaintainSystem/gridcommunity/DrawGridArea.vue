<template>
  <a-row :gutter="8">

    <a-col :span="24">

      <a-card :bordered="false" style="padding: 0">
        <div id="drawGridArea">
          <div >
            在地图上点击确定坐标，以多个坐标来定义范围 &nbsp;&nbsp;&nbsp;&nbsp;
            <button class="btn" v-if="showXz" @click="createPolygon()" >新增区间</button>
            <button class="btn" @click="adjustPolygon()">开始微调</button>
            <button class="btn" @click="closePolygon()">结束编辑</button>
            <button class="btn" @click="clearPolygon()">重新定义区间</button>
            <!--<button class="btn" @click="getPath()">获取坐标数组</button>-->
          </div>
          <div id="container1" style="width: 100%;min-height:500px"></div>
        </div>
      </a-card>
    </a-col>


  </a-row>

</template>
<style>

</style>
<script>
  //import AMap from 'AMap'
  export default {
    components: {
    },
    name: 'DrawGridArea',
    data () {
      return {
        showXz:true,
        eventBus: this.$EventBus(this),
        map: null,
        polyEditor:null,
        polygon:null,
        gridPosition:null,
        gridPoint:null
      }
    },

    mounted () {

      let record = this.$attrs.record;
      let gridPosition = record.gridPosition!=''&& record.gridPosition!=null?eval("("+record.gridPosition+")"):'';
      this.gridPosition = gridPosition;
      let gridPoint = record.coordinate!='' && record.coordinate!=null ?record.coordinate:'';
      this.gridPoint = gridPoint;
      this.amapView();
      this.closePolygon();
      //document.querySelector('#drawGridArea').parentNode.style.padding = 0;
      //document.querySelector('#drawGridArea').parentNode.parentNode.parentNode.parentNode.parentNode.style.padding = 0;
      if(gridPosition!='' && gridPosition!=null)
      {
        this.showXz = false;
      }
     /* var that = this;
      this.eventBus.$on("getGridPosition", (record) => {
        // A发送来的消息
        //console.log(record);
        console.log(222);
        let gridPosition = record.gridPosition!=''?eval("("+record.gridPosition+")"):'';
        console.log(gridPosition)
        that.amapView(gridPosition);
        this.closePolygon();
      });*/
    },
    methods: {
      amapView () {
        var gridPosition = this.gridPosition;
        var gridPoint = this.gridPoint;
        //record.coordinate.split(",").map(Number)
        var _this = this;
        let center = [116.471354, 39.994257];
        if(gridPoint != '')
        {
          center = gridPoint.split(",").map(Number);
        }
        var map = new AMap.Map("container1", {
          center: center,
          zoom: 16.8
        });
        if(gridPosition!='' && gridPosition!=null)
        {
           var polygon1 = new AMap.Polygon({
             path: gridPosition
           });
           map.add([polygon1]);
          polygon1.on('dblclick', () => {
            _this.polygon = polygon1;
            polyEditor.setTarget(polygon1);
            polyEditor.open();
          });
          this.polygon = polygon1;
        }

        map.setFitView();
        var polyEditor = new AMap.PolygonEditor(map);
        /*polyEditor.addAdsorbPolygons([polygon1]);*/
        polyEditor.on('add', function (data) {
          var polygon = data.target;
          polyEditor.addAdsorbPolygons(polygon);
          polygon.on('dblclick', () => {
            _this.polygon = polygon;
            polyEditor.setTarget(polygon);
            polyEditor.open();
          });
          _this.polygon = polygon;
          _this.$emit('positionValue',JSON.stringify( this.getPath()[0] ));
          _this.showXz = false;
        });
        polyEditor.on('adjust', function(event) {
          _this.$emit('positionValue', _this.getPath() );
        });
        polyEditor.on('addnode', function(event) {
          _this.$emit('positionValue', _this.getPath() );
        });
        /*polygon1.on('dblclick', () => {
          _this.polygon = polygon1;
          polyEditor.setTarget(polygon1);
          polyEditor.open();
        });*/
        this.map = map;
        this.polyEditor = polyEditor;
        polyEditor.close();

      },
      getPath(){
        if(this.polygon){
          var arr = this.parsePath(this.polygon.getPath())
          return JSON.stringify(arr)
        }else{
          console.log("没有选中的多边形");
          return '';
        }
      },
      parsePath (path) {
        var arr = [];
        path.forEach(function (item) {
          arr.push([item.lng,item.lat])
        });
        return arr
      },
      createPolygon () {
        const polyEditor = this.polyEditor;
        polyEditor.close();
        polyEditor.setTarget();
        this.polygon = null;

        polyEditor.open();

      },
      adjustPolygon(){

        this.polyEditor.setTarget(this.polygon);
        this.polyEditor.open();
      },
      clearPolygon () {
        if(this.polygon){
          this.polyEditor.removeAdsorbPolygons(this.polygon);
          this.polyEditor.close();
          this.map.remove([this.polygon]);
          this.polygon = null;
          //his.polygon = null;
          this.createPolygon();
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
