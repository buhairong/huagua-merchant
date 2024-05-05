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
				</view>
				
				<view class="item-wrap">
					<view class="item">
						<view class="item-title">车架号</view>
						<view class="item-content">{{carVin || '-'}}</view>
					</view>
					
					<view class="item">
						<view class="item-title">发动机号</view>
						<view class="item-content">{{carEngineNum || '-'}}</view>
					</view>
					
					<view class="item">
						<view class="item-title">外观颜色</view>
						<view class="item-content">{{outColor || '-'}}</view>
					</view>
					
				</view>	
			</view>
			
			<view class="car-plate-date-wrap">
				<view class="car-plate-title">预计上牌日期</view>
				<view class="car-plate-date" @click="showCalendarDate">
					{{carPlateDate ? carPlateDate : '请选择'}}
					<u-icon name="arrow-right" color="#cccccc" size="32" style="margin-left:8rpx;"></u-icon>
				</view>
			</view>
			
			<view class="tip">设置完成上牌日期后，该订单将无法更换车辆</view>
			
			<u-calendar
				v-model="showCalendar" 
				mode="date" 
				max-date="2099-01-01"
				@change="changeDate"
			></u-calendar>
			
			<u-modal
				v-model="showModal"
				title="预计上牌完成日期"
				:show-cancel-button="true"
				:mask-close-able="true"
				confirm-text="确定"
				cancel-text="取消"
				@confirm="bindCarPlateNum"
				@cancel="closeModal"
			>
				<view class="modal-content">
					<view class="modal-car-plate-date">{{modalStr}}</view>
					<view class="modal-tip">设置完成上牌日期后，该订单将无法更换车辆，是否确认设置？</view>
				</view>
			</u-modal>
		</view>
		
		<view >
			<view class="buttom-disabled-btn">
				<button :disabled="disabled" @click="openModal">确认</button>
			</view>
			
			<view class="skip" @click="goOrderDetailPage">
				跳过
			</view>
		</view>
		
		
	</view>
</template>

<script>
import { validIntegerNum } from '@/utils/validate'

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
			carPlateDate: '',
			showCalendar: false,
			showModal: false,
			modalStr: '',
		}
	},
	
	computed: {
		disabled() {
			if (this.carPlateDate) {
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
		this.carPlateDate = options.predictPlateTime
		if (this.carPlateDate) {
			this.getDateStr()
		}
	},
	
	methods: {
		async bindCarPlateNum() {
			const params = {
				orderId: this.orderId,
				predictPlateDate: this.carPlateDate,
			}
			
			const res = await this.$getRequest(this.$url.updateOrderPredictPlateDate, "POST", params)
			
			if (res.code == 0) {
				this.goOrderDetailPage()
			}
		},
		
		goOrderDetailPage() {
			// uni.reLaunch({
			// 	url: `/order/orderInfo/handoverOrderDetailInfo?id=${this.orderId}&carId=${this.carId}&newType=${this.newType}&carBrand=${this.carBrand}&carType=${this.carType}&carTypeYear=${this.carTypeYear}&carTypeYearProduct=${this.carTypeYearProduct}&imageUrl=${this.imageUrl}`
			// })
			uni.navigateTo({
				url: `/order/orderInfo/addLicense?carId=${this.carId}&powerMode=${this.powerMode}&id=${this.orderId}&newOrOld=${this.newType}&brand=${this.carBrand}&carType=${this.carType}&carTypeYear=${this.carTypeYear}&carTypeYearProduct=${this.carTypeYearProduct}&imageUrl=${this.imageUrl}&carVin=${this.carVin}&carEngineNum=${this.carEngineNum}&outColor=${this.outColor}&carPlateNum=${this.carPlateNum}&mileage=${this.mileage}&registerDate=${this.productDate}&travelLicenseUrl=${this.travelLicenseUrl}`
			})
		},
		
		showCalendarDate() {
		  this.showCalendar = true
		},
		
		changeDate(e) {
		  this.carPlateDate = e.result
			this.getDateStr()
		},
		
		getDateStr() {
			const dateArr = this.carPlateDate.split('-')
			
			const date = new Date(this.carPlateDate)
			const day = date.getDay()
			let dayStr = ''
			switch(day) {
				case 0: dayStr = '日'
								break
				case 1: dayStr = '一'
								break
				case 2: dayStr = '二'
								break
				case 3: dayStr = '三'
								break
				case 4: dayStr = '四'
								break
				case 5: dayStr = '五'
								break
				case 6: dayStr = '六'
								break
			}
			
			this.modalStr = `${dateArr[0]}年${dateArr[1]}月${dateArr[2]}日 星期${dayStr}`
		},
		
		openModal() {
			this.showModal = true
		},
		
		closeModal() {
			this.showModal = false
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "./styles/index.scss";
	
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
	
	.card {
		margin: 20px 0;
	}
	
	.car-plate-date-wrap {
		padding: 0 32rpx;
		width: 100%;
		height: 104rpx;
		border-radius: 16rpx;
		background: rgba(10, 15, 45, 0.04);
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 15px;
		.car-plate-title {
			color: rgba(10, 15, 45, 0.5);
		}
		.car-plate-date {
			display: flex;
			align-items: center;
		}
	}
	
	.tip {
		padding-top: 12px;
		height: 36rpx;
		font-size: 14px;
		line-height: 36rpx;
		color: #FF0000;
	}
	
	.skip {
		margin-top: 12px;
		height: 36rpx;
		font-size: 14px;
		line-height: 36rpx;
		color: #3D3D3D;
		text-align: center;
	}
	
}

.modal-content {
	padding: 30px 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-sizing: border-box;
	.modal-tip {
		margin-top: 30px;
		padding: 0 32rpx;
		font-size: 14px;
		line-height: 36rpx;
		color: #FF0000;
		box-sizing: border-box;
	}
	.modal-car-plate-date {
		height: 44rpx;
		font-size: 20px;
		line-height: 44rpx;
		color: #3D3D3D;
	}
}
</style>