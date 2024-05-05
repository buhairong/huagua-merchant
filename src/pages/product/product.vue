<template>
  <view class="proPage commonPage">
    <!-- <view v-if="!userInfo || (userInfo && userInfo.status != 1)" class="m-page-off">
      <view class="m-t1">未认证</view>
      <view class="m-t2">请先完成认证</view>
      <view class="foot-btn m-t3" @click="go2Sign">去认证</view>
    </view> -->
    <!-- v-else -->
    <view class="m-page-on">
      <view class="content">
        <view v-if="list && list.length == 0">
          <u-gap
            height="200"
          />
          <u-empty
            text="暂无订单"
            mode="list"
          />
        </view>
        <!-- <view v-if="list"> -->
        <view
          v-for="(item, index) in list"
          :key="index"
          class="m-pro-item"
          @click="handleDetail(item)"
        >
          <view class="">
            <view class="u-flex u-row-between">
              <view class="m-pro-brand u-line-1">{{ item.carBrand + ' ' + item.carType + ' ' + item.carTypeYear + ' | ' + item.carTypeYearProduct }}</view>
              <view class="m-pro-guide u-line-1">{{ item.guidancePrice | $transformNum }}</view>
            </view>
            <view class="u-flex u-row-between">
              <view class="m-pro-payment">最低合约金额：￥{{ item.monthPayment | $numFormat }}</view>
              <view>
                <u-image
                  width="184"
                  height="102"
                  :src="item.imageUrl"
                />
              </view>
            </view>
          </view>
        </view>
        <!-- </view> -->
      </view>
      <u-loadmore
        v-show="page > 1"
        :status="status"
        :load-text="loadText"
      />
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        userInfo: null,
        partnerId: null,
        // riskAuditStatus: 5,
        riskAuditStatus: null,
        
        list: null,
        status: 'loadmore', // 加载更多 状态
        page: 1, // 第N页
        totalPages: 0, // 总页数
        loadText: {
          loadmore: '轻轻上拉',
          loading: '努力加载中',
          nomore: '实在没有了'
        },
      }
    },
    onShow() {
    },
    onLoad() {
      getApp().globalData.getUserInfo((data) => {
        this.userInfo = data;
        // TODO 释放
        // if(data) {
          this.partnerId = data.partnerId
          // if(data.status == 1) {
            this.list = []
            this.getProductList()
        //   }
        // }
      })
    },
    methods: {
      go2Sign() {
        if(!this.userInfo) {
          this.$getUserProfile("/pages/product/product", () => {
            this.$u.route("/pages/login/sign");
          });
          return false;
        }
        if(this.userInfo.status != 1) {
          this.$u.route('/pages/mine/type');
        }
      },
      async getProductList() {
        const res = await this.$getRequest(this.$url.getCarSubscribeList, 'POST', {
          cityId: uni.getStorageSync("cityId") || this.userInfo.cityId,
          page: this.page,
          partnerId: this.partnerId
        })
        this.list = this.list.concat(res.data.records)
        this.totalPages = res.data.pages
        this.page = res.data.current
        this.status = 'loadmore'
      },
      handleDetail(item) {
        let cityId = uni.getStorageSync("cityId") || this.userInfo.cityId
        this.$u.route(`/pages/product/detail?id=${item.carTypeYearProductId}&qt=1&cityId=${cityId}`);
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
        this.getProductList()
        if(this.page >= this.totalPages) {
          this.status = 'nomore';
        }
      }, 2000)
    },
  }
</script>

<style lang="scss" scoped>
.proPage {
  .m-page-off {
    padding: 300rpx 100rpx;
    text-align: center;
    .m-t1 {
      font-size: 40rpx;
      font-weight: bold;
      color: #333333;
    }
    .m-t2 {
      padding-top: 16rpx;
      font-size: 24rpx;
      font-weight: 400;
      color: #999999;
    }
    .m-t3 {
      margin-top: 216rpx;
    }
  }
  .m-page-on {
    padding: 36rpx 20rpx;
    .m-pro-item {
      padding: 42rpx 16rpx 22rpx 32rpx;
      background: #FFFFFF;
      box-shadow: 0px -1px 24px 0px rgba(10, 15, 45, 0.04), 0px 4px 24px 0px rgba(10, 15, 45, 0.04);
      border-radius: 12px;
      margin-bottom: 12px;
      .m-pro-brand {
        font-size: 28rpx;
        font-weight: bold;
        color: #333333;
      }
      .m-pro-guide {
        font-size: 32rpx;
        font-weight: 400;
        color: #EE3833;
      }
      .m-pro-payment {
        font-size: 24rpx;
        font-weight: 400;
        color: #999999;
      }
    }
  }
}
</style>
