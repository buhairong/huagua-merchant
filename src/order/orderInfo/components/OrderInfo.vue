<template>
	<view class="card">
		<view class="title-wrap">
			<u-section
				title="订单信息" 
				line-color="#165DFF"
				font-size="34"
				color="#0A0F2D"
				:right="false"
			></u-section>
			<view class="status-tag">{{orderStatusObj[orderDetail.status]}}</view>
		</view>
		
		<view class="item-wrap">
			<view class="item">
				<view class="item-title">订单编号</view>
				<!-- <view class="item-content" @click="copy"> -->
				<view class="item-content">
					{{orderDetail.orderNum}}
					<!-- <view class="tag">复制</view> -->
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">订单来源</view>
				<view class="item-content">{{orderSourceObj[orderDetail.orderSource]}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">客户信息</view>
				<view class="item-content">
					<view class="customer" @click="callPhone">
						{{orderDetail.userName ? orderDetail.userName : '-'}}
						<view class="phone-tag" v-if="orderDetail.userName">
							<u-icon name="phone-fill" color="#0256FF" size="28"></u-icon>
						</view>
					</view>
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">销售人员</view>
				<view class="item-content">
					<view class="sale">
						{{orderDetail.salesmanName ? orderDetail.salesmanName : ''}}
						<view class="sale-tag" @click="distribution" v-if="isManager && orderDetail.status !== 8">
							{{orderDetail.salesmanId ? '更换销售' : '分配销售'}}
						</view>
					</view>
				</view>
			</view>
			
		</view>	
		
		<DistributionPopup
			:show.sync="showDistributionPopup"
			:orderId="orderDetail.id"
			@complete="complete"
		/>
	</view>
</template>

<script>
import { orderStatusObj, orderSourceObj } from '@/constants/index.js'
import DistributionPopup from './DistributionPopup.vue'

export default {
	components: {
		DistributionPopup,
	},
	
	props: {
		orderDetail: {
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
			showDistributionPopup: false,
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
				phoneNumber: this.orderDetail.clientMobile
			})
		},
		
		distribution() {
			this.showDistributionPopup = true
		},
		
		complete(data) {
			this.orderDetail.salesmanName = data.salesmanName
			this.$emit('refresh')
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "../styles/index.scss";

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

.sale {
	display: flex;
	align-items: center;
	.sale-tag {
		margin-left: 12rpx;
		color: #0256FF;
		text-decoration: underline;
	}
}


</style>