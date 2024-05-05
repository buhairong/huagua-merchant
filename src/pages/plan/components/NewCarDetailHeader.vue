<template>
	<view class="wrap">
		<view
				class="status-bar"
				:style="{ height: custom.top + 'px' }"
		/>
		
		<view class="nav">
			<view class="back" @click="goBack">
				<u-icon name="arrow-left" color="#000000" size="48"></u-icon>
			</view>
		</view>
		
		<view class="brand">
			{{detail.carTypeYearProductEntity.carBrand}} {{detail.carTypeYearProductEntity.carType}}
		</view>
		
		<view class="brand-price">
		    <text class="name">
		        指导价
		    </text>
		    <text class="price" v-if="detail.carTypeYearProductEntity.guidancePrice">
		        {{ formatTenThousandNumber(detail.carTypeYearProductEntity.guidancePrice) }}
		    </text>
		    <text class="price" v-else>-</text>
		</view>
		
		<view class="car-img">
			<image
				style="width:100%;height:100%;"
				mode="aspectFill"
				:src="detail.carTypeYearProductEntity.imageUrl"
			/>
		</view>
		
		<view class="card-wrap">
			<view class="card">
				<view class="card-item">
					<view class="left">
						<view class="sub-item">{{powerMode[detail.carTypeYearProductEntity.powerMode].label}}</view>
						<view class="sub-title">燃料形式</view>
					</view>
					<view class="right"></view>
				</view>
				
				<view class="card-item">
					<view class="left">
						<view class="sub-item">{{detail.carTypeYearProductEntity.discharge}}T</view>
						<view class="sub-title">排量(L)</view>
					</view>
					<view class="right"></view>
				</view>
				
				<view class="card-item">
					<view class="left">
						<view class="sub-item">{{detail.carTypeYearProductEntity.drive ? drive[detail.carTypeYearProductEntity.drive].label : '-'}}</view>
						<view class="sub-title">驱动方式</view>
					</view>
					<view class="right"></view>
				</view>
				
				<view class="card-item">
					<view class="left">
						<view class="sub-item">{{detail.carTypeYearProductEntity.horsepower}}</view>
						<view class="sub-title">马力(Ps)</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { formatTenThousandNumber } from '@/utils/index.js'
import { powerMode, drive } from '@/constants/index.js'
	
const app = getApp()

export default {
	props: {
		detail: {
			type: Object,
			required: true,
		},
	},
	
	data() {
		return {
			custom: app.globalData.custom,
			powerMode,
			drive,
		}
	},
	
	mounted() {
		
	},
	
	methods: {
		goBack() {
			uni.navigateBack({
				delta: 1
			})
		},
		
		formatTenThousandNumber(num) {
			return formatTenThousandNumber(num)
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.wrap {
	padding-bottom: 20px;
	width: 100vw;
	height: 800rpx;
	background: linear-gradient(180deg, rgba(10,15,45,0.16) 36%, rgba(255,255,255,0.16) 100%);
	.nav {
		padding-left: 32rpx;
		height: 88rpx;
		display: flex;
	}
	.brand {
		margin-bottom: 8px;
		padding-left: 48rpx;
		height: 60rpx;
		font-size: 22px;
		line-height: 60rpx;
		color: #0A0F2D;
	}
	.brand-price {
		background: url("https://image.51cheyaoshi.com/xcx/app/static/icon3.png") no-repeat;
		background-size: contain;
		display: inline-block;
		padding: 0 10rpx;
		height: 50rpx;
		line-height: 45rpx;
		font-size: 24rpx;
		position: relative;
		vertical-align: top;
		margin-left: 46rpx;
		width: 215rpx;
		white-space: pre;
		.name {
			color: #ffffff;
			padding-right: 18rpx;
		}
		.price {
			padding: 0 10rpx;
			color: rgba(10, 15, 45, 0.8);
			position: absolute;
			left: 100rpx;
			top: -1rpx;
			z-index: 1;
		}
	}
	.car-img {
		margin-top: 20px;
		width: 100%;
		height: 320rpx;
	}
	.card-wrap {
		padding: 0 32rpx;
		.card {
			display: flex;
			.card-item {
				width: 0;
				flex: 1;
				display: flex;
				align-items: center;
				.left {
					width: 0;
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;
					.sub-item {
						height: 40rpx;
						font-size: 12px;
						line-height: 40rpx;
						color: rgba(10, 15, 45, 0.8);
					}
					.sub-title {
						margin-top: 2px;
						height: 40rpx;
						font-size: 12px;
						line-height: 40rpx;
						color: rgba(10, 15, 45, 0.5);
					}
				}
				.right {
					width: 2rpx;
					height: 40rpx;
					background: rgba(10, 15, 45, 0.04);
				}
			}
		}
	}
}
</style>