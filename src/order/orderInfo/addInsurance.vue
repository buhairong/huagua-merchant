<template>
	<view class="page">
		<CarInfoHeader 
			:brand="brand"
			:carType="carType"
			:carTypeYear="carTypeYear"
			:carTypeYearProduct="carTypeYearProduct"
			:imageUrl="imageUrl"
		/>
		
		<Insurance 
			:secondCarInfo="detail"
		/>
		
		<view class="btn-wrap">
			<view class="btn" @click="bind">保存信息</view>
		</view>
		
	</view>
</template>

<script>
import CarInfoHeader from './components/CarInfoHeader.vue'
import Insurance from '../../pages/plan/components/Insurance.vue'

export default {
	components: {
		CarInfoHeader,
		Insurance,
	},
	
	data() {
		return {
			id: '',
			brand: '',
			carType: '',
			carTypeYear: '',
			carTypeYearProduct: '',
			imageUrl: '',
			carId: '',
			newOrOld: '',
			carPlateNum: '',
			carVin: '',
			carEngineNum: '',
			mileage: '',
			outColor: '',
			detail: {},
		}
	},
	
	onLoad(options) {
		this.carId = options.carId
		this.newOrOld = options.newOrOld
		this.id = options.id
		this.brand = options.brand
		this.carType = options.carType
		this.carTypeYear = options.carTypeYear
		this.carTypeYearProduct = options.carTypeYearProduct
		this.imageUrl = options.imageUrl
		this.carVin = options.carVin
		this.carEngineNum = options.carEngineNum
		this.mileage = options.mileage
		this.outColor = options.outColor
		this.carPlateNum = options.carPlateNum
	},
	
	onShow() {
		this.selectCarsInfo()
	},
	
	methods: {
		async selectCarsInfo() {
			const params = {
				id: this.carId,
				newOrOld: this.newOrOld,
			}
			
			const res = await this.$getRequest(this.$url.findCarInfoById, "POST", params)
			
			if (res.code === 0) {
				this.detail = res.data
			}
		},
		
		bind() {
			if (!this.detail.insuranceList || this.detail.insuranceList.length === 0) {
				uni.showToast({
				    title: '请添加交强险',
				    duration: 2000,
						icon: 'none',
				})
				return
			}
			
			if (this.detail.insuranceList.length === 1 && this.detail.insuranceList[0].insuranceType == 1) {
				uni.showToast({
				    title: '请添加交强险',
				    duration: 2000,
						icon: 'none',
				})
				return
			}
			
			uni.reLaunch({
				url: `/order/orderInfo/handoverOrderDetailInfo?id=${this.id}&carId=${this.carId}&newType=${this.newOrOld}`
			})
			
			// uni.reLaunch({
			// 	url: `./bindcar-finish?orderId=${this.id}&carId=${this.carId}&newType=${this.newOrOld}&carBrand=${this.brand}&carType=${this.carType}&carTypeYear=${this.carTypeYear}&carTypeYearProduct=${this.carTypeYearProduct}&imageUrl=${this.imageUrl}&carPlateNum=${this.carPlateNum}&carVin=${this.carVin}&carEngineNum=${this.carEngineNum}&mileage=${this.mileage}&outColor=${this.outColor}`
			// })
			
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "./styles/index.scss";

.page {
	padding: 16px 32rpx 54px;
}

.btn-wrap {
	width: 100vw;
	position: fixed;
	left: 0;
	bottom: 56px;
	z-index: 100;
	padding: 0 40rpx;
	.btn {
		width: 100%;
		height: 116rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #4170EE;
		border-radius: 16rpx;
		color: #FFFFFF;
		font-size: 17px;
	}
}
</style>