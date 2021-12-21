<template>
  <div class="container">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="0">
          <a-col :md="4" :sm="8">
            <a-form-item label="标题">
              <a-input v-model="queryParam.title" style="width: 150px;"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="负责人">
              <a-input v-model="queryParam.manager" style="width: 150px;"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="安全员">
              <a-input v-model="queryParam.reportorName" style="width: 150px;"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="上报日期">
              <a-date-picker v-model="queryParam.startDate" />-
              <a-date-picker v-model="queryParam.endDate" />
            </a-form-item>
          </a-col>
          
          <a-col :md="4" :sm="8">
            <a-button type="primary" icon="search" @click="loadData">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div v-if="page == 0" class="table-operator">
      <a-button type="primary" icon="plus" @click="add">新建</a-button>
      <a-button type="danger" icon="delete" @click="del('batch')">删除</a-button>
    </div>

    <a-table
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :data-source="data"
      rowKey="id"
      :pagination="{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        'show-size-changer': true,
        'show-quick-jumper': true,
        'show-total': total => `共 ${total} 条`
      }"
      @change="change"
    >
      <span slot="serial" slot-scope="text, record, index">
        <!-- <div style="float: left;margin: auto;">
          <div v-if="parseInt(record.state) === 0" class="dot" style="background: green;width: 8px;height: 8px;border-radius: 6px;"></div>
          <div v-if="parseInt(record.state) === 1" class="dot" style="background: red;width: 8px;height: 8px;border-radius: 6px;"></div>
          <div v-if="parseInt(record.state) === 2" class="dot" style="background: red;width: 8px;height: 8px;border-radius: 6px;"></div>
        </div> -->
        {{ index + 1 }}
      </span>
      <span slot="state" slot-scope="text, record">
        <div v-if="page == 0">
          
        </div>
        <div v-if="page == 1">
          <div v-if="parseInt(record.state) === 0" class="dot" style="background: green;width: 12px;height: 12px;border-radius: 6px;"></div>
          <div v-if="parseInt(record.state) === 1" class="dot" style="background: red;width: 12px;height: 12px;border-radius: 6px;"></div>
          <div v-if="parseInt(record.state) === 2" class="dot" style="background: red;width: 12px;height: 12px;border-radius: 6px;"></div>
        </div>
        <div v-else-if="page == 2">
          
          {{record.status == '1' ? '已上报' : '' }}
          {{record.status == '2' ? '已处置' : '' }}
        </div>
      </span>
      <template slot="action" slot-scope="text,record">
        <a @click="info(record)">查看</a>
        <a-divider v-if="page == 0 || page == 1" type="vertical" />
        <a v-if="page == 0 || page == 1" @click="edit(record)">{{page == 0 ? '编辑' : '处置'}}</a>
        <a-divider v-if="page == 0" type="vertical" />
        <a v-if="page == 0" @click="del('single',record)">删除</a>

        <a-divider v-if="page == 2" type="vertical" />
        <a v-if="page == 2" @click="exportWord(record)">导出word</a>

      </template>
    </a-table>
    <ReportEdit :modalData="modalData" @handleModalEvent="handleModalEvent"></ReportEdit>
  </div>
</template>
<script>
import { caseInfoCityList, caseInfoCityList2, caseInfoCityDelete, exportWord } from '@/api/case'
import ReportEdit from './ReportEdit'
import qs from 'qs'
import { Ellipsis } from '@/components'
import moment from 'moment';
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '状态',
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title'
  },
  // {
  //   title: '问题类型',
  //   dataIndex: 'typeName',
  //   key: 'typeName'
  // },
  
  {
    title: '上报时间',
    dataIndex: 'reportTime',
    key: 'caseType'
  },
  {
    title: '上报人',
    dataIndex: 'reportorName',
    key: 'reportorName'
  },
  {
    title: '处置时限（天）',
    dataIndex: 'limittimes',
    key: 'limittimes'
  },
  {
    title: '案件截止时间',
    dataIndex: 'endDate',
    key: 'endDate'
  },
  {
    title: '备注',
    dataIndex: 'caseDesc',
    key: 'caseDesc',
    width: 200
  },
  {
    title: '地址',
    dataIndex: 'locationDesc',
    key: 'locationDesc',
    width: 200
  },
  
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 150,
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  props: {
    page: {
      type: String,
      default: '0'
    }
  },
  components: {
    ReportEdit,
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
      queryParam: {}
    }
  },
  methods: {
    moment,
    init() {
      this.loadData()
    },
    exportWord(record) {
      var params = { 
        id: record.id 
      }
      exportWord(qs.stringify(params))
        .then(res => {
          debugger
          window.open('http://49.64.220.144:8088' + res.result)
        }).catch(err => {
        
        })
    },
    dateFormat(time) {
      var date = new Date(time)
      var year = date.getFullYear()
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      // 拼接
      return year + '-' + month + '-' + day
    },
    loadData () {
      var params = {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        status: this.page,
        reportor: window.sessionStorage.getItem('id'),
        ...this.queryParam
      }
      if (params.startDate) params.startDate = this.dateFormat(params.startDate)
      if (params.endDate) params.endDate = this.dateFormat(params.endDate)
      
      // debugger
      caseInfoCityList2(qs.stringify(params))
        .then(res => {
          this.data = res.result.data
          this.pagination.total = res.result.totalCount
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          // Do something
        })
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
</style>
