<template>
  <a-card>
    <Button @click="handleInfiniteOnLoad">加载</Button>
    <a-list>
      <RecycleScroller
        v-infinite-scroll="handleInfiniteOnLoad"
        style="height: 400px"
        :items="data"
        :item-size="73"
        key-field="email"
        :infinite-scroll-disabled="busy"
        :infinite-scroll-distance="10"
      >
        <a-list-item slot-scope="{ item }">
          <a-list-item-meta :description="item.email">
            <a slot="title" :href="item.href">{{ item.name.last }}</a>
            <a-avatar
              slot="avatar"
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            />
          </a-list-item-meta>
          <div>Content {{ item.index }}</div>
        </a-list-item>
      </RecycleScroller>
      <a-spin v-if="loading" class="demo-loading" />
    </a-list>
  </a-card>
</template>
<script>
//  import reqwest from 'reqwest';
  import infiniteScroll from 'vue-infinite-scroll';
  import { RecycleScroller } from 'vue-virtual-scroller';
  import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
//  const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';
  export default {
    directives: { infiniteScroll },
    components: {
      RecycleScroller,
    },
    data() {
      return {
        data: [],
        loading: false,
        busy: false,
      };
    },
    beforeMount() {
      this.fetchData(res => {
        this.data = res.results;
      });
    },
    methods: {
      fetchData(callback) {
//        reqwest({
//          url: fakeDataUrl,
//          type: 'json',
//          method: 'get',
//          contentType: 'application/json',
//          success: res => {
//            callback(res);
//          },
//        });
        var res = {
          results:[]
        }
        for(var i=0;i<2;i++){
          res.results.push({
            email:"123456.163.com"+ Math.floor(Math.random() * 1000),
            href:"www.baidu.com",
            name:{
              last:"chen"+ (this.data.length+i)
            }
          })
        }
        callback(res);
      },
      handleInfiniteOnLoad() {
        const data = this.data;
        this.loading = true;
        if (data.length > 100) {
          this.$message.warning('Infinite List loaded all');
          this.busy = true;
          this.loading = false;
          return;
        }
        this.fetchData(res => {
          this.data = res.results.concat(data).map((item, index) => ({ ...item, index }));
//          this.data = data.concat(res.results);
          this.loading = false;
        });
      },
    },
  };
</script>
<style>
  .demo-loading {
    position: absolute;
    bottom: 40px;
    width: 100%;
    text-align: center;
  }
</style>