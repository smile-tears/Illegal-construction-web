<template>
  <a-card :loading="loading" :body-style="{ padding: '20px 24px 8px' }" :bordered="false">
    <div class="chart-card-header">
      <div class="meta">
        <span class="chart-card-title">
          <slot name="title">
            {{ title }}
          </slot>
        </span>
        <span class="chart-card-action">
          <slot name="action"></slot>
        </span>
      </div>
      <div class="total" v-if="hasTotal">
        <slot name="total">
          <span>{{ typeof total === 'function' && total() || total }}</span>
        </slot>
      </div>
    </div>
    <div class="chart-card-content" :style="{height: getHeight, marginTop: getMarginTop }">
      <div class="content-fix">
        <slot></slot>
      </div>
    </div>
    <div class="chart-card-footer" v-if="hasFooter">
      <div class="field">
        <slot name="footer"></slot>
      </div>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'ChartCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    hasTotal: {
      type: Boolean,
      required: false,
      default: true
    },
    total: {
      type: [Function, Number, String],
      required: false,
      default: null
    },
    hasFooter: {
      type: Boolean,
      required: false,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    divHeight: {
      type: [Number, String],
      default: 46
    },
    marginTop:{
      type: [Number, String],
      default:0
    }
  },
  computed: {
    // 滚动区高度
    // (业务需求：手机屏幕高度减去头部标题和底部tabbar的高度，当然这2个高度也是可以动态获取的)
    getHeight: function() {
      return this.divHeight + 'px';
    },
    getMarginTop: function() {
      return this.marginTop + 'px';
    }
  },
}
</script>

<style lang="less" scoped>
  .chart-card-header {
    position: relative;
    overflow: hidden;
    width: 100%;

    .meta {
      position: relative;
      overflow: hidden;
      width: 100%;
      color: rgba(0, 0, 0, .45);
      font-size: 14px;
      line-height: 22px;
    }
  }

  .chart-card-action {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
  }

  .chart-card-footer {
    border-top: 1px solid #e8e8e8;
    padding-top: 9px;
    margin-top: 8px;

    > * {
      position: relative;
    }

    .field {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0;
    }
  }

  .chart-card-content {
    margin-bottom: 12px;
    position: relative;
    height: 46px;
    width: 100%;

    .content-fix {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
    }
  }

  .total {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    color: #000;
    margin-top: 4px;
    margin-bottom: 0;
    font-size: 30px;
    line-height: 38px;
    height: 38px;
  }
</style>
