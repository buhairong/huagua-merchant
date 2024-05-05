<template>
	<view>
		<view class="wrap">
			<image
				style="width:136rpx"
				src="https://image.51cheyaoshi.com/xcx/merchant/static/home/complete.png"
				mode="widthFix"
			/>
			<view class="title">{{title}}</view>
			
			<view class="car-info-wrap">
				<view class="left">
					<image
						class="car-img"
						:src="imgUrl"
						mode="widthFix"
					/>
				</view>
				<view class="right">
					<view class="brand">{{brandName}} {{carType}}</view>
					<view class="car-type">
						{{carTypeYear}} {{carTypeYearProduct}}
					</view>
				</view>
			</view>
			<view class="btn-group">
				<view class="btn create-btn" @click="goDetailPage(4)">查看详情</view>
				<view class="btn" @click="goHomePage">回到工作台</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: null,
				imgUrl: '',
				brandName: '',
				carType: '',
				carTypeYear: '',
				carTypeYearProduct: '',
				title: '',
				operator: 1,
				carId: null,
			}
		},
		
		onLoad(options) {
			this.operator = options.operator
			if (this.operator == 1) {
				this.title = '方案创建成功'
			} else {
				this.title = '方案修改成功'
			}
			this.type = options.type
			this.carId = options.carId
			this.imgUrl = options.imgUrl
			this.brandName = options.brandName
			this.carType = options.carType
			this.carTypeYear = options.carTypeYear
			this.carTypeYearProduct = options.carTypeYearProduct
		},
		
		methods: {
			goHomePage() {
				uni.reLaunch({
					url: '/pages/workspace/workspace'
				})
			},
			
			createPlan() {
				let url = '/pages/plan/newCarPlan?create=1'
				if(this.type == 2) {
					url = '/pages/plan/oldCarPlan?create=1'
				}
				uni.navigateTo({
					url,
				})
			},
			
			goDetailPage(tab) {
				uni.navigateTo({
					url: `/pages/car/oldCarDetail?tab=${tab}&id=${this.carId}`
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
		height: 56rpx;
		font-size: 18px;
		font-weight: 500;
		line-height: 56rpx;
		color: #1D2129;
		margin-top: 12px;
		margin-bottom: 2px;
	}
	.link {
		height: 56rpx;
		font-size: 16px;
		line-height: 56rpx;
		color: #0256FF;
	}
	.car-info-wrap {
		display: flex;
		align-items: center;
		.left {
			.car-img {
				width: 290rpx;
			}
		}
		.right {
			padding-left: 34rpx;
			.brand {
				font-size: 16px;
				font-weight: 500;
				line-height: 48rpx;
				color: #1D2129;
			}
			.car-type {
				margin-top: 2px;
				font-size: 12px;
				line-height: 36rpx;
				color: #86909C;
			}
		}
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
