<template>
	<view class="page-wrap">
		<view class="custom-header">
			<view
			    class="status-bar"
			    :style="{ height: custom.top + 'px' }"
			/>
			<view class="nav">
				<view class="back-btn" @click="back">
					<u-icon name="arrow-left" color="rgba(0, 0, 0, 0.9)" size="48"></u-icon>
				</view>
				{{createData.carId ? '修改二手车' : '添加二手车'}}
			</view>
		</view>
		
		<view class="header" :style="{marginTop: custom.top + 32 + 'px'}">
			<view class="left">
				<view class="car-brand-wrap">
					<view class="brand">{{carProductInfo.brandName}} {{carProductInfo.carType}}</view>
					<view class="car-type">
						{{carProductInfo.carTypeYear}} {{carProductInfo.carTypeYearProduct}}
					</view>
				</view>
			</view>
			<view class="right">
				<image
					class="car-img"
					:src="productEntity.imageUrl"
					mode="widthFix"
				/>
			</view>
		</view>
		
		<view class="create-plan-wrap">
			<OldCarStep1
				v-if="currentStep == 0"
				:createData="createData"
				@nextStep="nextStep"
			/>
			
			<OldCarStep2
				v-if="currentStep == 1"
				:createData="createData"
				@prevStep="prevStep"
				@save="save"
			/>
			
			<!-- <OldCarStep3
				v-if="currentStep == 2"
				:createData="createData"
				@prevStep="prevStep"
				@save="save"
			/> -->
		</view>
	</view>
</template>

<script>
import OldCarStep1 from './components/OldCarStep1.vue'
import OldCarStep2 from './components/OldCarStep2.vue'
import OldCarStep3 from './components/OldCarStep3.vue'

const app = getApp()
export default {
	components: {
		OldCarStep1,
		OldCarStep2,
		OldCarStep3,
	},
	data() {
		return {
			custom: app.globalData.custom,
			createData: {
				carId: null, // 车辆ID
				carTypeYearProductId: 0, // 车型配置ID
				newOrOld: 2, // 1.新车，2.二手车
				
				// 以下为用户输入
				travelLicenseUrl: '', // 行驶证图片地址
				carPlateNum: '', // 车牌号
				carVin: '', // 车架号
				carEngineNum: '', // 发动机号
				registerDate: '', // 车辆注册日期
				mileage: '', // 车辆里程
				/*
					"specificLocationCarPicsList": [
							{
								"carPicList": [
									{
										"fileId": 0,
										"remark": "",
										"url": ""
									}
								],
								"carPicsType": 0
							}
						],
				*/
				specificLocationCarPicsList: [
					{carPicsType: 0, carPicList: []},
					{carPicsType: 1, carPicList: []},
					{carPicsType: 3, carPicList: []},
					{carPicsType: 5, carPicList: []},
					{carPicsType: 7, carPicList: []},
					{carPicsType: 2, carPicList: []},
					{carPicsType: 4, carPicList: []},
					{carPicsType: 6, carPicList: []},
					{carPicsType: 8, carPicList: []},
				], // 车辆图片
				/*
					colors: [
						{
							colorName: "",
							colorNum: "",
							hasCheck: 0, // 是否选择，1是选择，0未选择，默认未选择
							money: 0
						}
					],
				*/
				dealerReferencePrice: undefined, // 车辆售价
				transcationNum: undefined, // 过户次数
				otherConfigList: [ // 汽车增配项集合
					{
						details: [
							{
								id: 1,
								detailName: "", // 名称
								hasCheck: 1, // 是否选择，1是选择，0未选择
								money: undefined // 价格
							},
						],
					}
				],
				carColor: '', // 外观颜色
				trimColor: '', // 内饰颜色
				plateDate: '', // 上牌日期
				accessReportUrl: '', // 评估报告
			},
			carProductInfo: {
				brandId: null,
				brandName: null,
				carTypeId: null,
				carType: null,
				carTypeYearId: null,
				carTypeYear: null,
				carTypeYearProductId: null,
				carTypeYearProduct: null,
			},
			currentStep: 0,
			stepList: [
				{
					name: '上传行驶证'
				}, 
				{
					name: '上传车辆照片'
				},
				{
					name: '设置其他'
				},
			],
			productEntity: {},
			detailColors: [],
			status: null,
			businessType: 1,  // 1.车辆  2.竞拍
		}
	},
	
	onLoad(options) {
		this.businessType = options.businessType || 1
		if(options.id) {
			this.createData.carId = options.id
			const value = uni.getStorageSync('old_car_detail')
			if (value) {
				const detail = JSON.parse(value)
				this.status = detail.status
				this.carProductInfo.brandId = detail.carBrandId
				this.carProductInfo.brandName = detail.carBrand
				this.carProductInfo.carTypeId = detail.carTypeId
				this.carProductInfo.carType = detail.carType
				this.carProductInfo.carTypeYearId = detail.carTypeYearId
				this.carProductInfo.carTypeYear = detail.carTypeYear
				this.carProductInfo.carTypeYearProductId = detail.carTypeYearProductId
				this.createData.carTypeYearProductId = detail.carTypeYearProductId
				this.carProductInfo.carTypeYearProduct = detail.carTypeYearProduct
				
				this.createData.travelLicenseUrl =  detail.travelLicenseUrl // 行驶证图片地址
				this.createData.carPlateNum =  detail.carPlateNum // 车牌号
				this.createData.carVin =  detail.carVin // 车架号
				this.createData.carEngineNum =  detail.carEngineNum // 发动机号
				this.createData.registerDate =  detail.regDate // 车辆注册日期
				this.createData.mileage =  detail.mileage // 车辆里程s
				
				// 车辆图片
				this.createData.specificLocationCarPicsList.forEach(item => {
					const cur = detail.carPicsMap[item.carPicsType]
					if(cur && cur.length) {
						item.carPicList = cur
					}
				})
				
				this.createData.dealerReferencePrice =  detail.dealerReferencePrice // 车辆售价
				this.createData.transcationNum =  detail.transcationNum // 过户次数
				if (detail.otherConfigList && detail.otherConfigList.length) {
					this.createData.otherConfigList =  detail.otherConfigList // 汽车增配项集合
				}
				
				this.createData.carColor =  detail.carColor // 外观颜色
				this.createData.trimColor =  detail.trimColor // 内饰颜色
				this.createData.plateDate =  detail.plateDate // 上牌日期
				this.createData.accessReportUrl =  detail.accessReportUrl // 评估报告
			}
		} else {
			if(options.brandId) {
				this.carProductInfo.brandId = options.brandId
			}
			
			if(options.brandName) {
				this.carProductInfo.brandName = options.brandName
			}
			
			if(options.carTypeId) {
				this.carProductInfo.carTypeId = options.carTypeId
			}
			
			if(options.carType) {
				this.carProductInfo.carType = options.carType
			}
			
			if(options.carTypeYearId) {
				this.carProductInfo.carTypeYearId = options.carTypeYearId
			}
			
			if(options.carTypeYear) {
				this.carProductInfo.carTypeYear = options.carTypeYear
			}
			
			if(options.carTypeYearProductId) {
				this.carProductInfo.carTypeYearProductId = options.carTypeYearProductId
				this.createData.carTypeYearProductId = options.carTypeYearProductId
			}
			
			if(options.carTypeYearProduct) {
				this.carProductInfo.carTypeYearProduct = options.carTypeYearProduct
			}
		}
		
		this.init()
	},
	
	methods: {
		init() {
			this.getCarConfigAndColor()
		},
		
		async getCarConfigAndColor() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				id: this.carProductInfo.carTypeYearProductId,
			}
			
			const res = await this.$getRequest(this.$url.getCarColor, "GET", params)
			
			if (res.code == 0) {
				this.productEntity = res.data.productEntity
			}
			
			uni.hideLoading()
		},
		
		prevStep(data) {
			this.currentStep = data.step
			
			// from step 2
			if (data.specificLocationCarPicsList) {
				this.createData.specificLocationCarPicsList = data.specificLocationCarPicsList
			}
			
			// from step 3
			if (data.dealerReferencePrice) {
				this.createData.dealerReferencePrice = data.dealerReferencePrice
			}
			
			if (data.transcationNum) {
				this.createData.transcationNum = data.transcationNum
			}
			
			if (data.otherConfigs) {
				this.createData.otherConfigList[0].details = data.otherConfigs
			}
			
		},
		
		nextStep(data) {
			this.currentStep = data.step
			
			// from step 1
			if (data.travelLicenseUrl) {
				this.createData.travelLicenseUrl = data.travelLicenseUrl
			}
			
			if (data.registerDate) {
				this.createData.registerDate = data.registerDate
			}
			
			if (data.carVin) {
				this.createData.carVin = data.carVin
			}
			
			if (data.carEngineNum) {
				this.createData.carEngineNum = data.carEngineNum
			}
			
			if (data.carPlateNum) {
				this.createData.carPlateNum = data.carPlateNum
			}
			
			if (data.plateDate) {
				this.createData.plateDate = data.plateDate
			}
			
			if (data.mileage) {
				this.createData.mileage = data.mileage
			}
			
			if (data.transcationNum) {
				this.createData.transcationNum = data.transcationNum
			}
			
			if (data.carColor) {
				this.createData.carColor = data.carColor
			}
			
			if (data.trimColor) {
				this.createData.trimColor = data.trimColor
			}
			
			if (data.plateDate) {
				this.createData.plateDate = data.plateDate
			}
			
			if (data.accessReportUrl) {
				this.createData.accessReportUrl = data.accessReportUrl
			}
			
			if (data.otherConfigs) {
				this.createData.otherConfigList[0].details = data.otherConfigs.filter(item => item.detailName)
			}
			
			// this.save()
			
		},
		
		save(data) {
			if (data && data.specificLocationCarPicsList) {
				this.createData.specificLocationCarPicsList = data.specificLocationCarPicsList
			}
			
			if (this.createData.carId) {
				this.updateCar()
			} else {
				this.saveCar()
			}
		},
		
		async saveCar() {
			uni.showLoading({
				title: '保存中'
			})
			
			const res = await this.$getRequest(this.$url.addCarAtLastPage, "POST", this.createData)
			
			if (res.code == 0) {
				this.createData.carId = res.data.carId
				uni.showToast({
					title: '保存成功',
					duration: 2000,
					icon: 'none'
				})
				
				if (this.businessType == 2) {
					uni.reLaunch({
						url: `/auction/cars/setAuctionInfo?carId=${res.data.carId}&carTypeId=${this.carProductInfo.carTypeId}&carTypeYearId=${this.carProductInfo.carTypeYearId}&carTypeYearProductId=${this.createData.carTypeYearProductId}`
					})
				} else {
					uni.reLaunch({
						url: `/pages/car/createSuccess?operator=1&id=${res.data.carId}&type=2&imgUrl=${this.productEntity.imageUrl}&brandId=${this.carProductInfo.brandId}&brandName=${this.carProductInfo.brandName}&carTypeId=${this.carProductInfo.carTypeId}&carType=${this.carProductInfo.carType}&carTypeYearId=${this.carProductInfo.carTypeYearId}&carTypeYear=${this.carProductInfo.carTypeYear}&carTypeYearProductId=${this.createData.carTypeYearProductId}&carTypeYearProduct=${this.carProductInfo.carTypeYearProduct}`
					})
				}
			} else {
				uni.showToast({
					title: res.msg,
					duration: 2000,
					icon: 'none'
				})
			}
			
			uni.hideLoading()
		},
		
		async updateCar() {
			uni.showLoading({
				title: '修改中'
			})
			
			const res = await this.$getRequest(this.$url.updateNewCarInfo, "POST", this.createData)
			
			if (res.code == 0) {
				uni.showToast({
					title: '修改成功',
					duration: 2000,
					icon: 'none'
				})
				
				uni.reLaunch({
					url: `/pages/car/createSuccess?operator=2&id=${this.createData.carId}&type=2&imgUrl=${this.productEntity.imageUrl}&brandId=${this.carProductInfo.brandId}&brandName=${this.carProductInfo.brandName}&carTypeId=${this.carProductInfo.carTypeId}&carType=${this.carProductInfo.carType}&carTypeYearId=${this.carProductInfo.carTypeYearId}&carTypeYear=${this.carProductInfo.carTypeYear}&carTypeYearProductId=${this.createData.carTypeYearProductId}&carTypeYearProduct=${this.carProductInfo.carTypeYearProduct}&status=${this.status}`
				})
			} else {
				uni.showToast({
					title: res.msg,
					duration: 2000,
					icon: 'none'
				})
			}
			
			uni.hideLoading()
		},
		
		back() {
			let content = '您的车辆尚未创建完毕，确认要退出吗？'
			
			if(this.createData.id) {
				content = '您的车辆尚未修改完毕，确认要退出吗？'
			}
			
			uni.showModal({
				title: '提示',
				content,
				success: (res) => {
					if (res.confirm) {
						uni.navigateBack({
							delta: 1
						})
					}
				}
			})
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	padding-top: 0;
}

.header {
	padding-top: 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.left {
		flex: 1;
		padding-right: 20rpx;
		.car-brand-wrap {
			display: flex;
			flex-direction: column;
		}
		.brand {
			font-size: 16px;
			font-weight: 500;
			line-height: 24px;
			color: #1D2129;
		}
		.car-type {
			margin-top: 2px;
			font-size: 12px;
			line-height: 18px;
			color: #86909C;
		}
	}
	.right {
		.car-img {
			width: 224rpx;
		}
	}
}

</style>
