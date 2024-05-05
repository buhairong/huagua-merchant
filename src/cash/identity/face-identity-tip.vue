<template>
	<view class="wrap">
		<!-- <view class="header">
			<image
				style="width:320rpx;height:320rpx;"
				src="https://image.51cheyaoshi.com/xcx/app/static/home/face_icon.png"
			/>
			<view class="tip">请确保正对手机且光线充足</view>
		</view>
		<view class="btn" @click="goSignPage">立即认证</view> -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			
		}
	},
	onLoad(options) {
		
	},
	
	methods: {
		goSignPage() {
			uni.navigateTo({
				url: '/cash/identity/face-identity',
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	width: 100vw;
	height: 100vh;
	padding: 40px 40rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	.header {
		text-align: center;
	}
	.btn {
		width: 100%;
		height: 116rpx;
		border-radius: 16rpx;
		background: #0A0F2D;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 17px;
		color: #FFFFFF;
	}
	.tip {
		margin-top: 16px;
		height: 44rpx;
		font-size: 14px;
		line-height: 44rpx;
		color: rgba(10, 15, 45, 0.5);
	}
}
</style>