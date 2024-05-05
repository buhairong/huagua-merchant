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
			
			<view class="count" v-if="item.isOverTimeOfProhibit === 1">
				倒计时
				<view class="count-box">{{hour}}</view>
				时
				<view class="count-box">{{min}}</view>
				分
			</view>
		</view>
		
		<view class="info">
			<view>
				<view class="item" v-if="orderType === 2">
					<view class="item-title">企业名称：</view>
					<view class="item-content">{{item.companyName}}</view>
				</view>
				<view class="item">
					<view class="item-title">客户信息：</view>
					<view class="item-content">{{item.name}}</view>
				</view>
				<view class="item">
					<view class="item-title">审核状态：</view>
					<view class="item-content">{{RiskOrderStatus[item.riskResult].label}}</view>
				</view>
				<view class="item">
					<view class="item-title">创建时间：</view>
					<view class="item-content">{{item.createdTime || '-'}}</view>
				</view>
			</view>
			
			<view class="distribution" v-if="item.riskResult === 1 || item.riskResult === 7 || item.isOverTimeOfProhibit === 1">
				<text v-if="item.riskResult === 1">用户审核</text>
				<text v-else-if="item.riskResult === 7">查看补充材料</text>
				<text v-else-if="item.isOverTimeOfProhibit === 1">重新审核</text>
			</view>
			
		</view>
		
	</view>
</template>

<script>
import { RiskOrderStatus } from '@/constants/index.js'

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
		
		type: {
			type: Number,
			required: true,
		},
	},
	
	data() {
		return {
			RiskOrderStatus,
			signToCancelTime: 0,
			signToCancelTimer: null,
			hour: '',
			min: '',
		}
	},
	
	mounted() {
		if (this.item.isOverTimeOfProhibit === 1 && this.item.overTimeOfProhibitSeconds > 0) {
			this.signToCancelTime = this.item.overTimeOfProhibitSeconds
			this.countdown()
			this.signToCancelTimer = setInterval(() => {
				this.signToCancelTime = this.signToCancelTime - 60
				this.countdown()
			}, 60000)
		}
		
	},
	
	beforeDestroy() {
		clearInterval(this.signToCancelTimer)
		this.signToCancelTimer = null
	},
	
	methods: {
		countdown() {
			if (this.signToCancelTime > 0) {
				const oneH = 60 * 60
				const h = Math.floor(this.signToCancelTime / oneH) + ''
				const m = Math.floor((this.signToCancelTime % oneH) / 60) + ''
				this.hour = h.padStart(2, '0')
				this.min = m.padStart(2, '0')
			} else {
				clearInterval(this.signToCancelTimer)
				this.signToCancelTimer = null
			}
		},
		
		gotoDetail(item) {
			uni.navigateTo({
				url: `/risk/risk/riskOrderDetail?id=${this.item.id}&auditRate=${this.item.auditRate}&orderType=${this.orderType}&type=${this.type}`
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

.count {
	display: flex;
	align-items: center;
	font-size: 12px;
	color: rgba(10, 15, 45, 0.8);
	.count-box {
		margin: 0 10rpx;
		padding: 0 10rpx;
		height: 36rpx;
		line-height: 36rpx;
		border-radius: 4rpx;
		background: #000000;
		color: #FFFFFF;
		font-size: 12px;
	}
}
</style>