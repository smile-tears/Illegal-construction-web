<template>
  <a-card :bordered="false">
    <a-row :gutter="24">
      <a-col :span="5">
        <SampleTree ref="tree" />
      </a-col>
      <a-col :span="19">
        <SampleList />
      </a-col>
    </a-row>
  </a-card>

</template>

<script>
import SampleTree from './sample/SampleTree'
import SampleList from './sample/SampleList'

export default {
  name: 'TreeList',
  components: {
    SampleTree,
    SampleList
  }
}
</script>

<style lang="less">
  .custom-tree {

    /deep/ .ant-question-item-group-title {
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