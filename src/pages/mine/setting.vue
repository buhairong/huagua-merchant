<template>
  <view class="setPage commonPage">
    <u-cell-group :border="false">
      <!-- <u-cell-item
        v-for="(item) in cellList"
        :key="item.index"
        :icon="item.icon"
        :title="item.title"
        @click="handleCell(item)"
      /> -->
      <u-cell-item title="设置头像" bg-color="#FFFFFF" :arrow="false" @click="updateAvatar">
        <view slot="right-icon">
          <u-image
            width="64"
            height="64"
            shape="circle"
            :src="userInfo.logoImage || 'https://image.51cheyaoshi.com/xcx/merchant/static/logo.png'"
          />
        </view>
      </u-cell-item>
      <u-cell-item title="手机号" :value="userInfo.phone" bg-color="#FFFFFF" :arrow="false"></u-cell-item>
      <u-cell-item title="退出公司" value="" bg-color="#FFFFFF" @click="unbindCorp"></u-cell-item>
    </u-cell-group>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        userInfo: null,
        cellList: [
          { icon:'rmb-circle', title: '我的钱包', default: 1, index: 0 },
          { icon:'order', title: '我的成交', default: '', index: 1 },
        ],
      }
    },
    onShow() {
      getApp().globalData.getUserInfo((data) => {
        this.userInfo = data;
      })
    },
    methods: {
      async updateAvatar() {
        const pageThis = this
        uni.vibrateShort();
        const self = this;
        uni.chooseImage({
          success: async (chooseImageRes) => {
            uni.showLoading({
              title: '上传中'
            });
            const tempFilePaths = chooseImageRes.tempFilePaths;
            const upload = await this.$getFileUpload(this.$url.upload, tempFilePaths)
        
            console.log(upload)
        
            if(upload.code != 0) {
              uni.showToast({
                title: '上传失败，请重新上传',
                duration: 2000,
                icon: 'none'
              });
              return false;
            }
            uni.hideLoading()
            // 更新
            const res = await pageThis.$getRequest(pageThis.$url.updateAvatar, 'POST', {
              id: pageThis.userInfo.id,
              logoImage: upload.data.src
            })
            if(res.code != 0) {
              uni.showToast({
                title: '更新失败，请重新上传',
                duration: 2000,
                icon: 'none'
              });
              return false;
            }
            this.userInfo.logoImage = upload.data.src
          }
        });
      },
      async unbindCorp() {
        const pageThis = this
        await uni.showModal({
          title: '',
          content: '确认退出公司吗？',
          success: async function (res) {
            if (res.confirm) {
              const uRes = await pageThis.$getRequest(pageThis.$url.unbindCorp, 'POST', {
                partnerId: pageThis.userInfo.partnerId
              })
              if(uRes.code != 0) {
                uni.showToast({
                  title: '退出失败',
                  duration: 2000
                });
                return false;
              } else {
                uni.showToast({
                  title: '退出成功',
                  duration: 2000,
                  icon: 'none'
                });
                return false;
              }
            } else if (res.cancel) {
            }
          }
        });
      },
      // go2MobilePhone(page) {
      //   this.$u.route("/pages/mine/" + page);
      // }
    }
  }
</script>
<style lang="scss">
  .setPage {
    .u-cell {
      padding: 26rpx 0rpx !important;
    }
    .u-cell_title {
      font-size: 30rpx !important;
      color: #333333 !important;
    }
  }
</style>
<style lang="scss" scoped>
.setPage {
  padding: 40rpx;
}
</style>
