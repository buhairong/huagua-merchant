<template>
	<view class="wrap">
		<view
			class="card"
			v-if="item"
		>
			<view class="plan-title">
				选择方案
				<view class="qrcode-wrap" @click="openQrCode">
					<image
						class="qrcode"
						:src="qrCodeUrl"
					/>
					<view class="tip">扫我下单</view>
				</view>
			</view>
			<view class="plan-list">
					<view 
						v-for="plan in selCity.respVOS"
						:key="plan.id"
						class="plan"
						:class="{'checked-plan': plan.id === selCity.id}"
						@click.stop="changePlan(plan.id)"
					>
							<view class="plan-item1">{{plan.subscribeName}}</view>
							<view class="plan-item2">
								￥{{plan.monthPay | $numFormat}}/月
							</view>
							<view class="plan-item3">
								{{plan.paymentTypeStr}}
							</view>
							
							<view class="checked-icon-wrap">
								<u-icon name="checkmark" color="#ffffff" size="16"></u-icon>
							</view>
					</view>
			</view>
		
			<!-- <view class="plan-item" style='margin-top: 0;'>
				<view class="item-title">订阅费用：</view>
				<view class="item-content item-sub" style='margin-top: 0;'>
					<view class="left">
						<text style="color:#F51A4E; font-weight: 500; font-size:16px">{{item.monthPay | $numFormat}}<text style="font-size: 12px;">元/月</text></text>
						<view style="margin-left: 16rpx;" @click.stop="openPopup">
							<u-icon class="info-circle" name="info-circle"></u-icon>
						</view>
					</view>
				</view>
			</view> -->
			
			<!-- <view class="plan-item">
				<view class="item-title">订阅周期：</view>
				<view class="item-content">
					{{item.monthTotal}}期
				</view>
			</view> -->
			
			<view class="plan-item">
				<view class="item-title">用车城市：</view>
				<view class="item-content">
					<view class="city" @click.stop="openCityList">
						{{selCityName}}
						<view class="change-city-link">切换城市</view>
					</view>
				</view>
			</view>
			
			<view class="plan-item">
				<view class="item-title">期末可选：</view>
				<view class="item-content">
					<view class="item-sub" v-if="item && item.finalSelectList.includes(-1)">
						<view class="left" style="height:44rpx;line-height:44rpx;">
							继续订阅 <text style="padding-left:24rpx;color:rgba(10, 15, 45, 0.5);">{{item.nextMouthPayment | $numFormat}}<text style="font-size: 12px;">元/月</text></text>
						</view>
					</view>
					
					<view class="item-sub" v-if="item && item.finalSelectList.includes(0)">
						<view class="left" style="height:44rpx;line-height:44rpx;">
							买断车辆 <text style="padding-left:24rpx;color:rgba(10, 15, 45, 0.5);">{{item.buyoutsFee | $numFormat}}元</text>
						</view>
					</view>
					
					<view class="item-sub" v-if="item && item.finalSelectList.includes(1)">
						<view class="left" style="height:44rpx;line-height:44rpx;">
							退回车辆 <text style="padding-left:24rpx;color:rgba(10, 15, 45, 0.5);">(押金原路退还)</text>
						</view>
					</view>
				</view>
			 </view>
			 
			 <view class="plan-item">
			 	<view class="item-title">车辆押金：</view>
			 	<view class="item-content">
			 		{{item.deposit | $numFormat}}元
			 		<text style="padding-left:14rpx;font-size: 14px;color:rgba(10, 15, 45, 0.5);">(买断可抵尾款)</text>
			 	</view>
			 </view>
			 
			 <view class="plan-item" v-if="item.serviceStr">
			 	<view class="item-title">精选服务：</view>
			 	<view class="item-content item-sub" style='margin-top: 0;'>
			 		<view class="left" style="line-height:44rpx;">
			 			{{item.serviceStr}}
			 		</view>
			 		<view class="right"></view>
			 	</view>
			 </view>
		</view>
		
		<u-popup class='popupClass' border-radius="14" closeable=true mode="bottom" v-model="showPopup">
			<view class="popupClassTop">汽车订阅</view>
			<view class="popupClassBom">
				    汽车订阅是一种让您可以「后悔」的全新汽车消费模式。您仅需一次性支付当期订阅费用，即可开走车辆。 订阅期结束30天前，您再决定是否买断车辆，届时您可以选择全款或金融方案支付尾款购买车辆，也可选择继续订阅或退回车辆结束订阅。
			</view>
		</u-popup>
		
		<u-popup border-radius="14" mode="center" v-model="showQrCode">
			<image
				style="width:550rpx;height:550rpx;"
				:src="qrCodeUrl"
			/>
		</u-popup>
		
		<u-select
			v-model="showCityList" 
			:list="cityList"
			@confirm="confirmCity"
		></u-select>
		
		<u-popup border-radius="14" mode="center" v-model="showMorePayPopup">
			<view class="popup-wrap">
				<view class="title">订阅12期</view>
				<view class="sub-title">（分两次付）</view>
				<view class="pay-table">
					<view 
							v-for="(item1, index1) in morePayList"
							:key="index1"
							class="pay-row"
					>
						<view class="pay-col">{{item1.periodName}}</view>
						<view class="pay-col">{{item1.monthPayment | $numFormat}}元/月</view>
						<view class="pay-col">{{item1.totalPayment | $numFormat}}元</view>
					</view>
				</view>
				<view class="btn" @click.stop="closeMorePayPopup">我知道了</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	props: {
		detail: {
			type: Object,
			required: true,
		},
		
		newType: {
			type: Number,
			required: true,
		},
	},
	
	data() {
		return {
			showPopup: false,
			showQrCode: false,
			qrCodeUrl: '',
			currentCompany: {},
			selCityId: null,
			selCityName: '',
			item: null,
			selCity: {},
			commonItem: {},
			cityList: [],
			showCityList: false,
			showMorePayPopup: false,
			morePayList: [],
		}
	},
	
	async mounted() {
		const value = uni.getStorageSync('cityId')
		if (value) {
			this.selCityId = value
		}
		
		const currentCompany = uni.getStorageSync('current_company')
		if (currentCompany) {
			this.currentCompany = currentCompany
		}
		
		await this.getAllCity()
		this.init()
		
		//this.getWecarsQrCode()
	},
	
	methods: {
		init() {
			const item = this.detail.carSubscribeList.find(city => city.cityId === 0)
			if (item) {
				this.commonItem = item
			}
			
			this.getCurItem()
		},
		
		getAllCity() {
			this.$getRequest(this.$url.openCityList, 'GET', {})
				.then((res) => {
					if(res.code == 0) {
						this.cityList = res.data
						this.cityList.forEach(item => {
							item.value = item.id
							item.label = item.city
						})
						const city = res.data.find(city1 => city1.id == this.selCityId)
						if (city) {
							this.selCityName = city.city
						} else {
							uni.showModal({
								title: '提示',
								content: '很抱歉，您所在的城市暂未开放订阅方案，请选择可用订阅方案城市。',
								confirmText: '选择城市',
								success: (res) => {
									if (res.confirm) {
										this.showCityList = true
									} else if (res.cancel) {
										this.selCityId = '310100'
										this.selCityName = '上海'
										this.getCurItem()
									}
								},
								fail: (err) => {
									console.log('fail', err)
								}
							})
						}
					}
				})
		},
		
		openCityList() {
			this.showCityList = true
		},
		
		confirmCity(e) {
			this.selCityId = e[0].value
			this.selCityName = e[0].label
			this.getCurItem()
		},
		
		getCurItem() {
			const city = this.detail.carSubscribeList.find(city => city.cityId == this.selCityId)
			if (city) {
				this.selCity = city
			} else {
				this.selCity = this.commonItem
			}
			
			this.selCity.id = this.selCity.respVOS[0].id
			this.item = this.selCity.respVOS[0]
			this.getWecarsQrCode()
			
			// this.$emit('change', {
			// 	item: this.item,
			// 	selCityId: this.selCityId
			// })
		},
		
		changePlan(id) {
			this.selCity.id = id
			this.item = this.selCity.respVOS.find(plan => plan.id === this.selCity.id)
		},
		
		openPopup() {
			this.showPopup = true
		},
		
		openQrCode() {
			this.showQrCode = true
		},
		
		// 获取小程序码
		async getWecarsQrCode() {
			let params = {}
			
			//console.log('scene', `${this.cityId}&${this.detail.carTypeYearProductEntity.id}&${this.currentCompany.userId}&${this.detail.carTypeYearProductEntity.carBrandId}&${this.currentCompany.company.id}`)
			if (this.newType === 1) {
				params = {
				  envVersion: 1,
					page: 'pages/home/profile/index',
					
					scene: `${this.selCityId}&${this.detail.carTypeYearProductEntity.id}&${this.currentCompany.userId}&${this.detail.carTypeYearProductEntity.carBrandId}&${this.currentCompany.company.id}&${this.item.id}`,
				}
			} else {
				params = {
				  envVersion: 1,
					page: 'pages/home/certcar/detail',
					scene: `${this.carId}&${this.selCityId}&0&${this.currentCompany.userId}&${this.currentCompany.company.id}`,
				}
			}
			
			const res = await this.$getRequest(this.$url.createUnlimitedQrCode, 'POST', params)
			if (res.code == 0) {
				this.qrCodeUrl = res.data
			}
		},
		
		openMorePayPopup(plan) {
			this.morePayList = plan
			this.showMorePayPopup = true
		},
		
		closeMorePayPopup() {
			this.showMorePayPopup = false
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "~@/styles/mixin.scss";	

.card {
	position: relative;
	.qrcode-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		.qrcode {
			width: 100rpx;
			height: 100rpx;
		}
		.tip {
			height: 48rpx;
			font-size: 10px;
			line-height: 48rpx;
			color: rgba(118, 118, 118, 0.8);
		}
	}
}

.plan-item {
	margin-top: 12px;
	display: flex;
	.item-title {
		margin-right: 24rpx;
		height: 44rpx;
		font-size: 14px;
		line-height: 44rpx;
		color: #64696F;
	}
	.item-content {
		flex: 1;
		font-size: 14px;
		line-height: 44rpx;
		color: #0A0F2D;
		.city {
			display: flex;
			align-items: center;
			.change-city-link {
				padding-left: 24rpx;
				font-size: 12px;
				text-decoration: underline;
				color: #3446AA;
			}
		}
	}
	.item-sub {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.left {
			flex: 1;
			font-size: 14px;
			line-height: 44rpx;
			color: #0A0F2D;
			display: flex;
			align-items: center;
		}
		.right {
			margin-left: 20rpx;
			width: 44rpx;
			height: 44rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
	
	.item-sub {
		margin-top: 12px;
		&:first-child {
			margin-top: 0;
		}
	}
}

.popupClass{
	.popupClassTop{
		width: 100%;
		text-align: center;
		margin: 24px 0;
		height: 21px;
		font-family: PingFangSC-Medium;
		font-size: 15px;
		font-weight: 500;
		line-height: 21px;
		letter-spacing: 0px;
		color: rgba(0, 0, 0, 0.9);
		
	}
	.popupClassBom{
		margin:  28px;
		height: 104px;
		font-family: PingFangSC-Regular;
		font-size: 14px;
		font-weight: normal;
		line-height: 22px;
		letter-spacing: 0px;
		color: rgba(10, 15, 45, 0.8);
		margin-bottom: 90px;
	}
}

.plan-title {
	font-size: 32rpx;
	color: #333333;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.plan-list {
	margin-top: 12px;
	display: flex;
	flex-wrap: wrap;
	.plan {
		margin-right: 24rpx;
		padding: 16rpx 0;
		width: 190rpx;
		height: 156rpx;
		border-radius: 8rpx;
		border: 2rpx solid rgba(10, 15, 45, 0.3);
		display: flex;
		flex-direction: column;
		align-items: center;
		.plan-item1 {
			height: 44rpx;
			font-size: 28rpx;
			line-height: 44rpx;
			color: #0A0F2D;
		}
		.plan-item2 {
			height: 40rpx;
			font-size: 12px;
			line-height: 40rpx;
			color: #0A0F2D;
		}
		.plan-item3 {
			height: 40rpx;
			font-size: 12px;
			line-height: 40rpx;
			color: rgba(10, 15, 45, 0.5);
			display: flex;
			align-items: center;
		}
	}
	.plan:last-child {
		margin-right: 0;
	}
	.checked-plan {
		position: relative;
		border-color: #0256FE;
		.checked-icon-wrap {
			width: 24rpx;
			height: 24rpx;
			background: #0256FE;
			border-radius: 0px 6rpx 0px 4rpx;
			position: absolute;
			top: 0;
			right: 0;
			z-index: 100;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
}

.popup-wrap {
	width: 640rpx;
	padding: 50rpx 32rpx 32rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.title{
		height: 48rpx;
		font-size: 34rpx;
		line-height: 48rpx;
		color: rgba(0, 0, 0, 0.9);
	}
	.sub-title {
		margin-top: 12rpx;
		margin-bottom: 32rpx;
		height: 48rpx;
		font-size: 24rpx;
		line-height: 48rpx;
		color: #767676;
	}
	.pay-table {
		width: 100%;
		border-radius: 8px;
		border: 2rpx solid rgba(10, 15, 45, 0.2);
		.pay-row {
			height: 90rpx;
			display: flex;
			border-bottom: 2rpx solid rgba(10, 15, 45, 0.2);
			font-size: 24rpx;
			color: rgba(10, 15, 45, 0.6);
			.pay-col {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				border-right: 2rpx solid rgba(10, 15, 45, 0.2);
			}
			.pay-col:last-child {
				border-right: none;
			}
		}
		.pay-row:last-child {
			border-bottom: none;
			color: rgba(10, 15, 45, 0.7);
		}
	}
	.btn {
		margin-top: 70rpx;
		width: 100%;
		height: 88rpx;
		border-radius: 16rpx;
		background: rgba(10, 15, 45, 0.9);
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 14px;
		color: #FFFFFF;
	}
}
</style>