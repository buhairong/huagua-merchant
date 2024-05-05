<template>
	<u-popup v-model="show" mode="center" border-radius="14">
		<view class="popupWrap">
			<image
				style="width:124rpx;height:182rpx;"
				src="https://image.51cheyaoshi.com/xcx/merchant/static/order/completed.png"
			/>
			<view class="text">完成验车</view>
			<view class="btn" @click="gotoDetail">好的</view>
		</view>
	</u-popup>
</template>

<script>
export default {
	props: {
		show: {
			type: Boolean,
			default: false,
		},
		
		orderCarInfo: {
			type: Object,
			default: () => ({}),
		},
		
		carId: {
			type: String | Number,
			default: '',
		},
		
		newType: {
			type: String | Number,
			default: '',
		},
		
		orderId: {
			type: String | Number,
			default: '',
		},
	},
	
	data() {
		return {
			showPopup: false,
			bindCarId: null,
			selectCar: null,
		}
	},
	
	methods: {
		gotoDetail() {
			uni.reLaunch({
				url: `/order/orderInfo/handoverOrderDetailInfo?id=${this.orderId}&carId=${this.carId}&newType=${this.newType}&carBrand=${this.orderCarInfo.carBrand}&carType=${this.orderCarInfo.carType}&carTypeYear=${this.orderCarInfo.carTypeYear}&carTypeYearProduct=${this.orderCarInfo.carTypeYearProduct}&imageUrl=${this.orderCarInfo.imageUrl}`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.popupWrap {
	width: 560rpx;
	padding: 40px 64rpx 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	.text {
		margin-top: 16px;
		height: 56rpx;
		font-size: 18px;
		line-height: 56rpx;
		color: #1D2129;
	}
	.btn {
		margin-top: 60px;
		width: 100%;
		height: 90rpx;
		border-radius: 16rpx;
		background: #4170EE;
		font-size: 16px;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>