<template>
	<view class="card">
		<view class="title-wrap">
			<u-section
				title="车辆信息" 
				line-color="#165DFF"
				font-size="34"
				color="#0A0F2D"
				:right="false"
			></u-section>
			<view class="status-tag">{{orderDetail.plateNum}}</view>
		</view>
		
		<view class="item-wrap">
			<view class="item">
				<view class="item-title">车型</view>
				<view class="item-content">
					<view class="long-text">
						{{orderDetail.carTypeYearProductEntity.carBrand}} {{orderDetail.carTypeYearProductEntity.carType}}
					</view>
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">款型</view>
				<view class="item-content">
					<view class="long-text">
						{{orderDetail.carTypeYearProductEntity.carTypeYear}} {{orderDetail.carTypeYearProductEntity.carTypeYearProduct}}
					</view>
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">外观颜色</view>
				<view class="item-content">
					{{orderDetail.carColor}}
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">验车信息</view>
				<view class="item-content">
					<view class="link-text" @click="review" v-if="orderDetail.deliveryCheckInfo">
						查看详情
					</view>
					<view v-else>
						待验车
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
		},
		
		orderType: {
			type: Number | String,
			required: true,
		},
	},
	
	data() {
		return {
			
		}
	},
	
	methods: {
		review() {
			this.$emit('review')
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "../../orderInfo/styles/index.scss";

.long-text {
	width: 100%;
	text-align: right;
}

.link-text {
	font-size: 28rpx;
	text-decoration: underline;
	color: #3446AA;
}
</style>