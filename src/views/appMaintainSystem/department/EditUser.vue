<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :destroyOnClose="true"
    :maskClosable="false"
    :footer="footer"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form">

        <a-card class="card" title="个人信息" :bordered="false">
          <a-row>
            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="人员姓名"
                hasFeedback
              >
                <a-input
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  placeholder="人员姓名"
                  v-decorator="[
                'name',
                {rules: [{ required: true, message: '请输入人员姓名' }]}
              ]"
                ></a-input>
              </a-form-item>
            </a-col>

            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="工号"
                hasFeedback
              >
                <a-input
                  placeholder="工号"
                  v-decorator="['workcode']"
                ></a-input>
              </a-form-item>
            </a-col>

            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="英文名"
                hasFeedback
              >
                <a-input
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  placeholder="英文名"
                  v-decorator="[
                'englishName'
              ]"
                ></a-input>
              </a-form-item>
            </a-col>

            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="排序"
                hasFeedback
              >
                <a-input-number
                  placeholder="排序"
                  :min="0" v-decorator="['showOrder', {}]" />
              </a-form-item>
            </a-col>

            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="登录账号"
                hasFeedback
              >
                <a-input
                  placeholder="登录账号"
                  v-decorator="['username',{rules: [{ required: true, message: '请输入登录账号' }]}]"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="登录密码"
                hasFeedback
              >
                <a-input
                  :disabled="isEdit"
                  placeholder="登录密码"
                  v-decorator="['password',{rules: [{ required: true, message: '请输入登录密码' }]}]"
                  type="password"
                ></a-input>
              </a-form-item>
            </a-col>

            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="所属部门"
                hasFeedback
              >
                <!--<a-input
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  placeholder="所属部门"
                  v-decorator="[
                'department',
                {rules: [{ required: true, message: '请输入所属部门' }]}
              ]"
                ></a-input>--><!--只能选部门，不能选分部-->
                <a-tree-select
                  v-decorator="['departmentId']"
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  :tree-data="orgTree"
                  placeholder="请选择所属部门"
                  tree-default-expand-all
                >
                </a-tree-select>
              </a-form-item>
            </a-col>
            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="直接上级"
                hasFeedback
              >
                <!--<a-input
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  placeholder="直接上级"
                  v-decorator="[
                'leader',
              ]"
                ></a-input>-->
                <a-tree-select
                  v-decorator="['leader']"
                  style="width: 100%"
                  show-search
                  treeNodeFilterProp="title"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  :tree-data="userTreeData"
                  placeholder="请选择直接上级"
                  tree-default-expand-all
                >
                </a-tree-select>
              </a-form-item>
            </a-col>

            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="身份证号"
                hasFeedback
              >
                <a-input
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  placeholder="身份证号"
                  @change="changeIdNumber"
                  v-decorator="[
                'idNumber',
              ]"
                ></a-input>
              </a-form-item>
            </a-col><!--输入完成自动算出年龄性别-->

            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="年龄">
                <a-input-number
                  placeholder="年龄"
                  :min="0" v-decorator="['age', {}]" />
              </a-form-item>
            </a-col>

            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="性别">
                <a-radio-group v-decorator="['sex',{ initialValue: '0' }]">
                  <a-radio value="0">男</a-radio>
                  <a-radio value="1">女</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>


            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="学历">
                <a-select v-decorator="['qualification',{ initialValue: '4' }]">
                  <a-select-option  value="1">初中及以下</a-select-option>
                  <a-select-option  value="2">高中</a-select-option>
                  <a-select-option  value="3">大专</a-select-option>
                  <a-select-option  value="4">本科</a-select-option>
                  <a-select-option  value="5">研究生</a-select-option>
                  <a-select-option  value="6">博士</a-select-option>
                  <a-select-option  value="7">博士后</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="联系电话"
                hasFeedback
              >
                <a-input
                  placeholder="联系电话"
                  v-decorator="[
                'telephone'
              ]"
                ></a-input>
              </a-form-item>
            </a-col>

            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="家庭住址"
                hasFeedback
              >
                <a-input
                  placeholder="家庭住址"
                  v-decorator="[
                'address'
              ]"
                ></a-input>
              </a-form-item>
            </a-col>

            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="邮箱"
                hasFeedback
              >
                <a-input
                  placeholder="邮箱"
                  v-decorator="[
                'email',
                {rules: [{
                  type: 'email',
                  message: '请输入邮箱格式!',
                }]}
              ]"
                ></a-input>
              </a-form-item>
            </a-col>

            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="状态"
                hasFeedback
              >
                <a-select
                  v-decorator="['status', { initialValue: '1' }]"
                  placeholder="状态"
                >
                  <a-select-option value="1">
                    正式
                  </a-select-option>
                  <a-select-option value="2">
                    离职
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="紧急联系人"
                hasFeedback
              >
                <a-input
                  placeholder="紧急联系人"
                  v-decorator="['emergencyContact',{}]"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="紧急联系人电话"
                hasFeedback
              >
                <a-input
                  placeholder="紧急联系人电话"
                  v-decorator="['emergencyContactNum',{}]"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="紧急联系人地址"
                hasFeedback
              >
                <a-input
                  placeholder="紧急联系人地址"
                  v-decorator="['emergencyAdreess',{}]"
                ></a-input>
              </a-form-item>
            </a-col>

            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="职称"
                hasFeedback
              >
                <a-input
                  v-decorator="['jobtitle',{}]"
                ></a-input>
              </a-form-item>
            </a-col>

            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="合同日期"
                hasFeedback
              >
                <a-range-picker
                  :placeholder="['合同开始日期','合同结束日期']"
                  v-decorator="['contractDate',{initialValue:[contractDate.contractStartDate,contractDate.contractEndDate]}]"
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>

            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="岗位"
                hasFeedback
              >
                <a-input
                  v-decorator="['post',{}]"
                ></a-input>
                <!-- <a-select
                  v-decorator="['post']"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  show-search
                  :data="jobList"
                >
                  <a-select-option v-for="job in jobList" :key="job.id">
                    {{ job.jobName }}
                  </a-select-option>
                </a-select> -->
                <!--<a-tree-select-->
                  <!--v-decorator="['post']"-->
                  <!--style="width: 100%"-->
                  <!--show-search-->
                  <!--treeNodeFilterProp="title"-->
                  <!--:dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"-->
                  <!--:tree-data="userTreeData"-->
                  <!--placeholder="请选择岗位"-->
                  <!--tree-default-expand-all-->
                <!--&gt;-->
                <!--</a-tree-select>-->
              </a-form-item>
            </a-col>

            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="照片"
                hasFeedback
              >
                <a-upload
                  name="avatar"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  action="/api/upload-avatar"
                  :before-upload="beforeUpload"
                  @change="handleChangeAvatar"
                >
                  <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">
                      Upload
                    </div>
                  </div>
                </a-upload>

              </a-form-item>
            </a-col>
          </a-row>
        </a-card>


        <!--<a-card class="card" title="工作信息" :bordered="false">-->
          <!--<a-row>-->
            <!--<a-table-->
              <!--:columns="workHisColumns"-->
              <!--:dataSource="workHisData"-->
              <!--:pagination="false"-->
              <!--:loading="workHisLoading"-->
            <!--&gt;-->
              <!--<template v-for="(col, i) in ['companyName', 'post', 'startDate', 'endDate']" :slot="col" slot-scope="text, record">-->
                <!--<a-input-->
                  <!--:key="col"-->
                  <!--v-if="record.editable"-->
                  <!--style="margin: -5px 0"-->
                  <!--:value="text"-->
                  <!--:placeholder="workHisColumns[i].title"-->
                  <!--@change="e => handleChange(e.target.value, record.key, col)"-->
                <!--/>-->
                <!--<template v-else>{{ text }}</template>-->
              <!--</template>-->
              <!--<template slot="operation" slot-scope="text, record">-->
                <!--<template v-if="record.editable">-->
                  <!--<span v-if="record.isNew">-->
                    <!--<a @click="saveRow(record)">添加</a>-->
                    <!--<a-divider type="vertical" />-->
                    <!--<a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">-->
                      <!--<a>删除</a>-->
                    <!--</a-popconfirm>-->
                  <!--</span>-->
                  <!--<span v-else>-->
                    <!--<a @click="saveRow(record)">保存</a>-->
                    <!--<a-divider type="vertical" />-->
                    <!--<a @click="cancel(record.key)">取消</a>-->
                  <!--</span>-->
                <!--</template>-->
                <!--<span v-else>-->
                  <!--<a @click="toggle(record.key)">编辑</a>-->
                  <!--<a-divider type="vertical" />-->
                  <!--<a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">-->
                    <!--<a>删除</a>-->
                  <!--</a-popconfirm>-->
                <!--</span>-->
              <!--</template>-->
            <!--</a-table>-->
            <!--<div class="user-addInfo-message" v-if="!isEdit">请先保存，然后在编辑中添加工作信息</div>-->
            <!--<a-button v-else style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newWorkHis">新增工作经历</a-button>-->
          <!--</a-row>-->
        <!--</a-card>-->

        <!--<a-card class="card" title="家庭信息" :bordered="false">-->
          <!--<a-row>-->

            <!--<a-table-->
              <!--:columns="familyColumns"-->
              <!--:dataSource="familyData"-->
              <!--:pagination="false"-->
              <!--:loading="familyLoading"-->
            <!--&gt;-->
              <!--<template v-for="(col, i) in ['name', 'relation', 'contactNum', 'address']" :slot="col" slot-scope="text, record">-->
                <!--<a-input-->
                  <!--:key="col"-->
                  <!--v-if="record.editable"-->
                  <!--style="margin: -5px 0"-->
                  <!--:value="text"-->
                  <!--:placeholder="familyColumns[i].title"-->
                  <!--@change="e => handleFamilyChange(e.target.value, record.key, col)"-->
                <!--/>-->
                <!--<template v-else>{{ text }}</template>-->
              <!--</template>-->
              <!--<template slot="operation" slot-scope="text, record">-->
                <!--<template v-if="record.editable">-->
                  <!--<span v-if="record.isNew">-->
                    <!--<a @click="saveFamilyRow(record)">添加</a>-->
                    <!--<a-divider type="vertical" />-->
                    <!--<a-popconfirm title="是否要删除此行？" @confirm="removeFamily(record.key)">-->
                      <!--<a>删除</a>-->
                    <!--</a-popconfirm>-->
                  <!--</span>-->
                  <!--<span v-else>-->
                    <!--<a @click="saveFamilyRow(record)">保存</a>-->
                    <!--<a-divider type="vertical" />-->
                    <!--<a @click="cancelFamily(record.key)">取消</a>-->
                  <!--</span>-->
                <!--</template>-->
                <!--<span v-else>-->
                  <!--<a @click="toggleFamily(record.key)">编辑</a>-->
                  <!--<a-divider type="vertical" />-->
                  <!--<a-popconfirm title="是否要删除此行？" @confirm="removeFamily(record.key)">-->
                    <!--<a>删除</a>-->
                  <!--</a-popconfirm>-->
                <!--</span>-->
              <!--</template>-->
            <!--</a-table>-->
            <!--<div class="user-addInfo-message" v-if="!isEdit">请先保存，然后在编辑中添加家庭成员信息</div>-->
            <!--<a-button v-else style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newFamily">新增家庭成员</a-button>-->
          <!--</a-row>-->
        <!--</a-card>-->


      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import ATreeSelect from 'ant-design-vue/es/tree-select'
import 'ant-design-vue/es/tree-select/style/index.less'
import { postUser, getSubCompanyUserTree, getJobList, getWorkInfoList, postWorkInfo, deleteWorkInfo, getFamilyInfoList, postFamilyInfo, deleteFamilyInfo } from '@/api/manage'
import pick from 'lodash.pick'

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default {
  name: 'EditUser',
  components: {
    ATreeSelect
  },
  data () {
    return {
      colsm:24,
      colmd:12,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 12 }
      },
      buttonCol: {
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12, offset: 5 }
        }
      },
      isEdit:false,
      footer: undefined,
      title: '',
      form: this.$form.createForm(this),
      confirmLoading: false,
      visible: false,
      id: 0,
      mdl: {},
      rowId: '',
      orgTree: [],
      userTreeData: [],
      jobList:[],
      contractDate:{
        contractStartDate: null,
        contractEndDate: null
      },

      //照片
      loading: false,
      imageUrl: '',

      // 工作历史
      workHisLoading: false,
      workHisColumns: [
        {
          title: '所在公司',
          dataIndex: 'companyName',
          key: 'companyName',
          width: '20%',
          scopedSlots: { customRender: 'companyName' }
        },
        {
          title: '岗位',
          dataIndex: 'post',
          key: 'post',
          width: '20%',
          scopedSlots: { customRender: 'post' }
        },
        {
          title: '开始时间',
          dataIndex: 'startDate',
          key: 'startDate',
          width: '20%',
          scopedSlots: { customRender: 'startDate' }
        },
        {
          title: '结束时间',
          dataIndex: 'endDate',
          key: 'endDate',
          width: '20%',
          scopedSlots: { customRender: 'endDate' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      workHisData: [
        /*{
          key: '1',
          companyName: 'X街道',
          post: '软件开发',
          editable: false,
          startDate: '2010-01-02',
          endDate: '2012-01-02'
        }*/
      ],

      //家庭成员
      familyLoading: false,
      familyColumns: [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          width: '15%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '关系',
          dataIndex: 'relation',
          key: 'relation',
          width: '15%',
          scopedSlots: { customRender: 'relation' }
        },
        {
          title: '联系方式',
          dataIndex: 'contactNum',
          key: 'contactNum',
          width: '20%',
          scopedSlots: { customRender: 'contactNum' }
        },
        {
          title: '住址',
          dataIndex: 'address',
          key: 'address',
          width: '30%',
          scopedSlots: { customRender: 'address' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      familyData: []

    }
  },

  created () {

  },
  methods: {
    init () {
      this.rowId = ''
      this.mdl = { name: '', workcode:'', englishName:'', showOrder:'', username:'', password: '',departmentId:'',leader:'', idNumber:'', age:0,
        qualification:'', telephone: '', address:'', email:'', status:'',emergencyContact:'',emergencyContactNum:'', emergencyAdreess:'' }
      this.contractDate = {
        contractStartDate: null,
        contractEndDate: null
      }
      this.workHisData = []
      this.familyData = []
    },
    //为组织结构树中的分部节点增加disabled属性
    parseDepartmentTree (treeData) {
      for(var i in treeData) {
        if(treeData[i].type === "subCompany") {
          treeData[i].disabled = true
          if(treeData[i]["children"] && treeData[i]["children"].length > 0 ) {
            this.parseDepartmentTree(treeData[i]["children"])
          }
        }
      }
    },

    //为组织结构树中的分部节点增加disabled属性
    parseUserTree (treeData) {
      for(var i in treeData) {
        if(treeData[i].type === "subCompany" || treeData[i].type === "department") {
          treeData[i].disabled = true
          if(treeData[i]["children"] && treeData[i]["children"].length > 0 ) {
            this.parseUserTree(treeData[i]["children"])
          }
        }
      }
    },

    add (id, title) {
      this.init()
      this.edit({ departmentId: id })
      this.title = '新建人员'
      this.isEdit = false
    },
    edit (record) {
      getSubCompanyUserTree({ id: 0 }).then(res => {
        this.userTreeData = res.result
        this.parseUserTree(this.userTreeData)
      })
      getJobList().then(res => {
        this.jobList = res.result.data
      })


      this.title = '编辑人员'
      this.isEdit = true
      this.footer = undefined
      this.rowId = record.id
      this.orgTree = JSON.parse(JSON.stringify(this.$attrs.orgTree))
      this.parseDepartmentTree(this.orgTree)
      if(record.sex){record.sex = record.sex+""}
      if(record.status){record.status = record.status+""}

      if(record.id){//如果是编辑获取家庭信息
        getFamilyInfoList({ userId: record.id }).then(res => {
          this.familyData = res.result.data
          this.familyData.forEach((item,i,arr) => {
            item.key = item.id
            item.relation = item.title
            delete item.title
            item.editable = false
          })
        })
        getWorkInfoList({ userId: record.id }).then(res => {
          this.workHisData = res.result.data
          this.workHisData.forEach((item,i,arr) => {
            item.key = item.id
            item.editable = false
            item.startDate = moment(item.startDate).format('YYYY-MM-DD')
            item.endDate = moment(item.endDate).format('YYYY-MM-DD')
          })
        })
      }
      if(record.contractStartDate){
        this.contractDate.contractStartDate = moment(record.contractStartDate)
      }else{
        this.contractDate.contractStartDate = moment()
      }
      if(record.contractEndDate){
        this.contractDate.contractEndDate = moment(record.contractEndDate)
      }else{
        this.contractDate.contractEndDate = moment()
      }
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        if(record.idNumber){
          this.setIdNumber(record.idNumber)
        }
        this.imageUrl = record.avatar
        var json = pick(this.mdl, 'name', 'workcode', 'englishName', 'showOrder', 'username', 'departmentId', 'leader', 'post','jobtitle',
          'idNumber', 'qualification', 'telephone', 'address', 'email', 'status', 'emergencyContact', 'emergencyContactNum', 'emergencyAdreess')
        this.form.setFieldsValue(json)
      })
    },
    detail (record) {
      this.edit(record)
      this.title = '人员详情'
      this.footer = null
    },

    close () {
      this.$emit('close')
      this.visible = false
    },
    handleOk () {
      const _this = this
      console.log('handleOk:')
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          if (_this.rowId) {
            values['id'] = _this.rowId
            delete values['password']
          }
          if(values.contractDate){
            values["contractStartDate"] = values.contractDate[0]
            values["contractEndDate"] = values.contractDate[1]
          }
          console.log('form values', JSON.stringify(values))
          console.log('imageUrl', _this.imageUrl)
          if (_this.imageUrl) {
            values['avatar'] = _this.imageUrl
          }

          _this.confirmLoading = true
          postUser(values)
          .then(res => {
            if(res.code === 200){
              _this.$message.success('保存成功')
              _this.$emit('ok')
            }
            _this.close()
          }).catch(() => {
            _this.$message.error('保存失败')
            // Do something
          }).finally(() => {
            _this.confirmLoading = false
          })
        }
      })
    },
    handleCancel () {
      this.close()
    },

    //照片
    handleChangeAvatar(info) {
      console.log('handleChangeAvatar,info', info)
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        if(info.file.response.code === 200){
          this.imageUrl = "/api" + info.file.response.result.url
          this.loading = false;
        }
      }
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG/PNG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
    // 身份证号解析 出生日期，年龄，性别
    changeIdNumber (info) {
      console.log('changeIdNumber',info.target.value)
      var idNo = info.target.value
      this.setIdNumber(idNo)
    },
    setIdNumber (idNo) {
      if(idNo.length === 18){
        this.birthday = idNo.substring(6,10) + "-" + idNo.substring(10,12) + "-" + idNo.substring(12,14)
        const age = this.jsGetAge(this.birthday)

        console.log('setIdNumber.idNo:',idNo)
        const sex = (parseInt(idNo.substring(16,17))+1) %2 + ""
        console.log('setIdNumber.sex:',sex)
        this.form.setFieldsValue({
          age: age,
          sex: sex
        });
      }
    },

    jsGetAge (strBirthday) {
      var returnAge;
      var strBirthdayArr=strBirthday.split("-");
      var birthYear = strBirthdayArr[0];
      var birthMonth = strBirthdayArr[1];
      var birthDay = strBirthdayArr[2];

      var d = new Date();
      var nowYear = d.getFullYear();
      var nowMonth = d.getMonth() + 1;
      var nowDay = d.getDate();

      if(nowYear == birthYear){
        returnAge = 0;//同年 则为0岁
      } else {
        var ageDiff = nowYear - birthYear ; //年之差
        if(ageDiff > 0){
          if(nowMonth == birthMonth) {
            var dayDiff = nowDay - birthDay;//日之差
            if (dayDiff < 0) {
              returnAge = ageDiff - 1;
            } else {
              returnAge = ageDiff ;
            }
          } else {
            var monthDiff = nowMonth - birthMonth;//月之差
            if (monthDiff < 0) {
              returnAge = ageDiff - 1;
            } else {
              returnAge = ageDiff ;
            }
          }
        } else {
          returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
        }
      }
      return returnAge;//返回周岁年龄
    },

    newWorkHis () {
      const length = this.workHisData.length
      this.workHisData.push({
        key: length === 0 ? '1' : (parseInt(this.workHisData[length - 1].key) + 1).toString(),
        companyName: '',
        post: '',
        startDate: '',
        endDate: '',
        editable: true,
        isNew: true
      })
    },
    handleChange (value, key, column) {
      const newData = [...this.workHisData]
      const target = newData.find(item => key === item.key)
      if (target) {
        target[column] = value
        this.workHisData = newData
      }
    },
    remove (key) {
      if(key.length > 10){//说明删除的数据还未保存后台
        deleteWorkInfo([key])
          .then(res => {
            this.$message.success('删除成功')
          })
      }
      const newData = this.workHisData.filter(item => item.key !== key)
      this.workHisData = newData
    },

    checkDate(str) {
      var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
      if(r==null)return false;
      var d= new Date(r[1], r[3]-1, r[4]);
      return (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
    },
    saveRow (record) {
      this.workHisLoading = true
      const { key, companyName, post, startDate, endDate } = record
      if (!companyName || !post ) {
        this.workHisLoading = false
        this.$message.error('请填写完整工作信息。')
        return
      }
      if(!this.checkDate(record.startDate)){
        this.workHisLoading = false
        this.$message.error('开始时间的格式不对,格式：YYYY-MM-DD')
        return
      }
      if(!this.checkDate(record.endDate)){
        this.workHisLoading = false
        this.$message.error('结束时间的格式不对,格式：YYYY-MM-DD')
        return
      }

      var workInfo = JSON.parse(JSON.stringify(record))
      if(workInfo.key.length < 10){
        workInfo.id = ''
      }else{
        workInfo.id = record.key
      }
      if(this.rowId !== ''){
        workInfo.userId = this.rowId
      }
      postWorkInfo(workInfo)
        .then(res => {
          const target = this.workHisData.find(item => item.key === key)
          target.key = res.result.id
          target.editable = false
          target.isNew = false

          this.remove(0)
          this.workHisLoading = false
        }).finally(() => {
          this.workHisLoading = false
        })

      // 模拟网络请求、卡顿 800ms
      /*new Promise((resolve) => {
        setTimeout(() => {
          resolve({ loop: false })
        }, 800)
      }).then(() => {
        const target = this.workHisData.find(item => item.key === key)
        target.editable = false
        target.isNew = false
        this.workHisLoading = false
      })*/
    },
    toggle (key) {
      const target = this.workHisData.find(item => item.key === key)
      target._originalData = { ...target }
      target.editable = !target.editable

      this.remove(0)
    },
    cancel (key) {
      const target = this.workHisData.find(item => item.key === key)
      Object.keys(target).forEach(key => { target[key] = target._originalData[key] })
      target._originalData = undefined
      this.remove(0)
    },


    newFamily () {
      const length = this.familyData.length
      this.familyData.push({
        key: length === 0 ? '1' : (parseInt(this.familyData[length - 1].key) + 1).toString(),
        name: '',
        relation: '',
        contactNum: '',
        address: '',
        editable: true,
        isNew: true
      })
    },
    handleFamilyChange (value, key, column) {
      const newData = [...this.familyData]
      const target = newData.find(item => key === item.key)
      if (target) {
        target[column] = value
        this.familyData = newData
      }
    },
    removeFamily (key) {
      if(key.length > 10){//说明删除的数据还未保存后台
        deleteFamilyInfo([key])
          .then(res => {
            this.$message.success('删除成功')
          })
      }
      const newData = this.familyData.filter(item => item.key !== key)
      this.familyData = newData
    },
    saveFamilyRow (record) {
      this.familyDataLoading = true
      const { key, name, relation, contactNum, address } = record
      if (!name || !relation ) {
        this.familyDataLoading = false
        this.$message.error('请填写完整家庭成员信息。')
        return
      }
      var familyInfo = {
        name:record.name,
        title:record.relation,
        contactNum:record.contactNum,
        address:record.address
      }
      if(record.key.length < 10){
        familyInfo.id = ''
      }else{
        familyInfo.id = record.key
      }
      if(this.rowId !== ''){
        familyInfo.userId = this.rowId
      }
      console.log('familyData',this.familyData)
      // 模拟网络请求、卡顿 800ms
      /*new Promise((resolve) => {
        setTimeout(() => {
          resolve({ loop: false })
        }, 800)
      })*/
      postFamilyInfo(familyInfo)
      .then(res => {
//        console.log('postFamilyInfo.res',res)
        const target = this.familyData.find(item => item.key === key)
        target.key = res.result.id
        console.log('target',target)
        target.editable = false
        target.isNew = false

        this.removeFamily(0)
        this.familyLoading = false
      })
    },
    toggleFamily (key) {
      const target = this.familyData.find(item => item.key === key)
      target._originalData = { ...target }
      target.editable = !target.editable

      this.removeFamily(0)
    },
    cancelFamily (key) {
      const target = this.familyData.find(item => item.key === key)
      Object.keys(target).forEach(key => { target[key] = target._originalData[key] })
      target._originalData = undefined
      this.removeFamily(0)
    }

  }
}
</script>
<style>
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  .user-addInfo-message{
    text-align: center;
    margin-top: 10px;
    font-size: 15px;
  }
</style>