<template>
	<view class="card">
		<view class="title-wrap">
			<u-section
				title="差异化服务" 
				line-color="#165DFF"
				font-size="34"
				color="#0A0F2D"
				:right="false"
			></u-section>
		</view>
		
		<view class="item-wrap">
			<view class="item">
				<view class="item-title">限定里程</view>
				<view class="item-content">{{orderDetail.limitMileage-0 | $numFormat}}公里</view>
			</view>
			
			<view class="item">
				<view class="item-title">超出另付</view>
				<view class="item-content">￥{{orderDetail.overMileageFee-0 | $numFormat}}/公里</view>
			</view>
			
			<view class="item">
				<view class="item-title">特色服务</view>
				<view class="item-content wrap-content">
					<view class="tag-wrap">
						<view class="tag" v-for="(item, index) in orderDetail.carSubscribeFreeServiceToWeb" :key="index">
							{{item.serviceName}} x {{item.size}}
						</view>
					</view>
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">服务保障</view>
				<view class="item-content wrap-content">
					<view class="tag-wrap">
						<view class="tag" v-if="orderDetail.safeguardServices.includes(0)">7x24小时道路救援</view>
						<view class="tag" v-if="orderDetail.safeguardServices.includes(1)">免费送车上门</view>
					</view>
				</view>
			</view>
			
		</view>	
	</view>
</template>

<script>
export default {
	props: {
		orderDetail: {
			type: Object,
			required: true,
		}
	},
	
	data() {
		return {
			
		}
	},
	
	methods: {
		
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "../styles/index.scss";

.wrap-content {
	flex: 1;
	justify-content: flex-end;
}

.tag-wrap {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
}

.tag {
	margin-left: 20rpx;
	margin-bottom: 16rpx;
	padding: 0 8rpx;
	height: 44rpx;
	line-height: 44rpx;
	border-radius: 4rpx;
	font-size: 12px;
	color: #1D2129;
	border: 1px solid #E5E6EB;
}
</style>