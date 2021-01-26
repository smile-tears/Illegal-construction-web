<template>
  <div>

    <div class="table-operator">
      <a-button  type="primary" icon="plus" @click="handleAdd()">新建人员</a-button>
      <a-upload
        style="display: inline-block;"
        name="file"
        :multiple="false"
        :action="BASE_URL+'/upload/user'"
        :file-list="fileList"
        @change="handleFileChange"
      >
        <a-button >批量导入</a-button>
      </a-upload>
      
      <a :href="BASE_URL+'/file/人员信息模板.xls'"><a-button>下载模板</a-button></a>
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
          <a-divider type="vertical" />
        </template>
        <template>
          <a @click="changePsd(record)">修改密码</a>
          <a-divider type="vertical" />
        </template>
        <template>
          <a @click="del(record)">删除</a>
          <a-divider type="vertical" />
        </template>
      </span>
    </s-table>
  </div>
</template>

<script>
  import moment from 'moment'
  import { STable } from '@/components'
  import { getUserList, deleteUser } from '@/api/manage'
  const BASE_URL = process.env.NODE_ENV === 'production' ? '' : '/api'
  export default {
    name: 'UserList',
    components: {
      STable
    },
    data () {
      return {
        BASE_URL: BASE_URL,
        fileList: [],
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
            width: '250px',
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
      handleFileChange( {fileList} ) {
      // debugger
      if (fileList[0].status !== 'uploading') {
        if (fileList[0].response.code == 200) {
          this.$message.info('上传成功！')
        } else {
          this.$message.error('上传失败，错误信息：' + fileList[0].response.message) 
        }
        this.fileList = []
      } else {
        this.fileList = fileList
      }
      
    },
      handleAdd () {
        this.$emit('onAddUser')
      },
      handleEdit (record) {
        this.$emit('onEditUser', record)
      },
      handleDetail (record) {
        this.$emit('onDetailUser',record)
      },
      changePsd (record){
        this.$emit('onChangePsd',record)
      },

      del( record) {
        var _this = this
        var ids = [record.id]
        deleteUser(ids)
          .then(res => {
            if (res.code === 200) {
              _this.refresh(_this.queryParam)
            } else {
//              _this.$message.error(res.message)
            }
          })
          // eslint-disable-next-line handle-callback-err
          .catch(err => {
            // Do something
          })
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
