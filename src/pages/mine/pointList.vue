<template>
  <view class="plPage commonPage">
    <view class="m-point-content">
      <view v-if="list && list.length == 0">
        <u-gap
          height="200"
          bg-color="#FFFFFF"
        />
        <u-empty
          text="暂无积分"
          mode="list"
        />
      </view>
      <view
        v-for="(item, index) in list"
        :key="index"
        class="m-point-item"
      >
        <view class="">
          <view class="u-flex u-row-between">
            <view class="m-title">{{ item.title }}</view>
            <view class="m-desc">{{ '+' + item.point }}</view>
          </view>
          <view class="m-subtitle">{{ item.subTitle }}</view>
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
    data() {
      return {
        list: [
          { id: 1, title: '邀请新用户1', subTitle: '2022-02-16 11:30:30', point: 100 },
          { id: 2, title: '邀请新用户2', subTitle: '2022-02-16 11:30:30', point: 100 },
          { id: 3, title: '邀请新用户3', subTitle: '2022-02-16 11:30:30', point: 100 },
          { id: 4, title: '邀请新用户4', subTitle: '2022-02-16 11:30:30', point: 100 },
          { id: 5, title: '邀请新用户5', subTitle: '2022-02-16 11:30:30', point: 100 },
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
    methods: {
      async getPointList(userId, page) {
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
    },
    onReachBottom() {
      if(this.page >= this.totalPages) {
        this.status = 'nomore';
        return;
      }
      this.status = 'loading';
      this.page = ++ this.page;
      setTimeout(() => {
        // this.getPointList(this.userId, this.page)
        if(this.page >= this.totalPages) {
          this.status = 'nomore';
        }
      }, 2000)
    },
  }
</script>

<style lang="scss" scoped>
.plPage {
  padding: 24rpx 40rpx;
  .m-point-item {
    padding: 30rpx 0;
    border-bottom: 1px solid #E6E6E6;
    .m-title, .m-desc {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
    }
    .m-subtitle {
      padding-top: 16rpx;
      font-size: 24rpx;
      font-weight: 400;
      color: #999999;
    }
  }
}
</style>
