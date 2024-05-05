<template>
	<view class="page">
		<view class="title">支持微信支付及银行转账支付</view>
		<view class="price-wrap">
			<view class="unit">￥</view>
			<view class="price">{{price | $numFormat}}</view>
		</view>
		
		<view class="btn wx-btn" @click="goPayPage(2)">微信支付</view>
		<view class="btn back-btn" @click="goPayPage(3)">银行转账</view>
		
		
	</view>
</template>

<script>
export default {
	components: {
		
	},
	
	data() {
		return {
			businessId: '',
			carId: '',
			openid: '',
			userId: '',
			price: 0,
			showSubscribeFreePay: false,
			businessType: 0,
			payType: 0,
			tab: 1,
			currentCompany: {},
		}
	},
	
	onLoad(options) {
		this.tab = options.tab || 1
		this.businessId = options.businessId
		this.carId = options.carId
		this.businessType = options.businessType
		this.payType = options.payType
		this.price = options.price - 0
		
		const currentCompany = uni.getStorageSync('current_company')
		if (currentCompany){
			this.currentCompany = currentCompany
		}
	},
	
	methods: {
		goPayPage(payMode) {
			if(payMode === 2) {
				this.handlePay()
			} else {
				this.handleBankPay()
			}
		},
		
		async handlePay() {
			// 1.拉起微信支付
			uni.showToast({
				title: '微信支付中',
				duration: 2000,
				icon: 'loading'
			})
			
			// 2.创建微信订单
			this.$requestPayment({
				fromSys: 2,
				appType: 2,
				businessId: this.businessId, // 订单ID
				businessType: this.businessType, // 支付类型 0租车、1长租产品、2新车订阅、3购买二手车、4团购、5会员、6购买服务、7.竞拍
				openid: this.currentCompany.openid,
				payType: this.payType, // 业务类型 // 0余额、1押金、2订金、3尾款、4长租费用（包月或季）、6二手车、7支付年费、8订阅费用、9租车租金、10租车押金
				total: this.price,
				// total: 0.01,
				userId: this.currentCompany.userId,
			}, async (res) => {
				if(res === 'success') {
					if (this.businessType == 7 && this.payType == 0) {
						uni.navigateBack({
							delta: 2
						})
					} else {
						uni.reLaunch({
							url: `/pages/car/oldCarDetail?tab=${this.tab}&id=${this.carId}`
						})
					}
				}
			})
			
			uni.hideLoading()
		},
		
		handleBankPay() {
			let delta = 1
			if (this.businessType == 7 && this.payType == 0) {
				delta = 3
			}
			uni.navigateTo({
				url: `/auction/pay/bankPayInfo?businessId=${this.businessId}&carId=${this.carId}&price=${this.price}&payType=${this.payType}&openid=${this.currentCompany.openid}&userId=${this.currentCompany.userId}&businessType=${this.businessType}&delta=${delta}&tab=${this.tab}`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.page {
	width: 100vw;
	padding: 32px 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.title {
		height: 48rpx;
		font-size: 16px;
		line-height: 48rpx;
		color: #0A0F2D;
	}
	
	.price-wrap {
		margin-top: 12px;
		height: 96rpx;
		line-height: 96rpx;
		display: flex;
		color: #0A0F2D;
		.unit {
			font-size: 22px;
			transform: translateY(6rpx);
		}
		.price {
			font-size: 32px;
		}
	}
	
	.remainder {
		height: 36rpx;
		font-size: 12px;
		line-height: 36rpx;
		color: rgba(10, 15, 45, 0.5);
	}
	
	.btn {
		margin-bottom: 20px;
		width: 100%;
		height: 116rpx;
		border-radius: 16rpx;
		font-size: 17px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.wx-btn {
		margin-top: 48px;
		background: #0A0F2D;
		color: #FFFFFF;
	}
	
	.back-btn {
		background: rgba(10, 15, 45, 0.04);
		color: #0A0F2D;
	}
}
</style>