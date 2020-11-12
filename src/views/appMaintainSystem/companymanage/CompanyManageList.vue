<template>
  <div class="container">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">

          <a-col :md="8" :sm="8">
            <a-form-item label="公司名称">
              <a-input v-model="queryParam.companyName" placeholder="" />
            </a-form-item>
          </a-col>
          <!-- <a-col :md="8" :sm="8">
            <a-form-item label="公司地址">
              <a-input v-model="queryParam.address" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="公司法人">
              <a-input v-model="queryParam.legalPerson" placeholder="" />
            </a-form-item>
          </a-col> -->
          <a-col :md="8" :sm="8">
            <a-form-item label="网格">
              <!-- <a-input v-model="queryParam.grid" placeholder="" /> -->
              <a-select
                show-search
                placeholder=""
                option-filter-prop="children"
                style="width: 200px"
                :filter-option="filterOption"
                v-model="queryParam.grid"
              >
                <a-select-option v-for="(grid) in gridDataList" :key="grid.id" :value="grid.id" >
                  {{grid.gridName}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-button type="primary" icon="search" @click="loadData">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => (queryParam = {})">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
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
        'show-total': (total) => `共  条`,
      }"
      @change="change"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <template slot="action" slot-scope="text, record">
        <a @click="info(record)">查看</a>
        <a-divider type="vertical" />
        <a @click="edit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="del('single', record)">删除</a>
      </template>
    </a-table>
    <CompanyManageEdit :modalData="modalData" @handleModalEvent="handleModalEvent"></CompanyManageEdit>
  </div>
</template>
<script>
import { companyManageList, companyManageDelete } from '@/api/companyManage'
import CompanyManageEdit from './CompanyManageEdit'
import {gridCommunityList} from '@/api/gridCommunity'
import qs from 'qs'

const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' },
  },
  // {
  //   title: 'id',
  //   dataIndex: 'id',
  //   key: 'id',
  // },
  {
    title: '公司名称',
    dataIndex: 'companyName',
    key: 'companyName',
  },
  {
    title: '公司地址',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '经度',
    dataIndex: 'lng',
    key: 'lng',
  },
  {
    title: '纬度',
    dataIndex: 'lat',
    key: 'lat',
  },
  {
    title: '公司法人',
    dataIndex: 'legalPerson',
    key: 'legalPerson',
  },
  // {
  //   title: '网格',
  //   dataIndex: 'grid',
  //   key: 'grid',
  // },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  components: {
    CompanyManageEdit,
  },
  mounted() {
    this.loadData()
    this.gridList()
  },
  // created() {
  //   this.eventBus.$on('transferCompanyManageNode', (companyManageNode) => {
  //     // 接收事件
  //     this.companyManageNode = companyManageNode
  //     this.loadData()
  //   })
  // },
  data() {
    return {
      data: [],
      gridDataList: [],
      columns,
      selectedRowKeys: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      companyManageNode: {},
      modalData: {},
      queryParam: {},
    }
  },
  methods: {
    loadData() {
      var params = {
        pid: this.companyManageNode.value,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        ...this.queryParam,
      }
      companyManageList(qs.stringify(params))
        .then((res) => {
          this.data = res.result.data
          this.pagination.total = res.result.totalCount
        })
        // eslint-disable-next-line handle-callback-err
        .catch((err) => {
          // Do something
        })
    },
    add() {
      this.modalData = {
        record: {
          pid: this.companyManageNode.value,
        },
        visible: true,
        disabled: false,
        title: '新建公司管理',
      }
    },
    del(type, record) {
      var ids = type === 'single' ? [record.id] : this.selectedRowKeys
      companyManageDelete(ids)
        .then((res) => {
          if (res.code === 200) {
            this.loadData()
          } else {
            this.$message.error(res.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch((err) => {
          // Do something
        })
    },
    edit(record) {
      this.modalData = {
        record: record,
        visible: true,
        disabled: false,
        title: '编辑公司管理',
      }
    },
    info(record) {
      this.modalData = {
        record: record,
        visible: true,
        disabled: true,
        title: '查看公司管理',
      }
    },
    handleModalEvent(res) {
      this.loadData()
    },
    onSelectChange(selectedRowKeys) {
      // console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys
    },
    change(pagination, filters, sorter) {
      this.pagination = pagination
      this.loadData()
    },
    gridList() {
      gridCommunityList()
        .then(res => {
          if (res.code === 200) {
            this.gridDataList = res.result.data
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          // Do something
        })
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    }
  },
}
</script>

<style lang="less" scoped>
.container {
  background: white;
  padding: 24px;
}
</style>