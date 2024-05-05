<template>
	<view class="card">
		<view class="title-wrap">
			<u-section
				title="备用联系人" 
				line-color="#165DFF"
				font-size="34"
				color="#0A0F2D"
				:right="false"
			></u-section>
		</view>
		
		<view class="item-wrap">
			<view class="item">
				<view class="item-title">备用联系人关系</view>
				<view class="item-content">{{orderDetail.emergencyContactRelation}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">备用联系人姓名</view>
				<view class="item-content">{{orderDetail.emergencyContactName}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">备用联系人联系方式</view>
				<view class="item-content">{{orderDetail.emergencyContactPhone}}</view>
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

</style>