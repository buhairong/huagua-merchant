<template>
	<view class="page" v-if="orderDetail">
		<view class="header">
			<image
				class="car-img"
				:src="imageUrl"
				mode="aspectFill"
			/>
			<view class="car-brand-wrap">
				<view class="brand">
					{{carBrandInfo}}
					<view class="tag">{{orderDetail.monthTotal}}个月</view>
				</view>
				<view class="car-type">
					{{carYearTypeInfo}}
				</view>
			</view>
		</view>
		
		<view class="step-wrap">
			<u-steps
				:list="orderDetail.statusChain" 
				:current="currentStep"
				un-active-color="#86909C"
				active-color="#1D2129"
			></u-steps>
		</view>

		<view class="container">
			<OrderInfo :orderDetail="orderDetail" />
			
			<BasicInfo :orderDetail="orderDetail" />
			
			<ServiceInfo :orderDetail="orderDetail" />
			
			<CarInfo :orderDetail="orderDetail" :photoLength="getLength"/>
			
			<CarInsuranceInfo :orderDetail="orderDetail" v-if="orderDetail.bindedCar === 1 && orderDetail.carInfo && orderDetail.carInfo.insuranceList.length" />

			<PickUpCarInfo :orderDetail="orderDetail" v-if="orderDetail.status >= 4" />
			
			<EmergencyInfo :orderDetail="orderDetail" v-if="orderDetail.status === 4 || orderDetail.status === 6" />

		</view>
		
		<u-popup border-radius="14" closeable=true mode="bottom" v-model="show">
			<u-row>
				<u-col span="12">
					<view class="popupTitle">车辆信息</view>
				</u-col>
			</u-row>
			<view class="popupInfo">
				<view class="itemInfo">
					<view class="itemTitle">实表里程</view>
					<input class="itemInput" v-model="mileage"  placeholder="请输入车辆实表里程" type="text" value="" />
					<view class="itemUnit">公里</view>
				</view>
				<view class="itemInfo">
					<view class="itemTitle">实时{{orderDetail.carInfo.powerMode==3?'电量':'油量'}}</view>
					<input v-model="electricity" :placeholder="`请输入车辆实时${orderDetail.carInfo.powerMode==3?'电量':'油量'}`" class="itemInput" type="text" value="" />
					<view class="itemUnit">{{orderDetail.carInfo.powerMode==3?'%':'/16'}}</view>
				</view>
				<view @click="upPic" class="nextBtn">下一步</view>
			</view>
		</u-popup>
		
		<view style="width:100%;padding:0 32rpx;margin-top:32px;">
			<view @click="getCarsMethod" v-if="orderDetail.bindedCar == 0 && orderDetail.status == 3" class="bottomBtn">绑定车辆</view>
			<view class="btn-group" v-if="orderDetail.bindedCar == 1 && orderDetail.status === 3">
				<view class="btn" @click="getCarsMethod">修改车辆</view>
				<view class="btn primary-btn" @click="bindCar('carToStore')">车辆到店</view>
			</view>
			
			<view v-if="orderDetail.status == 5" @click="bindCar('pay')" class="bottomBtn">交付车辆</view>
			<!-- <view v-if="orderDetail.status == 6" @click="bindCar('pay')" class="bottomBtn">订阅中</view> -->
			
		</view>
		
		<BindCarListPopup 
			v-if="showBindCarListPopup" 
			:show.sync="showBindCarListPopup" 
			:orderDetail="orderDetail" 
			:list="bindData" 
			:carId="carId"
			:newOrOld="orderDetail.newType"
			:orderId="id"
			@success="handleBindCar"
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
import BindCarListPopup from './components/BindCarListPopup.vue'

export default {
	components: {
		OrderInfo,
		BasicInfo,
		ServiceInfo,
		CarInfo,
		CarInsuranceInfo,
		PickUpCarInfo,
		EmergencyInfo,
		BindCarListPopup,
	},
	
	data() {
		return {
			orderDetail: null,
			id: null,
			carId: null,
			newType: null,
			carBrandInfo: '',
			carYearTypeInfo: '',
			imageUrl: '',
			// ORDER(0, "下单"),
			// PAYMENT(1, "支付订金"),
			// SIGNING(2, "合同签约"),
			// PAYING_GUARANTEE_DEPOSIT(3, "支付提车押金"),
			// CAR_ARRIVE(4, "车辆到店"),
			// PAYING_AGREEMENT(5, "支付订阅费用"),
			// DELIVERY(6, "车辆交付"),
			// USING(7, "订阅中"),
			// END(8, "结束订阅");
			// 0待支付订金、1待签约、2已签约，待支付（月付：押金、一次性付：订阅费用）、3备车中、4待支付订阅费用（仅限月付使用）、5待交车、6订阅中、7合约结束、8已取消
			currentStep: -1,
			stepList: [],
			// u-gap空位置
			showNote: true,
			xianshi: false,
			// 绑定车辆弹框下的数据
			valueraiod: '',
			bindData: [],
			// 显示步骤条到哪一步  从0开始
			greenSpot: 0,
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
			// 跳转拿过来的车辆信息
			itemId: {},
			pageNo: 1,
			pageSize: 10,
			totalPage: '',
			// 绑定车辆 确定绑定需要的id
			bindId: '',
			// 显示绑定车辆
			// showBind:true,
			// 显示修改车辆
			showChange: false,
			userInfo: {},
			insuranceItem: [],
			show:false,
			mileage:'',
			electricity:'',
			showBindCarListPopup: false,
		}
	},
	computed:{
		getLength(){
			let length = 0
			if(this.orderDetail && this.orderDetail.carInfo){
				for(key in this.orderDetail.carInfo.checkCarPicsMap){
					if(this.orderDetail.carInfo.checkCarPicsMap[value]){
						length += this.orderDetail.carInfo.checkCarPicsMap[value].length
					}
				}
			}
			return length
		}
	},
	methods: {
		// 右上角[绑定车辆]
		getCarsMethod() {
			const params = {
				carBrandId: this.itemId.carBrandId,
				carTypeId: this.itemId.carTypeId,
				carTypeYearId: this.itemId.carTypeYearId,
				carTypeYearProductId: this.itemId.carTypeYearProductId,
				newOrOld: this.itemId.newType,
				pageNo: this.pageNo,
				pageSize: this.pageSize,
				pageTag:2
			}
			this.$getRequest(this.$url.getCars, 'POST', params).then((data) => {
				if (data.code == 0) {
					this.totalPage = data.data.pages
					this.bindData = [...this.bindData, ...data.data.records]
					this.showBindCarListPopup = true
				}
			})
		},
		getChangeCarsMethod() {
			var params = {
				carBrandId: this.itemId.carBrandId,
				carTypeId: this.itemId.carTypeId,
				carTypeYearId: this.itemId.carTypeYearId,
				carTypeYearProductId: this.itemId.carTypeYearProductId,
				newOrOld: this.itemId.newType,
				pageNo: this.pageNo,
				pageSize: this.pageSize,
			}
			this.$getRequest(this.$url.getCars, 'POST', params).then((data) => {
				if (data.code == 0) {
					var that = this
					this.totalPage = data.data.pages
					var arr1 = that.bindData;
					var arr2 = data.data.records;
					arr1 = arr1.concat(arr2);
					that.bindData = arr1
				}
			})
		},
		// 车辆到店
		getCarInShopMethod() {
			const params = { orderId: this.orderDetail.id }
			this.$getRequest(this.$url.getCarInShop, 'GET', params).then((data) => {
				if (data.code == 0) {
					uni.showToast({
						title: '车辆到店',
						icon: "none"
					})
					
					this.getOrderDetailMethod()
				}
			})
		},
		bindCar(type) {
			if (type == 'bind') {
				this.getCarsMethod()
				this.xianshi = true
			} else if (type == 'change') {
				this.getCarsMethod()
				this.xianshi = true
			} else if (type == 'pay') {
				this.show = true
			} else if (type == 'carToStore') {
				this.getCarInShopMethod()
			}
		},
		// 下一步上次照片
		upPic(){
			let params = {
				actualDrivenKilometer:this.mileage,
				carId:this.orderDetail.carId,
				status:this.orderDetail.status,
				userCarSubscribeId:this.orderDetail.id
			}
			if(this.orderDetail.carInfo.powerMode==3){
				params.actualElectricity=this.electricity
			}else{
				params.actualOil=this.electricity
			}
			this.$getRequest(this.$url.addCarInfo,'POST',params).then(res => {
				if(res.code == 0){
					this.show = false
					uni.navigateTo({
						url: '../product/checkCarPhoto?id='+this.orderDetail.id+'&carId='+this.orderDetail.carId+'&newOrOld='+this.orderDetail.carInfo.newOrOld
					})
				}
			})
			
		},
		// 绑定车辆- 确定绑定
		getBindOrderMethod() {
			const params = {
				carId: this.bindId,
				carSubscribeOrderId: this.id,
				newOrOld: this.newType
			}
			this.$getRequest(this.$url.getBindOrder, 'POST', params).then((data) => {
				if (data.code == 0) {
					this.xianshi = false
					uni.showToast({
						title: '绑定成功',
						icon: "none"
					})
					this.carId = this.bindId
					this.getOrderDetailMethod()
				}
			})
		},
		// 绑定车辆-  修改绑定
		getChangeOrderMethod() {
			var params = {
				carId: this.bindId,
				carSubscribeOrderId: this.id,
				newOrOld: this.newType
			}
			this.$getRequest(this.$url.getBindOrder, 'POST', params).then((data) => {
				if (data.code == 0) {
					this.xianshi = false
					uni.showToast({
						title: '修改成功',
						icon: "none"
					})
					this.getOrderDetailMethod()
				}
			})
		},
		handleBindCar(data) {
			this.carId = data
			this.getOrderDetailMethod()
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
					this.topInfo.orderNum = data.data.orderNum
					this.topInfo.userName = data.data.userName
					this.topInfo.newType = data.data.newType
					this.topInfo.limitMileage = data.data.limitMileage
					this.topInfo.overMileageFee = data.data.overMileageFee
					this.topInfo.statusChain = data.data.statusChain
					this.insuranceItem = data.data.carInfo?data.data.carInfo.insuranceList:null
					
					data.data.statusChain.forEach((item, index) => {
						if(item.greenLightOn === 1) {
							this.currentStep = index
						}
					})
					
				}
			}).finally(() => {
				uni.hideLoading()
			})
		},
		// 选中某个单选框时，由radio时触发
		radioChange(e) {
			console.log("radioChange", e);
			this.bindId = e
		},
		// 选中任一radio时，由radio-group触发
		radioGroupChange(e) {
			// console.log(e);
		}
	},
	created() {

	},
	onShow(){
		this.getOrderDetailMethod()
	},
	onLoad(option) {
		this.id = option.id
		this.carId = option.carId
		this.newType = option.newType
		this.carBrandInfo = option.carBrandInfo
		this.carYearTypeInfo = option.carYearTypeInfo
		this.imageUrl = option.imageUrl
		this.carInfo.image = option.image
		const itemId = JSON.parse(uni.getStorageSync('item'))
		this.itemId = itemId
		
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page {
	padding: 16px 0 40px;
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
				height: 48rpx;
				color: #1D2129;
				display: flex;
				align-items: center;
				.tag {
					margin-left: 16rpx;
					width: 70rpx;
					height: 34rpx;
					border-radius: 4rpx;
					background: #F7F7F7;
					font-size: 10px;
					color: #1D2129;
					display: flex;
					justify-content: center;
					align-items: center;
				}
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
	.popupInfo{
		padding: 30px 20px;
		.itemInfo{
			padding: 15px 0;
			border-bottom: 1px solid rgba(216,216,216,0.6);
			font-size: 14px;
			// color: #000;
			.itemTitle{
				display: inline-block;
				vertical-align: middle;
				width: 23%;
			}
			.itemInput{
				display: inline-block;
				vertical-align: middle;
				width: 67%;
			}
			.itemUnit{
				display: inline-block;
				vertical-align: middle;
				text-align: right;
				width: 10%;
			}
		}
		.nextBtn{
			margin-top: 50px;
			background-color: #4170EE;
			color: #fff;
			text-align: center;
			border-radius: 8px;
			height: 40px;
			line-height: 40px;
		}
	}
	.popupTitle {
		font-style: 15px;
		text-align: center;
		padding: 20px 0 0px 0;
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
