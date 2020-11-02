<template>
  <a-card>
    <a-carousel autoplay>
      <div><img class="caseImg" src="http://b-ssl.duitang.com/uploads/item/201410/09/20141009224754_AswrQ.jpeg"/></div>
      <div><img class="caseImg" src="https://up.enterdesk.com/edpic/ab/9e/e1/ab9ee1b8e0c8eabde3c8137de475bcb0.jpg"/></div>
      <div><img class="caseImg" src="http://5b0988e595225.cdn.sohucs.com/q_70,c_zoom,w_640/images/20190115/87868f21befc4e7f9007aa71efa79621.jpeg"/></div>
    </a-carousel>
  </a-card>
</template>
<style scoped>
  /* For demo */
  .ant-carousel{
    width: 300px;
  }
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

  .caseImg{
    width: 300px;
  }
</style>
<script>
  export default {
    components: {
    },
    name: 'MyCarousel'
  }
</script>