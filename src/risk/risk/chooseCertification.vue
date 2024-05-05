<template>
  <view class="page-wrap">
	  <view>
	  	<view class="title">
	  		<text style="color: #EA0000;">*</text>加收材料
	  	</view>
			
			<view class="tip">请勾选需要用户补交的材料，届时我们将通知用户</view>
			
			<u-checkbox-group wrap>
				<u-checkbox 
					v-model="item.checked" 
					v-for="item in certificationList" :key="item.id" 
					:name="item.id"
				>
					{{item.certificationName}}
				</u-checkbox>
			</u-checkbox-group>
	  </view>
		
		<view class="buttom-disabled-btn-group">
			<view class="cancel-btn" @click="back">取消</view>
			<button :disabled="!certificationList.some(item => item.checked)" @click="save">确定</button>
		</view>
  </view>
</template>

<script>
export default {
	data() {
		return {
			id: null,
			auditRate: null,
			orderType: null,
			certificationList: [],
			currentCertification: [],
		}
	},
	
	onLoad(options) {
		this.id = options.id
		this.auditRate = options.auditRate
		this.orderType = options.orderType
		const value = uni.getStorageSync('currentCertificationList')
		if (value) {
			this.currentCertification = value.map(item => item.certificationId)
		}
		uni.removeStorageSync('currentCertificationList')
		this.getCertificationConfigList()
	},
	
	methods:{
		async getCertificationConfigList() {
			uni.showLoading({
				title: '加载中'
			})
			
			const res = await this.$getRequest(this.$url.getCertificationConfigList, "GET", {})
			
			if (res.code == 0) {
				this.certificationList = res.data.map(item => {
					item.checked = false
					
					if(this.currentCertification.includes(item.id)) {
						item.checked = true
					}
					
					return item 
				})
			}
			
			uni.hideLoading()
		},
		
		back() {
			uni.navigateBack({
				delta: 1
			})
		},
		
		async save() {
			uni.showLoading({
				title: '加载中'
			})
			
			const list = this.certificationList.filter(item => item.checked).map(item => {
				item.certificationId = item.id
				
				return item
			})
			
			const params = {
				userCarSubscribeId: this.id,
				auditRate: this.auditRate,
				riskResult: 7,
				list,
			}
			
			const res = await this.$getRequest(this.$url.addUserCarSubscribeCertification, "POST", params)
			
			if (res.code == 0) {
				this.back()
			}
			
			uni.hideLoading()
		},
		
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.title {
		height: 48rpx;
		font-size: 17px;
		line-height: 48rpx;
		color: #0A0F2D;
	}
	.tip {
		margin: 16px 0;
		height: 44rpx;
		font-size: 14px;
		line-height: 44rpx;
		color: #4E5969;
	}
}
</style>
