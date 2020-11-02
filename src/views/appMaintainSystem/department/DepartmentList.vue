<template>
  <div>

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="部门名称">
              <a-input v-model="queryParam.departmentName" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="部门状态">
              <a-select v-model="queryParam.canceled" placeholder="请选择" default-value="0">
                <a-select-option value="0">启用</a-select-option>
                <a-select-option value="1">封存</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset()">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd()">新建部门</a-button>
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
  import { STable, Ellipsis } from '@/components'
  import { getDepartmentList, deleteDepartment } from '@/api/manage'

  export default {
    name: 'DepartmentList',
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
            title: '部门ID',
            dataIndex: 'departmentCode'
          },
          {
            title: '部门名称',
            dataIndex: 'departmentName'
          },
          {
            title: '部门简称',
            dataIndex: 'departmentMask'
          },
          {
            title: '描述',
            dataIndex: 'departmentDesc',
            scopedSlots: { customRender: 'desc' }
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
          this.queryParam = Object.assign(this.queryParam, parameter)
          console.log('loadData.parameter', this.queryParam)
          return getDepartmentList(this.queryParam)
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
    methods: {
      handleAdd () {
        this.$emit('onAdd')
      },
      handleEdit (record) {
        this.$emit('onEdit', record)
      },
      handleDelete (record) {
        var arrId = [record.id]
        deleteDepartment(arrId)
        .then(res => {
          if(res.code === 200){
            this.$refs.table.refresh(false)
            this.$message.success('删除成功')
          }
        }).catch(() => {
          console.log('deleteDepartment err:',res)
          this.$message.error('删除失败')
        })
      },
      batchDelete (){
        console.log('this.selectedRowKeys', this.selectedRowKeys)
        deleteDepartment(this.selectedRowKeys)
          .then(res => {
            if(res.code === 200){
              _this.$refs.table.refresh(false)
              this.$message.success('删除成功')
            }
          })
      },
      handleDetail (record) {
        record.type = "department"
        this.$emit('onDetail',record)
      },
      reset () {
        this.queryParam.departmentName = null
        this.queryParam.canceled = null
      },

      refresh (parameter) {
        console.log('refresh:', parameter)
        console.log('this.queryParam:', this.queryParam)
        this.queryParam = Object.assign(this.queryParam, parameter)
        console.log('refresh.parameter', this.queryParam)
        this.loadData = parameter => {
          return getDepartmentList(this.queryParam)
            .then(res => {
              return res.result
            })
        }
        // this.loadData(true)
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
