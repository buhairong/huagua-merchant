<template>
  <view class="verifyBpPage commonPage">
    <view class="identity-t">验证银行卡预留手机号</view>
    
    <view class="m-content-v">
      <view class="identity-box u-flex u-row-between u-padding-top-10 u-padding-bottom-10 ">
        <view class="u-flex-1">手机号</view>
        <view class="u-flex-3">
          <u-input 
            v-model="mobile"
            type="number"
            maxlength="11"
            :custom-style="{textAlign: 'left'}"
            placeholder="填写预留手机号"
            :disabled="readOnly"
          />
        </view>
        <view>
          <view class="m-input-right-btn" style="background: transparent;color: transparent;">获取验证码</view>
        </view>
      </view>
      <view class="identity-box u-flex u-row-between u-padding-top-10 u-padding-bottom-10 ">
        <view class="u-flex-1">验证码</view>
        <view class="u-flex-3">
          <u-input
            v-model="vcode"
            type="number"
            maxlength="4"
            :custom-style="{textAlign: 'left'}"
            placeholder="填写验证码"
          />
        </view>
        <view>
          <view>
            <view
              v-if="isSms"
              class="m-input-right-btn"
              @click="handleSend"
            >
              获取验证码
            </view>
            <view v-else>
              剩余 {{ sms }} 秒
            </view>
          </view>
          
        </view>
      </view>
    </view>
    <view class="u-text-center m-btn-v">
      <view class="foot-btn-common" @click="submitBankCard">提交</view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'VerifyBankPhone',
    data() {
      return {
        userInfo: null,
        partnerId: null,
        mobile: '',
        realMobile:'',
        vcode: '',
        readOnly: true,
        // tips: '',
        // // refCode: null,
        // seconds: 10,
        isSms: true,
        sms: 60,
        
      }
    },
    onShow() {
      getApp().globalData.getUserInfo((data) => {
        this.userInfo = data;
        this.partnerId = data.partnerId
        this.mobile = data.phone
        this.realMobile = data.username
      })
    },
    onLoad() {
    },
    methods: {
      async handleSend() {
        if(!this.$u.test.mobile(this.realMobile)) {
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
          mobile: this.realMobile
        })
        uni.hideLoading();
        
        if(data.code != 0) {
          uni.showToast({
            title: '验证码获取失败，请重试',
            duration: 1500
          });  
        } else {
          this.isSms = false;
          this.timer = setInterval(() => {
            if (--this.sms <= 0) {
              this.sms = 60;
              this.isSms = true;
              clearInterval(this.timer);
            }
          }, 1000);
          
          uni.showToast({
            title: '验证码已发送',
            duration: 1500
          });
        }
      },
      async submitBankCard() {
        const pageThis = this
        if(!this.vcode || this.vcode.length != 4) {
          uni.showToast({
            title: '请输入4位验证码',
            duration: 1000,
            icon: 'none'
          });
          return false;
        }
        
        uni.vibrateShort({})
        uni.showLoading({
            title: '正在绑定银行卡'
        });
        
        const tmpCard = uni.getStorageSync("tmpCard")
        const data = await this.$getRequest(this.$url.bindBankCard, 'POST', {
          mobile: this.userInfo.username,
          bankCardNo: tmpCard.card_num,
          bankName: tmpCard.bank_name,
          cardOwner: tmpCard.cardOwner,
          identifyingCode: this.vcode,
          partnerId: this.partnerId
        })
        if(data.code != 0) {
          uni.showToast({
            title: data.msg,
            duration: 2000
          });
          return false;
        }
        uni.showLoading({
          title: '绑定成功'
        });
        setTimeout(function () {
        	uni.hideLoading();
          pageThis.$u.route(`/pages/mine/bankCard`)
        }, 2000);
      }
    }
  }
</script>

<style lang="scss" scoped>
.verifyBpPage {
  padding: 52rpx 40rpx;
  .m-content-v {
    padding-top: 120rpx;
  }
  .identity-box {
    border-bottom: 1px solid #E6E6E6;
  }
  .m-btn-v {
    padding-top: 200rpx;
  }
}
</style>
