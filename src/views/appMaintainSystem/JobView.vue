<template>
  <a-card :bordered="false">
    <job-list
      ref="table"
      @onAdd="handleAdd"
      @onEdit="onEdit"
      @onDetail="onDetail">
    </job-list>
    <edit ref="edit" @ok="handleSaveOk" @close="handleSaveClose" />
  </a-card>
</template>

<script>

  import ATextarea from 'ant-design-vue/es/input/TextArea'
  import AInput from 'ant-design-vue/es/input/Input'
  // 动态切换组件
  import JobList from '@/views/appMaintainSystem/job/List'
  import Edit from '@/views/appMaintainSystem/job/Edit'

  export default {
    name: 'TableListWrapper',
    components: {
      AInput,
      ATextarea,
      JobList,
      Edit
    },
    data () {
      return {
        record: ''
      }
    },
    created () {

    },
    methods: {
      handleAdd (record) {
        this.$refs.edit.add('', '岗位新建')
      },
      handleSaveOk () {
        this.$refs.table.refresh({})
      },
      onEdit (record) {
        // alert(1)
        this.$refs.edit.edit(record, '岗位编辑')
      },
      onDetail (record) {
        this.$refs.edit.detail(record, '岗位详情')
      },
      handleSaveClose () {

      }
    }
  }
</script>
