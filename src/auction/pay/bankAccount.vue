<template>
	<view class="wrap">
		<view class="pay-wrap">
			<view class="unit">￥</view>
			<view class="money">{{detail.money | $numFormat}}</view>
		</view>
		
		<view class="pay-time">{{detail.payTime}}</view>
		
		<view class="title">转账凭证</view>
		
		<view class="img-list">
			<image
				v-for="(item, index) in detail.bankBills"
				:key="index"
				class="img"
				:src="item"
				mode="widthFix"
				@click="preview(index)"
			/>
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
		preview(current) {
			uni.previewImage({
				current,
				urls: this.detail.bankBills,
			})
		},
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
	.pay-time {
		margin-top: 8rpx;
		height: 44rpx;
		font-size: 28rpx;
		line-height: 44rpx;
		color: rgba(10, 15, 45, 0.5);
		text-align: center;
	}
	.title {
		margin-top: 64rpx;
		height: 48rpx;
		font-size: 34rpx;
		line-height: 48rpx;
		color: #0A0F2D;
	}
	.img-list {
		.img {
			margin-top: 32rpx;
			width: 100%;
		}
	}
}
</style>