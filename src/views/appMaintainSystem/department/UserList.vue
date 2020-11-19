<template>
  <div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd()">新建人员</a-button>

      <!--<a-dropdown v-action:update v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
          &lt;!&ndash; lock | unlock &ndash;&gt;
          <a-menu-item key="3"><a-icon type="lock" />启用/禁用</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>
      </a-dropdown>-->
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
        <template>
          <a @click="handleDetail(record)">详情</a>
        </template>
      </span>
    </s-table>
  </div>
</template>

<script>
  import moment from 'moment'
  import { STable } from '@/components'
  import { getUserList, deleteUser } from '@/api/manage'

  export default {
    name: 'UserList',
    components: {
      STable
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
            title: '#',
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '用户名',
            dataIndex: 'username'
          },
          {
            title: '姓名',
            dataIndex: 'name'
          },
          {
            title: '英文名',
            dataIndex: 'englishName'
          },
          {
            title: '状态',
            dataIndex: 'status',
            customRender: function (text, record, index) {
              return text === 1 ? '正式' : '离职'
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
          var queryParam = {};
          if(this.$parent.queryParam){
            queryParam= JSON.parse(JSON.stringify(this.$parent.$attrs))
          }
          Object.assign( parameter, queryParam);
          return getUserList(parameter)
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
      console.log('created.this',this)
    },
    mounted () {
      console.log('mounted.this',this)
      this.refresh(this.$attrs)
    },
    methods: {
      handleAdd () {
        this.$emit('onAddUser')
      },
      handleEdit (record) {
        this.$emit('onEditUser', record)
      },
      handleDetail (record) {
        this.$emit('onDetailUser',record)
      },

      refresh (param) {
        var _this = this
        console.log('refresh:', param)
        console.log('this.queryParam:', this.queryParam)
//        this.queryParam = Object.assign(this.queryParam, parameter)
//        Object.assign( this.queryParam,param);
        this.queryParam = param;

        console.log('refresh.this.queryParam', this.queryParam)
        this.loadData = parameter => {
          Object.assign( parameter, this.queryParam);
          return getUserList(parameter)
            .then(res => {
              return res.result
            })
        }
//        this.$nextTick(() => {
//        })
        setTimeout(function () {
          _this.loadData( Object.assign({pageNo:1, pageSize:10}, _this.queryParam) )
          _this.$refs.table.refresh(true)
        },1000)
//        this.$refs.table.refresh(true)
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
//          date: moment(new Date())
        }
      }
    }
  }
</script>
