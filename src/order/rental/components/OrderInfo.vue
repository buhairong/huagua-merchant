<template>
	<view class="card">
		<view class="title-wrap">
			<u-section
				:title="`${orderType == 1 ? '送车信息' : '接车信息'}`" 
				line-color="#165DFF"
				font-size="34"
				color="#0A0F2D"
				:right="false"
			></u-section>
			<view class="status-tag">{{CAR_RENTAL_ORDER_STATUS[orderDetail.status]}}</view>
		</view>
		
		<view class="item-wrap">
			<view class="item">
				<view class="item-title">客户信息</view>
				<view class="item-content">
					<view class="customer" @click="callPhone">
						{{orderDetail.userEntity.name}}
						<view class="phone-tag">
							<u-icon name="phone-fill" color="#0256FF" size="28"></u-icon>
						</view>
					</view>
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">{{orderType == 1 ? '送车地址' : '接车地址'}}</view>
				<view class="item-content">
					<view class="long-text">
						{{orderType == 1 ? `${orderDetail.pickUpAddress}` : `${orderDetail.returnAddress}`}}
					</view>
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">{{orderType == 1 ? '送车时间' : '接车时间'}}</view>
				<view class="item-content">
					{{orderType == 1 ? `${orderDetail.startDate}` : `${orderDetail.endDate}`}}
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">{{orderType == 1 ? '送车管家' : '接车管家'}}</view>
				<view class="item-content">
					{{orderType == 1 ? `${orderDetail.pickUpUserName}` : `${orderDetail.returnUserName}`}}
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
import { CAR_RENTAL_ORDER_STATUS } from '@/constants/index.js'
export default {
	props: {
		orderDetail: {
			type: Object,
			required: true,
		},
		
		orderType: {
			type: Number | String,
			required: true,
		},
	},
	
	data() {
		return {
			CAR_RENTAL_ORDER_STATUS,
		}
	},
	
	methods: {
		// 复制订单号
		copy() {
			uni.setClipboardData({
				data: this.orderDetail.orderNum,
			})
		},
		
		callPhone() {
			uni.makePhoneCall({
				phoneNumber: this.orderDetail.userEntity.mobile
			})
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "../../orderInfo/styles/index.scss";

.status-tag {
	padding: 0 16rpx;
	height: 52rpx;
	border-radius: 8rpx;
	font-size: 12px;
	display: flex;
	align-items: center;
	background: #F2F3F8;
	color: rgba(118, 118, 118, 0.8);
}

.tag {
	margin-left: 20rpx;
	width: 64rpx;
	height: 40rpx;
	border-radius: 8rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #F5F6F7;
	font-size: 12px;
	color: rgba(10, 15, 45, 0.8);
}

.customer {
	display: flex;
	align-items: center;
	.phone-tag {
		margin-left: 14rpx;
		width: 40rpx;
		height: 40rpx;
		background: rgba(22, 93, 255, 0.1);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}

.long-text {
	width: 100%;
	text-align: right;
}


</style>