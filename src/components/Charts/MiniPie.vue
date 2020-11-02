<template>
  <div class="antv-chart-mini">
    <div class="chart-wrapper" :style="{ height: 46 }">
      <!--<v-chart :force-fit="true" :height="height" :data="data" :padding="[36, 5, 18, 5]">
        <v-tooltip />
        <v-bar position="x*y" />
      </v-chart>-->
      <v-chart :force-fit="true" :height="285" :data="pieData" :scale="pieScale" >
        <v-tooltip :showTitle="false" dataKey="item*percent" />
        <v-axis />
        <!-- position="right" :offsetX="-140" -->
        <v-legend dataKey="item" />
        <v-pie position="percent" color="item" :vStyle="pieStyle" />
        <v-coord type="theta" :radius="0.75" :innerRadius="0.6" />
      </v-chart>

    </div>
  </div>
</template>

<script>
import moment from 'moment'
const DataSet = require('@antv/data-set')

const sourceData = []
//  [
//  { item: '家用电器', count: 32.2 },
//  { item: '食用酒水', count: 21 },
//  { item: '个护健康', count: 17 },
//  { item: '服饰箱包', count: 13 },
//  { item: '母婴产品', count: 9 },
//  { item: '其他', count: 7.8 },
//  { item: '家用电器1', count: 32.2 },
//  { item: '食用酒水1', count: 21 },
//  { item: '个护健康1', count: 17 },
//  { item: '服饰箱包1', count: 13 },
//  { item: '母婴产品1', count: 9 },
//  { item: '其他1', count: 7.8 }
//]


var areaArr = ["玄武",'秦淮','建邺',"鼓楼",'浦口','栖霞',"雨花台",'江宁','六合','溧水','高淳']
for(var i in areaArr){
  sourceData.push({ item: areaArr[i], count: Math.floor(Math.random() * 100) })
}


const pieScale = [{
  dataKey: 'percent',
  min: 0,
  formatter: '.0%'
}]

const dv = new DataSet.View().source(sourceData)
dv.transform({
  type: 'percent',
  field: 'count',
  dimension: 'item',
  as: 'percent'
})
const pieData = dv.rows


export default {
  name: 'MiniPie',
  data () {
    return {
//      data,
//      tooltip,
//      scale,
      height: 200,
      pieScale,
      pieData,
      sourceData,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import "chart";
</style>
