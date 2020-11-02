<template>
  <div class="box">
    <a-input-search
      placeholder="请输入你要发送的消息"
      @search="websocketsend"
      enterButton="发消息"
      size="large"
      v-model="value"
    />

    <div class="mt20 btn">
      <a-button type="primary" @click="initWebSocket">建立链接</a-button>
      <a-button type="primary" @click="websocketclose">断开连接</a-button>
    </div>

  </div>
</template>
<script>
  export default {
    name: 'websocket',
    data() {
      return {
        value: '后端的同学您好！我开始像你发起请求了！',
        wsUri: 'ws://localhost:8088/websocket/' + 10, //this.$route.query.id,
        id: this.$route.query.id,//请求的链接ID
        isWebSocket: false,//判断是否链接成功！
      }
    },
    created() {
      this.initWebSocket();
      console.log("您请求的链接id:", this.$route.query.id)
    },
    destroyed() {
      this.websock.close() //离开路由之后断开websocket连接
    },
    methods: {
      initWebSocket() { //初始化weosocket
        this.websock = new WebSocket(this.wsUri);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
      },
      websocketonopen() { //连接建立之后执行send方法发送数据
        this.isWebSocket = true;
        console.log("链接成功！", this.isWebSocket)
        // this.websocketsend(JSON.stringify(actions));
      },
      websocketonerror() {//连接建立失败重连
        this.$message.info("重新建立链接中");
        this.initWebSocket();
      },
      websocketonmessage(e) { //数据接收
        // const redata = JSON.parse(e.data);
        console.log("redata", e.data)
      },
      websocketsend(Data) {//数据发送
        let actions = {
          "msg": this.value,
          "id": this.id
        };
        console.log("您正在发送消息", actions);
        if (this.isWebSocket) {
          this.websock.send(JSON.stringify(actions));
        } else {
          console.log("请先建立链接");
          this.$message.error("请先建立链接")
        }

      },
      websocketclose(e) {  //关闭
        this.isWebSocket = false;
        this.websock.close();
        console.log('断开连接', e);
      },
    }

  }
</script>
<style scoped lang="scss">
  .box {
    margin-top: 20px;
    width: 500px;
    margin-left: 100px;

    .btn {
      button {
        margin: 0 10px;
      }
    }
  }


</style>