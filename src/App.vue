<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'

export default {
  mixins: [AppDeviceEnquire],
  data () {
    return {
      locale: zhCN
    }
  },
  created() {
    // 通知路由守卫页面刷新，重新渲染路由信息
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('isGenerateRoutes', 'false')
    })
  },
  mounted () {

  }
}
</script>
