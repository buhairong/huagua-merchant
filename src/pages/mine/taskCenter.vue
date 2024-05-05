<template>
  <view class="tcPage commonPage">
    <view class="m-card m-top">
      <view class="u-flex u-row-between">
        <view>
          <view class="m-left">积分</view>
        </view>
        <view>
          <view class="m-right" @click="go2PointList">积分明细</view>
        </view>
      </view>
      <view class="m-point"><text>{{ point }}</text></view>
    </view>
    
    <view class="m-task-content">
      <view v-if="list && list.length == 0">
        <u-gap
          height="200"
          bg-color="#FFFFFF"
        />
        <u-empty
          text="暂无任务"
          mode="list"
        />
      </view>
      <view
        v-for="(item, index) in list"
        :key="index"
        class="m-card m-task-item"
      >
        <view class="">
          <view class="u-flex u-row-between">
            <view>
              <view>
                <text class="m-title">{{ item.title }}</text>
                <text class="m-desc u-padding-left-40">{{ '+' + item.point + '积分'}}</text>
              </view>
              <view class="m-subtitle">{{ item.subTitle }}</view>
            </view>
            <view>
              <view class="m-finish-btn">去完成</view>
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
  export default {
    name: 'TaskCenter',
    data() {
      return {
        point: 1860.00,
        list: [
          { id: 1, title: '邀请新用户1', subTitle: '邀请用户注册小程序', point: 100 },
          { id: 2, title: '邀请新用户2', subTitle: '邀请用户注册小程序', point: 100 },
          { id: 3, title: '邀请新用户3', subTitle: '邀请用户注册小程序', point: 100 },
          { id: 4, title: '邀请新用户4', subTitle: '邀请用户注册小程序', point: 100 },
          { id: 5, title: '邀请新用户5', subTitle: '邀请用户注册小程序', point: 100 },
        ],
        status: 'loadmore', // 加载更多 状态
        page: 0, // 第N页
        totalPages: 0, // 总页数
        loadText: {
          loadmore: '轻轻上拉',
          loading: '努力加载中',
          nomore: '实在没有了'
        },
      }
    },
    onShow() {
      // TODO 列表初始化
    },
    methods: {
      async getTaskList(userId, page) {
        // const res = await this.$getRequest(this.$url.getSubscribeOrderList, 'POST', {
        //   page,
        //   userId
        // })
        // console.log(res)
        // this.list = this.list.concat(res.data.records)
        // this.totalPages = res.data.pages
        // this.page = res.data.current
        this.status = 'loadmore'
      },
      go2PointList() {
        this.$u.route('/pages/mine/pointList')
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
        // this.getTaskList(this.userId, this.page)
        if(this.page >= this.totalPages) {
          this.status = 'nomore';
        }
      }, 2000)
    },
  }
</script>

<style lang="scss" scoped>
.tcPage {
  padding: 28rpx 32rpx;
  .m-top {
    padding: 46rpx 24rpx 46rpx 40rpx;
    background: linear-gradient(92deg, #F9203A 0%, #FF6C30 100%);
    box-shadow: 0px -1px 24px 0px rgba(10, 15, 45, 0.04), 0px 4px 24px 0px rgba(10, 15, 45, 0.04);
    color: #FFFFFF;
    .m-left {
      font-size: 28rpx;
      font-weight: 400;
      color: #FFFFFF;
    }
    .m-right {
      background: #FFFFFF;
      padding: 10rpx 20rpx;
      border-radius: 30rpx;
      font-size: 28rpx;
      font-weight: 500;
      color: #EE3833;
    }
    .m-point {
      font-size: 52rpx;
      font-weight: bold;
      color: #FFFFFF;
    }
  }
  .m-task-item {
    padding: 42rpx 32rpx;
    .m-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
    }
    .m-subtitle {
      padding-top: 10rpx;
      font-size: 26rpx;
      font-weight: 400;
      color: #666666;
    }
    .m-desc {
      font-size: 26rpx;
      font-weight: 500;
      color: #EE3833;
    }
    .m-finish-btn {
      padding: 10rpx 32rpx;
      background: #31C37B;
      border-radius: 30rpx;
      font-size: 28rpx;
      font-weight: 500;
      color: #FFFFFF;
    }
  }
}
</style>
