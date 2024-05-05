<template>
  <view class="typePage commonPage">
    <view>
      <view class="m-title-1"><text>请选择您的身份</text></view>
      <view class="u-padding-top-16 m-title-2"><text>请选择您的身份</text></view>
    </view>
    <u-gap height="112"/>
    <view>
      <view class="m-type-view u-flex u-row-between" @click="go2UserIdentifyPage">
        <view class="m-label">
          <text>个人</text>
        </view>
        <view class="">
          <u-image
            width="144"
            height="144"
            shape="circle"
            src="https://image.51cheyaoshi.com/xcx/merchant/static/identify/type_user.png"
          />
        </view>
      </view>
      <view class="m-type-view u-flex u-row-between" @click="go2CorpTypePage">
        <view class="m-label">
          <text>企业</text>
        </view>
        <view class="">
          <u-image
            width="144"
            height="144"
            shape="circle"
            src="https://image.51cheyaoshi.com/xcx/merchant/static/identify/type_corp.png"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        userInfo: null
      }
    },
    onShow() {
      getApp().globalData.getUserInfo((data) => {
        this.userInfo = data;
      })
    },
    methods: {
      go2UserIdentifyPage() {
        this.$u.route('/pages/mine/userIdentify');
      },
      go2CorpTypePage() {
        if (this.userInfo.companyPerson == 1) {
          this.$u.route('/pages/mine/corpIdentify');
        } else {
          this.$u.route('/pages/mine/corpType');
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
.typePage {
  padding-top: 90rpx;
  padding-left: 50rpx;
  padding-right: 50rpx;
  .m-title-1 {
    font-size: 44rpx;
    font-weight: bold;
    color: #333333;
  }
  .m-title-2 {
    font-size: 28rpx;
    font-weight: 400;
    color: #999999;
  }
  .m-type-view {
    height: 220rpx;
    background: #ffffff;
    padding-top: 38rpx;
    padding-bottom: 38rpx;
    padding-left: 80rpx;
    padding-right: 48rpx;
    box-shadow: 0px -1px 23px 0px rgba(10, 15, 45, 0.04), 0px 4px 23px 0px rgba(10, 15, 45, 0.04);
    border-radius: 16rpx;
    margin-bottom: 40rpx;
    .m-label {
      font-size: 40rpx;
      font-weight: bold;
      color: #333333;
    }
  }
}
</style>
