<template>
  <view class="mpPage commonPage">
    <view class="mobile-sign-t">
      输入手机号码
    </view>
    <!-- <view class="mobile-sign-text">
      为了方便取得联系，请输入您的常用手机号码
    </view> -->
    <view class="mobile-box u-flex u-row-between">
      <u-input
        v-model="mobile"
        type="number"
        placeholder="请输入手机号"
        :border="false"
        maxlength="11"
        class="u-flex-1 mobile-box-value"
        @input="handleInput"
      />
      <view>
        <view
          v-if="isSms"
          class="send-code"
          @click="handleSend"
        >
          获取验证码
        </view>
        <view v-else>
          {{ sms }} S
        </view>
      </view>
    </view>
    <view class="m-tip u-padding-top-40">登录/注册即代表您已同意<text class="m-tip-blue" @click="showUserProtocol">《车要试出行用户协议》</text></view>
  </view>
</template>

<script>
export default {
  name: "MobilePhone",
  data() {
    return {
      userProtocolUrl: 'https://manager.wecar-rental.com/applet/protocol/privacy.pdf',
      mobile: '',
      code: '',
      isSms: true,
      sms: 60,
    };
  },
  onLoad() {
  },
  methods: {
    showUserProtocol () {
      this.$goHtml(this.userProtocolUrl, '')
    },
    async handleSend() {
      // if(!this.mobile || this.mobile.length != 11) {
      //   uni.showToast({
      //     title: '请输入11位手机号',
      //     duration: 1000,
      //     icon: 'none'
      //   });
      //   return false;
      // }
      if(!this.$u.test.mobile(this.mobile)) {
        uni.showToast({
          title: '请输入正确的11位手机号',
          duration: 1000,
          icon: 'none'
        });
        return false;
      }
      
      uni.vibrateShort({})
      uni.showLoading({
          title: '正在获取验证码'
      });
      const data = await this.$getRequest(this.$url.getIdentifyingCode, 'POST', {
        mobile: this.mobile
      })
      uni.hideLoading();
      
      if(data.code != 0) {
        uni.showToast({
          title: '验证码获取失败，请重试',
          duration: 1500
        });  
      } else {
        // this.isSms = false;
        // this.timer = setInterval(() => {
        //   if (--this.sms <= 0) {
        //     this.sms = 60;
        //     this.isSms = true;
        //     clearInterval(this.timer);
        //   }
        // }, 1000);
        uni.showToast({
          title: '验证码已发送',
          duration: 1500
        });
        uni.setStorageSync("codePhone", this.mobile)
        this.$u.route('/pages/mine/verifyCode');
      }
    },
    handleLogin(e) {
      console.log(e);
    },
    handleInput() {
      uni.vibrateShort({})
    }
  },
};
</script>
<style lang="scss">
  .mpPage {
    .mobile-box-value .u-input__input {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
    }
  }
</style>
<style lang="scss" scoped>
  .mpPage {
    padding: 236rpx 50rpx;
    .mobile-sign-t {
      font-size: 48rpx;
      font-weight: bold;
      color: #333333;
    }
    // .mobile-sign-text {
    //   color: rgba(10, 15, 45, 0.5);
    //   font-size: 28rpx;
    //   margin-top: 8rpx;
    // }
    .mobile-box {
      margin-top: 108rpx;
      background: rgba(10, 15, 45, 0.04);
      border-radius: 16rpx;
      padding: 10rpx 30rpx;
      
      .send-code {
        color: #333333;
        font-size: 28rpx;
        font-weight: 400;
      }
    }
    .m-tip {
      font-size: 24rpx;
      font-weight: 400;
      color: #666666;
      .m-tip-blue {
        color: #1AA5FF;
      }
    }
  }
</style>
