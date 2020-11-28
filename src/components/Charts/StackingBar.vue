<template>
  <div :style="{ padding: '0 0 32px 32px' }">
    <h4 :style="{ marginBottom: '0px' }">{{ title }}</h4>
    <!--<v-chart-->
      <!--height="254"-->
      <!--:data="data"-->
      <!--:forceFit="true"-->
      <!--:padding="['auto', 'auto', '40', '50']"-->
    <!--&gt;-->
      <!--<v-tooltip />-->
      <!--<v-axis />-->
      <!--&lt;!&ndash;<v-scale x field="月份" />&ndash;&gt;-->
      <!--&lt;!&ndash;<v-scale y field="月均降雨量" />&ndash;&gt;-->
      <!--&lt;!&ndash;<v-bar series-field="name" adjust="stack" />&ndash;&gt;-->
      <!--<v-bar position="x*y"/>-->
    <!--</v-chart>-->
    <div id="mountNode" ></div>
    <!--:style="{height: '280px'}"-->
  </div>
</template>
<style type="text/css">
  #mountNode{
    height: 410px;
    padding-left: -20px;
  }
</style>
<script>

export default {
  name: 'StackingBar',
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    xArr: {
      type: Array,
      default: () => {
        return []
      }
    },
    scale: {
      type: Array,
      default: () => {
        return [{
          dataKey: 'x',
          min: 2
        }, {
          dataKey: 'y',
          title: '次数',
          min: 1
        }]
      }
    },
    tooltip: {
      type: Array,
      default: () => {
        return [
          'x*y',
          (x, y) => ({
            name: x,
            value: y
          })
        ]
      }
    }
  },
  data () {
    return {
    }
  },
  watch: {
    data (val) {
      this.init()
    }
  },
  mounted(){
    this.init();
  },
  methods:{
    init(){
      var data = this.data
      var ds = new DataSet();
      var dv = ds.createView().source(data);
      dv.transform({
        type: 'fold',
        fields: this.xArr, //['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.'], // 展开字段集
        key: '区', // key字段
        value: '案件数' // value字段
      });

      var chart = new G2.Chart({
        container: 'mountNode',
        forceFit: true,
        height: 410,
        // window.innerHeight
      });
      chart.source(dv);
      chart.intervalStack().position('区*案件数').color('name');
      chart.render();
    }
  }
}
</script>
