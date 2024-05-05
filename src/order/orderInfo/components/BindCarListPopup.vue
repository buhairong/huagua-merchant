<template>
	<u-popup mode="bottom" v-model="show" closeable="true" border-radius="20">
		<view class="title">绑定车辆</view>
		<view class="container">
			<scroll-view scroll-y style="height: 500rpx;">
				<view style="padding-bottom: 100rpx;">
					<u-radio-group v-model="bindCarId" @change="radioChange">
						<view class="car" v-for="item in list" :key="item.id">
							<view class="car-info">
								<view class="img-wrap">
									<image style="width:220rpx;height:154rpx;margin-left:-32rpx;" mode="aspectFill" :src="item.imageUrl"></image>
								</view>
								<view class="car-detail">
									<view class="brand-wrap">
										{{item.carBrand}} {{item.carType}}
										<view class="car-color">{{item.carColor}}</view>
									</view>
									<view class="car-type">
										{{item.carTypeYear}} {{item.carTypeYearProduct}}
									</view>
									<view class="item">
										<view class="item-title">车架号：</view>
										<view class="item-content">{{item.carVin}}</view>
									</view>
									<view class="item">
										<view class="item-title">发动机号：</view>
										<view class="item-content">{{item.carEngineNum}}</view>
									</view>
								</view>
							</view>
							<u-radio :name="item.id"></u-radio>
						</view>
					</u-radio-group>
				</view>
			</scroll-view>
			
			<view class="btn-wrap" v-if="selectCar">
				<view class="btn" @click="bindCar" v-if="selectCar.hasLicenseUrl === 1 && selectCar.hasCarInsurance === 1">绑定车辆</view>
				<view class="btn" @click="goAddLicensePage" v-else-if="selectCar.hasLicenseUrl === 0">上传行驶证</view>
				<view class="btn" @click="goAddInsurancePage" v-else-if="selectCar.hasCarInsurance === 0">上传保险信息</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
export default {
	props: {
		show: {
			type: Boolean,
			default: false,
		},
		
		list: {
			type: Array,
			default: () => [],
		},
		
		orderDetail: {
			type: Object,
			default: () => ({}),
		},
		
		carId: {
			type: String | Number,
			default: '',
		},
		
		newOrOld: {
			type: String | Number,
			default: '',
		},
		
		orderId: {
			type: String | Number,
			default: '',
		},
	},
	
	data() {
		return {
			showPopup: false,
			bindCarId: null,
			selectCar: null,
		}
	},
	
	mounted() {
		this.showPopup = this.show
		if (this.carId) {
			this.bindCarId = this.carId
		}
	},
	
	methods: {
		radioChange(e) {
			this.bindCarId = e
			this.selectCar = this.list.find(item => item.id === e)
		},
		
		bindCar() {
			uni.showLoading({
				title: '保存中',
				icon: 'none'
			})
			
			const params = {
				carId: this.bindCarId,
				carSubscribeOrderId: this.orderId,
				newOrOld: this.newOrOld,
			}
			
			this.$getRequest(this.$url.getBindOrder, 'POST', params).then(res => {
				if (res.code === 0) {
					this.showPopup = false
					this.$emit('update:show', false)
					this.$emit('success', this.bindCarId)
				}
			}).finally(() => {
				uni.hideLoading()
			})
		},
		
		goAddLicensePage() {
			uni.navigateTo({
				url: `./addLicense?carId=${this.selectCar.id}&id=${this.orderId}&newOrOld=${this.newOrOld}&hasCarInsurance=${this.selectCar.hasCarInsurance}&brand=${this.selectCar.carBrand}&carType=${this.selectCar.carType}&carTypeYear=${this.selectCar.carTypeYear}&carTypeYearProduct=${this.selectCar.carTypeYearProduct}&imageUrl=${this.selectCar.imageUrl}`
			})
		},
		
		goAddInsurancePage() {
			uni.navigateTo({
				url: `./addInsurance?id=${this.orderId}&carId=${this.selectCar.id}&newOrOld=${this.newOrOld}&brand=${this.selectCar.carBrand}&carType=${this.selectCar.carType}&carTypeYear=${this.selectCar.carTypeYear}&carTypeYearProduct=${this.selectCar.carTypeYearProduct}&imageUrl=${this.selectCar.imageUrl}`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "../styles/index.scss";

.title {
	width:100%;
	font-size: 15px;
	color: rgba(0, 0, 0, 0.9);
	height: 42rpx;
	line-height: 42rpx;
	text-align: center;
	margin: 28rpx 0 20px 0;
}

.container {
	padding: 0 32rpx;
}

.car {
	height: 200rpx;
	margin-bottom: 12px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 2rpx solid #F2F3F5;
	.car-info {
		height: 100%;
		display: flex;
		.img-wrap {
			height: 100%;
			display: flex;
		}
		.car-detail {
			.brand-wrap {
				display: flex;
				align-items: center;
				height: 42rpx;
				font-size: 14px;
				color: #1D2129;
				.car-color {
					margin-left: 16rpx;
					width: 70rpx;
					height: 34rpx;
					border-radius: 4rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					background: #F7F8FA;
					font-size: 10px;
					color: #1D2129;
				}
			}
			.car-type {
				margin-top: 2px;
				margin-bottom: 8px;
				height: 36rpx;
				font-size: 12px;
				line-height: 36rpx;
				color: #4E5969;
			}
			.item {
				line-height: 36rpx;
				margin-bottom: 2px;
				display: flex;
				font-size: 12px;
				.item-title {
					width: 128rpx;
					color: #86909C;
				}
				.item-content {
					color: #1D2129;
				}
			}
		}
	}
}

.btn-wrap {
	margin-bottom: 40px;
	.btn {
		width: 100%;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #4170EE;
		border-radius: 16rpx;
		font-size: 15px;
		color: #FFFFFF;
	}
}
</style>