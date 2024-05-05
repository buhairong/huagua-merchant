<template>
	<view class="record" @click="goDetailPage">
		<view class="record-item">
			<view>{{cashRecordObj[item.operateType].text}}</view>
			<view class="time">{{item.createdTime}}</view>
		</view>
		<view class="right">
			<view>
				<view>{{item.operateType < 10 ? '+' : '-'}}{{item.money | $numFormat1}}</view>
				<view class="status" v-if="item.operateType === 12 || (item.operateType === 1 && item.payWay === 2)">
					<view v-if="item.status === 0">审核中</view>
					<view class="error-status" v-else-if="item.status === 2">{{item.remark}}</view>
				</view>
			</view>
			
			<u-icon name="arrow-right" color="#cccccc" size="32" style="margin-left:4px;"></u-icon>
		</view>
	</view>
</template>

<script>
import { cashRecordObj } from '@/constants/index.js'

export default {
	props: {
		item: {
			type: Object,
			required: true,
		}
	},
	
	data() {
		return {
			cashRecordObj,
			currentCompany: {},
		}
	},
	
	mounted() {
		const value = uni.getStorageSync('current_company')
		if (value) {
			this.currentCompany = value
		}
	},
	
	methods: {
		goDetailPage() {
			if (this.item.operateType === 1 && this.item.payWay === 2 && (this.item.status === 0 || this.item.status === 2)) {
				uni.navigateTo({
					url: `/auction/pay/bankPayInfo?businessId=-1&billId=${this.item.accountDetailId}&price=${this.item.money}&payType=0&openid=${this.currentCompany.openid}&userId=${this.currentCompany.userId}&businessType=7`
				})
			} else {
				uni.navigateTo({
					url: `/auction/pay/accountDetail?type=${this.item.operateType}&id=${this.item.id}&money=${this.item.money}&createdTime=${this.item.createdTime}`
				})
			}
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "~@/styles/mixin.scss";

.record {
	margin-bottom: 12px;
	padding: 20px 32rpx;
	box-shadow: 0px -1px 24px 0px rgba(10, 15, 45, 0.04),0px 4px 24px 0px rgba(10, 15, 45, 0.04);
	border-radius: 16rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: #333333;
	font-size: 32rpx;
	.record-item {
		.time {
			margin-top: 16rpx;
			font-size: 12px;
			color: #999999;
		}
	}
	.right {
		display: flex;
		align-items: center;
	}
	.status {
		margin-top: 16rpx;
		font-size: 14px;
	}
	.error-status {
		color: #EA0000;
	}
}
</style>