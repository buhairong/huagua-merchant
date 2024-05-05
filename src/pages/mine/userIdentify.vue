<template>
  <view class="uIdentifyPage commonPage">
    <view class="identity-t">请上传您的身份证</view>
    <view class="identity-c">车要试会严格保障您的信息安全</view>
    <view class="u-flex">
      <view class="identity-card u-flex-1 u-margin-right-15" @click="handleUploadFace(0)">
        <template v-if="tempFilePathsFace">
          <u-image
            width="100%"
            height="100%"
            :src="tempFilePathsFace"
          />
        </template>
        <template v-else>
          <u-image
            width="100%"
            height="100%"
            src="https://image.wecar-rental.com/xcx/12771641117293_.pic.jpg"
          />
        </template>
      </view>
      <view class="identity-card u-flex-1 u-margin-left-15" @click="handleUploadFace(1)">
        <template v-if="tempFilePathsBack">
          <u-image
            width="100%"
            height="100%"
            :src="tempFilePathsBack"
          />
        </template>
        <template v-else>
          <u-image
            width="100%"
            height="100%"
            src="https://image.wecar-rental.com/xcx/12781641117299_.pic.jpg"
          />
        </template>
      </view>
    </view>
    
    <view class="u-padding-top-70">
      <view class="identity-box u-flex u-row-between u-padding-top-20 u-padding-bottom-20 ">
        <view class="u-flex-1">真实姓名</view>
        <view class="u-flex-2">
          <u-input 
            v-model="form.name"
            type="text"
            :custom-style="{textAlign: 'left'}"
            placeholder="请输入您的姓名"
            :disabled="readOnly"
          />
        </view>
      </view>
      <view class="identity-box u-flex u-row-between u-padding-top-20 u-padding-bottom-20 ">
        <view class="u-flex-1">身份证号</view>
        <view class="u-flex-2">
          <u-input
            v-model="form.card"
            type="idcard"
            :custom-style="{textAlign: 'left'}"
            placeholder="请输入您的身份证号"
            :disabled="readOnly"
          />
        </view>
      </view>
      <view class="identity-box u-flex u-row-between u-padding-top-20 u-padding-bottom-20 ">
        <view class="u-flex-1">手机号</view>
        <view class="u-flex-2">
          <u-input
            v-model="form.phone"
            type="phone"
            :custom-style="{textAlign: 'left'}"
            placeholder="请输入您的手机号"
            :disabled="true"
          />
        </view>
      </view>
      <!-- <view class="identity-box u-flex u-row-between u-padding-top-20 u-padding-bottom-20 ">
        <view class="u-flex-1">所在公司</view>
        <view class="u-flex-2">
          <u-input
            v-model="form.corp"
            type="text"
            :custom-style="{textAlign: 'left'}"
            placeholder="请输入您所在的公司"
            :disabled="readOnly"
          />
        </view>
      </view> -->
      
      <view class="identity-box u-flex u-row-between u-padding-top-30 u-padding-bottom-30 ">
        <view class="u-flex-1">有效期</view>
        <view v-if="!isForever" class="u-flex-1" @click="popPicker">
          <u-picker
            v-model="showDatePicker"
            confirm-color="#0A0F2D"
            mode="time"
            :disabled="readOnly"
            :default-selector="defaultSelector"
            @confirm="handleTime"
          />
          <text :class="form.endTime ? '' : 'placeholderSty'">
            {{ form.endTime || '请选择有效期' }}
          </text>
        </view>
        <view :class="isForever ? 'u-flex-2' : 'u-flex-1'">
          <u-checkbox
            :key="index"
            v-model="isForever"
            :disabled="readOnly"
            @change="checkboxChange"
          >
            永久有效
          </u-checkbox>
        </view>
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
    <u-gap height="260" />
    <view v-if="!readOnly" class="foot-sticky foot-btn u-flex-1">
      <view class="u-text-center" @click="handleSubmit">
        提交信息
      </view>
    </view>
    <!-- modal -->
    <u-modal v-model="tipShow"  @confirm="confirmModal" ref="uModal" :title-style="{color: 'transparent'}" title=" " confirm-color="#576B95">
      <view class="slot-content" style="height: 150px;">
        <view class="u-text-center u-padding-top-50">
          <view class="u-text-center"><icon :type="tipType" size="50"/></view>
          <view class="u-text-center u-padding-top-40"><text class="m-tip-txt">{{tipDesc}}</text></view>
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script>
// saveIDCardLicenseFile
import dayjs from 'dayjs';
import { auditStatusAll } from '@/constants'
export default {
  name: 'UserIdentify',
  data() {
    return {
      userProtocolUrl: 'https://www.51cheyaoshi.com/applet/protocol/partner_privacy.pdf',
      tipShow: false,
      tipType: '',
      tipDesc: '',
      auditStatus: 0,
      
      userInfo: {},
      tempFilePathsFace: '',
      tempFilePathsBack: '',
      saveFaceInfo: null,
      saveBackInfo: null,
      checked: false,
      isForever: false,
      showDatePicker: false,
      defaultSelector: [0],
      params: {
        year: true,
        month: true,
        day: true,
        hour: false,
        minute: false,
        second: false
      },
      form: {
        name: '',
        card: '',
        phone: '',
        endTime: '',
        start_date: '',
      },
      readOnly: false
    }
  },
  onLoad() {
    getApp().globalData.getUserInfo((data) => {
      this.userInfo = data;
      this.form.phone = data.phone;
      this.form.name = data.realName;
      // TODO 释放
      if ([1,5].includes(data.status)) {
        this.readOnly = true;
      }
      this.getUserInfoAll(data.partnerId)
    })
  },
  methods: {
    showUserProtocol () {
      this.$goHtml(this.userProtocolUrl, '')
    },
    async handleSubmit() {
      const pageThis = this
      if(!this.tempFilePathsFace) {
        uni.showToast({
          title: '请上传身份证正面',
          duration: 2000,
          icon: 'none'
        });
        return false;
      }
      if(!this.tempFilePathsBack) {
        uni.showToast({
          title: '请上传身份证反面',
          duration: 2000,
          icon: 'none'
        });
        return false;
      }
      if(!this.form.name) {
        uni.showToast({
          title: '请输入身份证姓名',
          duration: 2000,
          icon: 'none'
        });
        return false;
      }
      if(!this.form.card) {
        uni.showToast({
          title: '请输入身份证号',
          duration: 2000,
          icon: 'none'
        });
        return false;
      }
      if(!this.form.phone) {
        uni.showToast({
          title: '请输入手机号',
          duration: 2000,
          icon: 'none'
        });
        return false;
      }
      if(!this.form.endTime) {
        if(!this.isForever) {
          uni.showToast({
            title: '请选择身份证有效期',
            duration: 2000,
            icon: 'none'
          });
          return false;
        } else {
          // +100年
          this.form.endTime = dayjs(new Date()).add(36500, 'day').format('YYYY-MM-DD')
        }
      }
      if(!this.checked) {
        uni.showToast({
          title: '请同意用户协议',
          duration: 2000,
          icon: 'none'
        });
        return false;
      }
      uni.showLoading({
        title: '认证中'
      });
      // 检查证件的真实性
      const hRes = await this.handleSaveId()
      console.log(hRes)
      if(hRes) {
        uni.showToast({
          title: '请确认身份证图片是否真实有效',
          duration: 2000,
          icon: 'none'
        });
        return false;
      }
      // 调用
      const result = await this.$getRequest(this.$url.personRegister, 'POST', {
        realName: this.form.name,
        userId: this.userInfo.id,
        id: this.userInfo.partnerId,
        idcard: this.form.card,
        idcardUrl: this.tempFilePathsFace,
        idcardBackUrl: this.tempFilePathsBack,
        idcardValidityTimeStart: this.form.start_date,
        idcardExpirationTime: this.form.endTime
      })
      if(result.code != 0) {
        uni.showToast({
          title: result.msg,
          duration: 2000,
          icon: 'none'
        });
        return false;
      } else {
        // personRegister 不反回auditStatus默认设为0
        let auditStatus = 0
        this.auditStatus = 0
        this.tipType = 'waiting'
        this.tipDesc = auditStatusAll[auditStatus]
        this.tipShow = true
      }
      uni.hideLoading()
    },
    confirmModal() {
      this.tipShow = false
      this.$u.route({
          type: 'navigateBack',
          delta: 1,
      })
    },
    async handleSaveId() {
      if(!this.saveFaceInfo) {
        uni.showToast({
          title: '请上传身份证正面',
          duration: 2000,
          icon: 'none'
        });
        return false;
      }
      if(!this.saveBackInfo) {
        uni.showToast({
          title: '请上传身份证反面',
          duration: 2000,
          icon: 'none'
        });
        return false;
      }
    },
    // type   0： 前   1： 后
    handleUploadFace(type) {
      if (this.readOnly) return;
      uni.vibrateShort();

      const self = this;
      uni.chooseImage({
        success: async (chooseImageRes) => {
          uni.showLoading({
            title: '上传中'
          });
          const tempFilePaths = chooseImageRes.tempFilePaths;
          const upload = await this.$getFileUpload(this.$url.upload, tempFilePaths)

          if(upload.code != 0) {
            uni.showToast({
              title: '识别失败，请重新上传',
              duration: 2000,
              icon: 'none'
            });
            return false;
          }
          uni.hideLoading()

          if(type == 0) {
            this.tempFilePathsFace = upload.data.src;
            this.OCRCardImg({
                idcardImageUrl: upload.data.src
            }, 0);
          } else {
            this.tempFilePathsBack = upload.data.src;
            this.OCRCardImg({
                idcardBackImageUrl: upload.data.src
            }, 1);
          }
        }
      });
    },
    async OCRCardImg(params, type) {
      uni.showLoading({
        title: '上传成功，解析中'
      });

      const uploadInfo =  await this.$getRequest(this.$url.ocrIdcard, 'POST', params)

      if(uploadInfo.code != 0) {
        uni.showToast({
          title: uploadInfo.msg,
          duration: 2000
        });
        return false;
      }
      uni.hideLoading()
      if (type === 0) {
        this.form.name = uploadInfo.data.name
        this.form.card = uploadInfo.data.num
        this.saveFaceInfo = uploadInfo.data;
      } else {
        this.form.endTime = dayjs(uploadInfo.data.end_date).format('YYYY-MM-DD')
        this.form.start_date = uploadInfo.data.start_date
        this.isForever = uploadInfo.data.is_fake
        this.saveBackInfo = uploadInfo.data;
      }
    },
    async init() {
      // getApp().globalData.getUserInfo(async (data) => {
      //     console.log(data);
      //     if(data.idCardStatus == 1) {
      //         uni.showLoading({
      //             title: '加载中'
      //         });
      //         const data = await this.$getRequest(this.$url.getMemberCertificateInfo, 'GET', {
      //             type: 'id'
      //         })
      //         uni.hideLoading();
      //         this.tempFilePathsFace = data.frontUrl;
      //         this.tempFilePathsBack = data.backUrl;
      //     }

      // })
    },
    handleTime(obj) {
      const {year, month, day} = obj
      this.form.endTime = `${year}-${month}-${day}`
    },
    popPicker() {
      if (!this.readOnly) {
        this.showDatePicker = true
      }
    },
    checkboxChange() {
      this.isForever = !this.isFore
      if(this.isForever) {
        this.form.endTime = ''
      }
    },
    // 获取用户身份证信息
    async getUserInfoAll(partnerId) {
      // 获取全部userinfo信息
      const userInfo =  await this.$getRequest(this.$url.partnerUserInfoAll, 'POST', {id: partnerId})
      const partnerInfo = userInfo.data
      if (partnerInfo) {
        this.tempFilePathsFace = partnerInfo.idcardUrl
        this.tempFilePathsBack = partnerInfo.idcardBackUrl
        // this.form.name = partnerInfo.name
        this.form.card = partnerInfo.idcard
        this.form.endTime = partnerInfo.idcardExpirationTime ? dayjs(partnerInfo.idcardExpirationTime).format('YYYYMMDD') : ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .uIdentifyPage {
    padding: 132rpx 40rpx;
    
    .identity-card {
      background: #F7F7F7;
      border-radius: 16rpx;
      height: 200rpx;
      text-align: center;
    }
    .identity-box {
      // background: rgba(10, 15, 45, 0.04);
      // border-radius: 16rpx;
      border-bottom: 1px solid #E6E6E6;
    }
    
    .m-tip-txt {
      font-size: 34rpx;
      font-weight: 500;
    }
    
    .placeholderSty {
        color: #c0c4cc;
    }
  }
</style>
