<template>
  <view class="bcPage commonPage">
    <view v-if="!list" class="m-page-off u-text-center">
      <u-loading mode="flower"></u-loading>
    </view>
    <view v-if="list.length > 0"class="m-page-on">
      <view class="u-flex u-row-between">
        <view>银行卡（ {{ list.length + '张' }} ）</view>
        <view class="m-add-btn" @click="addBankCard"><u-icon name="plus" color="#2979ff" size="20"></u-icon>添加</view>
      </view>
      <view class="content">
        <view v-if="list && list.length == 0">
          <u-gap
            height="200"
            bg-color="#FFFFFF"
          />
          <u-empty
            text="暂无银行卡"
            mode="list"
          />
        </view>
        
        <view
          v-for="(item, index) in list"
          :key="index"
          class="m-card-item m-card"
          :class="item.bankClassName"
          @click="handleDetail(item)"
        >
          <u-image
            style="position: absolute;margin-top: -40rpx;"
            mode="scaleToFit"
            src="https://image.51cheyaoshi.com/xcx/merchant/static/identify/bc_cover.png"
            width="660"
            height="256"
          />
          <view class="item-t1">{{ item.bankName }}</view>
          <view class="item-t2">{{ item.bankCardNo }}</view>
          <view class="item-t3">{{ item.bankType || '借记卡' }}</view>
        </view>
      </view>
    </view>
    
    <view v-else class="m-page-off u-text-center">
      <view class="m-t1">添加银行卡</view>
      <view class="m-t2">请添加您的银行卡</view>
      <view class="foot-btn-common m-t3" @click="addBankCard">添加银行卡</view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'BankCard',
    data() {
      return {
        list: [],
        status: 'loadmore', // 加载更多 状态
        page: 0, // 第N页
        totalPages: 0, // 总页数
        loadText: {
          loadmore: '轻轻上拉',
          loading: '努力加载中',
          nomore: '实在没有了'
        },
        cardList: []
      }
    },
    onShow() {
    },
    onLoad() {
      this.list = []
      this.totalPages = 0
      this.page = 0
      getApp().globalData.getUserInfo((data) => {
        this.userInfo = data;
        this.userId = data.id;
        this.init(this.userInfo.partnerId)
      })
    },
    methods: {
      async init(pId) {
        const res = await this.$getRequest(this.$url.getBankCardList, 'POST', {
          partnerId: pId
        })
        this.list = res.data
        
        // const newList = []
        // // 过滤卡片
        // if(res.data.length > 0){
        //   for (const item of res.data) {
        //     if(item.bankName == '中国农业银行') {
        //       item.bankClassName = 'ny-card'
        //     }
        //     console.log(item)
        //     newList.push(item)
        //   }
        // }
        // this.list = newList
      },
      addBankCard() {
        this.$u.route('/pages/mine/addBankCard')
      },
      handleDetail(item) {
        uni.setStorageSync("BankCardItemInfo", item)
        this.$u.route('/pages/mine/bankCardDetail')
      }
    }
  }
</script>

<style lang="scss" scoped>
.bcPage {
  background: #FFFFFF !important;
  .m-page-off {
    padding: 214rpx 50rpx;
    .m-t1 {
      font-size: 40rpx;
      font-weight: 500;
      color: #333333;
    }
    .m-t2 {
      padding-top: 24rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #999999;
    }
    .m-t3 {
      margin-top: 200rpx;
    }
  }
  .m-page-on {
    padding: 56rpx 40rpx;
    .m-card-item {
      // padding: 60rpx 40rpx;
      color: #333333;
      .item-t1 {
        border-top-left-radius: 24rpx;
        border-top-right-radius: 24rpx;
        padding-top: 40rpx;
        padding-left: 40rpx;
        padding-bottom: 96rpx;
        font-size: 36rpx;
        font-weight: bold;
        color: #FFFFFF;
        background: linear-gradient(297deg, #5656FF 0%, #55D0FF 100%);
        
      }
      .item-t2 {
        padding-left: 40rpx;
        padding-top: 32rpx;
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
      }
      .item-t3 {
        font-size: 12px;
        font-weight: 400;
        color: #999999;
        padding-left: 40rpx;
        padding-bottom: 32rpx;
      }
    }
    .m-add-btn {
      padding: 12rpx 32rpx;
      background: #F7F7F7;
    }
    .zs-card {
      background: #EA564A;
    }
    .ny-card {
      background: #2c6536;
    }
    .gs-card {
      background: #bf9232;
    }
    .pf-card {
      background: #11356f;
    }
  }
}
</style>
