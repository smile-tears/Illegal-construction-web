<template>
  <a-modal
    :title="modalData.title"
    :width="800"
    :visible="modalData.visible"
    :footer="null"
    :maskClosable="false"
    @cancel="handleCancel"
    class="modal"
  >
      <a-table
        :columns="columns"
        :data-source="data"
        rowKey="id"
        :pagination="{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          'show-size-changer': true
        }"
        @change="change"
      >
      </a-table>

  </a-modal>
</template>

<script>
//  import { rolePost, rolePut, userRolePost, userRoleDelete, userRoleList } from '@/api/role'
//  import { getSubCompanyUserTree } from '@/api/manage'

  import { companyByUser } from '@/api/case'
  import qs from 'qs'
  const columns = [
    {
      title: '公司名',
      dataIndex: 'companyName',
      key: 'companyName'
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: '法人',
      dataIndex: 'legalPersonName',
      key: 'legalPersonName'
    },
    {
      title: '联系电话',
      dataIndex: 'mobile',
      key: 'mobile'
    }
  ]
  export default {
    // eslint-disable-next-line vue/require-prop-types
    props: ['modalData'],
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        formLayout: 'horizontal',
        key: 1,
        data: [],
        columns: columns,
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        visible2: false,
        treeData: null,
        value: undefined
      }
    },
    watch: {
      modalData (modalData) {
//        this.form.resetFields()
        if (modalData.visible === true) {
//          this.$nextTick(() => {
//            delete this.modalData.record.delTag
//            this.form.setFieldsValue({ ...this.modalData.record })
//          })
          this.loadCompanyList()
        }
      }
    },
    beforeCreate () {
      this.form = this.$form.createForm(this)
      // console.log('form::', this.form)
    },
    methods: {
      loadCompanyList () {
        var record = JSON.parse(JSON.stringify(this.modalData.record))

        var param = {
          pageNo: this.pagination.current,
          pageSize: this.pagination.pageSize,
          safetyOffice: record.safetyOffice
        }
        companyByUser(qs.stringify(param))
          .then(res => {
            if (res.code === 200) {
              this.data = res.result.data
              this.pagination.total = res.result.totalCount
            }
          })
          .catch(() => {
            // Do something
          })
      },
      change (pagination, filters, sorter) {
        this.pagination = pagination;
        this.loadCompanyList()
      },
      handleCancel() {
        this.modalData.visible = false
      }
    }
  }
</script>

<style lang="less" >
  .modal div.ant-modal-body {
    padding: 10px;
  }
  .btn-container button{
    margin: 0 3px;
  }
</style>
