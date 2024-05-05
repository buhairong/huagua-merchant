<template>
	<view class="wrap">
		<image
			style="width: 128rpx;height:128rpx;"
			src="https://image.51cheyaoshi.com/xcx/merchant/static/order/time.png"
		/>
			
		<view class="title">审核中</view>
		<view class="sub-title">请耐心等待审核结果</view>
	
		<view class="btn-group">
			<view class="btn create-btn" @click="goDetailPage(5)">查看详情</view>
			<view class="btn" @click="goHomePage">回到工作台</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				type: 2,
			}
		},
		
		onLoad(options) {
			this.id = options.id
			this.type = options.type
		},
		
		methods: {
			goDetailPage(tab) {
				let url = `/pages/car/newCarDetail?tab=${tab}&id=${this.id}`
				if(this.type == 2) {
					url = `/pages/car/oldCarDetail?tab=${tab}&id=${this.id}`
				}
				uni.navigateTo({
					url
				})
			},
			
			goHomePage() {
				uni.reLaunch({
					url: '/pages/workspace/workspace'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.wrap {
	margin: 50px 60rpx 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	
	.title {
		margin-top: 50rpx;
		height: 56rpx;
		font-size: 36rpx;
		line-height: 56rpx;
		color: #1D2129;
	}
	
	.sub-title {
		margin-top: 24rpx;
		height: 44rpx;
		font-size: 28rpx;
		line-height: 44rpx;
		color: rgba(10, 15, 45, 0.6);
	}
	
	
	.btn-group {
		margin-top: 50px;
		.btn {
			margin-bottom: 16px;
			width: 478rpx;
			height: 80rpx;
			border-radius: 8rpx;
			background: #F7F8FA;
			font-size: 17px;
			font-weight: 500;
			color: #1D2129;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.create-btn {
			background: #4170EE;
			color: #FFFFFF;
		}
	}
}
</style>
