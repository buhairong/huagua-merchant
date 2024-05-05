<template>
  <view class="message commonPage">
    <view class="u-flex" @click="handleTodoList">
      <view class="">
        <u-image
          width="112"
          height="112"
          src="https://image.51cheyaoshi.com/xcx/merchant/static/message/todo.png"
          shape="circle"
          mode="aspectFit"
        >
          <u-loading slot="loading" />
        </u-image>
      </view>
      <view class="message-content u-flex-1">
        <view class="u-flex u-row-between">
          <view class="message-notice">待办事项</view>
          <!-- <u-badge size="mini" type="success"></u-badge> -->
          <view v-if="bsMessage.createdTime" class="message-time" >
            {{ $u.timeFormat(new Date(bsMessage.createdTime).getTime(), 'hh:MM') }}
          </view>
        </view>
        <view class="message-title">{{ bsMessage.content || '' }}</view>
      </view>
    </view>
    <view class="u-flex u-margin-top-48" @click="handleNotice">
      <view class="">
        <u-image
          width="112"
          height="112"
          src="https://image.51cheyaoshi.com/xcx/merchant/static/message/sysnotice.png"
          shape="circle"
          mode="aspectFit"
        >
          <u-loading slot="loading" />
        </u-image>
      </view>
      <view class="message-content u-flex-1">
        <view class="u-flex u-row-between">
          <view class="message-notice">系统公告</view>
          <view v-if="marketingMessage.createdTime" class="message-time">
            {{ $u.timeFormat(new Date(marketingMessage.createdTime).getTime(), 'hh:MM') }}
          </view>
        </view>
        <view class="message-title">{{ marketingMessage.title || '' }}</view>
      </view>
    </view>
    <view class="u-flex u-margin-top-48" @click="handleMsg">
      <view class="">
        <u-image
          width="112"
          height="112"
          src="https://image.51cheyaoshi.com/xcx/merchant/static/message/sysmsg.png"
          shape="circle"
          mode="aspectFit"
        >
          <u-loading slot="loading" />
        </u-image>
      </view>
      <view class="message-content u-flex-1">
        <view class="u-flex u-row-between">
          <view class="message-notice">系统消息</view>
          <view v-if="bsMessage.createdTime" class="message-time" >
            {{ $u.timeFormat(new Date(bsMessage.createdTime).getTime(), 'hh:MM') }}
          </view>
        </view>
        <view class="message-title">{{ bsMessage.content || '' }}</view>
      </view>
    </view>
    
    <!-- <u-image width="300" height="300" src="https://image.51cheyaoshi.com/20220630/3ca4dffe-88fc-41f0-aafd-90841b552a23.png"/> -->
  </view>
</template>

<script>
import dayjs from 'dayjs';
export default {
  name: "Message",
  data() {
    return {
      bsMessage: {},
      marketingMessage: {},
      userInfo: null,
      cityId: ''
    };
  },
  onLoad() {
    console.log(this.$u)
    this.cityId = uni.getStorageSync("cityId")
    
    // TODO scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    // const scene = decodeURIComponent(query.scene)
    // console.log(scene)
  },
  onShow() {
    getApp().globalData.getUserInfo((data) => {
      console.log(data);
      this.userInfo = data;
      // this.init(this.userInfo.id);
    })
  },
  methods: {
    handleMark() {
      this.$u.route('/pages/message/marketing-list')
    },
    handleMsg() {
      if(this.userInfo) {
        this.$u.route('/pages/message/sysMsgList')
      } else {
        this.$getUserProfile("/pages/message/message", () => {
          this.$u.route("/pages/login/sign");
        });
      }
    },
    async init(userid) {
      const bsRes = await this.$getRequest(this.$url.businessMessageListByPage, 'POST', {
        cityId: this.cityId,
        userId: userid
      })
      if(bsRes.data.records && bsRes.data.records.length>0) {
        this.bsMessage = bsRes.data.records[0];
        bsRes.data.records.map((item) => {
          item.createdTime = dayjs(item.createdTime).format('YYYY/MM/DD HH:mm')
          return item;
        })
      }

      const mRes = await this.$getRequest(this.$url.marketingMessageListByPage, 'POST', {
        cityId: this.cityId,
        userId: userid
      })
      if(mRes.data.records && mRes.data.records.length>0) {
        this.marketingMessage = mRes.data.records[0];
        mRes.data.records.map((item) => {
          item.createdTime = dayjs(item.createdTime).format('YYYY/MM/DD HH:mm')
          return item;
        })
      }
    }
  },
};
</script>

<style lang="scss" scoped>
  .message {
    padding: 30rpx 40rpx;
    // .message-head {
    //   width: 120rpx;
    //   height: 120rpx;
    //   background: #0A0F2D;
    //   border-radius: 100%;
    // }
    // .message-activity {
    //   background: #F5194B;
    // }
    .message-content {
      padding-left: 30rpx;
      .message-notice {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
      }
      .message-title {
        padding-top: 8rpx;
        font-size: 28rpx;
        font-weight: 400;
        color: #999999;
      }
      .message-time {
        font-size: 28rpx;
        font-weight: 400;
        color: #999999;
      }
    }
  }
</style>
