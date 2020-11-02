<template>
  <div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd2()">新建分部</a-button>
      <a-dropdown v-action:update v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDelete()"><a-icon type="delete" />删除</a-menu-item>
          <!-- lock | unlock -->
          <!--<a-menu-item key="3"><a-icon type="lock" />启用/禁用</a-menu-item>-->
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
            <!--<a-menu-item v-if="$auth('support.disable')">
              <a href="javascript:;">禁用</a>
            </a-menu-item>-->
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
  import moment from 'moment'
  import { STable } from '@/components'
  import { getSubCompanyList, deleteSubCompany } from '@/api/manage'
  import DepartmentInfo from './DepartmentInfo'

  export default {
    name: 'SubCompanyList',
    components: {
      STable,
      DepartmentInfo
    },
    data () {
      return {
        mdl: {},
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        title: "分部详情",
        // 表头
        columns: [
          {
            title: '序号',
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '分部代码',
            dataIndex: 'subCompanyCode'
          },
          {
            title: '分部名称',
            dataIndex: 'subCompanyName'
          },
          {
            title: '状态',
            dataIndex: 'canceled',
            customRender: function (text, record, index) {
              return text === 0 ? '启用' : '封存'
            }
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
          console.log('parameter', parameter)
          console.log('Subompany', this)
          this.queryParam = Object.assign(this.queryParam, parameter)
          this.queryParam.supSubCompanyId = this.$attrs.supSubCompanyId
          console.log('loadData.parameter', this.queryParam)
          return getSubCompanyList(this.queryParam)
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
        }
      }
    },
    created () {
    },

    monted (){
      console.log('SubCompanyList monted',this)
    },
    methods: {
      handleAdd2 () {
        this.$emit('onAdd2')
      },
      handleEdit (record) {
        this.$emit('onEditSub', record)
      },
      handleDelete (record) {
        var arrId = [record.id]
        deleteSubCompany(arrId)
        .then(res => {
          if(res.code === 200){
            this.$refs.table.refresh(false)
            this.$message.success('删除成功')
          }
        }).catch(() => {
          this.$message.error('删除失败')
        })
      },
      batchDelete (){
        console.log('this.selectedRowKeys', this.selectedRowKeys)
        deleteSubCompany(this.selectedRowKeys)
          .then(res => {
            if(res.code === 200){
              _this.$refs.table.refresh(false)
              this.$message.success('删除成功')
            }
          })
      },
      handleDetail (record) {
        record.type = "subCompany"
        this.$emit('onDetail',record)
      },

      refresh (parameter) {
        console.log('refresh:', parameter)
        console.log('this.queryParam:', this.queryParam)
        this.queryParam = Object.assign(this.queryParam, parameter)
        console.log('refresh.parameter', this.queryParam)
        this.loadData = parameter => {
          return getSubCompanyList(this.queryParam)
            .then(res => {
              return res.result
            })
        }
        //this.loadData(true)
        this.$refs.table.refresh(true)
      },

      onSelectChange (selectedRowKeys, selectedRows) {
        // console.log(selectedRowKeys)
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },

      resetSearchForm () {
        console.log('resetSearchForm')
        this.queryParam = {
          date: moment(new Date())
        }
      }
    }
  }
</script>
