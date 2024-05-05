<template>
	<view class="car-info-wrap">
		<image
			class="img"
			mode="aspectFill"
			:src="carInfo.imageUrl"
		/>
		<view class="car-info">
			<view class="brand">{{carInfo.carBrand}} {{carInfo.carType}}</view>
			<view class="product">{{carInfo.carTypeYear}} {{carInfo.carTypeYearProduct}}</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		carInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	
	data(){
		return {
			
		}
	},
	
	mounted() {
		
	},
	
	methods: {
		
	}
}
</script>

<style lang="scss" scoped>
.car-info-wrap {
	display: flex;
	align-items: center;
	.img {
		width: 260rpx;
		height: 104rpx;
	}
	.car-info {
		.brand {
			font-size: 30rpx;
			line-height: 44rpx;
			color: rgba(10, 15, 45, 0.8);
		}
		.product {
			font-size: 24rpx;
			line-height: 40rpx;
			letter-spacing: 0px;
			color: rgba(10, 15, 45, 0.8);
		}
	}
}
</style>