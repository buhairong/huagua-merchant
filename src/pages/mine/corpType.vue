<template>
  <view class="cTypePage commonPage">
    <view class="m-tc-head">
      <view class="identity-t">请选择合作模式</view>
      <view class="identity-c">请选择合作模式，以实际合同为主</view>
    </view>
    <view>
      <swiper
        class="swiper"
        :indicator-dots="indicatorDots"
        previous-margin="25px"
        next-margin="25px"
        circular="true"
        :autoplay="autoplay"
        :interval="interval"
        :duration="duration"
        @change="changeType"
      >
        <swiper-item
          v-for="(item) in shopTypeList"
          :key="item.id"
        >
          <view class="swiper-item">
            <view class="m-sitem-bd">
              <view class="m-sitem" :style="'background-image: url(' + item.image + ');background-repeat: no-repeat;background-size: 100% 100%;background-position: center;' ">
                <!-- <view class="m-sitem-title">{{ item.title }}</view>
                <view class="m-sitem-sub">{{ item.sub }}</view> -->
              </view>
              <view class="m-sitem-c">{{ item.description }}</view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>
    <view class="foot-sticky foot-btn u-flex-1">
      <view class="u-text-center" @click="handleNextStep">
        下一步
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'CorpType',
    data() {
      return {
        current: 0,
        shopTypeList: []
      }
    },
    onShow(){
      // TODO 接口调用
      this.init()
    },
    methods: {
      async init() {
        // TODO 数据
        const result = await this.$getRequest(this.$url.getCooperList, 'POST', {})
        this.shopTypeList = result.data
      },
      changeType(item) {
        this.current = item.detail.current
      },
      handleNextStep() {
        let ctid = this.shopTypeList[this.current].type
        this.$u.route('/pages/mine/corpIdentify?ctid=' + ctid + '&ct='+ this.shopTypeList[this.current].title);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .swiper {
    height: 520rpx !important;
  }
  .cTypePage {
    padding-top: 132rpx;
    .m-tc-head {
      padding: 0 40rpx;
    }
    .swiper-item {
      padding-left: 16rpx;
      padding-right: 16rpx;
      
      .m-sitem {
        height: 300rpx;
        border-top-left-radius: 16rpx;
        border-top-right-radius: 16rpx;
        padding: 80rpx 50rpx;
        color: #FFFFFF;
        
        .m-sitem-title {
          font-size: 40rpx;
          font-weight: 500;
        }
        .m-sitem-sub {
          font-size: 28rpx;
          font-weight: 400;
        }
      }
      .m-sitem-c {
        border-bottom-left-radius: 16rpx;
        border-bottom-right-radius: 16rpx;
        background: #FFFFFF;
        padding: 36rpx 50rpx;
        font-size: 26rpx;
        font-weight: 400;
        color: #666666;
        
        box-shadow: 0px -1px 23px 0px rgba(10, 15, 45, 0.04), 0px 4px 23px 0px rgba(10, 15, 45, 0.04);
      }
    }
  }
</style>
