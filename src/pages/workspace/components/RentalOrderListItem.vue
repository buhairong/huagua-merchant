<template>
	<view class="card" @click="gotoDetail">
		<view class="header">
			<view class="brand">
				<view class="brand-name">
					<view class="left">
						{{item.carTypeYearProductEntity.carBrand}} {{item.carTypeYearProductEntity.carType}}
						<view class="plate-num">
							{{item.plateNum}}
						</view>
					</view>
					<view class="status-tag">
						{{CAR_RENTAL_ORDER_STATUS[item.status]}}
					</view>
				</view>
				<view class="product">
					{{item.carTypeYearProductEntity.carTypeYear}} {{item.carTypeYearProductEntity.carTypeYearProduct}}
				</view>
			</view>
		</view>
		
		<view class="info">
			<view>
				<view class="item">
					<view class="left">
						<view class="item-title">客户信息：</view>
						<view class="item-content">{{item.userEntity.name}}</view>
					</view>
					<view class="right" @click.stop="callPhone">
						<view class="phone-tag">
							<u-icon name="phone-fill" color="#0256FF" size="28"></u-icon>
						</view>
					</view>
				</view>
				
				<view class="item">
					<view class="left">
						<view class="item-title">{{orderType === 1 ? '送车地址' : '接车地址'}}：</view>
						<view class="item-content">{{orderType === 1 ? `${item.pickUpAddress}` : `${item.returnAddress}`}}</view>
					</view>
					<view class="right" @click.stop="copy">
						<view class="text-link">复制地址</view>
					</view>
				</view>
				
				<view class="item">
					<view class="left">
						<view class="item-title">{{orderType === 1 ? '送车时间' : '接车时间'}}：</view>
						<view class="item-content">{{formatDate(`${orderType === 1 ? `${item.startDate}` : `${item.endDate}`}`)}}</view>
					</view>
					<view class="right" v-if="item.status === 80 || item.status === 90  || item.status === 110  || item.status === 115">
						<view class="distribution">
							<text v-if="item.status === 80">开始送车</text>
							<text v-else-if="item.status === 90 || item.status === 115">开始验车</text>
							<text v-else-if="item.status === 110">前往接车</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { CAR_RENTAL_ORDER_STATUS } from '@/constants/index.js'
import { formatDate } from '@/utils'

export default {
	props: {
		item: {
			type: Object,
			required: true,
		},
		
		orderType: {
			type: Number,
			required: true,
		},
	},
	
	data() {
		return {
			CAR_RENTAL_ORDER_STATUS,
		}
	},
	
	mounted() {
		
	},
	
	beforeDestroy() {
		
	},
	
	methods: {
		callPhone() {
			uni.makePhoneCall({
				phoneNumber: this.item.userEntity.mobile
			})
		},
		
		copy() {
			uni.setClipboardData({
				data: this.orderType === 1 ? this.item.pickUpAddress : this.item.returnAddress,
			})
		},
		
		formatDate(time) {
			const date = formatDate(time)
			return `${date.month}月${date.date}日 ${date.hour}:${date.minute}`
		},
		
		gotoDetail(item) {
			uni.navigateTo({
				url: `/order/rental/rentalOrderDetail?orderId=${this.item.id}&orderType=${this.orderType}`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "~@/styles/mixin.scss";	

.header {
	display: flex;
	justify-content: space-between;
	.brand {
		width: 100%;
	}
	.brand-name {
		font-size: 16px;
		line-height: 48rpx;
		color: #1D2129;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.left {
			display: flex;
			align-items: center;
			.plate-num {
				padding-left: 24rpx;
				color: #3D3D3D;
				font-size: 24rpx;
			}
		}
		.status-tag {
			height: 52rpx;
			border-radius: 8rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 16rpx;
			background: #F2F3F8;
			color: rgba(118, 118, 118, 0.8);
			font-size: 24rpx;
		}
	}
	.product {
		margin-top: 2px;
		font-size: 12px;
		line-height: 36rpx;
		color: #86909C;
	}
}

.info {
	margin-top: 16px;
	width: 100%;
	.item {
		height: 64rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.left {
			width: 0;
			flex: 1;
			display: flex;
			align-items: center;
		}
		.item-title {
			font-size: 12px;
			color: #4E5969;
			padding-right: 8rpx;
		}
		.item-content {
			width: 0;
			flex: 1;
			@include text-overflow;
			font-size: 12px;
			color: #1D2129;
		}
		.right {
			margin-left: 24rpx;
			.phone-tag {
				width: 40rpx;
				height: 40rpx;
				background: rgba(22, 93, 255, 0.1);
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.text-link {
				font-size: 24rpx;
				text-decoration: underline;
				color: #3446AA;
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
	}
}
</style>