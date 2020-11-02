<template>
  <div class="container">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="案件编号">
              <a-input v-model="queryParam.caseNo" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="案件状态" >
              <a-select
                style="width: 125px"
                v-model="queryParam.status"
              >
                <a-select-option value="1">待立案</a-select-option>
                <a-select-option value="2">待分派</a-select-option>
                <a-select-option value="3">案件处置</a-select-option>
                <a-select-option value="4">处置反馈件</a-select-option>
                <a-select-option value="5">案件核查</a-select-option>
                <a-select-option value="6">核查反馈件</a-select-option>
                <a-select-option value="7">申请回退</a-select-option>
                <a-select-option value="8">申请延期</a-select-option>
                <a-select-option value="10">结案</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="案件描述">
                <a-input v-model="queryParam.caseDesc" placeholder=""/>
              </a-form-item>
            </a-col>
            <!-- <a-col :md="8" :sm="24">
              <a-form-item label="案件来源" >
                <a-select
                  style="width: 125px"
                  v-decorator="['casesource1']"
                >
                  <a-select-option value="内部">内部</a-select-option>
                  <a-select-option value="外部">外部</a-select-option>
                </a-select>
                <a-select
                  style="width: 140px;margin-left: 5px"
                  v-decorator="['casesource2']">
                  <a-select-option v-for="source in caseSource" :key="source" :value="source">{{ source }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="案件类型" v-show="true">
                <a-tree-select
                  v-decorator="['casetype.id', { rules: [{ required: true, message: '案件类型必填！' }] }]"
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  :tree-data="caseTypeTreeData"
                  placeholder
                  tree-default-expand-all
                ></a-tree-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="所属网格" v-show="true">
                <a-tree-select
                  v-decorator="['gridCommunity.id', { rules: [{ required: true, message: '所属网格必填！' }] }]"
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  :tree-data="gridTreeData"
                  placeholder
                  tree-default-expand-all
                  @select="handleGridSelect"
                ></a-tree-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="上报日期">
                <a-date-picker v-model="queryParam.reportDate" style="width: 100%" placeholder="请输入上报日期"/>
              </a-form-item>
            </a-col>-->
          </template> 
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="loadData">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              <a @click="() => this.advanced = !this.advanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
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
        {{ index + 1 }}
      </span>
      <template slot="action" slot-scope="text,record">
        <a @click="info(record)">查看</a>
        <!-- <a-divider type="vertical" /> -->

      </template>
    </a-table>
    <Edit :modalData="modalData" @handleModalEvent="handleModalEvent"></Edit>
  </div>
</template>
<script>
import { caseInfoCityList2 } from '@/api/case'
import Edit from '@/views/teamWork/commandCenter/Edit'
import qs from 'qs'
import { Ellipsis } from '@/components'
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '案件编号',
    dataIndex: 'caseNo',
    key: 'caseNo'
  },
  {
    title: '案件来源',
    dataIndex: 'casesource',
    key: 'casesource'
  },
  {
    title: '案件类型',
    dataIndex: 'caseType',
    key: 'caseType'
  },
  {
    title: '样本',
    dataIndex: 'sampleName',
    key: 'sampleName'
  },
  {
    title: '案件描述',
    dataIndex: 'caseDesc',
    key: 'caseDesc'
  },
  {
    title: '位置描述',
    dataIndex: 'locationDesc',
    key: 'locationDesc'
  },
  {
    title: '上报时间',
    dataIndex: 'reporTime',
    key: 'reporTime',
  },
  {
    title: '截止日期',
    dataIndex: 'enddate',
    key: 'enddate',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  components: {
    Edit,
    Ellipsis
  },
  mounted () {
    this.loadData()
  },
  data () {
    return {
      advanced: false,
      data: [],
      columns,
      selectedRowKeys: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      modalData: {
        record: {},
        selectTab: {
          options: []
        }
      },
      queryParam: {}
    }
  },
  methods: {
    loadData () {
      var params = {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        // status: 0,
        ...this.queryParam
      }
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
    info (record) {
      this.modalData = {
        record: record,
        visible: true,
        disabled: true,
        title: '综合查询',
        seen: false
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
