<template>
  <div>
    <a-input-search style="margin-bottom: 8px" placeholder="请输入搜索内容..." @change="filterData" />
    <a-list item-layout="horizontal" :data-source="data">
      <a-list-item :class="item.id===selectedId ? 'active' : ''" slot="renderItem" slot-scope="item" @click="selectRole(item)" >
        {{ item.roleName }}
      </a-list-item>
    </a-list>
  </div>
</template>
<script>
import { roleList } from '@/api/role'
export default {
  mounted () {
    this.loadData()
  },
  data () {
    return {
      eventBus: this.$EventBus(this),
      data: [],
      initData: [],
      selectedId: ''
    }
  },
  methods: {
    selectRole (item) {
      this.selectedId = item.id
      this.eventBus.$emit('transferRoleNode', item)
    },
    filterData (e) {
      const value = e.target.value
      this.data = this.initData
      if (value !== '') {
        var result = this.data.filter(item => {
          // return item.roleName.indexOf(value) > -1 || (item.roleDesc && item.roleDesc.indexOf(value) > -1)
          return item.roleName.indexOf(value) > -1
        })
        this.data = result
      }
    },
    loadData () {
      roleList()
        .then(res => {
          if (res.code === 200) {
            this.data = res.result.data
            this.initData = res.result.data
          }
        })
        .catch(() => {
          // Do something
        })
    }
  }
}
</script>
<style lang="less" scoped>
  /deep/  .ant-list-item {
    padding-left: 6px ;
  }
  .active {
    background: #bae7ff;
  }
</style>
