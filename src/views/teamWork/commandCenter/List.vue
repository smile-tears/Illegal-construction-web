<template>
  <div class="container">
    <!-- <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="8">
            <a-form-item label="角色名称">
              <a-input v-model="queryParam.caseName" placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-button type="primary" icon="search" @click="loadData">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div> -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="案件编号">
              <a-input v-model="queryParam.caseNo" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="案件描述">
              <a-input v-model="queryParam.caseDesc" placeholder=""/>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <!--<a-col :md="8" :sm="24">-->
              <!--<a-form-item label="案件状态">-->
                <!--<a-select v-model="queryParam.status" placeholder="请选择" default-value="0">-->
                  <!--<a-select-option value="0">全部</a-select-option>-->
                  <!--<a-select-option :value="1">立案</a-select-option>-->
                  <!--<a-select-option :value="2">处理中</a-select-option>-->
                  <!--<a-select-option :value="3">已解决</a-select-option>-->
                <!--</a-select>-->
              <!--</a-form-item>-->
            <!--</a-col>-->
            <a-col :md="8" :sm="24">
              <a-form-item label="案件来源" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-select
                  style="width: 125px"
                  @change="handleCaseSourceChange"
                  v-decorator="['casesource1']"
                >
                  <a-select-option value="内部">内部</a-select-option>
                  <a-select-option value="外部">外部</a-select-option>
                </a-select>
                <a-select
                  style="width: 140px;margin-left: 5px"
                  v-decorator="['casesource2']">
                  <a-select-option v-for="source in caseSource" :key="source" :value="source">{{ source }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="案件类型" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
                <a-tree-select
                  v-decorator="['casetype.id', { rules: [{ required: true, message: '案件类型必填！' }] }]"
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  :tree-data="caseTypeTreeData"
                  placeholder
                  tree-default-expand-all
                ></a-tree-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="所属网格" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
                <a-tree-select
                  v-decorator="['gridCommunity.id', { rules: [{ required: true, message: '所属网格必填！' }] }]"
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  :tree-data="gridTreeData"
                  placeholder
                  tree-default-expand-all
                  @select="handleGridSelect"
                ></a-tree-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="上报日期">
                <a-date-picker v-model="queryParam.reportDate" style="width: 100%" placeholder="请输入上报日期"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="loadData">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!--<div class="table-operator">-->
      <!--<a-button type="primary" icon="plus" @click="add">新建</a-button>-->
      <!--<a-button type="danger" icon="delete" @click="del('batch')">删除</a-button>-->
    <!--</div>-->

    <div v-if="isShowTab">
      <a-tabs
        default-active-key="1"
        :style="{ height: '45px' }"
        @tabClick="changeTab"
      >
        <a-tab-pane v-for="(value, key, index) in this.caseType" :key="key">
          <template slot="tab">
            <a-badge :count="`${value.count}`">
              {{key}}
            </a-badge>
          </template>
          正文{{ index }}
        </a-tab-pane>
      </a-tabs>
    </div>

    <a-table
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :data-source="data"
      rowKey="id"
      ref="table"
      :pagination="{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        'show-size-changer': true,
        'show-quick-jumper': true,
        'show-total': total => `共 ${total} 条`
      }"
    >
      <!--@change="change"-->
      <span slot="serial" slot-scope="text, record, index">
        <a-badge :color="caseColors[record.state]" text="" />
        {{ index + 1 }}
      </span>
      <template slot="action" slot-scope="text,record">
        <a @click="info(record)">操作</a>
      </template>
    </a-table>
    <Edit :modalData="modalData" @handleModalEvent="handleModalEvent"></Edit>
  </div>
</template>
<script>
import { caseInfoCityList2, caseInfoCityDelete, caseInfoCityType } from '@/api/case'
import Edit from './Edit'
import { gridTree } from '@/api/gridCommunity'
import { questionTypeTree } from '@/api/questionType'
import qs from 'qs'
import { Ellipsis } from '@/components'
import { mapGetters } from 'vuex'
import config from '@/config/defaultSettings'
import caseConfig from '@/api/caseConfig'
const caseType = caseConfig.caseType
const caseSource1 = caseConfig.caseSource1
const caseSource2 = caseConfig.caseSource2
const caseColors = caseConfig.caseColors

const columns = [
  {
    title: '序号',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '案件编号',
    dataIndex: 'caseNo',
    key: 'caseNo'
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
    key: 'reporTime',
  },
  {
    title: '截止日期',
    dataIndex: 'enddate',
    key: 'enddate',
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
    Edit,
    Ellipsis
  },
  props: ['status'],
  computed: {
    ...mapGetters(['userInfo'])

  },
  created () {

    this.getGridTree()
    this.questionTypeTree()

    this.initWebSocket();
  },
  destroyed() {
    this.websock.close() //离开路由之后断开websocket连接
  },
  mounted () {
    var _this = this

    this.$nextTick(() => {
      _this.caseType = JSON.parse(JSON.stringify(caseType))
      if(_this.$props.status){//单个状态，菜单进入
        _this.queryParam.status = _this.$props.status
        _this.isShowTab = false
        for(var key  in _this.caseType){
          _this.caseType[key]['count'] = 0
          if(_this.caseType[key].status == _this.queryParam.status && _this.caseType[key].options){
            _this.changeTab(key)
          }
        }
      }else{//除去单个状态的tab
        this.isShowTab = true
        for(var key  in _this.caseType){
          _this.caseType[key]['count'] = 0
          if(_this.caseType[key].status == _this.queryParam.status){
            _this.changeTab(key)
          }
        }
        _this.initTab()
      }
    })
//    this.loadData()
  },
  data () {
    return {
      isShowTab:true,
      // 高级搜索 展开/关闭
      advanced: false,
      caseColors: caseColors,
      caseSource: [],
      gridTreeData: [],
      caseType:{},
      activeKey:"",
      selectTab:{},
      data: [],
      columns,
      selectedRowKeys: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      msgCount:34,
      modalData: {
        record:{},
        selectTab:{
          options:[]
        }
      },
      queryParam: {},

      websocket:null,
      wsUri: '',
      userId: '',//请求的链接ID
      isWebSocket: false,//判断是否链接成功！

      wsUrl: config.wsUrl,
    }
  },
  methods: {
    initWebSocket() { //初始化weosocket
      this.userId = this.userInfo.id
      this.wsUri= this.wsUrl + '/caseInfo/' + new Date().getTime() + this.userId
      this.websock = new WebSocket(this.wsUri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
//      this.websock.onclose = this.websocketclose
    },
    websocketonopen() { //连接建立之后执行send方法发送数据
      this.isWebSocket = true;
      console.log("链接成功！", this.isWebSocket)
      // this.websocketsend(JSON.stringify(actions));
    },
    websocketonerror() {//连接建立失败重连
      this.$message.info("重新建立链接中");
      this.initWebSocket();
    },
    websocketonmessage(e) { //数据接收
      console.log("resdata", e.data)
      try{
//        var resdata = {
//          nodeid:'',
//          destnodeid:''
//        }
        const resdata = JSON.parse(e.data)
        for(var key  in this.caseType){
          if(this.caseType[key].status == resdata.destnodeid
            && (this.caseType[key].status != 3 && this.caseType[key].status != 5)
          ){
//            if(this.activeKey == key){
//              this.loadData()
//            }else{
            this.caseType[key]['count'] += 1
//            }
          }
        }

      }catch (e){
        console.log('websocketonmessage',e)
      }
    },
    websocketclose(e) {  //关闭
      this.isWebSocket = false;
      this.websock.close();
      console.log('断开连接', e);
    },

    loadData () {
      console.log('this',this)
      var _this = this
      var params = {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
//        status: 0,
        ...this.queryParam
      }

      //加载时将当前tab计数清零
      if(params.status){
        for(var key  in this.caseType){
          if(this.caseType[key].status == params.status){
            this.caseType[key]['count'] = 0
          }
        }
      }

      if(_this.$props.status){//如果是案件处置 案件核查.添加参数操作人
        params["operator"] = this.userId
      }

      caseInfoCityList2(qs.stringify(params))
        .then(res => {
          _this.data = res.result.data
          _this.pagination.total = res.result.totalCount
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          // Do something
        })
    },
    handleCaseSourceChange (value) {
      this.caseSource = value === '内部' ? caseSource1 : caseSource2
    },
    getCaseInfoCityType(){
      caseInfoCityType()
        .then(res => {
          if (res.code === 200) {
            this.caseType = res.result
            this.activeKey = Object.keys(caseType)[0]
            this.changeTab(this.activeKey)
          }
        })
        .catch(() => {})
    },
    initTab () {
      this.caseType = JSON.parse(JSON.stringify(caseType))
      this.activeKey = Object.keys(caseType)[0]
      delete this.caseType["案件处置"]
      delete this.caseType["案件核查"]
      this.changeTab(this.activeKey)
    },
    getGridTree () {
      gridTree()
        .then(res => {
          if (res.code === 200) {
            this.gridTreeData = res.result
          }
        })
        .catch(() => {})
    },
    questionTypeTree () {
      questionTypeTree()
        .then(res => {
          if (res.code === 200) {
            this.caseTypeTreeData = res.result
          }
        })
        .catch(() => {})
    },

    info (record) {
      this.modalData = {
        record: JSON.parse(JSON.stringify(record)),
        visible: true,
        disabled: true,
        title: this.activeKey,
        selectTab: this.selectTab,
        seen: true
      }
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
    },
    changeTab (activeKey){
      this.activeKey = activeKey
      this.selectTab = this.caseType[activeKey]
      console.log('changeTab',activeKey, this.selectTab)
      this.queryParam.status = this.selectTab.status + ""
      this.loadData()
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
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
