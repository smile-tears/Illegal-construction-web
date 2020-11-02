<template>
  <a-form
    :form="form"
    :label-col="{ span: 3 }"
    :wrapper-col="{ span: 6 }"
    @submit="handleSubmit"
    class="container"
  >
    <a-form-item label="id" v-show="false">
      <a-input v-decorator="['id', { rules: [] }]" />
    </a-form-item>
    <a-form-item label="上午上班开始时间">
      <a-time-picker
        format="HH:mm"
        v-decorator="['startTimeOfWork1', { rules: [{ type: 'object', required: true, message: '上班开始时间必填！' }] }]"
      />
    </a-form-item>
    <a-form-item label="上午上班结束时间">
      <a-time-picker
        format="HH:mm"
        v-decorator="['endTimeOfWork1', { rules: [{ required: true, message: '上午上班结束时间必填！' }] }]"
      />
    </a-form-item>
    <a-form-item label="下午上班开始时间">
      <a-time-picker
        format="HH:mm"
        v-decorator="['startTimeOfWork2', { rules: [{ required: true, message: '下午上班开始时间必填！' }] }]"
      />
    </a-form-item>
    <a-form-item label="下午上班结束时间">
      <a-time-picker
        format="HH:mm"
        v-decorator="['endTimeOfWork2', { rules: [{ required: true, message: '下午上班结束时间必填！' }] }]"
      />
    </a-form-item>
    <a-form-item label="上传轨迹频率">
      <a-select
        v-decorator="[
          'uploadTrackFrequency',
          { rules: [{ required: true, message: '上传轨迹频率必填！' }] },
        ]"
      >
        <a-select-option :value="1">1分钟</a-select-option>
        <a-select-option :value="5">5分钟</a-select-option>
        <a-select-option :value="15">15分钟</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="地图引擎">
      <a-select
        v-decorator="[
          'mapEngine',
          { rules: [{ required: true, message: '地图引擎必填！' }] },
        ]"
      >
        <a-select-option :value="0">高德地图</a-select-option>
        <a-select-option :value="1">百度地图</a-select-option>
        <a-select-option :value="2">天地图</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="工作时间计算类型">
      <a-select
        v-decorator="[
          'calculateTypeOfWorkTime',
          { rules: [{ required: true, message: '工作时间计算类型必填！' }] },
        ]"
      >
        <!-- <a-select-option :value="0">扣除节假日，上下班时间</a-select-option>
        <a-select-option :value="1">扣除节假日，不扣除上下班时间</a-select-option>
        <a-select-option :value="2">不扣除节假日</a-select-option> -->
        <a-select-option :value="1">不排除</a-select-option>
        <a-select-option :value="2">只排除上下班</a-select-option>
        <a-select-option :value="3">只排除节假日 </a-select-option>
        <a-select-option :value="4">排除上下班+节假日</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 12, offset: 4 }">
      <a-button type="primary" html-type="submit">保存</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import moment from 'moment'
import { sysGlobalConfigList, sysGlobalConfigPost } from '@/api/sysGlobalConfig'
export default {
  mounted() {
    sysGlobalConfigList()
      .then(res => {
        if (res.result.length > 0) {
          this.$nextTick(() => {
             this.form.setFieldsValue({ ...res.result[0] })
            this.form.setFieldsValue({
              id: res.result[0].id,
              startTimeOfWork1: moment(res.result[0].startTimeOfWork1,'HH:mm'),
              endTimeOfWork1: moment(res.result[0].endTimeOfWork1,'HH:mm'),
              startTimeOfWork2: moment(res.result[0].startTimeOfWork2,'HH:mm'),
              endTimeOfWork2: moment(res.result[0].endTimeOfWork2,'HH:mm'),
              uploadTrackFrequency: res.result[0].uploadTrackFrequency,
              mapEngine: res.result[0].mapEngine,
              calculateTypeOfWorkTime: res.result[0].calculateTypeOfWorkTime,
            })
          })
        }
      })
      // eslint-disable-next-line handle-callback-err
      .catch(err => {
        // Do something
      })
  },
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  methods: {
    moment,
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        values.startTimeOfWork1 = values.startTimeOfWork1.format('HH:mm')
        values.startTimeOfWork2 = values.startTimeOfWork2.format('HH:mm')
        values.endTimeOfWork1 = values.endTimeOfWork1.format('HH:mm')
        values.endTimeOfWork2 = values.endTimeOfWork2.format('HH:mm')
        
        if (!err) {
          // console.log('Received values of form: ', values)
          sysGlobalConfigPost(values)
            .then(res => {
              if (res.code == 200) {
                this.$message.success('保存成功！')
              } else {
                this.$message.error('保存失败！')
              }
            })
            .catch(err => {
              this.$message.error('保存异常！')
            })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  background: white;
  padding: 24px;
}
</style>