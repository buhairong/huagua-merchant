<template>
	<view class="page">
		<view>
			<view class="header">
				<view class="car-brand-wrap">
					<view class="brand">
						{{carBrand}} {{carType}}
					</view>
					<view class="car-type">
						{{carTypeYear}} {{carTypeYearProduct}}
					</view>
				</view>
				
				<image
					class="car-img"
					:src="imageUrl"
					mode="aspectFill"
				/>
			</view>
			
			<view class="title-wrap">
				<u-section
					style="width:100%"
					title="上传车辆信息" 
					line-color="#1D2129"
					font-size="32"
					color="#1D2129"
					:arrow="false"
					:right="false"
				></u-section>
			</view>
			
			<view class="item">
				<view class="item-title">车架号</view>
				<input v-model="carVin" placeholder="请输入车架号" />
			</view>
			
			<view class="item">
				<view class="item-title">发动机号</view>
				<input v-model="carEngineNum" placeholder="请输入发动机号" />
			</view>
			
			<view class="item">
				<view class="item-title">实表里程数</view>
				<view class="num-wrap">
					<input v-model="mileage" inputmode="numeric" type="digit" placeholder="请输入实表里程数" />
					<view class="unit">公里</view>
				</view>
			</view>
			
			
		</view>
		
		<view class="buttom-disabled-btn">
			<button :disabled="disabled" @click="bindCar">确认绑定</button>
		</view>
	</view>
</template>

<script>
import { validIntegerNum, validCarVin } from '@/utils/validate'

export default {
	data() {
		return {
			orderId: '',
			carTypeYearProductId: '',
			newType: '',
			carBrand: '',
			carType: '',
			carTypeYear: '',
			carTypeYearProduct: '',
			imageUrl: '',
			carVin: '',
			carEngineNum: '',
			mileage: '',
			outColor: '',
			powerMode: '',
			carId: '',
			currentCompany: {},
		}
	},
	
	computed: {
		disabled() {
			if (this.carVin && this.carEngineNum && this.mileage) {
				return false
			}
			
			return true
		}
	},
	
	onLoad(options){
		this.orderId = options.orderId
		this.carTypeYearProductId = options.carTypeYearProductId
		this.newType = options.newType
		this.carBrand = options.carBrand
		this.carType = options.carType
		this.carTypeYear = options.carTypeYear
		this.carTypeYearProduct = options.carTypeYearProduct
		this.imageUrl = options.imageUrl
		this.carVin = options.carVin
		this.carEngineNum = options.carEngineNum
		this.mileage = options.mileage
		this.outColor = options.outColor
		this.powerMode = options.powerMode
		this.carId = options.carId
		
		const value = uni.getStorageSync('current_company')
		if (value) {
			this.currentCompany = value
		}
	},
	
	methods: {
		async bindCar() {
			const num = this.powerMode == 3 ? 15 : 17
			if(!validCarVin(this.carVin, num)) {
				uni.showToast({
					title: `车架号为 ${num}位大写英文字母和数字`,
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!validIntegerNum(this.mileage)) {
				uni.showToast({
					title: '请正确输入实表里程数',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			const params = {
				orderId: this.orderId,
				newType: this.newType,
				carTypeYearProductId: this.carTypeYearProductId,
				carVin: this.carVin,
				carEngineNum: this.carEngineNum,
				mileage: this.mileage,
				outColor: this.outColor,
				carId: this.carId,
				salesmanId: this.currentCompany.userId,
				salesmanName: this.currentCompany.username,
				salesmanMobile: this.currentCompany.mobile,
				merchantId: this.currentCompany.company.id,
			}
			
			const res = await this.$getRequest(this.$url.bindingCar, "POST", params)
			
			if (res.code == 0 && res.data) {
				const carId = res.data.carId || ''
				this.carId = carId
				// uni.navigateTo({
				// 	url: `/order/orderInfo/confirmCarPlateDate?orderId=${this.orderId}&carId=${carId}&newType=${this.newType}&carBrand=${this.carBrand}&carType=${this.carType}&carTypeYear=${this.carTypeYear}&carTypeYearProduct=${this.carTypeYearProduct}&imageUrl=${this.imageUrl}&carVin=${this.carVin}&carEngineNum=${this.carEngineNum}&mileage=${this.mileage}&outColor=${this.outColor}&powerMode=${this.powerMode}`
				// })
				
				uni.navigateTo({
					url: `/order/orderInfo/uploadDeliveryCarPics?carId=${carId}&orderId=${this.orderId}&newOrOld=${this.newType}&category=1&carVin=${this.carVin}&carEngineNum=${this.carEngineNum}`
				})
			}
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
	
.page {
	padding: 16px 32rpx 40px;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.car-img {
			width: 266rpx;
			height: 108rpx;
			margin-left: 10rpx;
		}
		.car-brand-wrap {
			flex: 1;
			.brand {
				font-size: 16px;
				line-height: 48rpx;
				color: #1D2129;
			}
			.car-type {
				font-size: 12px;
				line-height: 36rpx;
				color: #86909C;
			}
		}
	}
	
	.title-wrap {
		margin-top: 24px;
		margin-bottom: 16px;
	}
	
	.item {
		margin-bottom: 12px;
		.item-title {
			margin-bottom: 2px;
			height: 36rpx;
			font-size: 12px;
			line-height: 36rpx;
			color: #1D2129;
		}
		input {
			height: 96rpx;
			border-radius: 16rpx;
			background: #F7F8FA;
			color: #1D2129;
			font-size: 14px;
			padding: 0 32rpx;
		}
		.num-wrap {
			padding-right: 32rpx;
			display: flex;
			align-items: center;
			background: #F7F8FA;
			input {
				flex: 1;
			}
			.unit {
				font-size: 14px;
				color: #1D2129;
			}
		}
	}
}

</style>