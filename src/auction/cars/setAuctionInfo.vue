<template>
	<view class="page-wrap">
		<view class="header" v-if="carProductInfo">
			<view class="left">
				<view class="car-brand-wrap">
					<view class="brand">{{carProductInfo.carBrand}} {{carProductInfo.carType}}</view>
					<view class="car-type">
						{{carProductInfo.carTypeYear}} {{carProductInfo.carTypeYearProduct}}
					</view>
				</view>
				
				<view class="brand-price">
					<text class="name">
						售价
					</text>
					<text class="price">
						{{ formatTenThousandNumber(carProductInfo.guidancePrice) }}
					</text>
				</view>
			</view>
			<image
				class="car-img"
				:src="carProductInfo.imageUrl"
				mode="heightFix"
			/>
		</view>
		
		<view class="card">
			<view class="item-wrap">
				<view class="item-title">起拍价格</view>
				<view class="item-content">
					<input
						v-model="form.startingPrice"
						class="input"
						type="digit"
						inputmode="numeric"
						placeholder="请输入"
						placeholder-style="font-size:14px;color:#A4AEBB;"
					/>
					<view class="unit">元</view>
				</view>
			</view>
			
			<view class="item-wrap">
				<view class="item-title">加价幅度</view>
				<view class="item-content">
					<input
						v-model="form.advance"
						class="input"
						type="digit"
						inputmode="numeric"
						placeholder="请输入"
						placeholder-style="font-size:14px;color:#A4AEBB;"
					/>
					<view class="unit">元</view>
				</view>
			</view>
			
			<view class="item-wrap">
				<view class="item-title" @click="openPop">
					竞卖保证金
					<u-icon
						style="margin-left:16rpx;"
						name="info-circle" 
						color="rgba(10, 15, 45, 0.8)" 
						size="32"
					></u-icon>
				</view>
				<view class="item-content">
					<input
						v-model="form.deposit"
						class="input"
						type="digit"
						inputmode="numeric"
						placeholder="请输入"
						placeholder-style="font-size:14px;color:#A4AEBB;"
					/>
					<view class="unit">元</view>
				</view>
			</view>
			
			<view class="item-wrap">
				<view class="item-title">竞价周期</view>
				<view class="item-content">
					<u-number-box 
						v-model="form.periodDay" 
						:min="1"
					>
					</u-number-box>
					<view class="unit">天</view>
				</view>
			</view>
			
			<view class="item-wrap">
				<view class="item-title">开始时间</view>
				<view class="item-content" @click="openTimePicker">
					{{ form.startTime ? form.startTime : '请选择' }}
				</view>
			</view>
		</view>
		
		<view class="fixed-bottom-btn">
			<view class="bottom-btn" @click="createCar">发起竞价</view>
		</view>
		
		<u-picker v-model="showTimePicker" mode="time" start="2023-10-10" :params="params" @confirm="handleChangeTime"></u-picker>
		
		<AuctionDepositPopup :showPopup.sync="showPopup" />
	</view>
</template>

<script>
import { formatTenThousandNumber } from '@/utils/index.js'
import AuctionDepositPopup from '../components/AuctionDepositPopup.vue'

export default {
	components: {
		AuctionDepositPopup,
	},
	
	data() {
		return {
			carTypeId: '',
			carTypeYearId: '',
			carTypeYearProductId: '',
			carProductInfo: null,
			form: {
				secondCarId: '', // 车辆ID
				startingPrice: '', // 起拍价格
				advance: '', // 加价幅度
				deposit: '', // 竞卖保证金
				periodDay: 1, // 竞价周期
				startTime: '', // 开始时间
				createdBy: '',
			},
			showPopup: false,
			showTimePicker: false,
			params: {
				year: true,
				month: true,
				day: true,
				hour: true,
			},
		}
	},
	
	onLoad(options) {
		this.form.secondCarId = options.carId
		this.carTypeId = options.carTypeId
		this.carTypeYearId = options.carTypeYearId
		this.carTypeYearProductId = options.carTypeYearProductId
		this.form.startingPrice = options.startingPrice || ''
		this.form.advance = options.advance || ''
		this.form.deposit = options.deposit || ''
		this.form.periodDay = options.periodDay || 1
		this.form.startTime = options.startTime || ''
		this.getCarProduct()
		
		const currentCompany = uni.getStorageSync('current_company')
		if (currentCompany){
			this.form.createdBy = currentCompany.username
		}
	},
	
	methods: {
		async getCarProduct() {
			const params = {
				carTypeId: this.carTypeId,
			}
			
			const res = await this.$getRequest(this.$url.getCarYear, "GET", params)
			
			if (res.code == 0) {
				const yearItem = res.data.find(item => item.carTypeYearId == this.carTypeYearId)
				if (yearItem) {
					const list = yearItem.carTypeYearProducts
					const product = list.find(item => item.id == this.carTypeYearProductId)
					if (product) {
						this.carProductInfo = product
					}
				}
			}
		},
		
		formatTenThousandNumber(num) {
			return formatTenThousandNumber(num)
		},
		
		openTimePicker() {
			this.showTimePicker = true
		},
		
		handleChangeTime(e) {
			this.form.startTime = `${e.year}-${e.month}-${e.day} ${e.hour}:00:00`
		},
		
		openPop() {
			this.showPopup = true
		},
		
		async createCar() {
			if(!this.form.startingPrice) {
				uni.showToast({
					title: '请输入起拍价格',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.form.advance) {
				uni.showToast({
					title: '请输入加价幅度',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.form.deposit) {
				uni.showToast({
					title: '请输入竞卖保证金',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.form.startTime) {
				uni.showToast({
					title: '请选择开始时间',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			const res = await this.$getRequest(this.$url.addSecondAuction, "POST", this.form)
			if (res.code === 0) {
				uni.reLaunch({
					url: `/auction/cars/createSuccess?id=${this.form.secondCarId}&type=2`
				})
			} else {
				uni.showToast({
					title: res.msg,
					duration: 2000,
					icon: "none"
				})
			}
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.header {
	margin-bottom: 40rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.left {
		flex: 1;
		padding-right: 20rpx;
		height: 200rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
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
	.car-img {
		height: 200rpx;
	}
}

.brand-price {
	background: url("https://image.51cheyaoshi.com/xcx/partner/static/product/Group_571.png") no-repeat;
	background-size: contain;
	display: inline-block;
	padding: 0 10rpx 0 20rpx;
	height: 50rpx;
	line-height: 45rpx;
	font-size: 24rpx;
	position: relative;
	vertical-align: top;
	width: 215rpx;
	white-space: pre;
	.name {
		color: #ffffff;
	}
	.price {
		padding: 0 10rpx;
		color: rgba(10, 15, 45, 0.8);
		position: absolute;
		left: 100rpx;
		top: -1rpx;
		z-index: 1;
	}
}

.card {
	padding: 0 40rpx 40rpx;
}

.item-wrap {
	height: 112rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: inset 0px -1px 0px 0px rgba(10, 15, 45, 0.04);
	.item-title {
		padding-right: 24rpx;
		font-size: 14px;
		color: #0A0F2D;
		display: flex;
		align-items: center;
	}
	.item-content {
		display: flex;
		align-items: center;
		.input {
			text-align: right;
		}
		.unit {
			padding-left: 16rpx;
			color: #0A0F2D;
		}
	}
}
</style>