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
				<view class="btn" @click="goListPage">车辆列表</view>
				<view class="btn create-btn" @click="createPlan" v-if="type == 2 || status == 1">创建订阅方案</view>
				<view class="btn create-btn" @click="goDetailPage(1)">车辆详情</view>
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
				brandId: '',
				brandName: '',
				carTypeId: '',
				carType: '',
				carTypeYearId: '',
				carTypeYear: '',
				carTypeYearProductId: '',
				carTypeYearProduct: '',
				title: '',
				operator: 1,
				status: null,
			}
		},
		
		onLoad(options) {
			this.operator = options.operator
			this.type = options.type
			this.id = options.id
			this.imgUrl = options.imgUrl
			this.brandId = options.brandId
			this.brandName = options.brandName
			this.carTypeId = options.carTypeId
			this.carType = options.carType
			this.carTypeYearId = options.carTypeYearId
			this.carTypeYear = options.carTypeYear
			this.carTypeYearProductId = options.carTypeYearProductId
			this.carTypeYearProduct = options.carTypeYearProduct
			this.status = options.status
			
			if (this.operator == 1) {
				if (this.type == 1) {
					this.title = '添加全新车成功'
				} else {
					this.title = '添加二手车成功'
				}
			} else {
				if (this.type == 1) {
					this.title = '修改全新车成功'
				} else {
					this.title = '修改二手车成功'
				}
			}
		},
		
		methods: {
			goListPage() {
				uni.navigateTo({
					url: '/pages/car/carList'
				})
			},
			
			createPlan() {
				let url = '/pages/car/newCarList?create=1'
				if(this.type == 2) {
					url = '/pages/car/oldCarList?create=1'
				}
				uni.navigateTo({
					url,
				})
			},
			
			goDetailPage(tab) {
				let url = `/pages/car/newCarDetail?tab=${tab}&id=${this.id}`
				if(this.type == 2) {
					url = `/pages/car/oldCarDetail?tab=${tab}&id=${this.id}`
				}
				uni.navigateTo({
					url
				})
			},
			
			createPlan() {
				uni.navigateTo({
					url: `/pages/plan/oldCarPlanDetail?secondHandCarId=${this.id}&brandId=${this.brandId}&brandName=${this.brandName}&carTypeId=${this.carTypeId}&carType=${this.carType}&carTypeYearId=${this.carTypeYearId}&carTypeYear=${this.carTypeYear}&carTypeYearProductId=${this.carTypeYearProductId}&carTypeYearProduct=${this.carTypeYearProduct}`
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
