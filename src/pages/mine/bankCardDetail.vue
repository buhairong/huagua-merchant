<template>
  <view class="bcdPage commonPage">
    <view class="m-page-on">
      <view class="content">
        <view class="m-card-item m-card">
          <u-image
            style="position: absolute;margin-top: -40rpx;"
            mode="scaleToFit"
            src="https://image.51cheyaoshi.com/xcx/merchant/static/identify/bc_cover.png"
            width="660"
            height="256"
          />
          <view class="item-t1">{{ bankInfo.bankName }}</view>
          <view class="item-t2">{{ bankInfo.bankCardNo }}</view>
          <view class="item-t3">{{ bankInfo.bankType || '借记卡' }}</view>
        </view>
      </view>
      
      <view class="u-text-center m-btn-v">
        <view class="foot-btn-gray" @click="unbindBankCard">解绑银行卡</view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        userInfo: null,
        bankInfo: null
      }
    },
    onShow() {
      this.bankInfo = uni.getStorageSync("BankCardItemInfo")
      getApp().globalData.getUserInfo((data) => {
        this.userInfo = data;
      })
    },
    methods: {
      async unbindBankCard() {
        const pageThis = this
        // TODO confirm
        await uni.showModal({
          title: '',
          content: '确认解绑银行卡吗？',
          success: async function (res) {
            if (res.confirm) {
              const uRes = await pageThis.$getRequest(pageThis.$url.unboundBankCard, 'POST', {
                partnerId: pageThis.userInfo.partnerId,
                id: pageThis.bankInfo.id
              })
              if(uRes.code != 0) {
                uni.showToast({
                  title: '解绑失败',
                  duration: 2000
                });
                return false;
              }
              uni.showLoading({
                title: '解绑成功'
              });
              setTimeout(function () {
              	uni.hideLoading();
                pageThis.$u.route(`/pages/mine/bankCard`)
              }, 2000);
            } else if (res.cancel) {
            }
          }
        });
        
      },
    }
  }
</script>

<style lang="scss" scoped>
.bcdPage {
  background: #FFFFFF !important;
  .m-page-on {
    padding: 26rpx 40rpx;
    .m-card-item {
      // padding: 60rpx 40rpx;
      color: #FFFFFF;
      .item-t1 {
        border-top-left-radius: 24rpx;
        border-top-right-radius: 24rpx;
        padding-top: 40rpx;
        padding-left: 40rpx;
        padding-bottom: 96rpx;
        font-size: 36rpx;
        font-weight: bold;
        color: #FFFFFF;
        background: linear-gradient(297deg, #5656FF 0%, #55D0FF 100%);
        
      }
      .item-t2 {
        padding-left: 40rpx;
        padding-top: 32rpx;
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
      }
      .item-t3 {
        font-size: 12px;
        font-weight: 400;
        color: #999999;
        padding-left: 40rpx;
        padding-bottom: 32rpx;
      }
    }
    .zs-card {
      background: #EA564A;
    }
    .m-btn-v {
      padding-top: 200rpx;
    }
  }
}
</style>
