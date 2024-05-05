<template>
  <view class="orderDetailPage">
    <view class="m-top-card">
      <view class="u-padding-top-40 u-padding-left-40 u-padding-right-40">
        <view class="u-font-40 m-status">
          <text>{{ orderInfo.userCarSubscribeEntity.status | orderName }}</text>
        </view>
        <view class="m-card-view">
          <u-row>
            <u-col span="5" class="u-text-right">
              <u-image
                class="m-order-img"
                mode="aspectFill"
                width="100%"
                height="200rpx"
                :src="orderInfo.carTypeYearProductEntity.imageUrl"
              />
            </u-col>
            <u-col span="7">
              <view class="u-line-1">
                <view class="u-flex">
                  <view class="m-car-title"><text>{{ (orderInfo.carTypeYearProductEntity.carBrand || '-') + ' ' + (orderInfo.carTypeYearProductEntity.carType || '-') }}</text></view>
                  <view class="u-padding-left-30">
                    <u-tag text="6个月" mode="plain" bg-color="#F3F4F9" border-color="#F3F4F9" color="#6E7376" />
                  </view>
                </view>
                <view class="m-car-subtitle"><text>{{ (orderInfo.carTypeYearProductEntity.carTypeYear || '-') + ' ' + (orderInfo.carTypeYearProductEntity.carTypeYearProduct || '-') }}</text></view>
              </view>
            </u-col>
          </u-row>
          <view class="u-text-center m-center-row">
            <u-row align="center" justify="center">
              <u-col span="4">
                <view class="m-row-bot-num u-font-36"><text>¥{{ orderInfo.userCarSubscribeEntity.totalPayment || '-' }}</text></view>
                <view class="m-row-bot-tl u-font-12">订单金额</view>
              </u-col>
              <u-col span="4">
                <view class="m-row-bot-num u-font-36"><text>{{ orderInfo.userCarSubscribeEntity.commissionRate || '-' }}</text></view>
                <view class="m-row-bot-tl u-font-12">佣金比例</view>
              </u-col>
              <u-col span="4">
                <view class="m-row-bot-num u-font-36"><text>{{ orderInfo.userCarSubscribeEntity.commissionAmount || '-' }}</text></view>
                <view class="m-row-bot-tl u-font-12">佣金预估</view>
              </u-col>
            </u-row>
          </view>
        </view>
      </view>
    </view>
    <view class="u-padding-left-40 u-padding-right-40">
      <view class="m-card-view">
        <view class="m-card-title"><text>合约详情</text></view>
        <view class="m-case-list u-flex u-row-between u-padding-top-30">
          <view>订阅主体</view>
          <view>{{ userInfo.realName || userInfo.nickName }}</view>
        </view>
        <view class="m-case-list u-flex u-row-between">
          <view>订阅周期</view>
          <view>{{ orderInfo.userCarSubscribeEntity.monthTotal }}个月</view>
        </view>
        <view class="m-case-list u-flex u-row-between">
          <view>订阅押金</view>
          <view>{{ orderInfo.userCarSubscribeEntity.deposit }}</view>
        </view>
        <view class="m-case-list u-flex u-row-between" v-if="orderInfo.userCarSubscribeEntity.totalCarUsedFee > 0">
          <view>订阅租金</view>
          <view>{{ orderInfo.userCarSubscribeEntity.totalCarUsedFee }}</view>
        </view>
        <view class="m-case-list u-flex u-row-between"  v-if="orderInfo.userCarSubscribeEntity.mileage > 0">
          <view>里程限制</view>
          <view>{{ orderInfo.carTypeYearProductEntity.mileage }}</view>
        </view>
        <!-- 当前城市若无门店，默认上门签约，点击 > 设置修改上门签约地址 -->
        <view class="m-case-list u-flex u-row-between" v-if="orderInfo.userCarSubscribeEntity.store > 0">
          <view>签约地址</view>
          <view>{{ orderInfo.carTypeYearProductEntity.store }}</view>
        </view>
      </view>
      
      <view class="m-card-view">
        <view><text class="m-card-title">订单历史</text></view>
        <view>
          <u-row>
            <u-col span="5">
              <u-steps
                :list="logContent"
                mode="dot"
                :current="0"
                active-color="#0AEB7D"
                direction="column"
              ></u-steps>
            </u-col>
            <u-col span="7">
              <u-steps
                class="m-log-step"
                :list="logList"
                mode="dot"
                :current="0"
                active-color="rgba(10, 15, 45, 0.3)"
                direction="column"
              ></u-steps>
            </u-col>
          </u-row>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import { orderStatusAll } from "@/constants";
  import dayjs from "dayjs";
  
  export default {
    name: 'OrderDetail',
    filters: {
      orderName(value) {
        return orderStatusAll.find(item => item.value === value).name
      },
    },
    data() {
      return {
        id: '',
        userInfo: {}, // 用户信息
        orderInfo: { userCarSubscribeEntity: { status: 0 } },
        logList: [],
        logContent: [],
      }
    },
    onLoad(option) {
      if(option) {
        this.id = option.id
      }
      this.init();
    },
    onShow() {
      getApp().globalData.getUserInfo((data) => {
        this.userInfo = data;
      })
    },
    methods: {
      async init() {
        uni.showLoading({
          title: '加载中'
        });
        const result = await this.$getRequest(this.$url.orderDetail, 'POST', {
          id: this.id, // this.id 11
          nowPaymentDeposit: 0,
          usedUserProductId: '', //天次id
          userCouponIds: ''//优惠券id
        })
        uni.hideLoading()
        
        this.orderInfo = result.data;
        
        let logList = []
        let logContent = []
        for(const item of result.data.logEntityList) {
          const date = dayjs(item.createdTime).format('YYYY年MM月DD日')
          const time = dayjs(item.createdTime).format('HH:mm');
          logList.push({ name: date + ' ' + time })
          logContent.push({ name: item.content })
        }
        this.logList = logList
        this.logContent = logContent
        
      },
    }
  }
</script>

<style lang="scss">
  .m-card-view {
    .m-order-img .u-image {
      margin-top: -40rpx;
    }
  }
  .m-center-row {
    text-align: center;
    .m-row-bot-num, .m-row-bot-tl {
      text-align: center;
    }
    .m-row-bot-num {
      font-weight: 500;
      font-weight: 500;
      color: #333333;
      font-size: 28rpx;
    }
    .m-row-bot-tl {
      padding-top: 10rpx;
      font-weight: 400;
      color: #999999;
      font-size: 24rpx;
    }
  }
  .u-steps__item {
    min-height: 75rpx !important;
    .u-steps__item__text--column {
      color: rgba(10, 15, 45, 0.8) !important;
    }
    .u-steps__item__line .u-line{
      height: 60% !important;
      border-left-width: 0.5px !important;
    }
    .u-steps__item__dot {
      width: 6px !important;
      height: 6px !important;
    }
    .u-steps__item__line {
      left: calc(9rpx / 2) !important;
      height: 100% !important;
      top: 73% !important;
    }
  }
  .m-log-step{
    .u-steps__item__dot {
      background-color: transparent !important;
    }
    .u-steps__item__line .u-line{
      border-color: transparent !important;
    }
    .u-steps__item__text--column {
      color: rgba(10, 15, 45, 0.3) !important;
    }
  }
  .u-tag {
    padding: 2rpx 14rpx !important;
  }
</style>

<style lang="scss" scoped>
.orderDetailPage {
  font-family: PingFangSC-Medium, PingFang SC;
  
  .m-top-card {
    background: linear-gradient(180deg, #31C37B 0%, rgba(49, 195, 123, 0) 100%);
    
    .m-status {
      font-size: 40rpx;
      color: #FFFFFF;
      font-weight: 500;
      padding-left: 32rpx;
      margin-bottom: 24rpx;
    }
  }
  
  .content {
    padding: 40rpx;
  }
    
  .m-card-view {
    padding: 38rpx 32rpx;
    background: #FFFFFF;
    box-shadow: 0px -1px 24px 0px rgba(10, 15, 45, 0.04), 0px 4px 24px 0px rgba(10, 15, 45, 0.04);
    border-radius: 24rpx;
    margin-bottom: 24rpx;
    
    .m-car-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
    }
    
    .m-car-subtitle {
      padding-top: 10rpx;
      font-size: 24rpx;
      font-weight: 400;
      color: #6E7376;
    }
    .m-card-title {
      font-size: 34rpx;
      font-weight: bold;
      color: #333333;
    }
    
    .m-case-list {
      font-size: 28rpx;
      color: #333333;
      padding: 10rpx 0;
      
      
    }
  }
}
</style>
