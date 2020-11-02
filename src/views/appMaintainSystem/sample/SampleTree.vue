<template>
  <div>
    <a-input-search style="margin-bottom: 8px" placeholder="请输入搜索内容..." @change="onChange" />
    <a-tree
      :expanded-keys="expandedKeys"
      :tree-data="treeData"
      :auto-expand-parent="autoExpandParent"
      @select="onSelect"
      @expand="onExpand"
    >
      <a-icon slot="switcherIcon" type="down" />
    </a-tree>
  </div>
</template>
<script>
import { sampleTree } from '@/api/sample'
export default {
  created () {
    this.getTree('init')
    this.eventBus.$on('refreshSampleTree', sampleNode => {
      // 接收事件
      this.getTree('refresh')
    })
  },
  data () {
    return {
      eventBus: this.$EventBus(this),
      expandedKeys: [],
      treeData: [],
      autoExpandParent: true
    }
  },
  methods: {
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    getTree (type) {
      sampleTree()
        .then(res => {
          if (res.code === 200) {
            this.treeData = res.result
            if (type === 'init') {
              // 树初始化事件
              this.expandedKeys = []
              this.expandedKeys.push(res.result[0].value)
              this.eventBus.$emit('transferSampleNode', res.result[0])
            }
          }
        })
        .catch(() => {
          // Do something
        })
    },
    onSelect (selectedKeys, info) {
      this.eventBus.$emit('transferSampleNode', info.node)
    },
    onChange (e) {
      const value = e.target.value
      this.expandedKeys = []
      this.filter(this.treeData, value)
      console.log(this.treeData)
    },
    filter (treeData, value) {
      treeData.filter((item, index, self) => {
        if (item.title.indexOf(value) > -1) {
          this.expandedKeys.push(item.key)
          // console.log('===' + item.title+'...'+this.expandedKeys)
          return true
        } else if (item.children && item.children.length > 0) {
          return this.filter(item.children, value)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less">
.ant-tree {
  border-right: 1px solid #e8e8e8;
}
</style>
