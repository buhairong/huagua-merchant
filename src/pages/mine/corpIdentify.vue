<template>
  <view class="cIdentifyPage commonPage">
    <view class="identity-t">请上传营业执照</view>
    <view class="identity-c">请拍照并上传你的营业执照</view>
    <view class="" @click="handleUploadCorp">
      <template v-if="corpFilePath">
        <u-image
          border-radius="12"
          width="200"
          height="246"
          :src="corpFilePath"
        />
      </template>
      <template v-else>
        <view class="def_back u-text-center">
          <view class="u-padding-top-80"><u-icon name="camera" color="#31C37B" size="48"/></u-icon></view>
          <view class="tip">上传营业照</view>
        </view>
      </template>
    </view>
    <view class="u-padding-top-70">
      <view
        class="identity-box u-flex u-row-between u-padding-top-20 u-padding-bottom-20 "
        v-for="(item, index) in fieldList"
        :key="index"
      >
        <view class="u-flex-1">{{ item.label }}</view>
        <view class="u-flex-2">
          <u-input 
            v-model="form[item.name]"
            :type="item.type ? item.type : 'text'"
            :custom-style="{textAlign: 'left'}"
            :placeholder="'请输入' + item.label"
            :disabled="item.readOnly ? item.readOnly : readOnly"
          />
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
    <u-gap height="200" />
    <view v-if="!readOnly" class="foot-sticky foot-btn u-flex-1">
      <view class="u-text-center" @click="handleSubmit">
        提交信息
      </view>
    </view>
    <!-- modal -->
    <u-modal v-model="tipShow" @confirm="confirmModal" ref="uModal" :title-style="{color: 'transparent'}" title=" " confirm-color="#576B95">
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
  import dayjs from 'dayjs';
  import { auditStatusAll } from '@/constants'
  export default {
    name: 'CorpIdentify',
    data() {
      return {
        userProtocolUrl: 'https://www.51cheyaoshi.com/applet/protocol/partner_privacy.pdf',
        readOnly: false,
        checked: false,
        corpFilePath: '',
        tipShow: false,
        tipType: '',
        tipDesc: '',
        fieldList: [
          { id: 0, label: '公司名称', name: 'corpName', type: 'text' },
          { id: 1, label: '组织机构代码', name: 'organizationCode', type: 'text' },
          { id: 2, label: '合作模式', name: 'corpTypeName', type: 'text', readOnly: true },
          { id: 3, label: '联系人', name: 'contacts', type: 'text' },
          { id: 4, label: '联系人电话', name: 'contactsMobile', type: 'number' },
          { id: 5, label: '职位', name: 'dept', type: 'text' },
        ],
        form: {
          corpName: '',
          organizationCode: '',
          corpType: '',
          corpTypeName: '',
          contacts: '',
          contactsMobile: '',
          dept: '',
        },
      }
    },
    onLoad(options) {
      if(options.ctid || options.ct) {
        this.form.corpType = options.ctid
        this.form.corpTypeName = options.ct
      }
      
      getApp().globalData.getUserInfo((data) => {
        this.userInfo = data;
        // TODO 释放
        if ([1,5].includes(data.status)) {
          this.readOnly = true;
        }
        this.getCorpInfoAll(data.partnerId)
      })
    },
    methods: {
      showUserProtocol () {
        this.$goHtml(this.userProtocolUrl, '')
      },
      handleUploadCorp() {
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
            console.log(upload)
      
            if(upload.code != 0) {
              uni.showToast({
                title: '识别失败，请重新上传',
                duration: 2000,
                icon: 'none'
              });
              return false;
            }
            uni.hideLoading()
    
            this.corpFilePath = upload.data.src;
            this.OCRCorpImg({
              businessLicenseImageUrl: upload.data.src
            });
            
          }
        });
      },
      async OCRCorpImg(params) {
        uni.showLoading({
          title: '上传成功，解析中'
        });
        const uploadInfo =  await this.$getRequest(this.$url.ocrCorpcard, 'POST', params)
        if(uploadInfo.code != 0) {
          uni.showToast({
            title: uploadInfo.msg,
            duration: 2000
          });
          return false;
        }
        uni.hideLoading()
        this.form.corpName = uploadInfo.data.name
        this.form.organizationCode = uploadInfo.data.reg_num
        // uploadInfo.data.person 法人
      },
      async handleSubmit() {
        const pageThis = this
        if(!this.corpFilePath) {
          uni.showToast({
            title: '请上传营业照',
            duration: 2000,
            icon: 'none'
          });
          return false;
        }
        if(!this.form.corpName) {
          uni.showToast({
            title: '请输入公司名称',
            duration: 2000,
            icon: 'none'
          });
          return false;
        }
        if(!this.form.organizationCode) {
          uni.showToast({
            title: '请输入组织机构代码',
            duration: 2000,
            icon: 'none'
          });
          return false;
        }
        // if(!this.form.corpType) {
        //   uni.showToast({
        //     title: '请输入合作模式',
        //     duration: 2000,
        //     icon: 'none'
        //   });
        //   return false;
        // }
        if(!this.form.contacts) {
          uni.showToast({
            title: '请输入联系人',
            duration: 2000,
            icon: 'none'
          });
          return false;
        }
        if(!this.form.contactsMobile) {
          uni.showToast({
            title: '请输入联系人电话',
            duration: 2000,
            icon: 'none'
          });
          return false;
        }
        if(!this.form.dept) {
          uni.showToast({
            title: '请输入本人职位',
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
        uni.showLoading({
          title: '认证中'
        });
        // this.handleSaveId()
        const result = await this.$getRequest(this.$url.corpRegister, 'POST', {
          partnerId: this.userInfo.partnerId,
          companyName: this.form.corpName, 
          partnerType: this.form.corpType,
          contacts: this.form.contacts,
          contactsMobile: this.form.contactsMobile,
          businessLicenseImageURL: this.corpFilePath,
          organizationCode: this.form.organizationCode,
          job: this.form.dept
        })
        if(result.code != 0) {
          uni.showToast({
            title: result.msg,
            duration: 2000,
            icon: 'none'
          });
          return false;
        } else {
          this.tipType = 'waiting'
          this.tipDesc = auditStatusAll[0]
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
      // 获取用户身份证信息
      async getCorpInfoAll(partnerId) {
        // 获取全部userinfo信息
        const userInfo =  await this.$getRequest(this.$url.partnerUserInfoAll, 'POST', {id: partnerId})
        const partnerInfo = userInfo.data
        if (partnerInfo) {
          this.corpFilePath = partnerInfo.businessLicenseUrl
          this.form.corpName = partnerInfo.partnerCompanyName
          this.form.corpType = partnerInfo.partnerType
          this.form.corpTypeName = partnerInfo.partnerTypeName
          this.form.dept = partnerInfo.job
          this.form.contacts = partnerInfo.contacts
          this.form.contactsMobile = partnerInfo.contactsMobile
          this.form.organizationCode = partnerInfo.organizationCode
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.cIdentifyPage {
  padding: 132rpx 40rpx;
  
  .identity-box {
    border-bottom: 1px solid #E6E6E6;
  }
  .def_back {
    width: 100px;
    height: 123px;
    background: #FFFFFF;
    box-shadow: 0px -1px 23px 0px rgba(10, 15, 45, 0.04), 0px 4px 23px 0px rgba(10, 15, 45, 0.04);
    border-radius: 6px;
  }
  .tip {
    font-size: 24rpx;
    font-weight: 400;
    color: #666666;
  }
}
</style>
