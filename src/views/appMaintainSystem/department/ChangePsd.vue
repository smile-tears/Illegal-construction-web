<template>
  <a-modal
    :title="title"
    :width="500"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :destroyOnClose="true"
    :maskClosable="false"
    :footer="footer"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form">

          <a-row>

            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="人员姓名"
                hasFeedback
              >
                <a-input
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  :disabled="true"
                  placeholder="人员姓名"
                  v-decorator="[
                'name',
                {rules: [{ required: true, message: '请输入人员姓名' }]}
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
                label="登录账号"
                hasFeedback
              >
                <a-input
                  placeholder="登录账号"
                  :disabled="true"
                  v-decorator="['username',{rules: [{ required: true, message: '请输入登录账号' }]}]"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="工号"
                hasFeedback
              >
                <a-input
                  placeholder="工号"
                  :disabled="true"
                  v-decorator="['workcode']"
                ></a-input>
              </a-form-item>
            </a-col>

            <a-col
              :sm="colsm"
              :md="colmd">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="登录密码"
                hasFeedback
              >
                <a-input
                  :disabled="isEdit"
                  placeholder="登录密码"
                  v-decorator="['password']"
                  type="password"
                ></a-input>
              </a-form-item>
            </a-col>


          </a-row>


      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import ATreeSelect from 'ant-design-vue/es/tree-select'
import 'ant-design-vue/es/tree-select/style/index.less'
import { postUser, getSubCompanyUserTree, getJobList, getWorkInfoList, postWorkInfo, deleteWorkInfo, getFamilyInfoList, postFamilyInfo, deleteFamilyInfo } from '@/api/manage'
import pick from 'lodash.pick'

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default {
  name: 'EditUser',
  components: {
    ATreeSelect
  },
  data () {
    return {
      colsm:24,
      colmd:24,
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
      isEdit:false,
      footer: undefined,
      title: '',
      form: this.$form.createForm(this),
      confirmLoading: false,
      visible: false,
      id: 0,
      mdl: {},
      rowId: ''

    }
  },

  created () {

  },
  methods: {
    init () {
      this.rowId = ''
      this.mdl = { name: '', workcode:'', username:'', password: '' }
    },

    changePsd (record) {
      this.title = '修改密码'
      this.rowId = record.id
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        var json = pick(this.mdl, 'name', 'workcode','username')
        this.form.setFieldsValue(json)
      })
    },

    close () {
      this.$emit('close')
      this.visible = false
    },
    handleOk () {
      const _this = this
      console.log('handleOk:')
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          if (_this.rowId) {
            values['id'] = _this.rowId
          }

          _this.confirmLoading = true
          postUser(values)
          .then(res => {
            if(res.code === 200){
              _this.$message.success('保存成功')
              _this.$emit('ok')
            }
            _this.close()
          }).catch(() => {
            _this.$message.error('保存失败')
            // Do something
          }).finally(() => {
            _this.confirmLoading = false
          })
        }
      })
    },
    handleCancel () {
      this.close()
    }

  }
}
</script>
<style>
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  .user-addInfo-message{
    text-align: center;
    margin-top: 10px;
    font-size: 15px;
  }
</style>