<template>
  <div class='container'>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="5">
            <a-form-item label="网格名称">
              <a-input v-model="queryParam.gridName" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="5">
            <a-form-item label="责任人">
              <a-input v-model="queryParam.manager" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="5">
            <a-form-item label="责任部门">
              <a-input v-model="queryParam.managerDept" placeholder=""/>
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
      <span slot="pid">
        {{ GridNode.title }}
      </span>
      <template slot="action" slot-scope="text,record">
        <a @click="info(record)">查看</a>
        <a-divider type="vertical"/>
        <a @click="edit(record)">编辑</a>
        <a-divider type="vertical"/>
        <a @click="openMap(record)">定义区间</a>
        <a-divider type="vertical"/>
        <a @click="del('single',record)">删除</a>
      </template>
    </a-table>
    <GridCommunityEdit :modalData="modalData" @handleModalEvent="handleModalEvent"></GridCommunityEdit>
    <a-modal
      title="定义区间"
      :visible="mapVisiable"
      :confirm-loading="confirmLoading"
      :width="900"
      :height="550"
      @ok="mapOk"
      @cancel="mapCancel"
    >
      <DrawGridArea  @positionValue="getAreaPosition" :record="recordValue"/>
    </a-modal>
  </div>
</template>
<script>
  import {gridCommunityList, gridCommunityDelete,idAndName,userIdAndName,gridCommunityPut} from '@/api/gridCommunity'
  import GridCommunityEdit from './GridCommunityEdit'
  import DrawGridArea from './DrawGridArea'
  import qs from 'qs'
  let map = new Map();
  let userMap = new Map();

  idAndName()
    .then(res => {
      if (res.code === 200) {
        res.result.data.map(item=>{map.set(item.id,item.subCompanyName)});
      }
    })
    .catch(() => {
    });
  userIdAndName()
    .then(res => {
      if (res.code === 200) {
        res.result.data.map(item=>{userMap.set(item.id,item.name)});
      }
    })
    .catch(() => {
    });



  const columns = [
    {
      title: '序号',
      scopedSlots: { customRender: 'serial' }
    },
    {
      title: '网格名称',
      dataIndex: 'gridName',
      key: 'gridName',
    },
    {
      title: '责任人',
      dataIndex: 'manager',
      key: 'manager',
      customRender: function (text, record, index) {
        return userMap.get(text);
      }
    },
    {
      title: '责任人联系方式',
      dataIndex: 'managerContactNum',
      key: 'managerContactNum',
    },
    {
      title: '责任部门',
      dataIndex: 'managerDept',
      key: 'managerDept',
      customRender: function (text, record, index) {
        return map.get(text);
      }
    },
    {
      title: '网格区域编码',
      dataIndex: 'number',
      key: 'number',
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
      GridCommunityEdit,
      DrawGridArea
    },
    created() {
      // this.eventBus.$on('transferGridNode', GridNode => {
      //   // 接收事件
      //   this.GridNode = GridNode;
      //   this.loadData()
      // });
      this.loadData()
      this.idAndName();
    },

    data() {
      return {
        mapPosition:'',
        confirmLoading:false,
        eventBus: this.$EventBus(this),
        data: [],
        columns,
        selectedRowKeys: [],
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        GridNode: {},
        modalData: {},
        queryParam: {},
        mapVisiable:false,
        recordValue:null
      }
    },
    methods: {
      getAreaPosition(data){
        this.mapPosition = data;
      },
      openMap(record){
        if(record.coordinate != '' && record.coordinate != null)
        {
          this.mapVisiable = true;
          this.recordValue = record;
        }else {
          this.$message.error('请先填写网格中心坐标！')
        }

        /*var that =this;
        window.setTimeout(function () {
          that.eventBus.$emit('getGridPosition',record);//与DrawGridArea通信
        },1000);
        this.$nextTick(function () {
          // DOM 现在更新了
          that.eventBus.$emit('getGridPosition',record);//与DrawGridArea通信
        })*/
      },
      mapOk(){

        this.recordValue.gridPosition = this.mapPosition;
        this.recordValue.delTag = 1;
        gridCommunityPut(this.recordValue)
          .then(res => {
            if (res.code === 200) {
              this.handleModalEvent();
              this.$message.success('保存成功')
            }
          })
          // eslint-disable-next-line handle-callback-err
          .catch(err => {
            // Do something
          })
        this.mapVisiable = false;
      },
      mapCancel(){
        this.mapVisiable = false;
      },
      loadData() {
        var params = {
          // pid: this.GridNode.value,
          pageNo: this.pagination.current,
          pageSize: this.pagination.pageSize,
          ...this.queryParam
        };
        params = this.filterParams(params);
        gridCommunityList(qs.stringify(params))
          .then(res => {
            if (res.code === 200) {
              this.data = res.result.data;
              this.pagination.total = res.result.totalCount
            }
          })
          // eslint-disable-next-line handle-callback-err
          .catch(err => {
            // Do something
          })
      },
      add() {
        this.modalData = {
          record: {
            // pid: this.GridNode.value
          },
          visible: true,
          disabled: false,
          title: '新建网格管理'
        }
      },
      del(type, record) {
        var ids = type === 'single' ? [record.id] : this.selectedRowKeys
        gridCommunityDelete(ids)
          .then(res => {
            if (res.code === 200) {
              this.loadData();
              // this.eventBus.$emit('refreshGridTree', this.GridNode)
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
          title: '编辑网格管理'
        }
       /* var that = this;
        window.setTimeout(function () {
          that.eventBus.$emit('getPosition',record);//与DrawGrid通信
        },1000);*/
      },
      info(record) {
        this.modalData = {
          record: record,
          visible: true,
          disabled: true,
          title: '查看网格管理'
        }
      },
      handleModalEvent(res) {
        this.loadData();
        // this.eventBus.$emit('refreshGridTree', this.GridNode)
      },
      onSelectChange(selectedRowKeys) {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.selectedRowKeys = selectedRowKeys
      },
      change(pagination, filters, sorter) {
        this.pagination = pagination
        this.loadData()
      },filterParams(obj) { // 剔除对象的空属性
        for(var i in obj){
          if(obj[i]==''){
            delete obj[i]
          }
        }
        return obj;
      },
      idAndName(){
        idAndName()
          .then(res => {
            if (res.code === 200) {
              return res.result.data;
            }
          })
          .catch(() => {
          })
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