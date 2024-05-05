<template>
	<view class="card" :class="{'new-car-card': type == 1, 'old-car-card': type == 2}" @click="goDetailPage">
		<view class="title-wrap">
			<view class="title">
				{{item.carBrand}} {{item.carType}}
			</view>
			<view class="car-status" v-if="type == 2">
				状态：{{auctionCarStatus[item.auctionStatus].label}}
			</view>
		</view>
		<view class="sub-title">
			<view class="car-type">
				{{item.carTypeYear}} {{item.carTypeYearProduct}}
			</view>
		</view>
		<view class="car-detail" v-if="type == 2">
			{{formatThousandNumber(item.mileage)}}公里/{{item.regTime}}/{{item.outColor}}
		</view>
		<view class="items-wrap">
			<view class="left">
				<view class="item" v-if="type == 2">
					<view class="item-title">车牌号：</view>
					<view class="item-content">{{item.carPlateNum || '-'}}</view>
				</view>
				<view class="item">
					<view class="item-title">车架号：</view>
					<view class="item-content">{{item.carVin || '-'}}</view>
				</view>
				<view class="item">
					<view class="item-title">发动机号：</view>
					<view class="item-content">{{item.carEngineNum || '-'}}</view>
				</view>
			</view>
			<view class="right">
				<image
					class="car-img"
					:src="item.imageUrl"
					mode="aspectFill"
				/>
			</view>
		</view>
	</view>
</template>

<script>
import { formatThousandNumber, formatTenThousandNumber } from '@/utils/index.js'
import { auctionCarStatus } from '@/constants/index.js'

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
			auctionCarStatus,
		}
	},
	
	methods: {
		formatThousandNumber(price) {
			return formatThousandNumber(price)
		},
		
		formatTenThousandNumber(num) {
			return formatTenThousandNumber(num)
		},
		
		goDetailPage() {
			uni.navigateTo({
				url: `/pages/car/oldCarDetail?id=${this.item.secondHandCarId}&tab=5`
			})
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "~@/styles/mixin.scss";

.card {
	.title-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.car-status {
			color: #4E5969;
			font-size: 12px;
		}
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		.left {
			flex: 1;
			.item {
				margin-top: 2px;
				display: flex;
				font-size: 12px;
				color: #4E5969;
				line-height: 18px;
				.item-title {
					height: 36rpx;
					margin-right: 8rpx;
				}
				.item-content {
					flex: 1;
					width: 0;
				}
				.commission {
					color: #F53F3F;
				}
			}
		}
		.right {
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			.car-img {
				width: 248rpx;
				height: 170rpx;
				border-radius: 16rpx;
			}
			.create-plan-btn {
				margin-top: 6px;
				width: 144rpx;
				height: 64rpx;
				border-radius: 8rpx;
				background: #4170EE;
				font-size: 12px;
				color: #FFFFFF;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
}

.new-car-card {
	padding-bottom: 0;
	.items-wrap {
		margin-top: -10px;
		.right {
			.car-img {
				width: 340rpx;
				height: 233rpx;
				margin-right: -60rpx;
			}
		}
	}
}

.old-car-card {
	.right {
		margin-top: -90rpx;
	}
}
</style>