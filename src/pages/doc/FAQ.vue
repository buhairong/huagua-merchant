<template>
  <view class="faqPage commonPage">
    <u-collapse :item-style="itemStyle" :head-style="headStyle" event-type="close" :accordion="accordion">
      <u-collapse-item
        v-for="(item, index) in itemList"
        :index="index"
        :title="item.head"
        :key="index"
        :open="item.open"
        :disabled="item.disabled"
        @change="itemChange"
      >
        <view class="m-qa">{{ 'Q' + index}}</view>
        <view class="collapse-item">
          {{item.body}}
        </view>
      </u-collapse-item>
    </u-collapse>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        itemList: [{
          head: "什么是合伙人",
          body: "什么是合伙人什么是合伙人什么是合伙人什么是合伙人什么是合伙人什么是合伙人什么是合伙人什么是合伙人什么是合伙人什么是合伙人什么是合伙人什么是合伙人",
          open: true,
          disabled: true
        },{
          head: "生活中不是缺少美，而是缺少发现美的眼睛",
          body: "学会欣赏，实际是一种积极生活的态度，是生活的调味品，会在欣赏中发现生活的美",
          open: false,
        },{
          head: "周围一些不起眼的人、事、物，或许都隐藏着不同凡响的智慧",
          body: "但是据说雕刻大卫像所用的这块大理石，曾被多位雕刻家批评得一无是处，有些人认为这块大理石采凿得不好，有些人嫌它的纹路不够美",
          open: false,
        },{
          head: "什么是合伙人",
          body: "什么是合伙人什么是合伙人什么是合伙人什么是合伙人什么是合伙人什么是合伙人什么是合伙人什么是合伙人什么是合伙人什么是合伙人什么是合伙人什么是合伙人",
          open: true,
          disabled: true
        },{
          head: "生活中不是缺少美，而是缺少发现美的眼睛",
          body: "学会欣赏，实际是一种积极生活的态度，是生活的调味品，会在欣赏中发现生活的美",
          open: false,
        },{
          head: "周围一些不起眼的人、事、物，或许都隐藏着不同凡响的智慧",
          body: "但是据说雕刻大卫像所用的这块大理石，曾被多位雕刻家批评得一无是处，有些人认为这块大理石采凿得不好，有些人嫌它的纹路不够美",
          open: false,
        }],
        itemStyle: {
          paddingTop: '5px',
          paddingBottom: '5px',
          borderBottom: '0.5px solid #E6E6E6',
        },
        headStyle: {
          paddingLeft: '35px',
          fontSize: '32rpx',
          fontWeight: 'bold',
          color: '#333333',
        }
      }
    },
    methods: {
      
    }
  }
</script>

<style lang="scss" scoped>
.faqPage {
  padding: 66rpx 40rpx;
  .collapse-item {
    // padding-bottom: 10px;
    padding: 0 40rpx 24rpx 70rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #666660;
  }
  .m-qa {
    width: 24px;
    max-height: 22px;
    border-radius: 12rpx;
    background: #31C37B;
    padding: 10rpx;
    font-size: 10px;
    font-weight: bold;
    color: #FFFFFF;
    position: absolute;
    margin-top: -30px;
    line-height: 12px;
    border-bottom-left-radius: initial;
  }
}
</style>
