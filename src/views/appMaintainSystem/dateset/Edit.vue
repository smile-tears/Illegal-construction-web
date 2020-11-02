<template>
  <a-modal
    :title="modalData.title"
    :width="600"
    :visible="modalData.visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :layout="formLayout" :form="form">
        <a-form-item label="id" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="false">
          <a-input :disabled="modalData.disabled" v-decorator="['id', {}]" />
        </a-form-item>
        <a-form-item label="日期" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <!-- <a-input :disabled="modalData.disabled" v-decorator="['datetime', {}]" />-->
          <a-date-picker :disabled="modalData.disabled"  v-decorator="['datetime', {}]"/>
        </a-form-item>
        <a-form-item label="类型" :label-col="labelCol" :wrapper-col="wrapperCol" v-show="true">
          <a-select
            v-decorator="[
          'type',
        ]">
            <a-select-option :value="0">调休</a-select-option>
            <a-select-option :value="1">假日</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

import {dateSetPost, dateSetPut, dateSetList} from '@/api/dateSet'
import moment from 'moment'
// 定义全局时间戳过滤器
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['modalData'],
  data() {
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
      confirmLoading: false
    }
  },
  watch: {
    modalData(modalData) {
      this.form.resetFields();
      if (modalData.visible === true) {
        this.$nextTick(() => {
          delete this.modalData.record.delTag
          this.form.setFieldsValue({ ...this.modalData.record })
        })
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    // console.log('form::', this.form)
  },
  methods: {
    handleOk() {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          console.log(values);
          var api = values.id === undefined ? dateSetPost : dateSetPut;
          //values.datetime = values.datetime._d| moment('YYYY-MM-DD');
          values.datetime = moment(values.datetime._d).format('YYYY-MM-DD')

          api(values)
            .then(res => {
              this.$emit('handleModalEvent', res);
              this.handleCancel()
            })
            .catch(() => {
            })
        }
      })
    },
    handleCancel() {
      this.modalData.visible = false
    }
  }
}
</script>