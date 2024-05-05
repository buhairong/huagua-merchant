<template>
  <view class="container">
    <view class="btn-content" @click="goFaceAuth">
      点击此处跳转人脸识别
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
				bizToken:'',
				redirectUrl: '',
				goFaceDone: false,
      }
    },
		
		onLoad(options) {
			console.log('middle onLoad')
			console.log('middle', options)
			this.bizToken = options.bizToken
			this.redirectUrl = decodeURIComponent(options.bizToken)
		},
		
		async onShow() {
			console.log('middle onShow')
			// 防止从实名/意愿页进入后直接返回
			if (!this.goFaceDone) return
	 
			// 如果已经跳转过，重置
			this.goFaceDone = false
	 
			// getEnterOptionsSync 方法从基础库 2.9.4 开始支持，低版本需做兼容处理
			const options = wx.getEnterOptionsSync()
			console.log('---options', options)
			// 从公证签小程序返回
			if (options.scene === 1038 && options.referrerInfo.extraData && options.referrerInfo.extraData.faceResult) {
				const pages = getCurrentPages()
				console.log('pages', pages)
				const pre = pages[pages.length - 2]
				console.log('pre', pre)
				console.log('pre1', pre.$vm)
				console.log('typeof pre.reloadPage', typeof pre.$vm.reloadPage)
				// 重新加载实名页面
				// if (pre.$vm.reloadPage && typeof pre.$vm.reloadPage === 'function') {
				// 	pre.$vm.reloadPage(this.redirectUrl + `&timeStamp=${new Date().getTime()}`)
				// 	wx.navigateBack({
				// 		delta: 1,
				// 	})
				// }
				let params = uni.getStorageSync('changeCompanyParams')
				if (params) {
					uni.showLoading({
						title: '加载中'
					})
					
					const res = await this.$getRequest(this.$url.updateUserLoginCompanyInfo, "POST", params)
					
					uni.hideLoading()
					
					if (res.code == 0) {
						uni.reLaunch({
							url:'/pages/workspace/workspace'
						})
					}
				}
			}
		},
		
		methods:{
			goFaceAuth() {
				const self = this
				wx.navigateToMiniProgram({
				  appId: 'wx1cf2708c2de46337', // 公证签小程序APPID
				  path: `/pages/face/index?bizToken=${this.bizToken}`, // 刷脸页面地址
					success() {
						self.goFaceDone = true
					}
				})
			},
			
			
		},
		

  }
</script>

<style lang="scss" scoped>
.btn-content {
	padding: 40rpx;
	text-align: center;
}
</style>
