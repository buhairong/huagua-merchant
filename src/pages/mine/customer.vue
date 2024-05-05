<template>
  <view class="custPage commonPage">
    <view class="u-flex u-row-right m-sel-view">
      <PageDateCond
        :date-cond-parent="dateCond"
        @setParentDateCond="setParentDateCond"
      />
      
      <view class="u-padding-left-60" @click="showAuditCondPicker = true">
        <text>{{ auditStatusCond }}</text>
        <u-icon class="u-padding-left-16" name="arrow-down" />
      </view>
    </view>
    <template>
      <u-picker
        mode="selector"
        v-model="showAuditCondPicker"
        confirm-color="#31C37B"
        :default-selector="[auditCondIndex]"
        :range="auditSelectorObj"
        range-key="name"
        @confirm="confirmAuditCond"
      />
    </template>
    
    <!-- List -->
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
        class="m-user-item"
        @click="handleDetail(item)"
      >
        <view class="u-flex">
          <view class="u-flex-1">
            <u-image
              width="100"
              height="100"
              shape="circle"
              src="https://image.51cheyaoshi.com/xcx/merchant/static/logo.png"
            />
            <!-- item.imageUrl -->
          </view>
          <view class="u-flex-4 u-padding-left-30">
            <view class="m-name-v">
              <text class="u-padding-right-10">{{ item.name }}</text>
              <u-icon v-if="item.sex == 2" name="woman" color="#dc493e" size="24"></u-icon>
              <u-icon v-if="item.sex == 1" name="man" color="#4ba4f8" size="24"></u-icon>
            </view>
            <view class="m-phone-v u-padding-top-20">
              <u-icon name="phone-fill" color="#999999"/>
              <text class="u-padding-left-10">{{ item.mobile }}</text>
            </view>
          </view>
          <view class="u-flex-3">
            <view class="u-text-right">
              <text class="m-status-t u-line-1">
                <text style="color: #1AA5FF;" class="u-padding-right-6">•</text>
                {{ item.riskAuditStatus | auditName }}
              </text>
            </view>
            <view class="u-padding-top-30 u-text-right">
              <u-button v-if="item.riskAuditStatus == 5" type="success" size="mini" @click="go2OrderPage(item.userId)">代客下单</u-button>
              <view><text v-if="item.unboundDays > 0" style="color: #EE3833;font-size: 24rpx;" class="u-padding-right-6">距离解绑仅剩{{ item.unboundDays }}天</text></view>
            </view>
          </view>
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
  import { auditStatusAll, userStatusCond } from "@/constants"
  
  export default {
    name: 'Customer',
    components: {
      PageDateCond
    },
    filters: {
      auditName(value) {
        return auditStatusAll[value]
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
        userStatus: 0,
        
        auditStatusCond: '已注册',
        auditSelectorObj: [],
        auditCondIndex: 0,
        showAuditCondPicker: false,
        
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
      this.list = []
      this.page = 1
      this.totalPages = 0
      
      getApp().globalData.getUserInfo((data) => {
        this.userInfo = data;
        this.userId = data.id;
        this.partnerId = data.partnerId
        
        this.getCustomerList(this.userId, 1)
      })
    },
    onLoad() {
      this.auditSelectorObj = userStatusCond
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
        this.getCustomerList()
      },
      async getCustomerList () {
        const custList = await this.$getRequest(this.$url.getCustomerList, "POST", {
          partnerId: this.userInfo.partnerId,
          page: this.page,
          startTime: this.startDate,
          endTime: this.endDate,
          status: this.userStatus
        });
        this.list = this.list.concat(custList.data.records)
        this.totalPages = custList.data.pages
        this.page = custList.data.current
        this.status = 'loadmore'
      },
      confirmAuditCond (e) {
        this.auditCondIndex = e[0]
        this.auditStatusCond = this.auditSelectorObj[e[0]].name
        this.userStatus = this.auditSelectorObj[e[0]].value
        
        // TODO list refresh
        this.page = 1
        this.totalPages = 0
        this.list = []
        this.getCustomerList()
      },
      go2OrderPage(custId) {
        this.$u.route(`/pages/order/order?id=${custId}`)
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
        this.getCustomerList(this.userId, this.page)
        if(this.page >= this.totalPages) {
          this.status = 'nomore';
        }
      }, 2000)
    },
  }
</script>

<style lang="scss" scoped>
.custPage {
  padding: 40rpx;
  .content {
    .m-user-item {
      padding: 38rpx 32rpx;
      background: #FFFFFF;
      box-shadow: 0px -1px 24px 0px rgba(10, 15, 45, 0.04), 0px 4px 24px 0px rgba(10, 15, 45, 0.04);
      border-radius: 12px;
      margin-bottom: 12px;
      .m-name-v {
        font-size: 28rpx;
        font-weight: bold;
        color: #333333;
      }
      .m-phone-v {
        font-size: 24rpx;
        font-weight: 400;
        color: #999999;
      }
      .m-status-t {
        padding: 4rpx 20rpx;
        background: #F7F7F7;
        border-radius: 20rpx;
        color: #666666;
        font-size: 22rpx;
        font-weight: 400;
      }
    }
  }  
}
</style>
