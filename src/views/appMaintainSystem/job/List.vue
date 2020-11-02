<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="岗位名称">
              <a-input v-model="queryParam.jobName" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd()">新建</a-button>
      <!--<a-dropdown v-action:export>
        <a-menu slot="overlay">
          <a-menu-item key="1"><a-icon type="delete" />Excel（当前页）</a-menu-item>
          <a-menu-item key="2"><a-icon type="solution" />Excel（全部）</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          导出 <a-icon type="down" />
        </a-button>
      </a-dropdown>-->
      <a-dropdown v-action:update v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDelete()"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>

      <span slot="desc" slot-scope="text, record, index">
        <Ellipsis :length="36" tooltip>{{text}}</Ellipsis>
      </span>


      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
        </template>
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a @click="handleDetail(record)">详情</a>
            </a-menu-item>
            <a-menu-item v-if="$auth('support.delete')">
              <a @click="handleDelete(record)">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>
  </div>
</template>

<script>
import { STable,Ellipsis } from '@/components'
import { getJobList, deleteJob } from '@/api/manage'

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '岗位名称',
          dataIndex: 'jobName'
        },
        {
          title: '岗位简称',
          dataIndex: 'jobMask'
        },
        {
          title: '岗位描述',
          dataIndex: 'jobDesc',
          scopedSlots: { customRender: 'desc' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getJobList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.result
          })
      },
      selectedRowKeys: [],
      selectedRows: [],

      // custom table alert & rowSelection
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false
    }
  },
  created () {
    this.tableOption()
    // getJobList({ t: new Date() })
  },
  methods: {
    tableOption () {
      if (!this.optionAlertShow) {
        this.options = {
          alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange
          }
        }
        this.optionAlertShow = true
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow = false
      }
    },

    handleAdd () {
      this.$emit('onAdd')
    },
    handleOk () {

    },
    handleEdit (record) {
      // alert(2)
      this.$emit('onEdit', record)
    },
    handleDetail (record) {
      console.log('record',record)
      this.$emit('onDetail', record)
    },
    handleDelete (record) {
      const _this = this
      var arrId = [record.id]
      deleteJob(arrId)
      .then(res => {
        _this.$refs.table.refresh(false)
        this.$message.success('删除成功')
      })
    },
    batchDelete (){
      console.log('this.selectedRowKeys', this.selectedRowKeys)
      deleteJob(this.selectedRowKeys)
        .then(res => {
          _this.$refs.table.refresh(false)
          this.$message.success('删除成功')
        })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
       // console.log(selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    refresh (parameter) {
      this.loadData = parameter => {
        return getJobList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.result
          })
      }
      this.$refs.table.refresh(true)
    },
    resetSearchForm () {

    }
  }
}
</script>

<style  lang="less">
  .colClass {
    text-align: center;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width:90%;
  }
</style>
