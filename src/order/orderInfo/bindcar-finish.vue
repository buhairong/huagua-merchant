<template>
	<view>
		<view class="wrap">
			<image
				style="width:136rpx"
				src="https://image.51cheyaoshi.com/xcx/merchant/static/home/complete.png"
				mode="widthFix"
			/>
			<view class="title">完成上牌</view>
			
			<view class="car-info-wrap">
				<view class="left">
					<image
						class="car-img"
						:src="imageUrl"
						mode="widthFix"
					/>
				</view>
				<view class="right">
					<view class="brand">{{carBrand}} {{carType}}</view>
					<view class="car-type">
						{{carTypeYear}} {{carTypeYearProduct}}
					</view>
				</view>
			</view>
			
			<view class="card">
				<view class="title-wrap">
					<u-section
						style="width:100%"
						title="车辆信息" 
						line-color="#165DFF"
						font-size="34"
						color="#0A0F2D"
						:arrow="false"
						:right="false"
					></u-section>
					
					<view class="plate" v-if="carPlateNum">
						<view class="city">{{carPlateNum && carPlateNum.slice(0,1)}}</view>
						<view class="number">{{carPlateNum && carPlateNum.slice(1)}}</view>
					</view>
				</view>
				
				<view class="item-wrap">
					<view class="item">
						<view class="item-title">车架号</view>
						<view class="item-content">{{carVin || '-'}}</view>
					</view>
					
					<view class="item">
						<view class="item-title">发动机号</view>
						<view class="item-content">{{carEngineNum || '-'}}</view>
					</view>
					
					<view class="item">
						<view class="item-title">外观颜色</view>
						<view class="item-content">{{outColor || '-'}}</view>
					</view>
				</view>	
			</view>
			
			<view class="btn-group">
				<view class="btn active-btn" @click="goOrderDetailPage">订单详情</view>
				<view class="btn" @click="goOrderListPage">订单列表</view>
			</view>
		</view>
		
		<CheckCarPopup 
			:show.sync="showPopup"
			:powerMode="powerMode"
			:carId="carId"
			:newType="newType"
			:orderId="orderId"
			:category="1"
		/>
	</view>
</template>

<script>
import CheckCarPopup from './components/CheckCarPopup.vue'	

export default {
	components: {
		CheckCarPopup,
	},
	
	data() {
		return {
			showPopup: false,
			orderId: '',
			carId: '',
			newType: '',
			carBrand: '',
			carType: '',
			carTypeYear: '',
			carTypeYearProduct: '',
			imageUrl: '',
			carVin: '',
			carEngineNum: '',
			mileage: '',
			outColor: '',
			carPlateNum: '',
			powerMode: '',
		}
	},
		
		onLoad(options) {
			this.orderId = options.orderId
			this.carId = options.carId
			this.newType = options.newType
			this.carBrand = options.carBrand
			this.carType = options.carType
			this.carTypeYear = options.carTypeYear
			this.carTypeYearProduct = options.carTypeYearProduct
			this.imageUrl = options.imageUrl
			this.carVin = options.carVin
			this.carEngineNum = options.carEngineNum
			this.mileage = options.mileage
			this.outColor = options.outColor
			this.carPlateNum = options.carPlateNum
			this.powerMode = options.powerMode
		},
		
		methods: {
			goOrderDetailPage() {
				uni.reLaunch({
					url: `/order/orderInfo/handoverOrderDetailInfo?id=${this.orderId}&carId=${this.carId}&newType=${this.newType}&carBrand=${this.carBrand}&carType=${this.carType}&carTypeYear=${this.carTypeYear}&carTypeYearProduct=${this.carTypeYearProduct}&imageUrl=${this.imageUrl}`
				})
			},
			
			goOrderListPage() {
				uni.reLaunch({
					url: '/order/orderInfo/orderList'
				})
			},
			
			check() {
				this.showPopup = true
			},
		}
	}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "./styles/index.scss";

.wrap {
	padding: 16px 32rpx 40px;
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
	.card {
		width: 100%;
		margin-bottom: 0;
		.title-wrap {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.plate {
				height: 19px;
				line-height: 19px;
				font-size: 12px;
				font-weight: 500;
				display: flex;
				.city {
					height: 100%;
					padding: 0 8rpx;
					color: #FFFFFF;
					background: #1D2129;
					border-top-left-radius: 2px;
					border-bottom-left-radius: 2px;
				}
				.number {
					border: 1px solid #0A0F2D;
					height: 100%;
					padding: 0 12rpx;
					color: #1D2129;
					border-top-right-radius: 2px;
					border-bottom-right-radius: 2px;
				}
			}
		}
	}
	.btn-group {
		width: 100%;
		padding: 40px 80rpx 0;
		.btn {
			margin-bottom: 12px;
			width: 100%;
			height: 96rpx;
			border-radius: 8rpx;
			background: #F7F8FA;
			font-size: 17px;
			color: #1D2129;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.active-btn {
			background: #4170EE;
			color: #FFFFFF;
		}
	}
}
</style>
