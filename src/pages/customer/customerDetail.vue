<template>
	<view class="page-wrap">
		<view>
			<view class="card user-card">
				<view class="left">
					<view class="info">
						{{customerInfo.name}}
					</view>
					<view class="mobile">
						电话：{{customerInfo.mobile}}
					</view>
				</view>
				
				<view class="right" @click.stop="callPhone(customerInfo.mobile)">
					<view class="phone-tag">
						<u-icon name="phone-fill" color="#0256FF" size="28"></u-icon>
					</view>
					打电话
				</view>
			</view>
			
			<view class="card">
				<view class="title-wrap">
					<view class="title">意向偏好</view>
				</view>
				
				<view class="item">
					<view class="item-title">价格</view>
					<view class="item-content">
						{{customerInfo.minPrice ? customerInfo.minPrice + '万' : 0}} - {{customerInfo.maxPrice ? customerInfo.maxPrice + '万' : '不限'}}
					</view>
				</view>
				
				<view class="item">
					<view class="item-title">车系</view>
					<view class="item-content">
						<view class="select-list-item" v-for="item in customerInfo.intentionCarTypes" :key="item.carTypeId">
							{{item.carBrand}}{{item.carType}}
						</view>
					</view>
				</view>
			</view>
			
		
			
			
		</view>
		
		<view class="bottom-btn-group">
			<view class="btn" @click="delCustomer">移除客户</view>
			<view class="btn save-btn" @click="editCustomer">编辑客户</view>
		</view>
		
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			customerInfo: {},
			userId: null,
			merchantId: null,
			salesmanId: null,
		}
	},
	
	onLoad(options) {
		this.userId = options.userId
		this.merchantId = options.merchantId
		this.salesmanId = options.salesmanId
		
		this.selectClientDetailInfo()
	},
	
	methods: {
		async selectClientDetailInfo() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				userId: this.userId,
			}
			
			const res = await this.$getRequest(this.$url.selectClientDetailInfo, "GET", params)
			
			if (res.code == 0 && res.data) {
				this.customerInfo = res.data
				uni.setStorageSync('customerInfo', res.data)
			}
			
			uni.hideLoading()
		},
		
		callPhone(mobile) {
			uni.makePhoneCall({
				phoneNumber: mobile
			})
		},
		
		editCustomer() {
			uni.navigateTo({
				url: `/pages/customer/setCustomer?type=2`
			})
		},
		
		delCustomer() {
			uni.showModal({
				title: '提示',
				content: '确定要移除这个客户吗？',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: '加载中'
						})
						
						const params = {
							merchantId: this.merchantId,
							salesmanId: this.salesmanId,
							userId: this.userId,
						}
						
						const res = await this.$getRequest(this.$url.deleteClient, "GET", params)
						
						if (res.code == 0) {
							uni.showToast({
								title: '保存成功',
								duration: 2000,
								icon: "none"
							})
							
							uni.navigateTo({
								url: '/pages/customer/customer'
							})
						}
						
						uni.hideLoading()
					}
				}
			})
		},
		
		
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.user-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: none;
		border-bottom: 2rpx solid #F2F3F5;
		margin-bottom: 20px;
		.left {
			.info {
				height: 48rpx;
				display: flex;
				align-items: center;
				color: #1D2129;
				font-size: 16px;
				.tag {
					margin-left: 16rpx;
					height: 36rpx;
					line-height: 36rpx;
					border-radius: 4rpx;
					background: #E8F3FF;
					color: #4170EE;
					font-size: 11px;
					padding: 0 8rpx;
				}
			}
			.mobile {
				margin-top: 10rpx;
				height: 36rpx;
				font-size: 12px;
				line-height: 36rpx;
				color: #86909C;
			}
		}
		.right {
			display: flex;
			align-items: center;
			.phone-tag {
				margin-right: 14rpx;
				width: 40rpx;
				height: 40rpx;
				background: rgba(22, 93, 255, 0.1);
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
	.title-wrap {
		display: flex;
	}
	.title {
		margin-bottom: 20px;
		height: 48rpx;
		font-size: 17px;
		line-height: 48rpx;
		color: #000000;
		position: relative;
		&:before {
			content: '';
			display: block;
			width: 100%;
			height: 12rpx;
			background: linear-gradient(89deg, #165DFF 0%, rgba(22,93,255,0.00) 80%);
			position: absolute;
			left: 0;
			bottom: 6rpx;
		}
	}
	.item {
		margin-top: 16px;
		display: flex;
		justify-content: space-between;
		.item-title {
			padding-right: 24rpx;
			height: 44rpx;
			font-family: PingFangSC-Regular;
			font-size: 14px;
			line-height: 44rpx;
			color: #86909C;
		}
		.item-content {
			width: 0;
			flex: 1;
			font-size: 14px;
			color: #1D2129;
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-end;
		}
		.select-list-item {
			margin-left: 16rpx;
			margin-bottom: 8px;
			padding: 0 16rpx;
			height: 56rpx;
			display: flex;
			align-items: center;
			color: #1D2129;
			font-size: 12px;
			background: #F7F8FA;
		}
	}
}
</style>
