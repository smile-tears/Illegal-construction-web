<template>
  <div class='container'>
  	<!-- <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
            		  <a-col :md="8" :sm="8">
            <a-form-item label="id">
              <a-input v-model="queryParam.id" placeholder=""/>
            </a-form-item>
          </a-col>
  		  <a-col :md="8" :sm="8">
            <a-form-item label="类型名称">
              <a-input v-model="queryParam.typeName" placeholder=""/>
            </a-form-item>
          </a-col>
  		  <a-col :md="8" :sm="8">
            <a-form-item label="显示顺序">
              <a-input v-model="queryParam.showOrder" placeholder=""/>
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
        'show-total': total => `共  条`
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
    <QuestionTypeEdit :modalData="modalData" @handleModalEvent="handleModalEvent"></QuestionTypeEdit>
  </div>
</template>
<script>
import { questionTypeList, questionTypeDelete } from '@/api/questionType'
import QuestionTypeEdit from './QuestionTypeEdit'
import qs from 'qs'

const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' }
  },
  { 
    title: '类型名称',
    dataIndex: 'typeName',    
    key: 'typeName',                              
  },
  { 
    title: '显示顺序',
    dataIndex: 'showOrder',    
    key: 'showOrder',                              
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
    QuestionTypeEdit
  },
  created () {
    this.loadData()
  },
  data() {
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
    loadData() {
      var params = {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        ...this.queryParam
      }
      questionTypeList(qs.stringify(params))
        .then(res => {
          this.data = res.result.data
          this.pagination.total = res.result.totalCount
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          // Do something
        })
    },
    add() {
      this.modalData = {
        record: {
        },
        visible: true,
        disabled: false,
        title: '新建问题类型'
      }
    },
    del(type, record) {
      var ids = type === 'single' ? [record.id] : this.selectedRowKeys
      questionTypeDelete(ids)
        .then(res => {
          if (res.code === 200) {
            this.loadData()
          } else {
            this.$message.error(res.message)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          // Do something
        })
    },
    edit(record) {
      this.modalData = {
        record: record,
        visible: true,
        disabled: false,
        title: '编辑问题类型'
      }
    },
    info(record) {
      this.modalData = {
        record: record,
        visible: true,
        disabled: true,
        title: '查看问题类型'
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