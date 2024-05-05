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
				{{createData.id ? '修改方案' : '创建方案'}}
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
				<view class="price-wrap">
					<view class="tip">售价</view>
					<view class="price">{{formatTenThousandNumber(productEntity.guidancePrice)}}</view>
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
		<view class="step-wrap">
			<u-steps 
				:list="stepList" 
				:current="currentStep"
				un-active-color="#86909C"
				active-color="#1D2129"
			></u-steps>
		</view>
		
		<view class="create-plan-wrap">
			<PlanStep1 
				v-if="currentStep == 0 && createData.financeSchemeId"
				:type="2"
				:createData="createData"
				@nextStep="nextStep"
			/>
			
			<PlanStep2
				v-if="currentStep == 1"
				:type="2"
				:createData="createData"
				@prevStep="prevStep"
				@save="save"
			/>
			
			<!-- <PlanStep4
				v-if="currentStep == 2"
				:type="2"
				:createData="createData"
				@prevStep="prevStep"
				@save="save"
			/> -->
		</view>
	</view>
</template>

<script>
import { formatTenThousandNumber } from '@/utils/index.js'
import PlanStep1 from './components/PlanStep1.vue'
import PlanStep2 from './components/PlanStep2.vue'
import PlanStep3 from './components/PlanStep3.vue'
import PlanStep4 from './components/PlanStep4.vue'

const app = getApp()
export default {
	components: {
		PlanStep1,
		PlanStep2,
		PlanStep3,
		PlanStep4,
	},
	data() {
		return {
			custom: app.globalData.custom,
			createData: {
				applyService: 3,
				secondHandCarId: null, // 车辆ID
				id: null, // 方案ID
				carTypeYearProductId: 0, // 车型配置ID
				financeCompanyId: 0, // 金融方公司id
				financeSchemeId: 0, // 金融方案ID
				financeSchemeName: "", // 金融方案名称
				productSchemeName: "", // 方案名称
				monthTotal: 6, // 订阅期数
				newType: 2, // 1.新车，2.二手车
				paymentType: 0, // 支付方式：0一次性付清、1月付、2季付、3年付、4全款	
				templateId: null, // 模板ID
				templateName: "", // 模板名称
				
				// 以下为用户输入
				buyoutsFee: undefined, // 买断金额
				carSubscribeFreeServiceList: [ // 赠送免费服务集合
					{
						serviceName: "免费大保养",
						size: 1,
						isChecked: false,
					},
					{
						serviceName: "免费小保养",
						size: 1,
						isChecked: false,
					},
					{
						serviceName: "免费洗车",
						size: 1,
						isChecked: false,
					},
					{
						serviceName: "美容装饰",
						isChecked: false,
					},
				], 
				safeguardServices: [ // 保障服务集合，0、免费送车上门，1、2*24小时道路救援
					{
						id: 0,
						serviceName: "免费送车上门",
						isChecked: false,
					},
					{
						id: 1,
						serviceName: "7x24小时 道路救援",
						isChecked: false,
					},
				], 
				distributionBrokerage: undefined, // 分销佣金
				nakedCarPrice: undefined, // 裸车价格
				limitMileage: undefined, // 里程限制
				overMileageFee: undefined, // 超出里程费用（元/公里）
				firstPeriodRate: 9.6,
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
					name: '设置方案'
				}, 
				{
					name: '设置其他'
				}, 
				// {
				// 	name: '设置分销佣金'
				// }, 
			],
			productEntity: {},
			detailColors: [],
		}
	},
	
	onLoad(options) {
		if(options.id) {
			this.createData.id = options.id
			const value = uni.getStorageSync('plan_detail')
			if (value) {
				const detail = JSON.parse(value)
				this.carProductInfo.brandId = detail.carType.carBrandId
				this.carProductInfo.brandName = detail.carType.carBrand
				this.carProductInfo.carTypeId = detail.carType.carTypeId
				this.carProductInfo.carType = detail.carType.carType
				this.carProductInfo.carTypeYearId = detail.carType.carTypeYearId
				this.carProductInfo.carTypeYear = detail.carType.carTypeYear
				this.carProductInfo.carTypeYearProductId = detail.carType.id
				this.createData.carTypeYearProductId = detail.carType.id
				this.carProductInfo.carTypeYearProduct = detail.carType.carTypeYearProduct
				
				this.createData.financeCompanyId =  detail.financeCompanyId // 金融方公司id
				this.createData.financeSchemeId = detail.financeSchemeId // 金融方案ID
				this.createData.financeSchemeName = detail.financeSchemeName // 金融方案名称
				this.createData.productSchemeName = detail.productSchemeName // 方案名称
				this.createData.monthTotal = detail.monthTotal // 订阅期数
				this.createData.paymentType = detail.paymentType // 支付方式：0一次性付清、1月付、2季付、3年付、4全款	
				this.createData.templateId = detail.templateId // 模板ID
				this.createData.buyoutsFee = detail.buyoutsFee // 买断金额
				// 赠送免费服务集合
				this.createData.carSubscribeFreeServiceList.forEach(item => {
					const checkedItem = detail.carSubscribeFreeServiceList.find(service => service.serviceName === item.serviceName)
					if (checkedItem) {
						item.isChecked = true
						if (checkedItem.size) {
							item.size = checkedItem.size
						}
					}
				})
				// 保障服务集合，0、免费送车上门，1、2*24小时道路救援
				detail.safeguardServices.forEach(item => {
					this.createData.safeguardServices[item].isChecked = true
				})
				this.detailColors = detail.colors // 外置颜色集合
				this.createData.distributionBrokerage = detail.distributionBrokerage // 分销佣金
				this.createData.nakedCarPrice = detail.nakedCarPrice // 裸车价格
				if (detail.otherConfigs && detail.otherConfigs.length) {
					this.createData.otherConfigs =  detail.otherConfigs // 汽车增配项集合
				}
				
				this.createData.limitMileage = detail.limitMileage // 里程限制
				this.createData.overMileageFee = detail.overMileageFee // 超出里程费用（元/公里）
				this.createData.firstPeriodRate = detail.firstPeriodRate // 首期摊销比列
				this.createData.secondHandCarId = detail.secondCarId
			}
		} else {
			if(options.secondHandCarId) {
				this.createData.secondHandCarId = options.secondHandCarId
			}
			
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
		
		console.log('this.createData', this.createData)
		
		this.init()
	},
	
	methods: {
		init() {
			this.getCarConfigAndColor()
			
			if (!this.createData.id) {
				this.getProductTemplate()
				//this.getFinancialScheme()
			}
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
				this.createData.colors = res.data.outColors
				this.productEntity = res.data.productEntity
				
				if (this.createData.id) {
					this.createData.colors.forEach(item => {
						if(this.detailColors.includes(item.colorName)) {
							item.hasCheck = 1 // 是否选择，1是选择，0未选择，默认未选择
						}
					})
				}
			}
			
			uni.hideLoading()
		},
		
		async getProductTemplate() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				newOrOld: this.createData.newType,
			}
			
			const res = await this.$getRequest(this.$url.getProductTemplate, "GET", params)
			
			if (res.code == 0) {
				this.createData.templateId = res.data[0].id
				this.createData.templateName = res.data[0].templateName
				this.createData.financeSchemeName = res.data[0].templateName
				this.createData.productSchemeName = res.data[0].templateName
				//this.createData.monthTotal = res.data[0].otherPropertyDto.subscriptionPeriodArrayOldCar[0]
				this.createData.financeSchemeId = res.data[0].financialSchemeId
			}
			
			uni.hideLoading()
		},
		
		async getFinancialScheme() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				id: this.carProductInfo.carTypeYearProductId,
				monthTotal: 6,
			}
			
			const res = await this.$getRequest(this.$url.getFinancialScheme, "POST", params)
			
			if (res.code == 0 && res.data && res.data.length) {
				this.createData.financeCompanyId = res.data[0].companyId
				this.createData.financeSchemeId = res.data[0].id
				this.createData.financeSchemeName = res.data[0].schemeName
				this.createData.productSchemeName = res.data[0].schemeName
			}
			
			uni.hideLoading()
		},
		
		formatTenThousandNumber(num) {
			return formatTenThousandNumber(num)
		},
		
		prevStep(data) {
			this.currentStep = data.step
			
			// from step 2
			if (data.limitMileage) {
				this.createData.limitMileage = data.limitMileage
			}
			
			if (data.overMileageFee) {
				this.createData.overMileageFee = data.overMileageFee
			}
			
			if (data.carSubscribeFreeServiceList) {
				this.createData.carSubscribeFreeServiceList = data.carSubscribeFreeServiceList
			}
			
			if (data.safeguardServices) {
				this.createData.safeguardServices = data.safeguardServices
			}
			
			// from step 3
			if (data.otherConfigs) {
				this.createData.otherConfigs[0].details = data.otherConfigs
			}
			
			// from step 4
			if (data.distributionBrokerage) {
				this.createData.distributionBrokerage = data.distributionBrokerage
			}
		},
		
		nextStep(data) {
			this.currentStep = data.step
			
			// from step 1
			if (data.nakedCarPrice) {
				this.createData.nakedCarPrice = data.nakedCarPrice
			}
			
			if (data.buyoutsFee) {
				this.createData.buyoutsFee = data.buyoutsFee
			}
			
			// from step 2
			if (data.limitMileage) {
				this.createData.limitMileage = data.limitMileage
			}
			
			if (data.overMileageFee) {
				this.createData.overMileageFee = data.overMileageFee
			}
			
			if (data.carSubscribeFreeServiceList) {
				this.createData.carSubscribeFreeServiceList = data.carSubscribeFreeServiceList
			}
			
			if (data.safeguardServices) {
				this.createData.safeguardServices = data.safeguardServices
			}
			
			if (data.firstPeriodRate) {
				this.createData.firstPeriodRate = data.firstPeriodRate
			}
			
			// from step 3
			if (data.otherConfigs) {
				this.createData.otherConfigs[0].details = data.otherConfigs
			}
		},
		
		save(data) {
			if (data.carSubscribeFreeServiceList) {
				this.createData.carSubscribeFreeServiceList = data.carSubscribeFreeServiceList
			}
			
			if (data.safeguardServices) {
				this.createData.safeguardServices = data.safeguardServices
			}
			//this.createData.distributionBrokerage = data.distributionBrokerage
			
			if (this.createData.id) {
				this.updatePlan()
			} else {
				this.savePlan()
			}
		},
		
		async savePlan() {
			uni.showLoading({
				title: '保存中'
			})
			
			const res = await this.$getRequest(this.$url.createCarPlan, "POST", {
				...this.createData,
				carSubscribeFreeServiceList: this.createData.carSubscribeFreeServiceList.filter(item => item.isChecked),
				safeguardServices: this.createData.safeguardServices.filter(item => item.isChecked).map(item => item.id),
			})
			
			if (res.code == 0) {
				uni.showToast({
					title: '保存成功',
					duration: 2000,
					icon: 'none'
				})
				
				uni.reLaunch({
					url: `/pages/plan/createSuccess?operator=1&carId=${this.createData.secondHandCarId}&type=2&imgUrl=${this.productEntity.imageUrl}&brandName=${this.carProductInfo.brandName}&carType=${this.carProductInfo.carType}&carTypeYear=${this.carProductInfo.carTypeYear}&carTypeYearProduct=${this.carProductInfo.carTypeYearProduct}`
				})
			} else {
				uni.showToast({
					title: '保存失败',
					duration: 2000,
					icon: 'none'
				})
			}
			
			uni.hideLoading()
		},
		
		async updatePlan() {
			uni.showLoading({
				title: '修改中'
			})
			
			const res = await this.$getRequest(this.$url.updateNewCarSubscribe, "POST", {
				...this.createData,
				carSubscribeFreeServiceList: this.createData.carSubscribeFreeServiceList.filter(item => item.isChecked),
				safeguardServices: this.createData.safeguardServices.filter(item => item.isChecked).map(item => item.id),
			})
			
			if (res.code == 0) {
				uni.showToast({
					title: '修改成功',
					duration: 2000,
					icon: 'none'
				})
				
				uni.reLaunch({
					url: `/pages/plan/createSuccess?operator=2&carId=${this.createData.secondHandCarId}&type=2&imgUrl=${this.productEntity.imageUrl}&brandName=${this.carProductInfo.brandName}&carType=${this.carProductInfo.carType}&carTypeYear=${this.carProductInfo.carTypeYear}&carTypeYearProduct=${this.carProductInfo.carTypeYearProduct}`
				})
			} else {
				uni.showToast({
					title: '修改失败',
					duration: 2000,
					icon: 'none'
				})
			}
			
			uni.hideLoading()
		},
		
		back() {
			let content = '您的方案尚未创建完毕，确认要退出吗？'
			
			if(this.createData.id) {
				content = '您的方案尚未修改完毕，确认要退出吗？'
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
		.price-wrap {
			height: 40rpx;
			margin-top: 12px;
			background: url("https://image.51cheyaoshi.com/xcx/merchant/static/home/Group_715.png") no-repeat;
			background-size: 194rpx 40rpx;
			display: flex;
			align-items: center;
			.tip {
				font-size: 12px;
				color: #FFFFFF;
				padding-left: 8rpx;
			}
			.price {
				font-size: 12px;
				font-weight: 500;
				color: #4E5969;
				padding-left: 30rpx;
			}
		}
	}
	.right {
		.car-img {
			width: 248rpx;
			border-radius: 16rpx;
		}
	}
}

.step-wrap {
	margin-top: 20px;
	margin-bottom: 16px;
}
</style>
