<template>
	<view class="card">
		<view class="title-wrap">
			<u-section
				title="方案信息" 
				line-color="#165DFF"
				font-size="34"
				color="#0A0F2D"
				:right="false"
			></u-section>
		</view>
		
		<view class="item-wrap" v-if="detail.orderAndUserDetail">
			<!-- <view class="item">
				<view class="item-title">标的金额</view>
				<view class="item-content">¥{{detail.orderAndUserDetail.standardPrice | $numFormat}}</view>
			</view> -->
			
			<template v-if="type == 2">
				<view class="item">
					<view class="item-title">车辆押金</view>
					<view class="item-content">¥{{detail.orderAndUserDetail.deposit | $numFormat}}</view>
				</view>
				
				<view class="item" v-if="detail.depositFreeApply && detail.depositFreeApply.addDeposit">
					<view class="item-title">加收押金</view>
					<view class="item-content">¥{{detail.depositFreeApply.addDeposit | $numFormat}}</view>
				</view>
			</template>
			
			
			<!-- <view class="item">
				<view class="item-title">订阅费用</view>
				<view class="item-content">¥{{detail.orderAndUserDetail.subscribeMoney | $numFormat}}</view>
			</view> -->
			
			<view class="item">
				<view class="item-title">用车城市</view>
				<view class="item-content">{{detail.orderAndUserDetail.city}}</view>
			</view>
			
		</view>	
		
	</view>
</template>

<script>
export default {
	props: {
		detail: {
			type: Object,
			required: true,
		},
		
		type: {
			type: Number,
			required: true,
		},
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
@import "../../../order/orderInfo/styles/index.scss";




</style>