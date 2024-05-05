<template>
	<view class="wrap">
		<view
			v-for="(item,index) in detail.templateRespVO" 
			:key="index" 
			class="card"
		>
			<view class="plan-item" style='margin-top: 0;'>
				<view class="item-title">订阅费用：</view>
				<view class="item-content item-sub" style='margin-top: 0;'>
					<view class="left">
						<text style="color:#F51A4E; font-weight: 500; font-size:16px">{{item.monthPay | $numFormat}}<text style="font-size: 12px;">元/月</text></text>
						<view style="margin-left: 16rpx;" @click.stop="openPopup">
							<u-icon class="info-circle" name="info-circle"></u-icon>
						</view>
					</view>
				</view>
			</view>
			
			<view class="plan-item">
				<view class="item-title">订阅周期：</view>
				<view class="item-content">
					{{item.monthTotal}}期
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
			
			<view class="plan-item">
				<view class="item-title">期末可选：</view>
				<view class="item-content">
					<view class="item-sub" v-if="item.finalSelect.includes(-1)">
						<view class="left" style="height:44rpx;line-height:44rpx;">
							继续订阅 <text style="padding-left:24rpx;color:rgba(10, 15, 45, 0.5);">{{item.nextMouthPayment | $numFormat}}<text style="font-size: 12px;">元/月</text></text>
						</view>
					</view>
					
					<view class="item-sub" v-if="item.finalSelect.includes(0)">
						<view class="left" style="height:44rpx;line-height:44rpx;">
							买断车辆 <text style="padding-left:24rpx;color:rgba(10, 15, 45, 0.5);">{{item.buyoutsFee | $numFormat}}元</text>
						</view>
					</view>
					
					<view class="item-sub" v-if="item.finalSelect.includes(1)">
						<view class="left" style="height:44rpx;line-height:44rpx;">
							退回车辆 <text style="padding-left:24rpx;color:rgba(10, 15, 45, 0.5);">(押金原路退还)</text>
						</view>
					</view>
				</view>
			 </view>
			 
			 <view class="qrcode-wrap" @click="openQrCode">
					<image
						class="qrcode"
						:src="qrCodeUrl"
					/>
					<view class="tip">扫我下单</view>
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
			cityId: '310100',
			currentCompany: {},
		}
	},
	
	mounted() {
		
		const value = uni.getStorageSync('cityId')
		if (value) {
			this.cityId = value
		}
		
		const currentCompany = uni.getStorageSync('current_company')
		console.log('currentCompany', currentCompany)
		if (currentCompany) {
			this.currentCompany = currentCompany
		}
		
		this.getWecarsQrCode()
	},
	
	methods: {
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
					
					scene: `${this.cityId}&${this.detail.carTypeYearProductEntity.id}&${this.currentCompany.userId}&${this.detail.carTypeYearProductEntity.carBrandId}&${this.currentCompany.company.id}`,
				}
			} else {
				params = {
				  envVersion: 1,
					page: 'pages/home/certcar/detail',
					scene: `${this.carId}&${this.cityId}&0&${this.currentCompany.userId}&${this.currentCompany.company.id}`,
				}
			}
			
			const res = await this.$getRequest(this.$url.createUnlimitedQrCode, 'POST', params)
			if (res.code == 0) {
				this.qrCodeUrl = res.data
			}
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
		position: absolute;
		top: 32rpx;
		right: 32rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 100;
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
</style>