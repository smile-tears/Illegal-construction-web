<template>
  <div>
    <a-tree
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      :tree-data="treeData"
      @select="onSelect"
      @expand="onExpand"
    />
  </div>
</template>
<script>
import { getSubCompanyUserTree } from '@/api/manage'
export default {
  mounted () {
    this.loadUserTree()
  },
  data () {
    return {
      eventBus: this.$EventBus(this),
      expandedKeys: [],
      autoExpandParent: true,
      treeData: []
    }
  },

  methods: {
    loadUserTree () {
      getSubCompanyUserTree()
        .then(res => {
          if (res.code === 200) {
            this.expandedKeys.push(res.result[0].key)
            this.recursionUserTree(res.result)
            this.treeData = res.result
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
    onSelect (selectedKeys, info) {
      // debugger
      this.eventBus.$emit('transferUserNode', info.node.dataRef)
    },
    recursionUserTree (data) {
      data.forEach(element => {
        if (element.type !== 'user') element.disabled = true
        if (element.children && element.children.length > 0) this.recursionUserTree(element.children)
      })
    }
  }
}
</script>
