<template>
	<view class="page" v-if="orderDetail">
		<view style="flex:1;">
			<view class="header">
				<image
					class="car-img"
					:src="imageUrl"
					mode="aspectFill"
				/>
				<view class="car-brand-wrap">
					<view class="brand">
						{{carBrand}} {{carType}}
					</view>
					<view class="car-type">
						{{carTypeYear}} {{carTypeYearProduct}}
					</view>
				</view>
			</view>
			
			<view class="container">
				<OrderInfo :orderDetail="orderDetail" :isManager="isManager" @refresh="getOrderDetailMethod" />
				
				<!-- <BasicInfo :orderDetail="orderDetail" /> -->
				
				<!-- <ServiceInfo :orderDetail="orderDetail" /> -->
				
				<CarInfo 
					:orderDetail="orderDetail"
					:carBrand="carBrand"
					:carType="carType"
					:carTypeYear="carTypeYear"
					:carTypeYearProduct="carTypeYearProduct"
					:imageUrl="imageUrl"
					:isManager="isManager"
					:currentCompany="currentCompany"
					@getCarsMethod="getCarsMethod"
				/>
				
				<!-- <CarInsuranceInfo :orderDetail="orderDetail" v-if="orderDetail.bindedCar === 1 && orderDetail.carInfo && orderDetail.carInfo.insuranceList.length" /> -->
			
				<PickUpCarInfo :orderDetail="orderDetail" :userId="currentCompany.userId" @refresh="getOrderDetailMethod" v-if="orderDetail.status == 5 || orderDetail.status == 6 || orderDetail.status == 7" />
				
				<EmergencyInfo :orderDetail="orderDetail" v-if="orderDetail.emergencyContactName" />
				
				<ConfigInfo :orderDetail="orderDetail" v-if="orderDetail.configRespVo && orderDetail.configRespVo.details && orderDetail.configRespVo.details.length" />
				
				<DecorateInfo :orderDetail="orderDetail" v-if="orderDetail.orderSource === 2" />
			
			</view>
			
		</view>
		
		<view style="width:100%;padding:0 32rpx;margin-top:32px;">
			<view class="btn-group" v-if="orderDetail.status == 16">
				<view class="btn" @click="handleRefuseOrder">拒绝接单</view>
				<view class="btn primary-btn" @click="handleOrder(1)">同意接单</view>
			</view>
			<view v-if="orderDetail.status == 1 && (!orderDetail.carSubscribeContract || orderDetail.carSubscribeContract.isMerchantSign == 0)" @click="contractFn" class="bottomBtn">
				线上签约
			</view>
			<view @click="getCarsMethod" v-if="orderDetail.status == 3 && orderDetail.newType == 1 && (!orderDetail.carId || !(orderDetail.carInfo && orderDetail.carInfo.deliveryCarPicsMap.length))" class="bottomBtn">
				绑定车辆
			</view>
			<view v-if="orderDetail.status == 13" @click="confirmCarPlateDate" class="bottomBtn">
				{{orderDetail.predictPlateTime ? '修改上牌信息' : '预计上牌完成日期'}}
			</view>
			<view v-if="orderDetail.status == 5 && orderDetail.deliveryCheckInfo && orderDetail.canDeliveryConfirm === 0">
				<view style="color: #FF0000;font-size: 14px;padding-bottom:12px;">
					用户确认验车信息并完成付款后，即可确认交车
				</view>
				<view class="bottomBtn" style="background: rgba(65, 112, 238, 0.5);">
					确认交车
				</view>
			</view>
			<view v-if="orderDetail.status == 5 && orderDetail.deliveryCheckInfo && orderDetail.canDeliveryConfirm === 1" class="bottomBtn" @click="delivery">
				确认交车
			</view>
			<view v-if="orderDetail.status == 5 && !orderDetail.deliveryCheckInfo" @click="getCarInShopMethod" class="bottomBtn">
				交付验车
			</view>
			<!-- <view v-if="(orderDetail.status == 10 || orderDetail.status == 1)  && orderDetail.orderSource === 2" @click="setQuality" class="bottomBtn">
				精品/装潢
			</view> -->
		</view>
		
		<CheckCarPopup
			:show.sync="showPopup"
			:powerMode="orderDetail.powerMode"
			:mileage="mileage"
			:tankSize="tankSize"
			:carId="orderDetail.carId"
			:newType="newType"
			:orderId="id"
			:category="category"
			:orderDetail="orderDetail"
		/>
	</view>
</template>

<script>
import OrderInfo from './components/OrderInfo.vue'
import BasicInfo from './components/BasicInfo.vue'
import ServiceInfo from './components/ServiceInfo.vue'
import CarInfo from './components/CarInfo.vue'
import CarInsuranceInfo from './components/CarInsuranceInfo.vue'
import PickUpCarInfo from './components/PickUpCarInfo.vue'
import EmergencyInfo from './components/EmergencyInfo.vue'
import ConfigInfo from './components/ConfigInfo.vue'
import DecorateInfo from './components/DecorateInfo.vue'
import BindCarListPopup from './components/BindCarListPopup.vue'
import CheckCarPopup from './components/CheckCarPopup.vue'	

export default {
	components: {
		OrderInfo,
		BasicInfo,
		ServiceInfo,
		CarInfo,
		CarInsuranceInfo,
		PickUpCarInfo,
		EmergencyInfo,
		ConfigInfo,
		DecorateInfo,
		BindCarListPopup,
		CheckCarPopup,
	},
	
	data() {
		return {
			showPopup: false,
			orderDetail: null,
			id: null,
			carId: null,
			newType: null,
			carBrandInfo: '',
			carYearTypeInfo: '',
			carBrand: '',
			carType: '',
			carTypeYear: '',
			carTypeYearProduct: '',
			imageUrl: '',
			// 0待支付订金、1待签约、2已签约，待支付（月付：押金、一次性付：订阅费用）、3备车中、4待支付订阅费用（仅限月付使用）、5待交车、6订阅中、7合约结束、8已取消
			xianshi: false,
			// 顶部   车辆的信息
			carInfo: {
				image: '',
				carBrand: '',
				carYearType: '',
				monthTotal: '',
			},
			topInfo: {
				orderNum: '',
				userName: '',
				newType: '',
				limitMileage: '',
				overMileageFee: '',
				statusChain: [],
			},
			insuranceItem: [],
			show:false,
			category: null,
			mileage: '',
			tankSize: '',
			isManager: false,
			currentCompany: {},
			options: null,
		}
	},
	
	methods: {
		async contractFn(){
			let esignInfo={
					userCarSubscribeId: this.id,
					userRole: 2,
			}
			const result = await this.$getRequest(this.$url.esign, 'GET', esignInfo)
			
			if(result.code == 0) {
				const contractUrl = result.data.contractUrl || result.data
				uni.setStorageSync('url', result.data.contractUrl || result.data)
				
				const params = {
					id: this.id,
					carId: this.carId,
					newType: this.newType
				}
				uni.setStorageSync('orderSignParams', params)
				uni.navigateTo({
					url: '/pages/workspace/wxbview?from=orderSign'
				})
			}
		},
		
		handleRefuseOrder() {
			uni.showModal({
				title: '提示',
				content: '确定要拒绝这个订单吗？',
				success: async (res) => {
					if (res.confirm) {
						this.handleOrder(17)
					}
				}
			})
		},
		handleOrder(status) {
			const params = {
				orderId: this.id,
				status
			}
			uni.showLoading({
				title: '加载中',
				icon: 'none'
			})
			this.$getRequest(this.$url.saveMerchantOrderStatus, 'GET', params).then((data) => {
				if (data.code == 0) {
					this.getOrderDetailMethod()
				}
			}).finally(() => {
				uni.hideLoading()
			})
		},
		// 绑车
		getCarsMethod() {
			let carVin = ''
			let carEngineNum = ''
			let mileage = ''
			let outColor = ''
			let carId = this.orderDetail.carId || ''
			
			if (this.orderDetail.carInfo) {
				carVin = this.orderDetail.carInfo.carVin || ''
				carEngineNum = this.orderDetail.carInfo.carEngineNum || ''
				mileage = this.orderDetail.carInfo.mileage || ''
			}
			
			if (this.orderDetail.configRespVo) {
				outColor = this.orderDetail.configRespVo.outColor || ''
			}
			
			uni.navigateTo({
				url: `/order/orderInfo/bindcar?orderId=${this.id}&carId=${carId}&carTypeYearProductId=${this.orderDetail.carTypeYearProductId}&newType=${this.newType}&carBrand=${this.carBrand}&carType=${this.carType}&carTypeYear=${this.carTypeYear}&carTypeYearProduct=${this.carTypeYearProduct}&imageUrl=${this.imageUrl}&carVin=${carVin}&carEngineNum=${carEngineNum}&mileage=${mileage}&outColor=${outColor}&powerMode=${this.orderDetail.powerMode}`
			})
		},
		
		// 预计上牌完成日期
		confirmCarPlateDate() {
			let predictPlateTime = ''
			if (this.orderDetail.predictPlateTime) {
				predictPlateTime = this.orderDetail.predictPlateTime
			}
			uni.navigateTo({
				url: `/order/orderInfo/confirmCarPlateDate?orderId=${this.orderDetail.id}&predictPlateTime=${predictPlateTime}&carId=${this.orderDetail.carId}&newType=${this.orderDetail.newType}&carBrand=${this.carBrand}&carType=${this.carType}&carTypeYear=${this.carTypeYear}&carTypeYearProduct=${this.carTypeYearProduct}&imageUrl=${this.imageUrl}&carVin=${this.orderDetail.carInfo.carVin}&carEngineNum=${this.orderDetail.carInfo.carEngineNum}&mileage=${this.orderDetail.carInfo.mileage}&outColor=${this.orderDetail.carInfo.carColor}&powerMode=${this.orderDetail.carInfo.powerMode}`
			})
		},
		
		// 完成上牌
		completeCarPlate() {
			uni.navigateTo({
				url: `/order/orderInfo/uploadLicencPics?carId=${this.orderDetail.carId}&powerMode=${this.orderDetail.powerMode}&id=${this.orderDetail.id}&newOrOld=${this.orderDetail.newType}&brand=${this.carBrand}&carType=${this.carType}&carTypeYear=${this.carTypeYear}&carTypeYearProduct=${this.carTypeYearProduct}&imageUrl=${this.imageUrl}&carVin=${this.orderDetail.carInfo.carVin}&carEngineNum=${this.orderDetail.carInfo.carEngineNum}&mileage=${this.orderDetail.carInfo.mileage}&outColor=${this.orderDetail.carInfo.carColor}`
			})
			
			// uni.navigateTo({
			// 	url: `/order/orderInfo/addLicense?carId=${this.orderDetail.carId}&powerMode=${this.orderDetail.powerMode}&id=${this.orderDetail.id}&newOrOld=${this.orderDetail.newType}&brand=${this.carBrand}&carType=${this.carType}&carTypeYear=${this.carTypeYear}&carTypeYearProduct=${this.carTypeYearProduct}&imageUrl=${this.imageUrl}&carVin=${this.orderDetail.carInfo.carVin}&carEngineNum=${this.orderDetail.carInfo.carEngineNum}&mileage=${this.orderDetail.carInfo.mileage}&outColor=${this.orderDetail.carInfo.carColor}`
			// })
		},
		
		delivery() {
			uni.navigateTo({
				url: `/order/orderInfo/delivery?orderId=${this.orderDetail.id}&carPersonImage=${this.orderDetail.carPersonImage}&username=${this.orderDetail.userName}`
			})
		},
		
		setQuality() {
			uni.navigateTo({
				url: `/order/orderInfo/setQuality?orderId=${this.orderDetail.id}&brand=${this.carBrand}&carType=${this.carType}&carTypeYear=${this.carTypeYear}&carTypeYearProduct=${this.carTypeYearProduct}&imageUrl=${this.imageUrl}&decorateMoney=${this.orderDetail.decorateMoney}&decorate=${this.orderDetail.decorate}`
			})
		},
		
		// 车辆到店
		getCarInShopMethod() {
			this.showPopup = true
		},
		
		getScheme() {
			const params = {
				path: '/order/orderInfo/handoverOrderDetailInfo',
				query: `id=${this.id}&carId=${this.carId}&newType=${this.newType}`,
			}
			
			this.$getRequest(this.$url.getScheme, 'POST', params)
		},
	
		// 订单详情
		getOrderDetailMethod() {
			const params = {
				id: this.id,
				carId: this.carId,
				newType: this.newType
			}
			uni.showLoading({
				title: '加载中',
				icon: 'none'
			})
			this.$getRequest(this.$url.getOrderDetail, 'POST', params).then((data) => {
				if (data.code == 0) {
					this.carBrand = data.data.carTypeYearProduct.carBrand
					this.carType = data.data.carTypeYearProduct.carType
					this.carTypeYear = data.data.carTypeYearProduct.carTypeYear
					this.carTypeYearProduct = data.data.carTypeYearProduct.carTypeYearProduct
					this.imageUrl = data.data.carTypeYearProduct.imageUrl
					this.carInfo.image = data.data.carTypeYearProduct.imageUrl
					
					
					let serviceName = {
						0: '24小时救援',
						1: '送车上门'
					}
					if (data.data.safeguardService) {
						let servicname = ''
						for (let i in JSON.parse(data.data.safeguardService)) {
							if (i == JSON.parse(data.data.safeguardService).length - 1) {
								servicname += serviceName[i]
							} else {
								servicname = servicname + serviceName[i] + ','
							}

						}
						data.data.servicname = servicname
					}
					this.carInfo.carBrand = data.data.carBrandInfo
					this.carInfo.carYearType = data.data.carYearTypeInfo
					this.carInfo.monthTotal = data.data.monthTotal
					this.orderDetail = data.data
					this.status = data.data.status
					
					//this.orderDetail.status = 5
					// this.orderDetail.orderSource = 2
					// this.orderDetail.canDeliveryConfirm = 1
					//this.orderDetail.newType = 2
					
					this.topInfo.orderNum = data.data.orderNum
					this.topInfo.userName = data.data.userName
					this.topInfo.newType = data.data.newType
					this.topInfo.limitMileage = data.data.limitMileage
					this.topInfo.overMileageFee = data.data.overMileageFee
					this.topInfo.statusChain = data.data.statusChain
					this.insuranceItem = data.data.carInfo?data.data.carInfo.insuranceList:null
					this.category = data.data.status === 3 || data.data.status === 13 ? 1 : 2
					 
					const carInfo = {
						carVin: '',
						carEngineNum: '',
						carBrand: this.carBrand,
						carType: this.carType,
						carTypeYear: this.carTypeYear,
						carTypeYearProduct: this.carTypeYearProduct,
						imageUrl: this.imageUrl,
						category: this.category,
						carPlateNum: '',
						travelLicenseUrl: '',
						registerDate: '',
						configRespVo: {},
						checkInfoId: '',
						otherConfigInfo: '',
						checkInfo: '',
						deliveryInfoId: '',
						deliveryCheckInfo: '',
						createId: this.currentCompany.userId,
						carCertificateList: [],
						insuranceList: [],
					}
					
					if (data.data.carInfo) {
						this.mileage = data.data.carInfo.mileage || ''
						this.tankSize = data.data.carInfo.tankSize || ''
						carInfo.carVin = data.data.carInfo.carVin || ''
						carInfo.carEngineNum = data.data.carInfo.carEngineNum || ''
						carInfo.carPlateNum = data.data.carInfo.carPlateNum || ''
						carInfo.travelLicenseUrl = data.data.carInfo.travelLicenseUrl || ''
						carInfo.registerDate = data.data.carInfo.registerDate || ''
						carInfo.insuranceList = data.data.carInfo.insuranceList || []
					}
					
					if (data.data.configRespVo) {
						carInfo.configRespVo = data.data.configRespVo || {}
					}
					
					if (data.data.checkInfoId) {
						carInfo.checkInfoId = data.data.checkInfoId
					}
					
					if (data.data.otherConfigInfo) {
						carInfo.otherConfigInfo = JSON.parse(data.data.otherConfigInfo)
					}
					
					if (data.data.checkInfo) {
						carInfo.checkInfo = JSON.parse(data.data.checkInfo)
					}
					
					if (data.data.deliveryInfoId) {
						carInfo.deliveryInfoId = data.data.deliveryInfoId
					}
					
					if (data.data.deliveryCheckInfo) {
						carInfo.deliveryCheckInfo = JSON.parse(data.data.deliveryCheckInfo)
					}
					
					if (data.data.carCertificateList && data.data.carCertificateList.length) {
						carInfo.carCertificateList = data.data.carCertificateList
					}
					
					uni.setStorageSync('orderCarInfo',carInfo)
					
					let carPicsMap = []
					if (data.data.carInfo && data.data.carInfo.checkCarPicsMap) {
						carPicsMap = data.data.carInfo.checkCarPicsMap
					}
					uni.setStorageSync('carPicsMap',carPicsMap)
					
					let deliveryCarPicsMap = []
					if (data.data.carInfo && data.data.carInfo.deliveryCarPicsMap) {
						deliveryCarPicsMap = data.data.carInfo.deliveryCarPicsMap
					}
					uni.setStorageSync('deliveryCarPicsMap',deliveryCarPicsMap)
					
				}
			}).finally(() => {
				uni.hideLoading()
			})
		},
	},
	onShow(){
		this.getOrderDetailMethod()
	},
	onLoad(option) {
		this.id = option.id
		this.carId = option.carId
		this.newType = option.newType
		
		const value = uni.getStorageSync('current_company')
		if (value) {
			this.currentCompany = value
			
			// 9.超级管理员  2.总经理  3.销售总监  4.销售
			this.isManager = value.company.roleList.some(item => item.id === 9 || item.id === 2 || item.id === 3)
			
			
		}
		
		this.getScheme()
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page {
	padding: 16px 0 40px;
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
			margin-right: 10rpx;
		}
		.car-brand-wrap {
			flex: 1;
			padding-right: 32rpx;
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
	
	.step-wrap {
		margin-top: 24px;
	}
	
	.container {
		margin-top: 16px;
		padding: 0 32rpx;
	}
	
	.btn-group {
		display: flex;
		justify-content: space-around;
		.btn {
			width: 330rpx;
			height: 116rpx;
			border-radius: 16rpx;
			background: #F7F8FA;
			font-size: 17px;
			color: #1D2129;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.primary-btn {
			background: #4170EE;
			color: #FFFFFF;
		}
	}
}	
	
	
	.bottomBtn{
		background-color: #4170EE;
		color: #fff;
		text-align: center;
		border-radius: 8px;
		width: 100%;
		height: 116rpx;
		line-height: 116rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 17px;
	}
	
.flex-center {
	display: flex;
	align-items: center;
}

.car-tabbar-title {
	font-size: 28rpx;
	color: #4E5969;
}

.m-left {
	margin-left: 40rpx;
}

.left-col {
	color: #86909C;
}

.font-col {
	font-family: PingFangSC-Regular;
}

.foot-but {
	position: fixed;
	left: 40rpx;
	right: 40rpx;
	z-index: 1;
	margin: 0 auto;
	z-index: 111;
	bottom: 60rpx;
}

.f-right {
	float: right;
}

.font-24 {
	font-size: 24rpx;
}

.margin-top-16 {
	margin-top: 16rpx;
}

.m-brand-scroll {
	width: 100%;
	overflow: hidden;
	white-space: nowrap;

	.m-item {
		width: 22.22%;
		display: inline-block;
		align-items: center;
	}
}

.brand {
	color: rgba(10, 15, 45, 0.8);
	font-size: 24rpx;
	margin-top: 4rpx;
}

.bindBtn {
	position: fixed;
	bottom: 26rpx;
	right: 0;
	left: 0;
	margin: 0 auto;
	width: 80%;
	text-align: center;
	background: #4170EE;
	height: 107rpx;
	border-radius: 16rpx;
	line-height: 107rpx;
	font-size: 34rpx;
	color: #FFFFFF
}



	.top-cow {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20rpx;

		.left-col {
			display: flex;
			align-items: center;

			image {
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
			}
		}

		.right-col {
			border-radius: 20rpx;
			background: #D8D8D8;

			text {
				font-family: PingFangSC-Regular;
				font-size: 24rpx;
				color: #3D3D3D;
				text-align: center;
				padding: 8rpx 10rpx;
			}
		}
	}

	.top-car-info {
		margin: 30rpx 6rpx 40rpx 6rpx;
		display: flex;
		align-items: center;
		width: 100%;

		.img {
			width: 40%;

			image {
				width: 224rpx;
				height: 106rpx;
			}
		}

		.info {
			width: 52%;
			maring-left: 20rpx;

			.brand {
				font-size: 32rpx;
				color: #333333;
			}

			.time {
				border-radius: 8rpx;
				background: #F7F7F7;
				padding: 4rpx 20rpx;
				font-size: 24rpx;
				color: #666666;
			}
		}
	}


		.order-content {
			padding: 20rpx 12rpx 20rpx 16rpx;
			margin-top: 26rpx;
			border-radius: 24rpx;
			box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02),
				0px 8px 24px rgba(10, 15, 45, 0.06);

			.o-c-t {
				.o-content-title {
					font-size: 34rpx;
					position: relative;
					padding-left: 20rpx;
				}

				.o-content-title:before {
					content: "";
					position: absolute;
					width: 4rpx;
					height: 28rpx;
					border-radius: 4rpx;
					background-color: #0AEB7D;
					top: 10rpx;
					left: 4rpx;
				}
			}

			.order-self {
				margin-top: 20rpx;
				padding-left: 16rpx;

				.o-content-row {
					line-height: 2.2;
				}
			}
		}

		.basic-info {
			min-height: 300rpx;
			padding: 20rpx 12rpx 20rpx 16rpx;
			margin-top: 32rpx;
			border-radius: 24rpx;
			box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02),
				0px 8px 24px rgba(10, 15, 45, 0.06);

			.o-c-t {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.o-content-title {
					font-size: 34rpx;
					position: relative;
					padding-left: 20rpx;
				}

				.o-content-title:before {
					content: "";
					position: absolute;
					width: 4rpx;
					height: 28rpx;
					border-radius: 4rpx;
					background-color: #0AEB7D;
					top: 10rpx;
					left: 4rpx;
				}
			}

			.order-self {
				margin-top: 16rpx;
				padding-left: 16rpx;

				.o-content-row {
					line-height: 2.2;
				}
			}
		}
		
	
</style>
