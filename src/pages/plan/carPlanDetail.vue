<template>
	<view class="page" v-if="detail">
		<view class="header" :class="{'new-car-header': type == 1}">
			<view class="left">
				<view class="car-brand-wrap">
					<view class="brand">{{detail.carType.carBrand}} {{detail.carType.carType}}</view>
					<view class="car-type">
						{{detail.carType.carTypeYear}} {{detail.carType.carTypeYearProduct}}
					</view>
				</view>
				<view class="price-wrap">
					<view class="tip">指导价</view>
					<view class="price">{{formatTenThousandNumber(detail.carType.guidancePrice)}}</view>
				</view>
			</view>
			<view class="right">
				<image
					class="car-img"
					:src="detail.carType.imageUrl"
					mode="widthFix"
				/>
			</view>
		</view>
		
		<!-- 新车方案 -->
		<view class="new-car-plan" v-if="type == 1">
			<view class="tabs">
				<view 
					v-for="tab in newCarPlanTabs"
					:key="tab.id"
					class="tab"
					:class="{'active-tab': tab.id === activeNewCarPlanTab}"
					@click="changeNewCarPlanTab(tab.id)"
				>
					{{tab.text}}<text v-if="tab.id === 2">（{{inStoreCars.length}}）</text>
				</view>
			</view>
			
			
			<!-- 新车 方案信息 -->
			<PlanBasicInfo 
				v-if="activeNewCarPlanTab === 1"
				:type="1"
				:detail="detail"
			/>
			
			<!-- 在库车辆 -->
			<InStoreCars
				v-if="activeNewCarPlanTab === 2"
				:type="1"
				:inStoreCars="inStoreCars"
				:detail="detail"
			/>
		</view>
		
		<!-- 二手车方案 -->
		<view class="new-car-plan" v-if="type == 2">
			<view class="tabs">
				<view 
					v-for="tab in oldCarPlanTabs"
					:key="tab.id"
					class="tab"
					:class="{'active-tab': tab.id === activeOldCarPlanTab}"
					@click="changeOldCarPlanTab(tab.id)"
				>
					{{tab.text}}
				</view>
			</view>
			
			<!-- 二手车 方案信息 -->
			<PlanBasicInfo 
				v-if="activeOldCarPlanTab === 1"
				:type="2"
				:detail="detail"
			/>
			
			<!-- 二手车 车辆信息 -->
			<CarBasicInfo 
				v-if="activeOldCarPlanTab === 2"
				:type="2"
				:detail="detail"
				:secondCarInfo="secondCarInfo"
			/>
			
			<!-- 二手车 车辆照片 -->
			<CarPhotos 
				v-if="activeOldCarPlanTab === 3"
				:type="2"
				:secondCarInfo="secondCarInfo"
				@updateImgInfo="getCarPlanDetail"
			/>
			
			<!-- 二手车 保险信息 -->
			<Insurance 
				v-if="activeOldCarPlanTab === 4"
				:secondCarInfo="secondCarInfo"
			/>
		</view>
		
	</view>
</template>

<script>
import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'
import PlanBasicInfo from './components/PlanBasicInfo.vue'
import InStoreCars from './components/InStoreCars.vue'
import CarBasicInfo from './components/CarBasicInfo.vue'
import CarPhotos from './components/CarPhotos.vue'
import Insurance from './components/Insurance.vue'

export default {
	components: {
		PlanBasicInfo, // 方案信息
		InStoreCars, // 在库车辆
		CarBasicInfo, // 车辆信息
		CarPhotos, // 车辆照片
		Insurance, // 保险信息
	},
	
	data() {
		return {
			id: '',
			type: 1,
			detail: null, // 详情
			activeNewCarPlanTab: 1,
			newCarPlanTabs: [
				{
					id: 1,
					text: '方案信息',
				},
				{
					id: 2,
					text: '在库车辆',
				},
			],
			activeOldCarPlanTab: 1,
			oldCarPlanTabs: [
				{
					id: 1,
					text: '方案信息',
				},
				{
					id: 2,
					text: '车辆信息',
				},
				{
					id: 3,
					text: '车辆照片',
				},
				{
					id: 4,
					text: '保险信息',
				},
			],
			inStoreCars: [], // 在库车辆
			secondCarInfo: {}, // 二手车车辆信息
		}
	},
	
	onLoad(options) {
		this.id = options.id
		this.type = options.type
	},
	
	onShow() {
		this.getCarPlanDetail()
	},
	
	methods: {
		// 车辆详情
		async getCarPlanDetail() {
			const params = {
				id: this.id,
			}
			
			const res = await this.$getRequest(this.$url.getCarPlanDetail, "GET", params)
			
			if (res.code == 0) {
				this.detail = res.data
				if (this.type == 1) {
					this.selectCarsInfoInStore(res.data.carTypeYearProductId)
				} else {
					this.selectCarsInfo(res.data.secondCarId)
				}
			}
		},
		
		// 在库车辆
		async selectCarsInfoInStore(id) {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				id,
			}
			
			const res = await this.$getRequest(this.$url.selectCarsInfoInStore, "GET", params)
			
			if (res.code == 0) {
				this.inStoreCars = res.data
			}
			
			uni.hideLoading()
		},
		
		// 二手车车辆详情
		async selectCarsInfo(id) {
			const params = {
				id,
				newOrOld: 2,
			}
			
			const res = await this.$getRequest(this.$url.findCarInfoById, "POST", params)
			
			if (res.code == 0) {
				for(const item in res.data.carPicsMap) {
					res.data.carPicsMap[item].forEach((img, index) => {
						img.canInput = true
						if(img.remark) {
							img.canInput = false
						}
					})
					
					this.secondCarInfo = res.data
				}
			}
		},
		
		changeNewCarPlanTab(id) {
			this.activeNewCarPlanTab = id
		},
		
		changeOldCarPlanTab(id) {
			this.activeOldCarPlanTab = id
		},
		
		formatTenThousandNumber(num) {
			return formatTenThousandNumber(num)
		},
		
		formatThousandNumber(price) {
			return formatThousandNumber(price)
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page {
	padding: 16px 32rpx 50px;
	
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
				background: url("https://image.51cheyaoshi.com/xcx/merchant/static/home/Group_571.png") no-repeat;
				background-size: 218rpx 40rpx;
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
				width: 290rpx;
			}
		}
	}
	
	.new-car-header {
		.car-img {
			width: 340rpx;
			margin-right: -50rpx;
		}
	}
	
	.tabs {
		margin-top: 20px;
		display: flex;
		align-items: center;
		padding-bottom: 16px;
		.tab {
			margin-right: 40rpx;
			height: 44rpx;
			line-height: 1;
			font-size: 14px;
			color: #4E5969;
			&:last-child {
				margin-right: 0;
			}
			&.active-tab {
				font-size: 17px;
				font-weight: 600;
				color: #000000;
				position: relative;
				&:before {
					content: '';
					display: block;
					width: 100%;
					height: 12rpx;
					background: linear-gradient(89deg, #165DFF 0%, rgba(22,93,255,0.00) 80%);
					position: absolute;
					left: 0;
					bottom: 12rpx;
				}
			}
		}
	}
}
</style>