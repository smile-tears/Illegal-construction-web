<template>
  <a-modal
    :title="title"
    :width="divWidth"
    :height="divHeight"
    :visible="visible"
    :footer="footer"
    @cancel="handleCancel"
  >
    <a-carousel ref="mycarousel" autoplay arrows>
      <div
        slot="prevArrow"
        slot-scope="props"
        class="custom-slick-arrow"
        style="left: 10px;zIndex: 1"
      >
        <a-icon type="left-circle" />
      </div>
      <div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: 10px">
        <a-icon type="right-circle" />
      </div>
      <div  v-for="item in files">
        <img class="caseBigImg" :src="item.url" :style="{width:getWidth}"/>
      </div>
    </a-carousel>
  </a-modal>
</template>
<style scoped>
  /* For demo */
  .ant-carousel{
    width:auto;
  }
  /*.caseBigImg{*/
    /*width: 550px;*/
  /*}*/
  .ant-carousel >>> .slick-slide {
    text-align: center;
    /*height: 160px;*/
    /*line-height: 160px;*/
    /*background: #364d79;*/
    /*overflow: hidden;*/
  }

  /*.ant-carousel >>> .slick-slide h3 {*/
  /*color: #fff;*/
  /*}*/
  .ant-carousel >>> .custom-slick-arrow {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: #fff;
    background-color: rgba(31, 45, 61, 0.11);
    opacity: 0.3;
  }
  .ant-carousel >>> .custom-slick-arrow:before {
    display: none;
  }
  .ant-carousel >>> .custom-slick-arrow:hover {
    opacity: 0.5;
  }
</style>
<script>
  export default {
    name: 'CarouselPic',
    data () {
      return {
        visible: false,
        footer: null,
        confirmLoading: false,
        files:[],
        title:"原图",
        divHeight:500,
        divWidth:600
      }
    },
    computed: {
      // 滚动区高度
      // (业务需求：手机屏幕高度减去头部标题和底部tabbar的高度，当然这2个高度也是可以动态获取的)
      getWidth: function() {
        return this.divWidth + 'px';
      }
    },
    created () {
      this.divHeight =  document.body.clientHeight
      this.divWidth =  document.body.clientWidth-50
    },
    methods: {
      loadData (files, i) {
        this.footer = null
        this.visible = true
        this.files = files
        console.log('this.$refs.mycarousel:',this.$refs.mycarousel)
        var _this = this
        this.$nextTick(function () {
          _this.$refs.mycarousel.goTo(i, false)
        })
      },
      close () {
        this.$emit('close')
        this.visible = false
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>
