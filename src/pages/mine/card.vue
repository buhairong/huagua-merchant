<template>
  <view class="cardPage commonPage">
    <view class="m-share-card">
      <button open-type="share" class="u-reset-button m-btn-share" @click="shareCard">
        <u-icon
          name="zhuanfa"
          color="#0a0f2d"
          size="40"
          @click="handleShare"
        />
      </button>
    </view>
    <view class="u-padding-top-30">
      <!-- <u-image
        border-radius="12rpx"
        width="100%"
        height="900rpx"
        src="https://image.51cheyaoshi.com/xcx/merchant/static/home/launch.png"
      /> -->
      <u-swiper
        :list="list"
        :autoplay="false"
        height="800"
        border-radius="24"
        bg-color="#FFFFFF"
      />
    </view>
    <view class="m-avatar">
      <u-image
        width="160"
        height="160"
        shape="circle"
        :src="userInfo.logoImage || 'https://image.51cheyaoshi.com/xcx/merchant/static/logo.png'"
      />
      <!-- TODO :src="userInfo.imageUrl" -->
    </view>
    <view class="m_name_t">
      <text>{{ userInfo.realName || userInfo.nickName }}</text>
    </view>
    <view class="m_company_v">
      <u-row>
        <u-col span="8">
          <view v-if="userInfo.companyName" class="u-flex">
            <view class="u-flex m_company_line">
              <view>
                <u-icon
                  name="https://image.51cheyaoshi.com/xcx/merchant/static/identify/icon_corp.png"
                  color="#999999"
                  size="28"
                  @click="handleShare"
                />
              </view>
              <view class="m_line_txt">
                <text> {{ userInfo.companyName }}</text>
              </view>
            </view>
          </view>
          <view v-if="userInfo.job" class="u-flex">
            <view class="u-flex m_company_line">
              <view class="u-padding-top-10">
                <u-icon
                  name="https://image.51cheyaoshi.com/xcx/merchant/static/identify/icon_card.png"
                  color="#999999"
                  size="28"
                  @click="handleShare"
                />
              </view>
              <view class="m_line_txt">
                <text>{{ userInfo.job }} </text>
              </view>
            </view>
          </view>
          <view class="u-flex">
            <view class="u-flex m_company_line">
              <view>
                <u-icon
                  name="https://image.51cheyaoshi.com/xcx/merchant/static/identify/icon_phone.png"
                  color="#999999"
                  size="28"
                  @click="handleShare"
                />
              </view>
              <view class="m_line_txt">
                <text> {{ userInfo.phone || '' }}</text>
              </view>
            </view>
          </view>
        </u-col>
        <u-col span="4">
        </u-col>
      </u-row>
      <view class="u-padding-top-20">
        <view class="u-flex u-row-between">
          <view>
            <view class="m_slogon">车要试-让有车生活更简单</view>
            <view class="m_slogon_tip">长按扫码查看更多</view>
          </view>
          <view>
            <u-image
              width="170"
              height="170"
              :src="userQr || 'https://image.51cheyaoshi.com/xcx/merchant/static/logo.png'"
            />
          </view>
        </view>
      </view>
      <u-gap height="40"></u-gap>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        qrCodeImage: null,
        userInfo: null,
        userQr: 'https://image.51cheyaoshi.com/20220630/b1515a4d-7a09-4f50-807e-25b37c9815bb.png',
        list: [
          { image: 'https://image.51cheyaoshi.com/xcx/merchant/static/identify/me_1.png', title: '111' },
          { image: 'https://image.51cheyaoshi.com/xcx/merchant/static/identify/me_1.png', title: '222' },
        ]
      }
    },
    onShow() {
      getApp().globalData.getUserInfo((data) => {
        this.userInfo = data;
      })
    },
    methods: {
      shareCard() {
        // TODO 截屏并分享图片
        
      }
    }
  }
</script>
<style lang="scss" scoped>
  .cardPage {
    padding: 28rpx 42rpx;
    
    .m-btn-share {
      text-align: right;
    }
    .m_name_t {
      padding-top: 32rpx;
      padding-left: 24rpx;
      font-size: 40rpx;
      font-weight: 500;
      color: #333330;
    }
    .m_company_v {
      padding-top: 24rpx;
      padding-left: 20rpx;
      .m_company_line {
        background: #F3F4F9;
        border-radius: 26rpx;
        margin-bottom: 16rpx;
        padding: 8rpx 16rpx;
      }
      .m_line_txt {
        padding-left: 10rpx;
        font-size: 24rpx;
        font-weight: 400;
        color: #333333;
      }
    }
    .m_slogon {
      padding-bottom: 10rpx;
      font-size: 30rpx;
      font-weight: 500;
      color: #333333;
      border-bottom: 1px solid #F0F0F0;;
    }
    .m_slogon_tip {
      padding-top: 10rpx;
      font-size: 14px;
      font-weight: 400;
      color: #999999;
    }
    
  }
</style>
<style lang="scss">
  .cardPage {
    .m-avatar {
      margin-top: -92rpx !important;
      padding-left: 48rpx;
      // .u-image__image, .u-image__loading {
      //   border: 5px solid #FFFFFF !important;
      // }
    }
  }
</style>

