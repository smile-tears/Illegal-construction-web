<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="8">
            <a-form-item label="菜单名称">
              <a-input v-model="queryParam.menuName" placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-button type="primary" icon="search" @click="loadData">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
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
        'show-total': total => `共 ${total} 条`
      }"
      @change="change"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="supMenuid" >
        {{ menuNode.title }}
      </span>
      <template slot="action" slot-scope="text,record">
        <a @click="info(record)">查看</a>
        <a-divider type="vertical" />
        <a @click="edit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="del('single',record)">删除</a>
      </template>
    </a-table>
    <edit :modalData="modalData" @handleModalEvent="handleModalEvent"></edit>
  </div>
</template>
<script>
import { menuList, menuDelete } from '@/api/menu'
import Edit from './Edit'
import qs from 'qs'

const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '菜单名称',
    dataIndex: 'menuName',
    key: 'menuName'
  },
  {
    title: '菜单链接',
    dataIndex: 'menuLink',
    key: 'menuLink'
  },
  {
    title: '菜单标识',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '组件名称',
    dataIndex: 'component',
    key: 'component'
  },
  {
    title: '重定向',
    dataIndex: 'redirect',
    key: 'redirect'
  },
  {
    title: '外部链接',
    dataIndex: 'target',
    key: 'target'
  },
  {
    title: '是否显示',
    dataIndex: 'visible',
    key: 'visible',
    customRender: function (text, record, index) {
      var showContent = ''
      switch (text) {
        case 0:
          showContent = '显示'
          break
        case 1:
          showContent = '不显示'
          break
        default:
          break
      }
      return showContent
    }
  },
  {
    title: '显示顺序',
    dataIndex: 'showOrder',
    key: 'showOrder'
  },
  {
    title: '父级菜单',
    dataIndex: 'supMenuid',
    key: 'supMenuid',
    scopedSlots: { customRender: 'supMenuid' }
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
    Edit
  },
  created () {
    this.eventBus.$on('transferMenuNode', menuNode => {
      // 接收事件
      this.menuNode = menuNode
      this.loadData()
    })
  },
  data () {
    return {
      eventBus: this.$EventBus(this),
      data: [],
      columns,
      selectedRowKeys: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      menuNode: {},
      modalData: {},
      queryParam: {}
    }
  },
  methods: {
    loadData () {
      var params = {
        supMenuid: this.menuNode.value,
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        ...this.queryParam
      }
      menuList(qs.stringify(params))
        .then(res => {
          if (res.code === 200) {
            this.data = res.result.data
            this.pagination.total = res.result.totalCount
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          // Do something
        })
    },
    add () {
      this.modalData = {
        record: {
          supMenuid: this.menuNode.value
        },
        visible: true,
        disabled: false,
        title: '新建菜单'
      }
    },
    del (type, record) {
      var ids = type === 'single' ? [record.id] : this.selectedRowKeys
      menuDelete(ids)
        .then(res => {
          if (res.code === 200) {
            this.loadData()
            this.eventBus.$emit('refreshMenuTree', this.menuNode)
          } else {
            this.$message.error(res.message)
          }
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
        title: '编辑菜单'
      }
    },
    info (record) {
      this.modalData = {
        record: record,
        visible: true,
        disabled: true,
        title: '查看菜单'
      }
    },
    handleModalEvent (res) {
      this.loadData()
      this.eventBus.$emit('refreshMenuTree', this.menuNode)
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
