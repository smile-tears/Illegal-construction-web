<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="位置描述">
              <a-input v-model="queryParam.locationDesc" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="案件描述">
              <a-input v-model="queryParam.caseDesc" placeholder=""/>
            </a-form-item>
          </a-col>
          <!-- <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="案件来源">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option :value="1">立案</a-select-option>
                  <a-select-option :value="2">处理中</a-select-option>
                  <a-select-option :value="3">已解决</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="案件类型">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option :value="1">立案</a-select-option>
                  <a-select-option :value="2">处理中</a-select-option>
                  <a-select-option :value="3">已解决</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template> -->
          <a-col :sm="8">
            <a-button type="primary" @click="loadData">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
          </a-col>
          <!-- <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col> -->
        </a-row>
      </a-form>
    </div> 

    <!-- <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleEdit()">新建</a-button>
      <a-button type="dashed" @click="tableOption">{{ optionAlertShow && '关闭' || '开启' }} alert</a-button>
      <a-dropdown v-action:update v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
          <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div> -->

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
      :customRow="showRow"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <template slot="action" slot-scope="text,record">
        <a @click="confirmCase(record)">立案</a>
      </template>
    </a-table>
    <ReportEdit :modalData="modalData" @handleModalEvent="handleModalEvent"></ReportEdit>
  </div>
</template>

<script>
import { caseInfoCityList, caseInfoCityPut, caseInfoCityList2 } from '@/api/case'
import qs from 'qs'
import ReportEdit from '@/views/appMaintainSystem/case/ReportEdit'
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
      var _this = this
      var params = {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        status: 1,
        ...this.queryParam
      }
      caseInfoCityList2(qs.stringify(params))
        .then(res => {
          this.data = res.result.data
          this.pagination.total = res.result.totalCount

          this.data.forEach(function(row){
            row.weight = 1
            row.lnglat = [row.lng,row.lat]
          })
          console.log('caseInfoCityList2:',this.data)
          setTimeout(function(){
            _this.$emit("showMarker",_this.data)
          },500)
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          // Do something
        })
    },
    showRow(record, index) {
      var _this = this
      return {
        on: {
//          dblclick: () => {
//            console.log('dblclick')
//            console.log(record,index)
//            _this.$emit("showCase",record)
//          }
          click: () => {
//            console.log('click')
//            console.log(record,index)
            _this.$emit("showCase",record)
          }
        }
      }
    },
    confirmCase(record) {
      this.modalData = {
        record: JSON.parse(JSON.stringify(record)),
        visible: true,
        disabled: false,
        title: '立案'
      }
      // record = {
      //   id: record.id,
      //   status: 2
      // }
      // caseInfoCityPut(record)
      //   .then(res => {
      //     if (res.code === 200) {
      //       this.$message.success("立案成功")
      //       this.loadData()
      //     }
      //   })
      //   .catch(() => {})
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
