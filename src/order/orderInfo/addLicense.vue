<template>
	<view class="page">
		<CarInfoHeader 
			:brand="brand"
			:carType="carType"
			:carTypeYear="carTypeYear"
			:carTypeYearProduct="carTypeYearProduct"
			:imageUrl="imageUrl"
		/>
		
		<AddLicense 
			:createData="params"
			@nextStep="nextStep"
		/>
	</view>
</template>

<script>
import CarInfoHeader from './components/CarInfoHeader.vue'
import AddLicense from './components/AddLicense.vue'

export default {
	components: {
		CarInfoHeader,
		AddLicense,
	},
	
	data() {
		return {
			id: '',
			brand: '',
			carType: '',
			carTypeYear: '',
			carTypeYearProduct: '',
			imageUrl: '',
			outColor: '',
			powerMode: '',
			params: {
				carId: '',
				travelLicenseUrl: '',
				carPlateNum: '',
				carVin: '',
				carEngineNum: '',
				registerDate: '',
				mileage: '',
				newOrOld: '',
			},
		}
	},
	
	onLoad(options) {
		this.params.carId = options.carId
		this.params.newOrOld = options.newOrOld
		this.params.carVin = options.carVin
		this.params.carEngineNum = options.carEngineNum
		this.params.carPlateNum = options.carPlateNum
		this.params.mileage = options.mileage
		this.params.registerDate = options.registerDate
		this.params.travelLicenseUrl = options.travelLicenseUrl
		this.id = options.id
		this.brand = options.brand
		this.carType = options.carType
		this.carTypeYear = options.carTypeYear
		this.carTypeYearProduct = options.carTypeYearProduct
		this.imageUrl = options.imageUrl
		this.outColor = options.outColor
		this.powerMode = options.powerMode
		
		const orderCarInfo = uni.getStorageSync('orderCarInfo')
		if (orderCarInfo) {
			this.params.travelLicenseUrl = orderCarInfo.travelLicenseUrl
			this.params.carPlateNum = orderCarInfo.carPlateNum
			this.params.registerDate = orderCarInfo.registerDate
		}
	},
	
	methods: {
		nextStep(data) {
			this.params.travelLicenseUrl = data.travelLicenseUrl
			this.params.carPlateNum = data.carPlateNum
			this.params.carVin = data.carVin
			this.params.carEngineNum = data.carEngineNum
			this.params.registerDate = data.registerDate
			this.params.mileage = data.mileage
			
			this.save()
		},
		
		save() {
			uni.showLoading({
				title: '保存中',
				icon: 'none'
			})
			
			this.$getRequest(this.$url.getCarTravelLicense, 'POST', this.params).then(res => {
				if (res.code === 0) {
					uni.navigateTo({
						url: `/order/orderInfo/uploadLicencPics?carId=${this.params.carId}&id=${this.id}&powerMode=${this.powerMode}&newOrOld=${this.params.newOrOld}&brand=${this.brand}&carType=${this.carType}&carTypeYear=${this.carTypeYear}&carTypeYearProduct=${this.carTypeYearProduct}&imageUrl=${this.imageUrl}&carPlateNum=${this.params.carPlateNum}&carVin=${this.params.carVin}&carEngineNum=${this.params.carEngineNum}&mileage=${this.params.mileage}&outColor=${this.outColor}`
					})
					// uni.navigateTo({
					// 	url: `./addInsurance?id=${this.id}&carId=${this.params.carId}&powerMode=${this.powerMode}&newOrOld=${this.params.newOrOld}&brand=${this.brand}&carType=${this.carType}&carTypeYear=${this.carTypeYear}&carTypeYearProduct=${this.carTypeYearProduct}&imageUrl=${this.imageUrl}&carPlateNum=${this.params.carPlateNum}&carVin=${this.params.carVin}&carEngineNum=${this.params.carEngineNum}&mileage=${this.params.mileage}&outColor=${this.outColor}`
					// })
				} else {
					uni.hideLoading()
				}
			}).catch(() => {
				uni.hideLoading()
			})
		},
		
		bind() {
			const params = {
				carId: this.params.carId,
				carSubscribeOrderId: this.id,
				newOrOld: this.params.newOrOld,
			}
			
			this.$getRequest(this.$url.getBindOrder, 'POST', params).then(res => {
				if (res.code === 0) {
					let carBrandInfo = `${this.brand} ${this.carType}`
					let carYearTypeInfo = `${this.carTypeYear} ${this.carTypeYearProduct}`
					
					uni.navigateTo({
						url: `./orderDetailInfo?id=${this.id}&carId=${this.params.carId}&newType=${this.params.newOrOld}&carBrandInfo=${carBrandInfo}&carYearTypeInfo=${carYearTypeInfo}&imageUrl=${this.imageUrl}`
					})
				}
			}).finally(() => {
				uni.hideLoading()
			})
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
</style>