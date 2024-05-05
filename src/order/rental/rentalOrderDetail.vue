<template>
	<view class="page" v-if="detail">
		<view>
			<CarInfoHeader :carInfo="detail.carTypeYearProductEntity" />
			
			<view class="container">
				<OrderInfo :orderDetail="detail" :orderType="orderType" />
				
				<CarInfo :orderDetail="detail" :orderType="orderType" @review="startCheckCar" />
			</view>
		</view>
		
		<view class="footer-btn">
			<view class="bottom-btn" @click="startHandCar" v-if="detail.status === 80">
				开始送车
			</view>
			<view class="bottom-btn" @click="startCheckCar(1)" v-else-if="detail.status === 85">
				已送达，开始验车
			</view>
			<view class="bottom-btn" @click="startGetCar" v-else-if="detail.status === 110">
				前往接车
			</view>
			<view class="bottom-btn" @click="startCheckCar(2)" v-else-if="detail.status === 115">
				已接车，开始验车
			</view>
		</view>
	</view>
</template>

<script>
import CarInfoHeader from '../components/CarInfoHeader.vue'
import OrderInfo from './components/OrderInfo.vue'
import CarInfo from './components/CarInfo.vue'

export default {
	components: {
		CarInfoHeader,
		OrderInfo,
		CarInfo,
	},
	
	data() {
		return {
			orderId: '',
			orderType: '',
			currentCompany: {},
			detail: null,
		}
	},
	
	computed: {
		
	},
	
	onLoad(options){
		this.orderId = options.orderId
		this.orderType = options.orderType
		
		const value = uni.getStorageSync('current_company')
		if (value) {
			this.currentCompany = value
		}
	},
	
	onShow() {
		this.getDetail()
	},
	
	methods: {
		async getDetail() {
			const params = {
				id: this.orderId,
			}
			
			const res = await this.$getRequest(this.$url.selectRentalOrderDetail, "GET", params)
			
			if (res.code === 0) {
				this.detail = res.data
				let deliveryCarPicsMap = []
				if (res.data.deliveryCarPics && res.data.deliveryCarPics.length) {
					deliveryCarPicsMap = res.data.deliveryCarPics
				}
				if (res.data.returnedDeliveryCarPics && res.data.returnedDeliveryCarPics.length) {
					deliveryCarPicsMap = res.data.returnedDeliveryCarPics
				}
				uni.setStorageSync('deliveryCarPicsMap', deliveryCarPicsMap)
				
				const deliveryCheckInfo = res.data.returnedCheckInfo || res.data.deliveryCheckInfo || ''
				uni.setStorageSync('deliveryCheckInfo', deliveryCheckInfo)
			}
		},
		
		async startHandCar() {
			const params = {
				id: this.orderId,
			}
			
			const res = await this.$getRequest(this.$url.startHandCar, "GET", params)
			
			if (res.code === 0) {
				this.getDetail()
			}
		},
		
		// 1.送车 2.接车 
		startCheckCar(type = 1) {
			uni.navigateTo({
				url: `/order/rental/uploadDeliveryCarPics?orderId=${this.orderId}&type=${type}`
			})
		},
		
		async startGetCar() {
			const params = {
				id: this.orderId,
			}
			
			const res = await this.$getRequest(this.$url.startGetCar, "GET", params)
			
			if (res.code === 0) {
				this.getDetail()
			}
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
	
.page {
	padding: 32rpx 0 200rpx;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.container {
		margin-top: 40rpx;
		padding: 0 32rpx;
	}
	
	.footer-btn {
		width: 100%;
		padding: 0 32rpx;
		position: fixed;
		bottom: 40px;
		left: 0;
		z-index: 100;
		.bottom-btn {
			width: 100%;
			height: 116rpx;
			border-radius: 16rpx;
			background: #4170EE;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32rpx;
			color: #fff;
			padding: 0 32rpx;
		}
	}
}
</style>