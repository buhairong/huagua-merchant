<template>
  <view class="orderListPage commonPage">
    <view class="u-flex u-row-right m-sel-view">
      <PageDateCond
        :date-cond-parent="dateCond"
        @setParentDateCond="setParentDateCond"
      />
      
      <view class="u-padding-left-60" @click="showOrderCondPicker = true">
        <text>{{ orderStatusCond }}</text>
        <u-icon class="u-padding-left-16" name="arrow-down" />
      </view>
    </view>
    
    <template>
      <u-picker
        mode="selector"
        v-model="showOrderCondPicker"
        confirm-color="#31C37B"
        :default-selector="[orderCondIndex]"
        :range="orderSelectorObj"
        range-key="name"
        @confirm="confirmOrderCond"
      />
    </template>
    
    <view class="content u-padding-top-30  u-padding-bottom-30">
      <view v-if="list && list.length == 0">
        <u-gap
          height="200"
        />
        <u-empty
          text="暂无订单"
          mode="list"
        />
      </view>
      
      <view
        v-for="(item, index) in list"
        :key="index"
        class="m-order-item"
        @click="handleDetail(item)"
      >
        <view class="wrap">
          <u-row>
            <u-col span="8">
              <view class="u-line-1">
                <view class="u-flex">
                  <view class="m-car-title">{{ item.carBrand }}</view>
                  <view class="u-padding-left-30">
                    <u-tag :text="item.monthTotal + '个月'" mode="plain" bg-color="#F3F4F9" border-color="#F3F4F9" color="#6E7376" />
                  </view>
                </view>
                <view class="m-car-subtitle">{{ item.carType }}{{ item.carTypeYear }}{{ item.carTypeYearProduct }}</view>
              </view>
            </u-col>
            <u-col span="4">
              <view class="u-text-right m-order-status">{{ item.orderStatus | orderName }}</view>
            </u-col>
          </u-row>
          
          <u-row>
            <u-col span="7">
              <view class="m-order-view">
                <view class="m-order-view-1">
                  <text class="m-order-title">客户姓名</text>
                  <text class="m-order-desc">{{ item.name }}</text>
                </view>
                <view class="m-order-view-2">
                  <text class="m-order-title">订单编号</text>
                  <text class="m-order-desc">{{ item.orderno }}</text>
                </view>
              </view>
            </u-col>
            <u-col span="5" class="u-text-right">
              <u-image
                class="m-order-img"
                mode="aspectFill"
                width="100%"
                height="200rpx"
                :src="item.imageUrl"
              />
            </u-col>
          </u-row>
          
        </view>
      </view>
    </view>
    
    <u-loadmore
      v-show="page > 1"
      :status="status"
      :load-text="loadText"
    />
  </view>
</template>

<script>
  import dayjs from "dayjs"
  import PageDateCond from '@/components/PageDateCond'
  import { orderStatusAll } from "@/constants"
  export default {
    name: 'OrderList',
    components: {
      PageDateCond
    },
    filters: {
      orderName(value) {
        return orderStatusAll.find(item => item.value === value).name
      },
    },
    data() {
      return {
        userInfo: null, // 用户信息
        userId: null, // 用户id
        partnerId: null, // 合伙人id
        
        dateCond: '今天', // 今天、昨天、近7天、近30天、自定义
        startDate: '' || dayjs(new Date()).format('YYYY/MM/DD'),
        endDate: dayjs(new Date()).format('YYYY/MM/DD'),
        orderStatus: 0,
        
        orderStatusCond: '待支付订金',
        orderSelectorObj: [],
        orderCondIndex: 0,
        showOrderCondPicker: false,
        
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
      this.list = []
      
      getApp().globalData.getUserInfo((data) => {
        this.userInfo = data;
        this.userId = data.id;
        this.partnerId = data.partnerId
        this.list = [];
        this.getOrderList(this.userId, 1)
      })
      
      this.orderSelectorObj = orderStatusAll
    },
    methods: {
      // pageDateCond
      setParentDateCond(dateStr, startDate, endDate) {
        this.dateCond = dateStr
        this.startDate = startDate
        this.endDate = endDate != '' ? endDate : dayjs(new Date()).format('YYYY-MM-DD')
        
        // TODO 重新检索数据
        this.page = 1
        this.totalPages = 0
        this.list = []
        this.getOrderList()
      },
      
      confirmOrderCond (e) {
        this.orderCondIndex = e[0]
        this.orderStatusCond = this.orderSelectorObj[e[0]].name
        this.orderStatus = this.orderSelectorObj[e[0]].value
        // TODO list refresh
        this.page = 1
        this.totalPages = 0
        this.list = []
        this.getOrderList()
      },
      async getOrderList(userId, page) {
        const res = await this.$getRequest(this.$url.orderList, 'POST', {
          page: this.page,
          partnerId: this.partnerId,
          startTime: this.startDate,
          endTime: this.endDate,
          orderStatus: this.orderStatus
        })
        console.log(res)
        this.list = this.list.concat(res.data.records)
        this.totalPages = res.data.pages
        this.page = res.data.current
        this.status = 'loadmore'
      },
      handleDetail(item) {
        this.$u.route(`/pages/order/detail?id=${item.id}`)
      },
    },
    onReachBottom() {
      if(this.page >= this.totalPages) {
        this.status = 'nomore';
        return;
      }
      this.status = 'loading';
      this.page = ++ this.page;
      setTimeout(() => {
        this.getOrderList(this.userId, this.page)
        if(this.page >= this.totalPages) {
          this.status = 'nomore';
        }
      }, 2000)
    },
  }
</script>
<style lang="scss">
  .m-order-img .u-image{
    margin-bottom: -74rpx !important;
  }
  .u-tag {
    padding: 2rpx 14rpx !important;
  }
</style>
<style lang="scss" scoped>
.orderListPage {
  padding: 40rpx;
  .m-sel-view {
    color: #666666;
    font-size: 28rpx;
    font-weight: 500;
  }
  .content {
    .m-order-item {
      padding: 38rpx 32rpx;
      background: #FFFFFF;
      box-shadow: 0px -1px 24px 0px rgba(10, 15, 45, 0.04), 0px 4px 24px 0px rgba(10, 15, 45, 0.04);
      border-radius: 12px;
      margin-bottom: 12px;
      
      .m-car-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
      }
      .m-car-subtitle {
        font-size: 24rpx;
        font-weight: 400;
        color: #6E7376;
      }
      .m-order-status {
        font-size: 28rpx;
        font-weight: 500;
        color: #0397FF;
      }
      
      .m-order-view {
        padding-top: 48rpx;
        
        .m-order-view-2 {
          padding-top: 16rpx;
        }
        
        .m-order-title {
          font-size: 12px;
          font-weight: 400;
          color: #343434;
        }
        .m-order-desc {
          padding-left: 50rpx;
          font-size: 12px;
          font-weight: 400;
          color: #999999;
        }
        
      }
    }
  }
}
</style>
