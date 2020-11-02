<template>
  <a-tree
    ref="tree"
    v-model="checkedKeys"
    v-if="treeData.length > 0"
    show-line
    :default-expanded-keys="expandedKeys"
    :auto-expand-parent="autoExpandParent"
    :defaultExpandAll="defaultExpandAll"
    :selected-keys="selectedKeys"
    :tree-data="treeData"
    @expand="onExpand"
    @select="onSelect"
  />
</template>
<script>

import aTree from 'ant-design-vue/es/tree/Tree'
import 'ant-design-vue/es/tree/style/index.less'

export default {
  name: 'DepartmentTree',
  components: {
    aTree
  },
  data () {
    return {
      expandedKeys: [],
      autoExpandParent: true,
      defaultExpandAll: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData: []
    }
  },
  watch: {
    checkedKeys (val) {
      console.log('onCheck', val)
    },
    selectedKeys (val) {
      console.log('watch onSelect', val)
    }
  },
  methods: {
    loadData (data, selectKey) {
      console.log('loadData data', data)
      this.treeData = data
      this.selectedKeys[0] = selectKey
      console.log('this.selectedKeys', this.selectedKeys)
//      this.$refs.tree.select(this.selectedKeys)
    },
    onExpand (expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      // this.autoExpandParent = false
    },
    onSelect (selectedKeys, info) {
      console.log('onSelect', info)

      this.selectedKeys = selectedKeys
      this.$emit('fatherMethod', info)
    }
  }
}

</script>

<style lang="less">
.ant-tree {
  border-right: 1px solid #e8e8e8;
}
</style>
