<template>
	<view class="wrap">
		<view class="pay-wrap">
			<view class="unit">￥</view>
			<view class="money">{{detail.money | $numFormat}}</view>
		</view>
		
		<view class="card">
			<view class="item">
				<view class="label">支付时间：</view>
				<view class="item-content">{{detail.payTime}}</view>
			</view>
			
			<view class="item">
				<view class="label">交易单号：</view>
				<view class="item-content">{{detail.wxOrderNum}}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {
	  
	},
	
	data() {
		return {
			detail: {}
		}
	},
	
	onLoad(options) {
		const val = uni.getStorageSync("rentalDepositDetailReqVo")
		if (val) {
			this.detail = val
		}
	},
	
	onShow() {
		
	},
	
	methods: {
		
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";	

.wrap {
	padding: 64rpx 32rpx;
	.pay-wrap {
		display: flex;
		justify-content: center;
		align-items: baseline;
		color: #0A0F2D;
		font-weight: 400;
		.unit {
			font-size: 44rpx;
		}
		.money {
			font-size: 64rpx;
		}
	}
	.card {
		margin-top: 64rpx;
		.item {
			display: flex;
			color: #64696F;
			font-size: 28rpx;
			.label {
				flex: 1;
				height: 44rpx;
				line-height: 44rpx;
			}
			.item-content {
				width: 458rpx;
				line-height: 44rpx;
				word-wrap: break-word; 
			}
		}
	}
}
</style>