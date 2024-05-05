<template>
  <view class="walletPage">
    <u-sticky>
      <view class="m-top u-padding-top-16 u-padding-left-60">
        <view class="u-flex u-row-between">
          <view>
            <view class="m-label">我的余额</view>
            <view class="m-val-l u-padding-top-8">{{ walletInfo.balance || 0 }}</view>
          </view>
          <view class="m-draw-btn" @click="go2WithDrawal">立即提现</view>
        </view>
        <view class="u-flex u-padding-top-30">
          <view class="u-text-center" @click="go2BankCard">
            <view class="m-label">银行卡</view>
            <view class="m-val-m">{{ walletInfo.bankCardCount || 0 }}</view>
          </view>
          <view class="m-flex-col-2 u-text-center">
            <view class="m-label">积分</view>
            <view class="m-val-m">{{ walletInfo.score || 0 }}</view>
          </view>
        </view>
      </view>
    </u-sticky>
    
    <view class="m-list-content">
      <view class="item-label u-padding-bottom-10">余额明细</view>
      
      <view v-if="list && list.length == 0">
        <u-gap
          height="200"
          bg-color="#FFFFFF"
        />
        <u-empty
          text="暂无余额明细"
          mode="list"
        />
      </view>
      
      <view
        v-for="(item, index) in list"
        :key="index"
        class="m-card item"
      >
        <view class="u-flex u-row-between">
          <view class="item-label">{{ item.type | payTypeText }}</view>
          <view class="item-val">{{ item.total }}</view>
        </view>
        <view class="u-flex u-row-between u-padding-top-16">
          <view class="item-time">{{ item.createdTime }}</view>
          <!-- <u-tag :text="item.status | statusText" type="info" /> -->
          <view v-if="item.afterBalance  > 0" class="item-remark">余额：{{ item.afterBalance }}</view>
        </view>
      </view>
      <u-loadmore
        v-show="page > 1"
        :status="status"
        :load-text="loadText"
      />
      <u-gap height="200" />
    </view>
  </view>
</template>

<script>
  import { accountStatusAll, accountPayTypeAll } from "@/constants"
  export default {
    name: 'BalanceList',
    filters: {
      payTypeText(value) {
        return accountPayTypeAll.find(item => item.value === value).name
      },
      statusText(value) {
        return accountStatusAll.find(item => item.value === value).name
      }
    },
    data() {
      return {
        userInfo: null, // 用户信息
        partnerId: null,
        walletInfo: null, // 钱包总览
        list: [], // 余额列表
        status: 'loadmore', // 加载更多 状态
        page: 0, // 第N页
        totalPages: 0, // 总页数
        loadText: {
          loadmore: '轻轻上拉',
          loading: '努力加载中',
          nomore: '实在没有了'
        }
      }
    },
    onShow() {
      this.list = []
      this.totalPages = 0
      this.page = 0
      getApp().globalData.getUserInfo((data) => {
        console.log(data);
        this.userInfo = data;
        this.userId = data.id;
        this.partnerId = data.partnerId
        this.init(this.userInfo.partnerId)
        this.getBalance(data.id, 1)
      })
    },
    onPullDownRefresh() {
      uni.stopPullDownRefresh();
    },
    methods: {
      async init(partnerId) {
        const res = await this.$getRequest(this.$url.walletInfo, 'POST', {
          partnerId: partnerId
        })
        this.walletInfo = res.data
      },
      async getBalance(userId, page) {
        const res = await this.$getRequest(this.$url.getWalletDetailList, 'POST', {
            page,
            partnerId: this.partnerId
        })
        if(res && res.data) {
          this.list = this.list.concat(res.data.records)
          this.totalPages = res.data.pages
          this.page = res.data.current
          this.status = 'loadmore'
        }
      },
      go2WithDrawal() {
        this.$u.route('/pages/mine/withdrawal');
      },
      go2BankCard() {
        this.$u.route('/pages/mine/bankCard');
      }
    },
    onReachBottom() {
      if(this.page >= this.totalPages) {
        this.status = 'nomore';
        return;
      }
      this.status = 'loading';
      this.page = ++ this.page;
      setTimeout(() => {
        this.getBalance(this.userId, this.page)
        if(this.page >= this.totalPages) {
            this.status = 'nomore';
        }
      }, 2000)
    },
  }
</script>

<style lang="scss" scoped>
  .walletPage {
    .m-top {
      // height: 286rpx;
      background: #31C37B;
      color: #FFFFFF;
      padding-bottom: 18rpx;
      .m-label {
        font-size: 28rpx;
        font-weight: 400;
        color: #FFFFFF;
      }
      .m-val-l {
        font-size: 52rpx;
        font-weight: 500;
        color: #FFFFFF;
      }
      .m-val-m {
        padding-top: 2rpx;
        font-size: 36rpx;
        font-weight: 500;
        color: #FFFFFF;
      }
      .m-draw-btn {
        text-align: center;
        // width: 87px;
        padding: 10rpx 28rpx;
        background: #FFFFFF;
        border-top-left-radius: 30rpx;
        border-bottom-left-radius: 30rpx;
        font-size: 28rpx;
        font-weight: 500;
        color: #31C37B;
      }
      .m-flex-col-2 {
        padding-left: 280rpx;
      }
    }
    .m-list-content {
      padding: 36rpx 32rpx;
      .item-label {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
      }
      .item {
        padding: 40rpx 30rpx;
        .item-val {
          font-size: 32rpx;
          font-weight: 500;
          color: #333333;
        }
        .item-time {
          font-size: 24rpx;
          font-weight: 400;
          color: #999999;
        }
        .item-remark {
          font-size: 28rpx;
          font-weight: 500;
          color: #333333;
        }
      }
    }
  }

</style>
