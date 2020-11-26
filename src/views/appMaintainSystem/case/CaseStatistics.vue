<template>
  <a-row id="fullContainer" :gutter="8">

    <a-col :span="24">
      <div class="container">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="8">
              <a-form-item label="日期">
                <a-range-picker @change="changeDate" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="6">
              <a-form-item label="网格">
                <a-input v-model="queryParam.grid" style="width: 250px;"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="6">
              <a-form-item label="人员">
                <a-input v-model="queryParam.manager" style="width: 250px;"/>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="4">
              <a-button type="primary" icon="search" @click="loadData">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </a-col>
          </a-row>
        </a-form>

        <a-table
          :columns="columns"
          :data-source="data"
          rowKey="id"
          :pagination="false"
        >
        </a-table>
        <!--<ReportEdit :modalData="modalData" @handleModalEvent="handleModalEvent"></ReportEdit>-->

      </div>


    </a-col>

    <a-col :md="8" :sm="8">
      <!--<a-card :bordered="false" class="chartContainer">-->
        <!--饼图-->
      <!--</a-card>-->

      <a-card class="antd-pro-pages-dashboard-analysis-salesCard chartContainer"  :bordered="false" title="违建类型占比" :style="{ height: '100%' }">

        <div>
          <v-chart :force-fit="true" :height="405" :data="pieData" :scale="pieScale">
            <v-tooltip :showTitle="false" dataKey="item*percent" />
            <v-axis />
            <!-- position="right" :offsetX="-140" -->
            <v-legend dataKey="item"/>
            <v-pie position="percent" color="item" :vStyle="pieStyle" />
            <v-coord type="theta" :radius="0.75" :innerRadius="0.6" />
          </v-chart>
        </div>
      </a-card>
    </a-col>

    <a-col :md="16" :sm="16">
      <a-card class="antd-pro-pages-dashboard-analysis-salesCard chartContainer"  :bordered="false" title="社区案件数" :style="{ height: '100%' }">

        <div>
          <stacking-bar :data="barData2" :xArr="areaArr" :style="{padding:'0px'}"/>

        </div>
      </a-card>
    </a-col>

  </a-row>


</template>
<script>
  import { caseInfoCityList, caseInfoCityList2, caseInfoCityDelete } from '@/api/case'
//  import ReportEdit from './ReportEdit'
  import qs from 'qs'
  import { Ellipsis } from '@/components'
  import { StackingBar } from '@/components'
  const columns = [
    {
      title: '网格',
      dataIndex: 'gridName',
      key: 'gridName',
      customRender: (value, row, index) => {
        const obj = {
          children: value,
          attrs: {},
        };
        console.log(row,index);
        if (row.rowSpan > 0) {
          obj.attrs.rowSpan = row.rowSpan;
        }else{
          obj.attrs.rowSpan = 0;
        }
        return obj;
      }
    },
    {
      title: '人员',
      dataIndex: 'manager',
      key: 'manager'
    },
    {
      title: '上报数',
      dataIndex: 'reportNum',
      key: 'reportNum'
    },
    {
      title: '结案数',
      dataIndex: 'dealedNum',
      key: 'dealedNum'
    },
    {
      title: '办结率',
      dataIndex: 'dealedPercent',
      key: 'dealedPercent'
    },
    {
      title: '超时案',
      dataIndex: 'overtimeNum',
      key: 'overtimeNum'
    },
    {
      title: '超时率',
      dataIndex: 'overtimePercent',
      key: 'overtimePercent'
    }
  ]

  //柱状图
  var barData2 = []
  var typeArr = ["常规共性内容",'危化品生产企业和使用危化品从事生产的化工企业','危化品经营企业','工贸企业中危化品的储存和使用',
    '冶金企业','有色行业企业','机械行业企业','轻工行业企业','纺织行业企业','涉爆粉尘','液氨储存及氨分解','动火作业','有限空间','电气设备设施',
    '外包作业','员工的不安全行为','消防安全','出租厂房']
  var areaArr = ["堰桥",'西漳','天一',"堰北"]
  for(var i in typeArr){
    var itemObj = {
      name:typeArr[i]
    }
    for(var j in areaArr){
      itemObj[areaArr[j]] = Math.floor(Math.random() * 100)
    }
    barData2.push(itemObj)
  }

  //饼图
  const DataSet = require('@antv/data-set')
  const sourceData = [
//    { item: '家用电器', count: 32.2 },
//    { item: '食用酒水', count: 21 },
//    { item: '个护健康', count: 17 },
//    { item: '服饰箱包', count: 13 },
//    { item: '母婴产品', count: 9 },
//    { item: '其他', count: 7.8 }
  ]

  for(var i in typeArr){
    var itemObj = {
      item: typeArr[i],
      count: Math.floor(Math.random() * 100)
    }
    sourceData.push(itemObj)
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
    props: {
      page: {
        type: String,
        default: '0'
      }
    },
    components: {
//      ReportEdit,
      StackingBar,
      Ellipsis
    },
    watch: {
      page (val) {
        this.init()
      }
    },
    mounted () {
      this.init()
    },

    data () {
      return {
        data: [],
        columns,
        selectedRowKeys: [],
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        modalData: {},
        queryParam: {},

        //饼图
        pieScale,
        pieData,
        sourceData,
        pieStyle: {
          stroke: '#fff',
          lineWidth: 1
        },

        //柱状图
        barData2,
        areaArr
      }
    },
    methods: {
      changeDate(date, dateString) {
        console.log(date, dateString);
        this.queryParam.startDate = dateString[0];
        this.queryParam.endDate = dateString[1];
      },

      init() {
        this.loadData()
      },
      loadData () {
        var params = {
          ...this.queryParam
        }

        this.data = [
          {
            gridName: '堰桥片区',
            manager: '人员1',
            reportNum: '20',
            dealedNum: '16',
            dealedPercent: '80%',
            overtimeNum: '2',
            overtimePercent: '10',
            rowSpan:'2'
          },
          {
            gridName: '堰桥片区',
            manager: '人员2',
            reportNum: '20',
            dealedNum: '18',
            dealedPercent: '90%',
            overtimeNum: '2',
            overtimePercent: '10',
            rowSpan:'0'
          },
          {
            gridName: '西漳片区',
            manager: '人员3',
            reportNum: '20',
            dealedNum: '18',
            dealedPercent: '90%',
            overtimeNum: '2',
            overtimePercent: '10',
            rowSpan:'3'
          },
          {
            gridName: '西漳片区',
            manager: '人员4',
            reportNum: '20',
            dealedNum: '18',
            dealedPercent: '90%',
            overtimeNum: '2',
            overtimePercent: '10',
            rowSpan:'0'
          },
          {
            gridName: '西漳片区',
            manager: '人员5',
            reportNum: '20',
            dealedNum: '18',
            dealedPercent: '90%',
            overtimeNum: '2',
            overtimePercent: '10',
            rowSpan:'0'
          }
        ];
//        var a = this.$store
//        caseInfoCityList2(qs.stringify(params))
//          .then(res => {
//            this.data = res.result.data
//            this.pagination.total = res.result.totalCount
//          })
//          .catch(err => {
//          })
      },
      del (type, record) {
        var ids = type === 'single' ? [record.id] : this.selectedRowKeys
        caseInfoCityDelete(ids)
          .then(res => {
            this.loadData()
          })
          // eslint-disable-next-line handle-callback-err
          .catch(err => {
            // Do something
          })
      },
      add () {
        this.modalData = {
          record: {},
          visible: true,
          view: false,
          title: '案件信息',
          page: this.page
        }
      },
      edit (record) {
        this.modalData = {
          record: record,
          visible: true,
          view: false,
          title: '案件信息',
          page: this.page
        }
      },
      info (record) {
        this.modalData = {
          record: record,
          visible: true,
          view: true,
          title: '案件信息',
          page: this.page
        }
      },
      handleModalEvent (res) {
        this.loadData()
      },
      onSelectChange (selectedRowKeys) {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.selectedRowKeys = selectedRowKeys
      },
      change (pagination, filters, sorter) {
        this.pagination = pagination
        this.loadData()
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    background: white;
    padding: 24px;
  }
  .chartContainer{
    margin-top:10px;
    margin-bottom: 10px;
  }
</style>
