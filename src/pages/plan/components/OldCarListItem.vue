<template>
	<view class="wrap" @click="go2detail(item)">
		<view class="car-img">
			<image
				class="item-img"
				mode="aspectFill"
				:src="item.imageUrl"
			/>
		</view>
		<view class="car-info">
			<view>
				<view class="brand">
					{{item.carBrand}}{{item.carType}} {{item.carTypeYear}} {{item.carTypeYearProduct}}
				</view>
				<view class="detail">
					{{item.cityName}} / {{item.monthTotal}}个月 {{item.mileage ? `${item.mileage | $transformNum}公里` : ''}}
				</view>
			</view>
			<view class="price">
				订阅仅需 <view style="padding-left:8rpx;font-size:16px;color:#F51A4E;">{{item.monthPayment | $numFormat}}</view><view style="color:#F51A4E;">元/月</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
	
	data() {
		return {
			finalSelectStr: '',
		}
	},
	
	mounted() {
		if (this.item.finalSelect) {
			let finalSelect = JSON.parse(this.item.finalSelect)
			const tempArr = []
			
			finalSelect.forEach(item => {
				if (item == 0) {
					tempArr.push('买断')
				} else if (item == 1) {
					tempArr.push('退回')
				} else if (item == -1) {
					tempArr.push('续订')
				}
			})
			this.finalSelectStr = tempArr.join('、')
		}
	},
	
	methods: {
		go2detail(item) {
			uni.navigateTo({
				url: `/pages/plan/oldCarSubscribeDetail?merchantId=${item.id}&carId=${item.secondCarId}`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";	

.wrap {
	margin-bottom: 12px;
	display: flex;
	.car-img {
		width: 220rpx;
		height: 180rpx;
		border-radius: 16rpx;
		background: #ccc;
		.item-img {
			border-radius: 16rpx;
			width: 100%;
			height: 100%;
		}
	}
	.car-info {
		width: 0;
		flex: 1;
		padding-left: 24rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.brand {
			height: 44rpx;
			font-size: 14px;
			line-height: 44rpx;
			color: rgba(10, 15, 45, 0.8);
			@include text-overflow;
		}
		.detail {
			height: 36rpx;
			font-size: 12px;
			line-height: 36rpx;
			color: rgba(10, 15, 45, 0.8);
		}
		.price {
			height: 44rpx;
			color: #0A0F2D;
			display: flex;
			align-items: baseline;
		}
	}
}
</style>