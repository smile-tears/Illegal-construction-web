<template>
  <div>
    <a-button type="primary" icon="save" @click="save">保存</a-button>
    <a-tree
      v-model="checkedKeys"
      checkable
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      :tree-data="treeData"
      @expand="onExpand"
      @check="onCheck"
    />
  </div>
</template>
<script>
import { menuTree, roleMenuPost, roleMenuList, userMenuPost, userMenuList } from '@/api/menu'
import qs from 'qs'
export default {
  created () {
    this.loadMenuTree()
    this.eventBus.$on('transferRoleNode', node => {
      // 接收事件
      this.node = node
      this.type = 'role'
      this.loadSelectedMenu()
    })
    this.eventBus.$on('transferUserNode', node => {
      // 接收事件
      this.node = node
      this.node.id = node.key
      this.type = 'menu'
      this.loadSelectedMenu()
    })
  },
  data () {
    return {
      eventBus: this.$EventBus(this),
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      treeData: [],
      node: null,
      type: '',
      halfCheckedKeys: [] // 包含半选中key
    }
  },
  methods: {
    loadMenuTree () {
      menuTree()
        .then(res => {
          if (res.code === 200) {
            this.treeData = res.result
            this.expandedKeys.push(res.result[0].key)
          }
        })
        .catch(() => {
          // Do something
        })
    },
    loadSelectedMenu () {
      var api = null
      var params = {}
      if (this.type === 'role') {
        api = roleMenuList
        params.roleId = this.node.id
      } else {
        api = userMenuList
        params.userId = this.node.id
      }
      api(qs.stringify(params))
        .then(res => {
          if (res.code === 200) {
            this.checkedKeys = res.result
          }
        })
        .catch(() => {
          // Do something
        })
    },
    onExpand (expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (node, event) {
      this.halfCheckedKeys = event.halfCheckedKeys
    },
    save () {
      var json = []
      var fieldname = ''
      var api = null
      if (this.node == null) {
        this.$message.error('请先选中左侧节点！')
        return
      }
      if (this.type === 'role') {
        api = roleMenuPost
        fieldname = 'roleId'
      } else {
        api = userMenuPost
        fieldname = 'userId'
      }
      [...this.checkedKeys, ...this.halfCheckedKeys].forEach(element => {
        var object = {
          menuId: element
        }
        object[fieldname] = this.node.id
        json.push(object)
      })
      api(json)
        .then(res => {
          if (res.code === 200) {
            this.$message.success('保存成功！')
          } else {
            this.$message.success('保存失败！')
          }
        })
        .catch(() => {
          // Do something
        })
    }
  }
}
</script>
