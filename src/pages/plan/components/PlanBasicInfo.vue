<template>
	<view v-if="detail">
		<view class="card">
			<view class="title-wrap">
				<view class="title">
					<view class="left-border"></view>
					基本信息
				</view>
			</view>
			<view class="item">
				<view class="item-title">订阅周期</view>
				<view class="item-content">{{detail.monthTotal}}期</view>
			</view>
			<view class="item">
				<view class="item-title">支付方式</view>
				<view class="item-content">一次性付</view>
			</view>
			<view class="item">
				<view class="item-title">{{type == 1 ? '裸车价格' : '车辆价格'}}</view>
				<view class="item-content">￥{{formatThousandNumber(detail.nakedCarPrice)}}</view>
			</view>
			<view class="item" v-if="type == 1">
				<view class="item-title">车辆购置税</view>
				<view class="item-content">￥{{formatThousandNumber(detail.purchaseTax)}}</view>
			</view>
			<view class="item">
				<view class="item-title">保证金</view>
				<view class="item-content">减免保证金</view>
			</view>
			<view class="item">
				<view class="item-title">订阅费用</view>
				<view class="item-content">￥{{formatThousandNumber(detail.totalPayment)}}</view>
			</view>
			<view class="item">
				<view class="item-title">分销佣金</view>
				<view class="item-content">￥{{formatThousandNumber(detail.distributionBrokerage)}}</view>
			</view>
			<view class="item">
				<view class="item-title">期末选择</view>
				<view class="item-content">可买断、无损退车</view>
			</view>
			<view class="item">
				<view class="item-title">买断价格</view>
				<view class="item-content">￥{{formatThousandNumber(detail.buyoutsFee)}}</view>
			</view>
		</view>
		
		<view class="card">
			<view class="title-wrap">
				<view class="title">
					<view class="left-border"></view>
					差异化服务
				</view>
			</view>
			<view class="item">
				<view class="item-title">限定里程</view>
				<view class="item-content">{{formatThousandNumber(detail.limitMileage)}}公里</view>
			</view>
			<view class="item">
				<view class="item-title">超出另付</view>
				<view class="item-content">￥{{detail.overMileageFee}}/公里</view>
			</view>
			<view class="item" v-if="detail.carSubscribeFreeServiceList.length">
				<view class="item-title">特色服务</view>
				<view class="item-content">
					<view class="service-list">
						<view 
							class="service"
							v-for="(item, index) in detail.carSubscribeFreeServiceList"
							:key="index"
						>
							{{item.serviceName}}{{item.size ? ` x ${item.size}` : ''}}
						</view>
					</view>
				</view>
			</view>
			<view class="item" v-if="detail.safeguardServices.length">
				<view class="item-title">服务保障</view>
				<view class="item-content">
					<view class="service-list">
						<view 
							class="service safeguard-service"
							v-for="(item, index) in detail.safeguardServices"
							:key="index"
						>
							{{safeguardServices[item].serviceName}}
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="btn" @click="modifyPlan">
			修改方案
		</view>
	</view>
</template>

<script>
import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'

export default {
	props: {
		type: {
			type: Number,
			required: true,
		},
		
		detail: {
			type: Object,
			required: true
		},
	},
	
	data() {
		return {
			safeguardServices: [ // 保障服务集合，0、免费送车上门，1、2*24小时道路救援
				{
					id: 0,
					serviceName: "免费送车上门",
					isChecked: false,
				},
				{
					id: 1,
					serviceName: "7x24小时 道路救援",
					isChecked: false,
				},
			], 
		}
	},
	
	methods: {
		formatTenThousandNumber(num) {
			return formatTenThousandNumber(num)
		},
		
		formatThousandNumber(price) {
			return formatThousandNumber(price)
		},
		
		modifyPlan() {
			try {
				uni.setStorageSync('plan_detail', JSON.stringify(this.detail))
				if (this.type == 1) {
					uni.navigateTo({
						url: `/pages/plan/newCarPlanDetail?id=${this.detail.id}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/plan/oldCarPlanDetail?id=${this.detail.id}`
					})
				}
			} catch (e) {
				console.log('modifyPlan2', e)
			}
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.card {
	padding: 20px 32rpx;
	.title {
		margin-bottom: 16px;
	}
	.item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 12px;
		&:last-child {
			margin-bottom: 0;
		}
		.item-title {
			height: 44rpx;
			font-size: 14px;
			line-height: 44rpx;
			color: #86909C;
			padding-left: 10rpx;
			padding-right: 20rpx;
		}
		.item-content {
			flex: 1;
			display: flex;
			justify-content: flex-end;
			font-size: 14px;
			line-height: 44rpx;
			color: #1D2129;
			.service-list {
				display: flex;
				justify-content: flex-end;
				flex-wrap: wrap;
				.service {
					height: 44rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					padding: 0 8rpx;
					border-radius: 4rpx;
					background: #FFFFFF;
					border: 1px solid #E5E6EB;
					font-size: 12px;
					color: #1D2129;
					margin-left: 20rpx;
					margin-bottom: 16rpx;
				}
				.safeguard-service {
					margin-bottom: 0;
				}
			}
		}
	}
}

.btn {
	margin-top: 36px;
	width: 100%;
	height: 116rpx;
	border-radius: 16rpx;
	background: #4170EE;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 17px;
	font-weight: 500;
	color: #FFFFFF;
}
</style>