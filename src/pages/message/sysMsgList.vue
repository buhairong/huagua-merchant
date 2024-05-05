<template>
  <view class="msgListPage commonPage">
    <view
      class="msg-card"
      v-for="(item,index) in msgList"
      :key="index"
    >
      <view class="m-title">新订单</view>
      <view class="m-msg u-padding-bottom-32">您有一个新的订单，请注意查收，您有一个新的订单，请注意查收</view>
      <view class="m-v-border-top u-flex u-row-between">
        <view>查看详情</view>
        <view><u-icon name="arrow-right" color="#999999" size="28"></u-icon></view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        msgList: [
          { id: 1, },
          { id: 2, },
          { id: 3, },
          { id: 4, },
          { id: 5, },
        ]
      }
    },
    methods: {
      
    }
  }
</script>

<style lang="scss" scoped>
.msgListPage {
  padding: 36rpx 32rpx;
  .msg-card {
    box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02), 0px 4px 24px rgba(10, 15, 45, 0.04);
    border-radius: 24rpx;
    padding: 32rpx;
    margin-bottom: 24rpx;
    .m-v-border-top {
      padding-top: 32rpx;
      border-top: 1px solid #EEEEEE;
    }
    .m-title {
      font-size: 34rpx;
      font-weight: bold;
      color: #333333;
    }
    .m-msg {
      padding-top: 18rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #999999;
    }
  }
}
</style>
