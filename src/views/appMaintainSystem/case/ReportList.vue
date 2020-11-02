<template>
  <div class="container">
    <!-- <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="8">
            <a-form-item label="角色名称">
              <a-input v-model="queryParam.caseName" placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-button type="primary" icon="search" @click="loadData">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div> -->
    <div class="table-operator">
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
        {{ index + 1 }}
      </span>
      <template slot="action" slot-scope="text,record">
        <a @click="info(record)">查看</a>
        <a-divider type="vertical" />
        <a @click="edit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="del('single',record)">删除</a>
      </template>
    </a-table>
    <ReportEdit :modalData="modalData" @handleModalEvent="handleModalEvent"></ReportEdit>
  </div>
</template>
<script>
import { caseInfoCityList, caseInfoCityList2, caseInfoCityDelete } from '@/api/case'
import ReportEdit from './ReportEdit'
import qs from 'qs'
import { Ellipsis } from '@/components'
const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' }
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
    key: 'reporTime'
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
    ReportEdit,
    Ellipsis
  },
  mounted () {
    this.loadData()
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
    loadData () {
      var params = {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        status: 0,
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
    add () {
      this.modalData = {
        record: {},
        visible: true,
        disabled: false,
        title: '问题上报'
      }
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
    edit (record) {
      this.modalData = {
        record: record,
        visible: true,
        disabled: false,
        title: '问题上报'
      }
    },
    info (record) {
      this.modalData = {
        record: record,
        visible: true,
        disabled: true,
        title: '问题上报'
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
