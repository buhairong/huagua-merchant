<template>
	<view class="card">
		<view class="title-wrap">
			<u-section
				style="flex:1;"
				title="车辆信息" 
				line-color="#165DFF"
				font-size="34"
				color="#0A0F2D"
				:arrow="false"
				:right="false"
			></u-section>
			
			<view v-if="orderDetail.carInfo">
				<view class="plate" v-if="orderDetail.carInfo.hasPerfect">
					<view class="city">{{orderDetail.carInfo.carPlateNum && orderDetail.carInfo.carPlateNum.slice(0,1)}}</view>
					<view class="number">{{orderDetail.carInfo.carPlateNum && orderDetail.carInfo.carPlateNum.slice(1)}}</view>
				</view>
				<template v-else-if="isManager || currentCompany.userId == orderDetail.salesmanId">
					<!-- <view class="prefect-info" @click="complete" >
						完善信息
						<u-icon name="arrow-right" color="#cccccc" size="32" style="margin-left:4px;"></u-icon>
					</view> -->
					<view class="sale-tag" @click="getCarsMethod" v-if="orderDetail.carId && orderDetail.status === 3 && orderDetail.newType == 1">
						更换车辆
					</view>
				</template>
				
			</view>
		</view>
		
		<view class="item-wrap">
			<view class="item" v-if="orderDetail.carInfo && orderDetail.carInfo.mileage">
				<view class="item-title">实表里程数</view>
				<view class="item-content">{{orderDetail.carInfo.mileage}}公里</view>
			</view>
			
			<view class="item" v-if="orderDetail.carInfo && orderDetail.carInfo.tankSize">
				<view class="item-title">实时{{orderDetail.carInfo.powerMode==3 ? '电量' : '油量'}}</view>
				<view class="item-content">{{orderDetail.carInfo.tankSize}}{{orderDetail.carInfo.powerMode==3 ? '%': '/16'}}</view>
			</view>
			
			
			<template v-if="orderDetail.carInfo">
				<view class="item">
					<view class="item-title">车架号</view>
					<view class="item-content">{{orderDetail.carInfo.carVin || '-'}}</view>
				</view>
				
				<view class="item">
					<view class="item-title">发动机号</view>
					<view class="item-content">{{orderDetail.carInfo.carEngineNum || '-'}}</view>
				</view>
			</template>
			
			
			<view class="item">
				<view class="item-title">外观颜色</view>
				<view class="item-content">{{orderDetail.configRespVo && orderDetail.configRespVo.outColor || '-'}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">内饰颜色</view>
				<view class="item-content">{{orderDetail.configRespVo && orderDetail.configRespVo.inColor || '-'}}</view>
			</view>
			
			<!-- <view class="item">
				<view class="item-title">选择增配项</view>
				<view class="item-content">
					<view v-if="orderDetail.configRespVo && orderDetail.configRespVo.configDtoList && orderDetail.configRespVo.configDtoList.length">
						<view class="config-wrap" v-for="(item, index) in orderDetail.configRespVo.configDtoList" :key="index">
							<view class="config" v-for="(item1, index1) in item.details" :key="index1">
								{{item1.detailName}}
							</view>
						</view>
					</view>
					<view v-else>-</view>
				</view>
			</view> -->
			
			<view class="item" v-if="orderDetail.carInfo && orderDetail.carInfo.insuranceList && orderDetail.carInfo.length">
				<view class="item-title">保险信息</view>
				<view class="item-content" @click="goInsuranceDetailPage">
					查看
					<u-icon name="arrow-right" color="#cccccc" size="32" style="margin-left:4px;"></u-icon>
				</view>
			</view>
			
			<view class="item" v-if="orderDetail.checkInfo">
				<view class="item-title">验车信息</view>
				<view class="item-content" @click="goValidOrderCarPage">
					查看
					<u-icon name="arrow-right" color="#cccccc" size="32" style="margin-left:4px;"></u-icon>
				</view>
			</view>
			
		</view>	
	</view>
</template>

<script>
export default {
	props: {
		orderDetail: {
			type: Object,
			required: true,
		},
		
		carBrand: {
			type: String,
			default: '',
		},
		
		carType: {
			type: String,
			default: '',
		},
		
		carTypeYear: {
			type: String,
			default: '',
		},
		
		carTypeYearProduct: {
			type: String,
			default: '',
		},
		
		imageUrl: {
			type: String,
			default: '',
		},
		
		isManager: {
			type: Boolean,
			default: false,
		},
		
		currentCompany: {
			type: Object,
			required: true,
		},
	},
	
	data() {
		return {
			
		}
	},
	
	methods: {
		complete() {
			let outColor = ''
			if (this.orderDetail.configRespVo) {
				outColor = this.orderDetail.configRespVo.outColor || ''
			}
			uni.navigateTo({
				url: `/order/orderInfo/addLicense?carId=${this.orderDetail.carId}&powerMode=${this.orderDetail.powerMode}&id=${this.orderDetail.id}&newOrOld=${this.orderDetail.newType}&brand=${this.carBrand}&carType=${this.carType}&carTypeYear=${this.carTypeYear}&carTypeYearProduct=${this.carTypeYearProduct}&imageUrl=${this.imageUrl}&carVin=${this.orderDetail.carInfo.carVin}&carEngineNum=${this.orderDetail.carInfo.carEngineNum}&outColor=${outColor}&carPlateNum=${this.orderDetail.carInfo.carPlateNum}&mileage=${this.orderDetail.carInfo.mileage}&registerDate=${this.orderDetail.carInfo.productDate}&travelLicenseUrl=${this.orderDetail.carInfo.travelLicenseUrl}`
			})
		},
		
		goInsuranceDetailPage() {
			try {
				uni.setStorageSync('insurance_list', this.orderDetail.carInfo.insuranceList)
				uni.navigateTo({
					url: `/order/orderInfo/insurance?carPlateNum=${this.orderDetail.carInfo.carPlateNum}`
				})
			} catch (e) {
				// error
			}
		},
		
		goValidOrderCarPage() {
			uni.navigateTo({
				url: `/order/orderInfo/validOrderCar?carId=${this.orderDetail.carId}&orderId=${this.orderDetail.id}&newType=${this.orderDetail.newType}&type=review`
			})
		},
		
		getCarsMethod() {
			this.$emit('getCarsMethod')
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "../styles/index.scss";

.title-wrap {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.plate {
		height: 19px;
		line-height: 19px;
		font-size: 12px;
		font-weight: 500;
		display: flex;
		.city {
			height: 100%;
			padding: 0 8rpx;
			color: #FFFFFF;
			background: #1D2129;
			border-top-left-radius: 2px;
			border-bottom-left-radius: 2px;
		}
		.number {
			border: 1px solid #0A0F2D;
			height: 100%;
			padding: 0 12rpx;
			color: #1D2129;
			border-top-right-radius: 2px;
			border-bottom-right-radius: 2px;
		}
	}
	.prefect-info {
		display: flex;
		align-items: center;
		font-size: 14px;
		color: #0256FF;
	}
}

.tip {
	height: 44rpx;
	font-size: 14px;
	line-height: 44rpx;
	color: #4E5969;
	text-align: center;
	margin-top: 67px;
	padding-bottom: 4px;
}

.icon-wrap {
	font-size: 14px;
	color: rgba(10, 15, 45, 0.8);
}

.config {
	font-size: 14px;
	line-height: 42rpx;
	color: rgba(10, 15, 45, 0.8);
	text-align: right;
}

.config-wrap {
	margin-bottom: 10px;
}

.config-wrap:last-child {
	margin-bottom: 0;
}

.sale-tag {
	color: #0256FF;
	text-decoration: underline;
}
</style>