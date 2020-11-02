<script src="../../../utils/domUtil.js"></script>
<template>
  <div>
    <a-form :form="form" @submit="handleSubmit">
      <a-row>
        <a-col
          :sm="colsm"
          :md="colmd">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="用户名"
            hasFeedback
          >
            <a-input
              placeholder="用户名"
              v-decorator="[
                'username',
                {rules: [{ required: true, message: '请输入用户名' }]}
              ]"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col
          :sm="colsm"
          :md="colmd">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="密码"
            hasFeedback
          >
            <a-input
              placeholder="密码"
              v-decorator="[
                'password',
                {rules: [{ required: true, message: '请输入密码' }]}
              ]"
              type="password"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col
          :sm="colsm"
          :md="colmd">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="姓名"
            hasFeedback
          >
            <a-input
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              placeholder="姓名"
              v-decorator="[
                'name',
                {rules: [{ required: true, message: '请输入姓名' }]}
              ]"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col
          :sm="colsm"
          :md="colmd">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="性别">
            <a-radio-group v-decorator="['sex',{ initialValue: '1' }]">
              <a-radio value="1">男</a-radio>
              <a-radio value="2">女</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col
          :sm="colsm"
          :md="colmd">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="移动电话"
            hasFeedback
          >
            <a-input
              placeholder="移动电话"
              v-decorator="[
                'telephone'
              ]"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col
          :sm="colsm"
          :md="colmd">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="移动电话是否公开">
            <a-radio-group v-decorator="['isShowPhone',{ initialValue: '1' }]">
              <a-radio value="1">是</a-radio>
              <a-radio value="2">否</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col
          :sm="colsm"
          :md="colmd">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="E-mail"
            hasFeedback
          >
            <a-input
              placeholder="E-mail"
              v-decorator="[
                'email',
                {rules: [{
                  type: 'email',
                  message: '请输入E-mail格式!',
                }]}
              ]"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col
          :sm="colsm"
          :md="colmd">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="登录后需要修改初始密码">
            <a-radio-group v-decorator="['isChangePass',{ initialValue: '2' }]">
              <a-radio value="1">是</a-radio>
              <a-radio value="2">否</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item
        v-bind="buttonCol"
      >
        <a-row>
          <a-col span="6">
            <a-button type="primary" html-type="submit">提交</a-button>
          </a-col>
          <a-col span="10">
            <a-button @click="handleGoBack">返回</a-button>
          </a-col>
          <a-col span="8"></a-col>
        </a-row>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import moment from 'moment'
import pick from 'lodash.pick'

export default {
  name: 'TableEdit',
  props: {
    record: {
      type: [Object, String],
      default: ''
    }
  },
  data () {
    return {
      colsm:24,
      colmd:12,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 12 }
      },
      buttonCol: {
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12, offset: 5 }
        }
      },
      form: this.$form.createForm(this),
      id: 0
    }
  },
  // beforeCreate () {
  //   this.form = this.$form.createForm(this)
  // },
  mounted () {
    this.$nextTick(() => {
      this.loadEditInfo(this.record)
    })
  },
  methods: {
    handleGoBack () {
      this.$emit('onGoBack')
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
      })
    },
    handleGetInfo () {

    },
    loadEditInfo (data) {
      const { form } = this
      // ajax
      console.log(`将加载 ${this.id} 信息到表单`)
      new Promise((resolve) => {
        setTimeout(resolve, 500)
      }).then(() => {
        const formData = pick(data, ['username', 'name', 'telephone', 'email', 'sex', 'isShowPhone', 'isChangePass'])
        //formData.updatedAt = moment(data.updatedAt)
        if(formData['sex'])formData['sex'] = formData['sex'] + ''
        if(formData['isShowPhone'])formData['isShowPhone'] = formData['isShowPhone'] + ''
        if(formData['sex'])formData['isChangePass'] = formData['isChangePass'] + ''
        console.log('formData', formData)
        form.setFieldsValue(formData)
      })
    }
  }
}
</script>
