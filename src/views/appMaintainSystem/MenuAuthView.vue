<template>
  <a-card :bordered="false">
    <a-row :gutter="24">
      <a-col :span="4">
        <a-tabs default-active-key="1" @change="handleTabChange" :animated="false">
          <a-tab-pane key="1" tab="角色">
            <role-list class="list"></role-list>
          </a-tab-pane>
          <a-tab-pane key="2" tab="人员" force-render>
            <user-tree class="list"></user-tree>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :span="20">
        <menu-tree ref="tree" ></menu-tree>
      </a-col>
    </a-row>
  </a-card>
</template>
<script>
import MenuTree from './auth/MenuTree'
import RoleList from './auth/RoleList'
import UserTree from './auth/UserTree'
export default {
  components: { MenuTree, RoleList, UserTree },
  methods: {
    handleTabChange () {
    }
  }
}
</script>
<style lang="less" scoped>
  .list {
    border-right: 1px solid #e8e8e8;
    padding-right: 20px;
  }
</style>
