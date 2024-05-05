<template>
	<view>
		<view v-if="detail.subscribeDetail">
			<view class="card">
				<view class="title-wrap">
					<view class="title">
						<view class="left-border"></view>
						基本信息
					</view>
				</view>
				<view class="item">
					<view class="item-title">订阅押金</view>
					<view class="item-content">￥{{formatThousandNumber(detail.subscribeDetail.deposit)}}</view>
				</view>
				<view class="item">
					<view class="item-title">订阅周期</view>
					<view class="item-content">{{detail.subscribeDetail.monthTotal}}个月</view>
				</view>
				<view class="item">
					<view class="item-title">支付方式</view>
					<view class="item-content">一次性付</view>
				</view>
				
				<view class="item subscribe-item">
					<view class="item-title">订阅费用</view>
					<view style="color:#BFBFBF;flex:1;">￥{{formatThousandNumber(detail.subscribeDetail.monthPay)}}/月</view>
					<view class="item-content">￥{{formatThousandNumber(detail.subscribeDetail.totalPayment)}}</view>
				</view>
				
				<view class="item">
					<view class="item-title">期末选择</view>
					<view class="item-content">可买断、可续订、可退回</view>
				</view>
			</view>
			
			<view class="card">
				<view class="title-wrap">
					<view class="title">
						<view class="left-border"></view>
						差异化服务
					</view>
				</view>
				<!-- <view class="item">
					<view class="item-title">限定里程</view>
					<view class="item-content">{{formatThousandNumber(detail.subscribeDetail.limitMileage)}}公里</view>
				</view>
				<view class="item">
					<view class="item-title">超出另付</view>
					<view class="item-content">￥{{detail.subscribeDetail.overMileageFee}}/公里</view>
				</view> -->
				<view class="item" v-if="detail.subscribeDetail.carSubscribeFreeServiceList.length">
					<view class="item-title">特色服务</view>
					<view class="item-content">
						<view class="service-list">
							<view 
								class="service"
								v-for="(item, index) in detail.subscribeDetail.carSubscribeFreeServiceList"
								:key="index"
							>
								{{item.serviceName}}{{item.size ? ` x ${item.size}` : ''}}
							</view>
						</view>
					</view>
				</view>
				<view class="item" v-if="detail.subscribeDetail.safeguardServices.length">
					<view class="item-title">服务保障</view>
					<view class="item-content">
						<view class="service-list">
							<view 
								class="service safeguard-service"
								v-for="(item, index) in detail.subscribeDetail.safeguardServices"
								:key="index"
							>
								{{safeguardServices[item].serviceName}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="empty-wrap" v-else>
			<image
				class="empty-img"
				src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_720.png"
			/>
			<view class="tip">暂无方案信息</view>
		</view>
		<view class="btn" @click="modifyPlan" v-if="!detail.subscribeDetail || detail.status !== 3">
			{{detail.subscribeDetail ? '修改方案' : '创建方案'}}
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
				if (this.detail.subscribeDetail) {
					uni.setStorageSync('plan_detail', JSON.stringify(this.detail.subscribeDetail))
					if (this.type == 1) {
						uni.navigateTo({
							url: `/pages/plan/newCarPlanDetail?id=${this.detail.subscribeDetail.id}`
						})
					} else {
						uni.navigateTo({
							url: `/pages/plan/oldCarPlanDetail?id=${this.detail.subscribeDetail.id}`
						})
					}
				} else {
					if (this.type == 1) {
						uni.navigateTo({
							url: `/pages/plan/newCarPlanDetail?brandId=${this.detail.carBrandId}&brandName=${this.detail.carBrand}&carTypeId=${this.detail.carTypeId}&carType=${this.detail.carType}&carTypeYearId=${this.detail.carTypeYearId}&carTypeYear=${this.detail.carTypeYear}&carTypeYearProductId=${this.detail.carTypeYearProductId}&carTypeYearProduct=${this.detail.carTypeYearProduct}`
						})
					} else {
						uni.navigateTo({
							url: `/pages/plan/oldCarPlanDetail?secondHandCarId=${this.detail.id}&brandId=${this.detail.carBrandId}&brandName=${this.detail.carBrand}&carTypeId=${this.detail.carTypeId}&carType=${this.detail.carType}&carTypeYearId=${this.detail.carTypeYearId}&carTypeYear=${this.detail.carTypeYear}&carTypeYearProductId=${this.detail.carTypeYearProductId}&carTypeYearProduct=${this.detail.carTypeYearProduct}`
						})
					}
				}
			} catch (e) {
				// error
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

.subscribe-item {
	.item-title {
		flex: 1;
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

.empty-wrap {
	margin: 40px 0 100px 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	.empty-img {
		width: 220rpx;
		height: 220rpx;
	}
	.tip {
		margin-top: 24px;
		height: 48rpx;
		font-size: 16px;
		font-weight: 500;
		line-height: 48rpx;
		color: #0A0F2D;
	}
}
</style>