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
				{{createData.carId ? '修改全新车' : '添加全新车'}}
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
					:src="carProductInfo.imgUrl"
					mode="widthFix"
				/>
			</view>
		</view>
		<view class="step-wrap">
			<u-steps 
				:list="stepList" 
				:current="currentStep"
				un-active-color="#86909C"
				active-color="#1D2129"
			></u-steps>
		</view>
		
		<view class="create-plan-wrap">
			<NewCarStep1
				v-if="currentStep == 0"
				:createData="createData"
				@nextStep="nextStep"
			/>
			
			<NewCarStep2
				v-if="currentStep == 1"
				:createData="createData"
				@prevStep="prevStep"
				@save="save"
			/>
		</view>
	</view>
</template>

<script>
import NewCarStep1 from './components/NewCarStep1.vue'
import NewCarStep2 from './components/NewCarStep2.vue'

const app = getApp()
export default {
	components: {
		NewCarStep1,
		NewCarStep2,
	},
	data() {
		return {
			custom: app.globalData.custom,
			createData: {
				carId: null, // 车辆ID
				carTypeYearProductId: 0, // 车型配置ID
				newOrOld: 1, // 1.新车，2.二手车
				
				// 以下为用户输入
				carVin: '', // 车架号
				carEngineNum: '', // 发动机号
				mileage: '', // 车辆里程
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
				colorConfigList: [], // 外置颜色集合
				carColor: '', // 选择的外置颜色
				trimColorConfigList: [], // 内饰颜色集合
				trimColor: '', // 选择的内饰颜色
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
				imgUrl: null,
			},
			currentStep: 0,
			stepList: [
				{
					name: '上传车辆信息'
				}, 
				{
					name: '设置颜色及增配'
				},
			],
			productEntity: {},
			detailColors: [],
		}
	},
	
	onLoad(options) {
		if(options.id) {
			this.createData.carId = options.id
			const value = uni.getStorageSync('new_car_detail')
			if (value) {
				const detail = JSON.parse(value)
				this.carProductInfo.brandId = detail.carBrandId
				this.carProductInfo.brandName = detail.carBrand
				this.carProductInfo.carTypeId = detail.carTypeId
				this.carProductInfo.carType = detail.carType
				this.carProductInfo.carTypeYearId = detail.carTypeYearId
				this.carProductInfo.carTypeYear = detail.carTypeYear
				this.carProductInfo.carTypeYearProductId = detail.carTypeYearProductId
				this.createData.carTypeYearProductId = detail.carTypeYearProductId
				this.carProductInfo.carTypeYearProduct = detail.carTypeYearProduct
				this.carProductInfo.imgUrl = detail.imageUrl
				
				this.createData.carVin =  detail.carVin // 车架号
				this.createData.carEngineNum =  detail.carEngineNum // 发动机号
				this.createData.mileage =  detail.mileage // 车辆里程
				this.createData.carColor =  detail.carColor // 选择的外置颜色
				this.createData.trimColor =  detail.trimColor // 选择的内饰颜色
				
				if (detail.otherConfigList && detail.otherConfigList.length) {
					this.createData.otherConfigList =  detail.otherConfigList // 汽车增配项集合
				}
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
			
			if(options.imgUrl) {
				this.carProductInfo.imgUrl = options.imgUrl
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
				this.createData.colorConfigList = res.data.outColors
				this.createData.trimColorConfigList = res.data.inColors
				this.productEntity = res.data.productEntity
				
				if (this.createData.carId) {
					this.createData.colorConfigList.forEach(item => {
						if(this.createData.carColor === item.colorName) {
							item.hasCheck = 1 // 是否选择，1是选择，0未选择，默认未选择
						}
					})
					this.createData.trimColorConfigList.forEach(item => {
						if(this.createData.trimColor === item.colorName) {
							item.hasCheck = 1 // 是否选择，1是选择，0未选择，默认未选择
						}
					})
				}
			}
			
			uni.hideLoading()
		},
		
		prevStep(data) {
			this.currentStep = data.step
			
			// from step 2
			this.createData.carColor = data.carColor
			this.createData.trimColor = data.trimColor
			this.createData.otherConfigList[0].details = data.otherConfigs
			this.createData.colorConfigList = data.colorConfigList
			this.createData.trimColorConfigList = data.trimColorConfigList
		},
		
		nextStep(data) {
			this.currentStep = data.step
			
			this.createData.carVin = data.carVin
			this.createData.carEngineNum = data.carEngineNum
			this.createData.mileage = data.mileage
		},
		
		save(data) {
			this.createData.carColor = data.carColor
			this.createData.trimColor = data.trimColor
			this.createData.otherConfigList[0].details = data.otherConfigs
			this.createData.colorConfigList = data.colorConfigList
			this.createData.trimColorConfigList = data.trimColorConfigList
			
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
			uni.hideLoading()
			if (res.code == 0) {
				uni.showToast({
					title: '保存成功',
					duration: 2000,
					icon: 'none'
				})
				uni.reLaunch({
					url: `/pages/car/createSuccess?operator=1&id=${res.data.carId}&type=1&imgUrl=${this.productEntity.imageUrl}&brandName=${this.carProductInfo.brandName}&carType=${this.carProductInfo.carType}&carTypeYear=${this.carProductInfo.carTypeYear}&carTypeYearProduct=${this.carProductInfo.carTypeYearProduct}`
				})
			} else {
				uni.showToast({
					title: res.msg,
					duration: 2000,
					icon: 'none'
				})
			}
			
			
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
					url: `/pages/car/createSuccess?operator=2&id=${this.createData.carId}&type=1&imgUrl=${this.productEntity.imageUrl}&brandName=${this.carProductInfo.brandName}&carType=${this.carProductInfo.carType}&carTypeYear=${this.carProductInfo.carTypeYear}&carTypeYearProduct=${this.carProductInfo.carTypeYearProduct}`
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

.header {
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
			width: 340rpx;
			margin-right: -30rpx;
		}
	}
}

.create-plan-wrap {
	margin-top: 20px;
}
</style>
