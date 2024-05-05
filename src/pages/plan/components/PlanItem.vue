<template>
	<view class="card" :class="{'new-car-card': type == 1}" @click="goDetailPage">
		<view class="title-wrap">
			<view class="title">{{item.carBrand}} {{item.carType}}</view>
			<view class="icon-wrap">
				<image
					class="icon"
					src="https://image.51cheyaoshi.com/xcx/merchant/static/home/delete.png"
					@click.stop="delPlan"
				/>
			</view>
		</view>
		<view class="sub-title">
			<view class="car-type">
				{{item.carTypeYear}} {{item.carTypeYearProduct}}
			</view>
			<view class="plate" v-if="type == 2">
				<view class="city">{{item.carPlateNum && item.carPlateNum.slice(0,1)}}</view>
				<view class="number">{{item.carPlateNum && item.carPlateNum.slice(1)}}</view>
			</view>
		</view>
		<view class="car-detail" v-if="type == 2">
			{{formatThousandNumber(item.mileage)}}公里/{{item.regTime}}/{{formatTenThousandNumber(item.dealerReferencePrice)}}
		</view>
		<view class="items-wrap">
			<view class="left">
				<view class="item">
					<view class="item-title">保 证 金：</view>
					<view class="item-content">{{getDeposit(item.deposit)}}</view>
				</view>
				<view class="item">
					<view class="item-title">订阅费用：</view>
					<view class="item-content">￥{{formatThousandNumber(item.monthPay)}}X{{item.monthTotal}}期</view>
				</view>
				<view class="item">
					<view class="item-title">分销佣金：</view>
					<view class="item-content commission">￥{{formatThousandNumber(item.distributionBrokerage)}}</view>
				</view>
			</view>
			<view class="right">
				<image
					class="car-img new-car-img"
					:src="item.imageUrl"
					mode="aspectFill"
				/>
			</view>
		</view>
	</view>
</template>

<script>
import { formatThousandNumber, formatTenThousandNumber, getDeposit } from '@/utils/index.js'

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
		delPlan() {
			uni.showModal({
				title: '提示',
				content: '确定要删除这个方案吗？',
				success: (res) => {
					if (res.confirm) {
						this.$emit('delPlan', this.item.id)
					}
				}
			})
		},
		
		formatThousandNumber(price) {
			return formatThousandNumber(price)
		},
		
		formatTenThousandNumber(num) {
			return formatTenThousandNumber(num)
		},
		
		goDetailPage() {
			uni.navigateTo({
				url: `/pages/plan/carPlanDetail?type=${this.type}&id=${this.item.id}`
			})
		},
		
		getDeposit(num) {
			return getDeposit(num)
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "~@/styles/mixin.scss";

.card {
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
					width: 60px;
					height: 18px;
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
			.car-img {
				width: 248rpx;
				height: 170rpx;
				border-radius: 16rpx;
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
</style>