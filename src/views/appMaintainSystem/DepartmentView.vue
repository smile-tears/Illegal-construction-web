<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="5">
        <a-button type="primary" icon="reload" @click="loadTree(false)">刷新</a-button>
        <department-tree
          ref="tree"
          @fatherMethod="handleTitleClick"
        >
        </department-tree>
      </a-col>

      <a-col :span="19">
        <div>
          <a-tabs default-active-key="1" @change="changeTab" ref="tabs">
            <a-tab-pane key="1" tab="部门信息">


              <a-button type="primary" icon="edit" v-if="this.selectType==='department'" @click="handleEdit2">编辑部门</a-button>
              <a-button type="primary" icon="edit" v-if="this.selectType==='subCompany'" @click="handleEditSub2">编辑分部</a-button>
              <department-info
                ref="departmentInfo"
                >

              </department-info>
            </a-tab-pane>

            <a-tab-pane key="4" tab="下级分部" v-if="selectType === 'subCompany'">
              <sub-company-list
                ref="supSubTable"
                :supSubCompanyId="selectKey"
                @onAdd2="handleAddSub"
                @onEditSub="handleEditSub"
                @onDetail="handleDetail"
              >
              </sub-company-list>
            </a-tab-pane>

            <a-tab-pane key="2" tab="下级部门" force-render>
              <department-list
                ref="table"
                @onEdit="handleEdit"
                @onAdd="handleAdd"
                @onDetail="handleDetail"
              >
              </department-list>
            </a-tab-pane>

            <a-tab-pane key="3" tab="人力资源" v-if="selectType === 'department'">
              <user-list
                ref="userTable"
                :departmentId="selectKey"
                @onAddUser="handleAddUser"
                @onEditUser="handleEditUser"
                @onDetailUser="handleDetailUser">
              </user-list>
            </a-tab-pane>
          </a-tabs>
        </div>

      </a-col>
    </a-row>

    <edit ref="edit" :orgTree="orgTree" :subTreeData="subTreeData" @ok="handleSaveOk" @close="handleSaveClose" />
    <edit-sub ref="editSub" :subTreeData="subTreeData" @ok="SaveSubOk" @close="SaveSubClose" />
    <edit-user ref="editUser" :orgTree="orgTree" @ok="SaveUserOk" @close="SaveUserClose" />
    <department-detail ref="detail" />

  </a-card>
</template>

<script>
// import OrgModal from './department/OrgModal'
import DepartmentTree from './department/DepartmentTree'
import DepartmentList from './department/DepartmentList'
import SubCompanyList from './department/SubCompanyList'
import DepartmentInfo from './department/DepartmentInfo'
import DepartmentDetail from './department/DepartmentDetail'
import UserList from './department/UserList'
import Edit from './department/Edit'
import EditSub from './department/EditSub'
import EditUser from './department/EditUser'
import { getSubCompanyTree, getSubCompanyTree2, getDepartmentList, getSubCompanyList } from '@/api/manage'

export default {
  name: 'TreeList',
  components: {
    DepartmentTree,
    DepartmentList,
    SubCompanyList,
    DepartmentInfo,
    DepartmentDetail,
    UserList,
    Edit,
    EditSub,
    EditUser
  },
  data () {
    return {
      orgTree: [],
      subTreeData: [],
      selectedRowKeys: [],
      selectedRows: [],
      selectKey: '',
      selectTile: '',
      selectType: '',
      currentComponet: '',
      subCompanyArr: [],
      subCompanyId:''
    }
  },
  created () {

  },
  mounted () {
    this.loadTree(true)

  },
  methods: {
    loadTree ( isLoadRoot ) {
      this.subCompanyId = ""
      getSubCompanyTree({ id: 0 }).then(res => {
        this.orgTree = res.result
//      console.log('this.orgTree', this.orgTree)
        if (this.orgTree &&  isLoadRoot) {
          this.selectType = this.orgTree[0]['type']
          this.selectKey = this.orgTree[0]['key']
          this.selectTile = this.orgTree[0]['title']
        }
        this.$refs.departmentInfo.loadData(this.selectType, this.selectKey)
        this.$refs.tree.loadData(this.orgTree, this.selectKey)
        this.$refs.table.refresh({ supDeptId: this.selectKey })
        if (this.selectType === 'subCompany') {
//        console.log('this.$refs', this.$refs)
//        console.log('this.$refs.supSubTable', this.$refs.supSubTable)
          this.$nextTick(() => {
            if (this.$refs.supSubTable)
              this.$refs.supSubTable.refresh({ supSubCompanyId: this.selectKey })
          })
        }
        if (this.selectType === 'department') {
          if (this.$refs.userTable)
            this.$refs.userTable.refresh({ departmentId: this.selectKey })
        }
      })
      getSubCompanyTree2({ id: 0 }).then(res => {
        this.subTreeData = res.result
      })
    },

    changeTab (key) {
      console.log('select tab:' + key)
    },
    /*parseSubCompany (item) {
      // 当前节点及以上分部节点
      if (item.$options.propsData.dataRef.type === 'subCompany') {
        this.subCompanyArr.push({key:item.$options.propsData.dataRef.key, title: item.$options.propsData.title})
      }
      //嵌套循环，直至树的根节点
      if(item.$options.propsData.pos !== '0-0'){
        this.parseSubCompany(item.$parent)
      }
    },*/
    getSubCompany (node) {
      if (node.$options.propsData.dataRef.type === 'subCompany') {
        this.subCompanyId = node.$options.propsData.dataRef.key
      }else{
        this.getSubCompany(node.$parent)
      }

    },

    handleTitleClick (item) {
      console.log('handleTitleClick', item)
      /*this.subCompanyArr = []
      this.parseSubCompany(item.node)
      console.log('this.subCompanyArr',this.subCompanyArr)*/
      this.selectType = item.node.$options.propsData.dataRef.type
      this.selectKey = item.node.$options.propsData.dataRef.key
      this.selectTile = item.node.$options.propsData.title

      this.subCompanyId = ""
      this.getSubCompany(item.node)

      console.log('select tree, this.$refs', this.$refs)
      if (this.$refs.departmentInfo)
        this.$refs.departmentInfo.loadData(this.selectType,this.selectKey)
      if (this.$refs.table)
        this.$refs.table.refresh({ supDeptId: this.selectKey })
      if (this.$refs.supSubTable)
        this.$refs.supSubTable.refresh({ supSubCompanyId: this.selectKey })
      if (this.$refs.userTable)
        this.$refs.userTable.refresh({ departmentId: this.selectKey })
    },

    handleAdd () {
      var model = this.$refs.edit
      console.log('add button, item', this.selectKey)

      if (this.selectKey) {
        model.add(this.selectKey, this.subCompanyId, this.selectType)
      } else {
        this.$message.success('没有选择部门节点')
        /*this.$notification['error']({
          message: '错误',
          description: '没有选择部门节点',
          duration: 4
        })*/
      }
    },

    handleAddSub () {
      var model = this.$refs.editSub
      console.log('add button, item', this.selectKey)
      if (this.selectKey) {
        model.add(this.selectKey, this.selectTile)
      } else {
        model.add('0', '根目录')
      }
    },
    handleEdit (item) {
      if ( this.selectType === "subCompany" ){
        item['subCompanyId'] = this.selectKey
      } else {
        item['supDeptId'] = this.selectKey
      }
      console.log('edit button, item', item)
      this.$refs.edit.edit(item)
    },
    handleEditSub (item) {
      item['supSubCompanyId'] = this.selectKey
      item['supSubCompanyName'] = this.selectTile
      console.log('edit button, item', item)
      this.$refs.editSub.edit(item)
    },
    handleEdit2 () {
      getDepartmentList({ id: this.selectKey }).then(res => {
        const item = res.result.data[0]
        this.$refs.edit.edit(item)
      })
    },
    handleEditSub2 () {
      getSubCompanyList({ id: this.selectKey }).then(res => {
        const item = res.result.data[0]
        this.$refs.editSub.edit(item)
      })
    },
    handleDetail (item) {
      this.$refs.detail.loadData(item)
    },

    handleSaveOk () {
      this.loadTree(false)
      this.$refs.table.refresh({ supDeptId: this.selectKey })
    },
    handleSaveClose () {
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 用户管理相关
    handleAddUser () {
      if (this.selectKey) {
        this.$refs.editUser.add(this.selectKey, this.selectTile)
      } else {
        this.$message.warn(`请先选择上级部门`)
      }
    },
    handleEditUser (item) {
      item['departmentId'] = this.selectKey
      item['departmentName'] = this.selectTile
      console.log('edit button, item', item)
      this.$refs.editUser.edit(item)
    },
    handleDetailUser (item) {

      item['departmentId'] = this.selectKey
      item['departmentName'] = this.selectTile
      console.log('edit button, item', item)
      this.$refs.editUser.detail(item)
    },
    SaveSubOk () {
      this.loadTree(false)
      this.$refs.supSubTable.refresh({ supSubCompanyId: this.selectKey })
    },
    SaveSubClose () {
    },
    SaveUserOk () {
      this.$refs.userTable.refresh({ departmentId: this.selectKey })
    },
    SaveUserClose () {
    }
  }
}
</script>

<style lang="less">
  .custom-tree {

    /deep/ .ant-menu-item-group-title {
      position: relative;
      &:hover {
        .btn {
          display: block;
        }
      }
    }

    /deep/ .ant-menu-item {
      &:hover {
        .btn {
          display: block;
        }
      }
    }

    /deep/ .btn {
      display: none;
      position: absolute;
      top: 0;
      right: 10px;
      width: 20px;
      height: 40px;
      line-height: 40px;
      z-index: 1050;

      &:hover {
        transform: scale(1.2);
        transition: 0.5s all;
      }
    }
  }
</style>
