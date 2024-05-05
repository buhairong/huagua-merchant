<template>
	<view class="card">
		<view class="title-wrap">
			<u-section
				title="用车人风险查询" 
				line-color="#165DFF"
				font-size="34"
				color="#0A0F2D"
				:right="false"
			></u-section>
		</view>
		
		<view class="item-wrap">
			<view class="item" v-for="item in detail.personalQuery" :key="item.id">
				<view class="item-title">{{item.apiName}}</view>
				<view class="item-content">{{getStatus(item.ruleResult)}}</view>
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
	},
	
	data() {
		return {
			
		}
	},
	
	methods: {
		getStatus(ruleResult) {
			let status = ''
			
			if (ruleResult == 1) {
				status = '通过'
			} else if (ruleResult == 2) {
				status = '不通过'
			} else {
				status = '人工'
			}
			
			return status
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "../../../order/orderInfo/styles/index.scss";




</style>