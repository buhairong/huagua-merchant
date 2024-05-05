<template>
  <view class="commonPage wdPage">
    <view class="m-label-m">提现金额</view>
    <!-- <view class="u-flex u-text-center" style="border-bottom: 1px solid #999999;">
      <view class="u-flex-4">
        <u-input
          v-model="value"
          :placeholder="'当前可提现' + amount + '元'"
          type="number"
          :border="false"
          :height="height"
          :auto-height="autoHeight"
        />
      </view>
      <view class="u-flex-1">全部提现</view>
    </view> -->
    <view>
      <u-field
        v-model="drawVal"
        label="￥"
        :placeholder="'当前可提现' + amount + '元'"
        label-width="48"
      >
        <view class="m-slot-v" slot="right" @click="setDrawAll">全部提现</view>
      </u-field>
    </view>
    <view class="u-padding-top-32 m-tip">预估提现扣税0元</view>
    <view class="m-btn-v u-text-center">
      <view class="foot-btn-common" @click="handleDraw">
        提现
      </view>
    </view>
    <!-- modal -->
    <u-modal
      v-model="tipShow"
      @confirm="confirmModal"
      ref="uModal"
      :title-style="{color: 'transparent'}"
      title=" "
      confirm-color="#31C37B"
      confirm-text="完成"
    >
      <view class="slot-content" style="min-height: 220px;">
        <view class="u-text-center m-modal-content">
          <view class="u-text-center u-padding-top-34">
            <u-icon name="checkmark-circle-fill" color="#2979ff" size="120"></u-icon>
          </view>
          <view class="m-tip-line1 u-padding-top-34">提现成功</view>
          <view class="u-text-center u-padding-top-20">
            <text class="m-tip-line2">我们将在三个工作日内处理您的提现申请</text>
          </view>
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script>
import dayjs from 'dayjs';
  export default {
    data() {
      return {
        // value: '',
        // height: 100,
        // autoHeight: true,
        userInfo: null,
        amount: '',
        drawVal: '',
        
        tipShow: false,
        tipType: '',
        tipDesc: '',
      }
    },
    onShow() {
      getApp().globalData.userInfo = null;
      getApp().globalData.getUserInfo((data) => {
        this.userInfo = data;
        // 获取now partnerinfo
        this.init(this.userInfo.partnerId)
      })
    },
    methods: {
      async init(partnerId) {
        const result = await this.$getRequest(this.$url.walletInfo, 'POST', {
          partnerId: partnerId
        })
        if(result.code != '0') {
          uni.showToast({
              title: result.msg,
              duration: 2000,
              icon: 'none'
          });
          return false;
        }
        this.amount = result.data.balance
      },
      setDrawAll() {
        this.drawVal = this.amount
      },
      confirmModal() {
        this.tipShow = false
        if(true) {
          this.$u.route({
            type: 'navigateBack',
            delta: 1,
          })
        } else {
          return false
        }
      },
      async handleDraw() {
        if (this.drawVal == 0 || this.drawVal == '') {
          uni.showToast({
            title: '请输入提现金额',
            duration: 2000,
            icon: 'none'
          });
          return false;
        }
        // 接口调用
        const result = await this.$getRequest(this.$url.applyWithdrawal, 'POST', {
          userId: this.userInfo.id,
          total: this.drawVal,
          type: 2
        })
        if(result.code != '0') {
          uni.showToast({
            title: result.msg,
            duration: 2000,
            icon: 'none'
          });
          return false;
        } else {
          this.tipShow = true
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.wdPage {
  padding: 160rpx 52rpx;
  .m-label-m {
    font-size: 28rpx;
    font-weight: 400;
    color: #333333;
  }
  .m-tip {
    font-size: 24rpx;
    font-weight: 400;
    color: #666666;
  }
  .m-slot-v {
    font-size: 28rpx;
    font-weight: 500;
    color: #333333;
  }
  .m-btn-v {
    padding-top: 200rpx;
  }
  .m-modal-content {
    padding: 60rpx 66rpx;
    .m-tip-line1 {
      font-size: 40rpx;
      font-weight: bold;
      color: #333333;
    }
    .m-tip-line2 {
      font-size: 24rpx;
      font-weight: 400;
      color: #999999;
    }
  }
}
</style>
<style lang="scss">
  .wdPage {
    .u-field {
      padding: 32rpx 0 !important;
      .u-label-text {
        font-size: 48rpx;
        font-weight: bold;
        color: #333333;
      }
    }
  }
</style>
