<template>
	<view class="card">
		<view class="car-info">
			<view class="brand">
				{{brand}} {{carType}}
			</view>
			<view class="car-type">
				{{carTypeYear}} {{carTypeYearProduct}}
			</view>
		</view>
		<image style="width:274rpx;height:144rpx;" mode="aspectFill" :src="imageUrl"></image>
	</view>
</template>

<script>
export default {
	props: {
		brand: {
			type: String,
			default: '',
		},
		
		carType: {
			type: String,
			default: '',
		},
		
		carTypeYear: {
			type: String,
			default: '',
		},
		
		carTypeYearProduct: {
			type: String,
			default: '',
		},
		
		imageUrl: {
			type: String,
			default: '',
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
@import "../styles/index.scss";

.card {
	height: 220rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.car-info {
		margin-right: 20rpx;
	}
	.brand {
		font-size: 16px;
		line-height: 44rpx;
		color: #1D2129;
	}
	.car-type {
		margin-top: 4px;
		font-size: 12px;
		line-height: 34rpx;
		color: #86909C;
	}
}
</style>