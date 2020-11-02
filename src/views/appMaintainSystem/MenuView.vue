<template>
  <a-card :bordered="false">
    <a-row :gutter="24">
      <a-col :span="5">
        <menu-tree ref="tree" ></menu-tree>
      </a-col>
      <a-col :span="19">
        <menu-list></menu-list>
      </a-col>
    </a-row>
    <!-- <edit ></edit> -->
  </a-card>

</template>

<script>
// import OrgModal from './department/OrgModal'
import MenuTree from './menu/MenuTree'
import MenuList from './menu/MenuList'
import Edit from './menu/Edit'

export default {
  name: 'TreeList',
  components: {
    MenuTree,
    MenuList,
    Edit
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
