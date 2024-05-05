<template>
	<view class="card" @click="gotoDetail">
		<view class="header">
			<view class="brand">
				<view class="brand-name">
					{{item.carBrand}} {{item.carType}}
				</view>
				<view class="product">
					{{item.carTypeYear}} {{item.carTypeYearProduct}}
				</view>
			</view>
			<view class="order-status-wrap">
				<view class="tag">{{orderStatusObj[item.status]}}</view>
				<view class="plate" v-if="item.carPlateNum">
					<view class="city">{{item.carPlateNum.slice(0,1)}}</view>
					<view class="number">{{item.carPlateNum.slice(1)}}</view>
				</view>
			</view>
		</view>
		
		<view class="info">
			<view>
				<view class="item">
					<view class="item-title">订单来源：</view>
					<view class="item-content">{{orderSourceObj[item.orderSource]}}</view>
				</view>
				<view class="item">
					<view class="item-title">客户信息：</view>
					<view class="item-content">{{item.userName || '-'}}</view>
				</view>
				<view class="item">
					<view class="item-title">跟进人员：</view>
					<view class="item-content">{{item.salesmanName || '-'}}</view>
				</view>
			</view>
			
			<template v-if="item.status !== 8">
				<view class="distribution" @click.stop="distribution" v-if="isManager && !item.salesmanId">
					分配订单
				</view>
				<template v-if="item.salesmanId == currentCompany.userId">
					<view class="distribution" @click.stop="gotoDetail" v-if="!item.carId && item.status == 3 && item.newType == 1">
						绑定车辆
					</view>
					<view class="distribution" @click.stop="gotoDetail" v-else-if="item.carId && item.status == 3">
						预计上牌完成日期
					</view>
					<view class="distribution" @click.stop="gotoDetail" v-else-if="item.status == 13">
						完成上牌
					</view>
					<view class="distribution" @click.stop="gotoDetail" v-else-if="item.status == 5">
						交付验车
					</view>
					<view class="distribution" @click.stop="gotoDetail" v-else-if="item.status == 1">
						{{item.orderSource === 2 ? '增配/装潢' : '添加增配项'}}
					</view>
				</template>
			</template>
		</view>
		
	</view>
</template>

<script>
import { orderStatusObj, orderSourceObj } from '@/constants/index.js'

export default {
	props: {
		item: {
			type: Object,
			required: true,
		},
		
		currentCompany: {
			type: Object,
			required: true,
		},
		
		isManager: {
			type: Boolean,
			default: false,
		},
	},
	
	data() {
		return {
			orderStatusObj,
			orderSourceObj,
		}
	},
	
	methods: {
		distribution() {
			this.$emit('distribution', this.item)
		},
		
		gotoDetail(item) {
			let carId = this.item.carId || ''
			uni.navigateTo({
				url: `/order/orderInfo/handoverOrderDetailInfo?id=${this.item.id}&carId=${carId}&newType=${this.item.newType}`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.header {
	display: flex;
	justify-content: space-between;
	.brand {
		margin-right: 24rpx;
	}
	.brand-name {
		font-size: 16px;
		line-height: 48rpx;
		color: #1D2129;
	}
	.product {
		margin-top: 2px;
		font-size: 12px;
		line-height: 36rpx;
		color: #86909C;
	}
	.order-status-wrap {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}
	.tag {
		padding: 0 16rpx;
		height: 52rpx;
		border-radius: 8rpx;
		font-size: 12px;
		text-align: center;
		display: flex;
		align-items: center;
		background: #F2F3F8;
		color: rgba(118, 118, 118, 0.8);
	}
	.plate {
		margin-top: 12px;
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

.info {
	margin-top: 16px;
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	.item {
		margin-top: 4px;
		display: flex;
		.item-title {
			height: 36rpx;
			font-size: 12px;
			line-height: 36rpx;
			color: #4E5969;
			padding-right: 8rpx;
		}
		.item-content {
			font-size: 12px;
			line-height: 36rpx;
			color: #1D2129;
		}
	}
	.item:first-child {
		margin-top: 0;
	}
	
	.distribution {
		padding: 0 24rpx;
		height: 64rpx;
		border-radius: 8rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #4170EE;
		font-size: 12px;
		color: #FFFFFF;
	}
}
</style>