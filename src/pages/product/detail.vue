<template>
  <view class="proDetailPage commonPage">
    <view v-show="!showShareImg">
    <view class="u-padding-top-10 u-padding-left-50  u-padding-right-50 u-text-right">
      <button open-type="share" class="u-reset-button u-text-right">
        <u-icon
          name="zhuanfa"
          color="#333333"
          size="40"
          @click="handleShare"
        />
      </button>
      <!-- <button class="u-reset-button u-text-right" @click="handleShareLike">
        <u-icon
          name="zhuanfa"
          color="#333333"
          size="40"
        />
      </button> -->
    </view>
    <view class="">
      <view class="u-flex u-text-center u-row-center">
        <u-image
          mode="scaleToFit"
          width="750"
          height="560"
          :src="product.imageUrl"
        />
      </view>
      <view class="m-detail">
        <view class="u-padding-left-32 u-padding-right-32">
          <view class="">
            <view class="m-pro-brand">{{ product.carBrand + ' ' + product.carType + ' ' + product.carTypeYear + ' | ' + product.carTypeYearProduct }}</view>
            <view class="u-flex u-padding-top-20">
              <view>
                <text class="yj-label-txt">佣金</text>
                <text class="yj-money-txt u-padding-left-12">￥</text>
                <text class="yj-val-txt">{{ product.carSubscribeRespVO.commissionAmount }}</text>
              </view>
              <view class="zdj-v u-padding-left-34">厂商指导价：{{ product.guidancePrice | $transformNum }}</view>
            </view>
          </view>
          <view class="m-card">
            <view class="m-card-title">订阅方案</view>
            <u-row class="m-info-row ">
              <u-col span="3"><text class="m-col-title-txt">订阅车况：</text></u-col>
              <u-col span="9"><text class="m-col-val-txt">{{ product.carSubscribeRespVO.newType === 1 ? "全新车" : "准新车" }}</text></u-col>
            </u-row>
            <u-row class="m-info-row">
              <u-col span="3"><text class="m-col-title-txt">订阅周期：</text></u-col>
              <u-col span="9">
                <u-radio-group v-model="periodType" active-color="#0A0F2D" @change="changePeriodGroup" size="26">
                  <u-radio
                    v-for="(item,key,index) in product.carSubscribeRespVO.productGroup"
                    :key="index"
                    active-color="#0a0f2d"
                    shape="circle" 
                    :name="key" 
                    icon-size="14" 
                    label-size="28" 
                    @change="changePeriodType"
                  >
                    {{ key }}期
                  </u-radio>
                </u-radio-group>
              </u-col>
            </u-row>
            <!-- <u-row class="m-info-row">
              <u-col span="3"><text class="m-col-title-txt">支付方式：</text></u-col>
              <u-col span="9">
                <text v-if="product.productGroup[periodType].length == 1" class="m-col-val-txt">{{ paymentTypeAll[product.productGroup[periodType][0].paymentType - 1] }}</text>
                <u-radio-group v-if="product.productGroup[periodType].length > 1" v-model="subType" active-color="#0A0F2D" @change="changeSubTypeGroup" size="26">
                  <u-radio
                    v-for="(product,pKey,pIndex) in product.productGroup[periodType]"
                    :key="pIndex"
                    active-color="#0a0f2d"
                    shape="circle" 
                    :name="product.id" 
                    icon-size="14" 
                    label-size="28" 
                    @change="changeSubType"
                  >
                    {{ paymentTypeAll[product.paymentType - 1] }}
                  </u-radio>
                </u-radio-group>
              </u-col>
            </u-row> -->
            <u-row class="m-info-row">
              <u-col span="3"><text class="m-col-title-txt">订阅租金：</text></u-col>
              <u-col span="9"><text class="m-col-val-txt">{{ popData.monthPayment |$numFormat }}元/月</text></u-col>
            </u-row>
            <u-row class="m-info-row">
              <u-col span="3"><text class="m-col-title-txt">订阅押金：</text></u-col>
              <u-col span="9"><text class="m-col-val-txt">{{ popData.deposit | $numFormat }}</text></u-col>
            </u-row>
            <u-row class="m-info-row" v-if="popData.usedFee > 0">
              <u-col span="3"><text class="m-col-title-txt">车辆使用费：</text></u-col>
              <u-col span="9"><text class="m-col-val-txt">{{ popData.usedFee | $numFormat }}元/月</text></u-col>
            </u-row>
            <u-row class="m-info-row" v-if="popData.plateFee > 0">
              <u-col span="3"><text class="m-col-title-txt">车牌占用费：</text></u-col>
              <u-col span="9"><text class="m-col-val-txt">{{ popData.plateFee | $numFormat }}元/月</text></u-col>
            </u-row>
            <u-row class="m-info-row" v-if="popData.serviceFee > 0">
              <u-col span="3"><text class="m-col-title-txt">保障服务费：</text></u-col>
              <u-col span="9"><text class="m-col-val-txt">{{ popData.serviceFee | $numFormat }}元/月</text></u-col>
            </u-row>
            <u-row class="m-info-row">
              <u-col span="3"><text class="m-col-title-txt">期末选择：</text></u-col>
              <u-col span="9"><text class="m-col-val-txt">多种方案，灵活选择</text></u-col>
            </u-row>
            <u-row class="m-info-row">
              <u-col span="3"><text class="m-col-title-txt">保障服务：</text></u-col>
              <u-col span="9"><text class="m-col-val-txt">服务区域内免费上门去送车，7x24小时道路救援</text></u-col>
            </u-row>
          </view>
          <!-- card TODO -->
          <!-- <view class="m-card">
            <view class="m-card-title">车辆信息</view>
            <u-row class="m-info-row ">
              <u-col span="3"><text class="m-col-title-txt">内饰颜色：</text></u-col>
              <u-col span="9"><text class="m-col-val-txt">{{ product.inColor }}</text></u-col>
            </u-row>
            <u-row class="m-info-row ">
              <u-col span="3"><text class="m-col-title-txt">可选颜色：</text></u-col>
              <u-col span="9"><text class="m-col-val-txt">黑、白</text></u-col>
            </u-row>
          </view> -->
          <!-- card -->
          <view class="m-card">
            <view class="m-card-title u-text-center">产品流程</view>
            <view class="m-lbl">1.定制产品</view>
            <view class="m-cont">在线支付合约订金，24小时内专属客户经理为您提供1对1订车服务</view>
            <view class="m-lbl">2.认证资质</view>
            <view class="m-cont">客户经理协助您上传签约用户身份信息，认证通过即可签约</view>
            <view class="m-lbl">3.签约付款</view>
            <view class="m-cont">签订合约并按照合同约定的付款方式及金额支付相关费用后，我们按所签合约为您定制采购车辆</view>
            <view class="m-lbl">4.交付车辆</view>
            <view class="m-cont">30天内我们完成车辆采购、落地（购置税、上牌、保险）流程，与您预约交车时间，完成车辆交付（准新车可直接提车）</view>
          </view>
        </view>
      </view>
    </view>
    <!-- <u-gap
      height="200"
      bg-color="#FFFFFF"
    /> -->
    </view>
    </view>
  </view>
</template>

<script>
  export default {
    onShareAppMessage(res) {
      return {
        title: '车要试 让有车生活 · 更简单',
        desc: '',
        path: '/pages/product/detail',
        imageUrl: '', // ./../..https://image.51cheyaoshi.com/xcx/merchant/static/logo.png
      }
    },
    data() {
      return {
        wH: null,
        wW: null,
        
        userInfo: null,
        carTypeYearProductId: '',
        product: { 
          guidancePrice : undefined,
          carSubscribeRespVO: {
            monthPayment: undefined,
          },
        },
        cityId: null,
        partnerId: null,
        popData: { monthPayment: undefined },
        subType: 0,
        periodType: '',
        paymentTypeAll: ['月付','季付','年付','全款'],
      }
    },
    onLoad(option) {
      let cityId = uni.getStorageSync("cityId")
      if(option) {
        this.cityId = cityId || option.cityId
        this.queryType = option.qt 
        this.carTypeYearProductId = option.id
      }
    },
    onShow() {
      const pageThis = this
      getApp().globalData.userInfo = null;
      getApp().globalData.getUserInfo((data) => {
        this.userInfo = data;
        this.partnerId = data.partnerId
        this.init()
      })
    },
    methods: {
      money2TenThousand(num) {
        if (num != undefined) {
          let tnumStr = (num / 10000).toFixed(3);
          const numStr = tnumStr.substring(0, tnumStr.length - 1)
          return `${numStr}万`;
        } else {
          return '-'
        }
      },
      money2Thousand(num) {
        if(num != undefined) {
          const numStr = num.toFixed();
          return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
          return '-'
        }
      },
      async init() {
        const pageThis = this
        uni.showLoading({
          title: '加载中'
        });
        const carDetailData = this.$getRequest(this.$url.carSubscribeDetailCommission, "POST", {
          carTypeYearProductId: this.carTypeYearProductId,
          cityId: this.cityId,
          partnerId: this.partnerId,
          queryType: this.queryType
        }).then(carDetailData => {
          uni.hideLoading();
          this.product = JSON.parse(JSON.stringify(carDetailData.data));
          // 初始化周期
          for(const key in pageThis.product.carSubscribeRespVO.productGroup) {
            for(const item of pageThis.product.carSubscribeRespVO.productGroup[key]) {
              if(item.id === pageThis.product.carSubscribeRespVO.id) {
                pageThis.periodType = key
                pageThis.popData.usedFee = item.totalCarUsedFee
                pageThis.popData.plateFee = item.totalPlateNumFee
                pageThis.popData.serviceFee = item.totalServiceFee
                pageThis.popData.deposit = item.deposit
                pageThis.popData.monthTotal = item.monthTotal
                pageThis.popData.monthPayment = item.monthPayment
                pageThis.popData.reserveFee = item.reserveFee
              }
            }
          }
        })
      },
      changePeriodGroup(index) {
        const oldPopData = JSON.parse(JSON.stringify(this.popData))
        this.popData.usedFee = 0
        this.popData.plateFee = 0
        this.popData.serviceFee = 0
        this.popData.deposit = 0
        this.popData.monthTotal = 0
        this.popData.monthPayment = 0
        
        // 默认勾选
        const item = this.product.carSubscribeRespVO.productGroup[index][0]
        this.subType = item.id
        this.changeProId = item.id
        this.changePayment = item.monthPayment
        this.popData.usedFee = item.totalCarUsedFee
        this.popData.plateFee = item.totalPlateNumFee
        this.popData.serviceFee = item.totalServiceFee
        this.popData.deposit =item.deposit
        this.popData.monthTotal = item.monthTotal
        this.popData.monthPayment = item.monthPayment
        this.popData.reserveFee = item.reserveFee
        // console.log(this.popData)
      },
      changePeriodType(index) {
      },
      handleShare() {
        
      }
    }
  }
</script>
<style lang="scss">
  .proDetailPage {
    .m-info-row {
      .u-row {
        padding-top: 32rpx !important;
      }
    }
  }
</style>
<style lang="scss" scoped>
.proDetailPage {
  .m-detail {
    background: #FFFFFF; //#bcaedf
    border-radius: 38rpx 38rpx 0px 0px;
    padding-top: 86rpx;
    padding-bottom: 200rpx;
    margin-top: -170rpx;
    .m-pro-brand {
      font-size: 36rpx;
      font-weight: bold;
      color: #333333;
    }
    .yj-label-txt {
      font-size: 24rpx;
      font-weight: 400;
      color: #333333;
    }
    .yj-money-txt {
      font-size: 32rpx;
      font-weight: bold;
      color: #EE3833;
    }
    .yj-val-txt {
      font-size: 44rpx;
      font-weight: bold;
      color: #EE3833;
    }
    .zdj-v {
      font-size: 24rpx;
      font-weight: 400;
      color: #999999;
    }
    .m-card {
      padding: 40rpx 32rpx;
      .m-card-title {
        font-size: 34rpx;
        font-weight: bold;
        color: #333333;
        padding-bottom: 10rpx;
      }
      .m-col-title-txt {
        font-size: 28rpx;
        font-weight: 400;
        color: #333333;
      }
      .m-col-val-txt {
        font-size: 28rpx;
        font-weight: 400;
        color: #999999;
      }
      .m-lbl {
        padding-top: 30rpx;
        font-size: 28rpx;
        font-weight: bold;
        color: #333333;
      }
      .m-cont {
        padding-top: 16rpx;
        font-size: 24rpx;
        font-weight: 400;
        color: #666666;
      }
    }
  }
}
</style>
