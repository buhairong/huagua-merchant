<template>
  <view class="addBcPage commonPage">
    <view class="identity-t">添加银行卡</view>
    <view class="identity-c">请绑定持卡人本人的银行卡(仅限借记卡)</view>
    
    <view class="u-padding-top-24">
      <view class="identity-box u-flex u-row-between u-padding-top-10 u-padding-bottom-10 ">
        <view class="u-flex-1">持卡人</view>
        <view class="u-flex-4">
          <u-input
            :clearable="false"
            v-model="form.name"
            type="text"
            :custom-style="{textAlign: 'left'}"
            placeholder="持卡人真实姓名"
            :disabled="readOnly"
          />
        </view>
        <view>
          <u-icon name="camera" size="36" color="transparent"></u-icon>
        </view>
      </view>
      <view class="identity-box u-flex u-row-between u-padding-top-10 u-padding-bottom-10 ">
        <view class="u-flex-1">卡号</view>
        <view class="u-flex-4">
          <u-input
            :clearable="false"
            v-model="form.card"
            type="number"
            maxlength="16"
            :custom-style="{textAlign: 'left'}"
            placeholder="持卡人本人银行卡号"
            :disabled="true"
          />
        </view>
        <view>
          <u-icon name="camera" size="50" color="#666666" @click="scanBankCard"></u-icon>
        </view>
      </view>
      <view v-if="!readOnly" class="u-padding-top-30">
        <view class="u-flex">
          <view>
            <u-checkbox
                v-model="checked"
                size="28"
                label-size="28"
                icon-size="22"
            >
              <view class="placeOrderInfo-address-text">我已阅读并同意</view>
            </u-checkbox>
          </view>
          <view @click="showUserProtocol" class="aPro">《用户隐私保密协议》</view>
        </view>
      </view>
    </view>
    <view class="u-text-center m-btn-v">
      <view class="foot-btn-common" @click="nextStepForBank">下一步</view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'AddBankCard',
    data() {
      return {
        userProtocolUrl: 'https://www.51cheyaoshi.com/applet/protocol/partner_privacy.pdf',
        readOnly: false,
        checked: false,
        form: {
          name: '',
          card: ''
        }
      }
    },
    methods: {
      showUserProtocol () {
        this.$goHtml(this.userProtocolUrl, '')
      },
      scanBankCard() {
        // 上传照片识别
        if (this.readOnly) return;
        uni.vibrateShort();
        
        const pageThis = this;
        uni.chooseImage({
          success: async (chooseImageRes) => {
            uni.showLoading({
              title: '上传中'
            });
            const tempFilePaths = chooseImageRes.tempFilePaths;
            const upload = await this.$getFileUpload(this.$url.upload, tempFilePaths)
        
            if(upload.code != 0) {
              uni.showToast({
                title: '请重新上传',
                duration: 2000,
                icon: 'none'
              });
              return false;
            }
            uni.hideLoading()
        
            this.tempFilePathsFace = upload.data.src;
            pageThis.OcrBankCard({
              bankCardImageUrl: upload.data.src
            });
          }
        });
      },
      async OcrBankCard(params) {
        uni.showLoading({
            title: '上传成功，解析中'
        });
        const uploadInfo =  await this.$getRequest(this.$url.ocrBankCard, 'POST', params)
    
        if(uploadInfo.code != 0) {
          uni.showToast({
            title: uploadInfo.msg,
            duration: 2000
          });
          return false;
        } else if(uploadInfo.data.card_type != 'DC') {
          uni.showToast({
            title: '仅限借记卡',
            duration: 2000
          });
          return false;
        }
        uni.hideLoading()
        this.form.card = uploadInfo.data.card_num
        this.form.bankName = uploadInfo.data.bank_name
        this.form.cardType = uploadInfo.data.card_type
        this.form.isFake = uploadInfo.data.is_fake
        if(uploadInfo.card_num != '') {
          uni.setStorageSync("tmpCard", uploadInfo.data)
        }
      },
      nextStepForBank() {
        // TODO 检查校验输入项
        if(!this.form.name) {
          uni.showToast({
            title: '请输入持卡人',
            duration: 2000,
            icon: 'none'
          });
          return false;
        }
        if(!this.form.card) {
          uni.showToast({
            title: '请输入卡号',
            duration: 2000,
            icon: 'none'
          });
          return false;
        }
        if(!this.checked) {
          uni.showToast({
            title: '请同意用户协议',
            duration: 2000,
            icon: 'none'
          });
          return false;
        }
        const tmpCard = uni.getStorageSync("tmpCard")
        tmpCard.cardOwner = this.form.name
        uni.setStorageSync("tmpCard", tmpCard)
        this.$u.route('/pages/mine/verifyBankPhone')
      }
    }
  }
</script>

<style lang="scss" scoped>
.addBcPage {
  padding: 52rpx 40rpx;
  .identity-box {
    border-bottom: 1px solid #E6E6E6;
  }
  .m-btn-v {
    padding-top: 200rpx;
  }
}
</style>
