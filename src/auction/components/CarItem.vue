<template>
	<view class="car-item" :class="{'new-car-card': type == 1, 'old-car-card': type == 2}" @click="setAuctionInfo">
		<image
			class="car-img"
			:src="item.imageUrl"
			mode="aspectFill"
		/>
		<view>
			<view class="title">
				{{item.carBrand}} {{item.carType}}
				<view class="car-color">{{item.outColor}}</view>
			</view>
			
			<view class="sub-title">
				<view class="car-type">
					{{item.carTypeYear}} {{item.carTypeYearProduct}}
				</view>
			</view>
			
			<view class="items-wrap">
				<view class="item">
					<view class="item-title">车牌号：</view>
					<view class="item-content">{{item.carPlateNum || '-'}}</view>
				</view>
				<view class="item">
					<view class="item-title">车架号：</view>
					<view class="item-content">
						{{item.carVin || '-'}}
						<view class="btn">选择</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { formatThousandNumber, formatTenThousandNumber } from '@/utils/index.js'

export default {
	props: {
		type: {
			type: String,
			required: true, // 1.新车 2.二手车
		},
		
		item: {
			type: Object,
			required: true,
		}
	},
	
	data() {
		return {
			
		}
	},
	
	methods: {
		formatThousandNumber(price) {
			return formatThousandNumber(price)
		},
		
		formatTenThousandNumber(num) {
			return formatTenThousandNumber(num)
		},
		
		setAuctionInfo() {
			uni.navigateTo({
				url: `/auction/cars/setAuctionInfo?carId=${this.item.secondHandCarId}&carTypeId=${this.item.carTypeId}&carTypeYearId=${this.item.carTypeYearId}&carTypeYearProductId=${this.item.carTypeYearProductId}`
			})
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "~@/styles/mixin.scss";

.car-item {
	padding: 32rpx 0;
	border-bottom: 2rpx solid #F2F3F5;
	display: flex;
	align-items: center;
	.title {
		height: 44rpx;
		display: flex;
		align-items: center;
		color: #1D2129;
		font-size: 28rpx;
		
	}
	.car-color {
		margin-left: 16rpx;
		height: 34rpx;
		line-height: 34rpx;
		border-radius: 4rpx;
		opacity: 1;
		background: #F7F8FA;
		padding: 0 16rpx;
		font-size: 10px;
		font-weight: 500;
		color: #1D2129;
	}
	.sub-title {
		margin-top: 2px;
		font-size: 12px;
		line-height: 18px;
		color: #86909C;
		display: flex;
		justify-content: space-between;
		.car-type {
			flex: 1;
		}
		.plate {
			margin-left: 20rpx;
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
	.car-detail {
		margin-top: 4px;
		height: 18px;
		font-size: 12px;
		line-height: 18px;
		color: #3D3D3D;
	}
	.items-wrap {
		margin-top: 16px;
		.item {
			margin-top: 2px;
			display: flex;
			font-size: 12px;
			color: #4E5969;
			line-height: 18px;
			.item-title {
				height: 48rpx;
				line-height: 48rpx;
				margin-right: 8rpx;
			}
			.item-content {
				flex: 1;
				width: 0;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.btn {
					width: 96rpx;
					height: 48rpx;
					border-radius: 8rpx;
					border: 2rpx solid #4170EE;
					color: #4170EE;
					font-size: 24rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
			.commission {
				color: #F53F3F;
			}
		}
	}
}

.car-img {
	margin-right: 24rpx;
	width: 220rpx;
	height: 154rpx;
	border-radius: 16rpx;
}
</style>