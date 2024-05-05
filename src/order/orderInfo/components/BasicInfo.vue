<template>
	<view class="card">
		<view class="title-wrap">
			<u-section
				title="基本信息" 
				line-color="#165DFF"
				font-size="34"
				color="#0A0F2D"
				:right="false"
			></u-section>
		</view>
		
		<view class="item-wrap">
			<view class="item">
				<view class="item-title">订阅周期</view>
				<view class="item-content">{{orderDetail.monthTotal}}期</view>
			</view>
			
			<view class="item">
				<view class="item-title">支付方式</view>
				<view class="item-content">一次性付</view>
			</view>
			
			<view class="item">
				<view class="item-title">裸车价格</view>
				<view class="item-content">￥{{orderDetail.nakedCarPrice-0 | $numFormat}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">买断价格</view>
				<view class="item-content">￥{{orderDetail.buyoutsFee-0 | $numFormat}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">提车押金</view>
				<view class="item-content">￥{{orderDetail.deposit-0 | $numFormat}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">订阅费用</view>
				<view class="item-content">￥{{orderDetail.monthPayment-0 | $numFormat}}/月 × {{orderDetail.monthTotal}}期</view>
			</view>
			
			<view class="item">
				<view class="item-title">分销佣金</view>
				<view class="item-content">￥{{orderDetail.distributionBrokerageFree-0 | $numFormat}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">期末选择</view>
				<view class="item-content">可能{{final[orderDetail.finalSelect]}}</view>
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
			final: {
				'0': '退回',
				'1': '买断',
				'3': '继续订阅',
			}
		}
	},
	
	methods: {
		
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "../styles/index.scss";


</style>