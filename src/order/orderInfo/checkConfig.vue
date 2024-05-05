<template>
	<view class="page">
		<view>
			<view class="header">
				<view class="car-brand-wrap">
					<view class="brand">
						{{orderCarInfo.carBrand}} {{orderCarInfo.carType}}
					</view>
					<view class="car-type">
						{{orderCarInfo.carTypeYear}} {{orderCarInfo.carTypeYearProduct}}
					</view>
					<view class="plate" v-if="orderCarInfo.carPlateNum">
						<view class="city">{{orderCarInfo.carPlateNum && orderCarInfo.carPlateNum.slice(0,1)}}</view>
						<view class="number">{{orderCarInfo.carPlateNum && orderCarInfo.carPlateNum.slice(1)}}</view>
					</view>
				</view>
				
				<image
					class="car-img"
					:src="orderCarInfo.imageUrl"
					mode="aspectFill"
				/>
			</view>
			
			<view class="section" v-if="orderCarInfo.configRespVo.configDtoList && orderCarInfo.configRespVo.configDtoList.length">
				<u-section
					style="width:100%"
					title="已有增配项" 
					line-color="#1D2129"
					font-size="32"
					color="#1D2129"
					:arrow="false"
					:right="false"
				></u-section>
				
				<view class="has-config-item" v-for="item in configJSON.customConfig" :key="item.locId">
					<view class="config-name">{{item.detailName}}</view>
					<view class="right">
						<view v-for="radio in radioList" :key="radio.id" class="radio-item" :class="{'active-radio': radio.id === item.isHas}" @click="changeHasStatus(item.locId, radio.id)">
							{{radio.label}}
						</view>
					</view>
				</view>
			</view>
			
			<!-- <view class="section">
				<u-section
					style="width:100%"
					title="添加增配项" 
					line-color="#1D2129"
					font-size="32"
					color="#1D2129"
					:arrow="false"
					:right="false"
				></u-section>
				
				<view class="add-config-item" v-for="item in configJSON.addConfig[0].details" :key="item.locId">
					<view @click="del(item.locId)" style="margin-right:16rpx;">
						<u-icon name="minus-circle-fill" color="rgba(29, 33, 41, 0.6)" size="32"></u-icon>
					</view>
					
					<view class="input-wrap" style="flex:1;">
						<input
							v-model="item.detailName"
							class="input"
							placeholder="请输入增配项"
							placeholder-style="font-size:14px;color:#A4AEBB;"
							maxlength="20"
						/>
					</view>
					
					<view class="input-wrap" style="margin-left:16rpx;width:234rpx;">
						<input
							v-model="item.money"
							inputmode="numeric"
							class="input"
							placeholder="请输入金额"
							placeholder-style="font-size:14px;color:#A4AEBB;"
						/>
						<view class="unit">元</view>
					</view>
				</view>
				
				<view class="add-wrap" >
					<view class="add" @click="addConfig">
						<u-icon name="plus-circle-fill" color="#4170EE" size="32"></u-icon>
						<view class="tip">更多增配项</view>
					</view>
				</view>
			</view> -->
			
		</view>
		
		<view class="bottom-btn" @click="save">下一步</view>
		
	</view>
</template>

<script>
import { validIntegerNum } from '@/utils/validate'

export default {
	data() {
		return {
			orderId: '',
			newType: '',
			carId: '',
			orderCarInfo: {},
			configJSON: {
				customConfig: [],
				addConfig: [{
					details: [],
					function: '',
				}],
			},
			locId: 1,
			radioList: [
				{id: 1, label: '有'},
				{id: 2, label: '无'},
			],
		}
	},
	
	onLoad(options){
		this.orderId = options.orderId
		this.newType = options.newType
		this.carId = options.carId
		
		const orderCarInfo = uni.getStorageSync('orderCarInfo')
		if (orderCarInfo) {
			this.orderCarInfo = orderCarInfo
			const configJSON = orderCarInfo.otherConfigInfo
			if (configJSON) {
				this.configJSON = configJSON
				if (configJSON.addConfig && configJSON.addConfig[0].details && configJSON.addConfig[0].details.length) {
					let max = 0
					this.configJSON.addConfig[0].details.forEach(item => {
						if (item.locId > max) {
							max = item.locId
						}
					})
					
					this.locId = max
				} else {
					this.addConfig()
				}
			} else {
				if(orderCarInfo.configRespVo.configDtoList && orderCarInfo.configRespVo.configDtoList.length) {
					for(const item of orderCarInfo.configRespVo.configDtoList) {
						for(const item1 of item.details) {
							this.configJSON.customConfig.push({
								...item1,
								isHas: 0, // 0. 未选 1.有 2.无 
								locId: ++this.locId,
							})
						}
					}
				}
				
				this.addConfig()
			}
		}
	},
	
	methods: {
		changeHasStatus(locId, id) {
			const index = this.configJSON.customConfig.findIndex(item => item.locId === locId)
			if (index !== -1) {
				this.configJSON.customConfig[index].isHas = id
			}
		},
		
		addConfig() {
			this.configJSON.addConfig[0].details.push({
				locId: ++this.locId,
				detailName: '',
				hasCheck: 1,
				money: undefined,
			})
		},
		
		del(locId) {
			const index = this.configJSON.addConfig[0].details.findIndex(item => item.locId === locId)
			if (index !== -1) {
				uni.showModal({
					title: '提示',
					content: '确定要删除这个增配项吗？',
					success: (res) => {
						if (res.confirm) {
							this.configJSON.addConfig[0].details.splice(index, 1)
						}
					}
				})
			}
		},
		
		async save() {
			this.configJSON.addConfig[0].details = this.configJSON.addConfig[0].details.filter(item => item.detailName || item.money)
			for(const item of this.configJSON.addConfig[0].details) {
				if (!item.detailName.trim()) {
					uni.showToast({
						title: '请输入增配项',
						duration: 2000,
						icon: "none"
					})
					return false
				}
				if (!item.money) {
					uni.showToast({
						title: '请输入金额',
						duration: 2000,
						icon: "none"
					})
					return false
				}
				
				if (!validIntegerNum(item.money)) {
					uni.showToast({
						title: '请正确输入金额',
						duration: 2000,
						icon: "none"
					})
					return false
				}
			}
			
			const otherConfigList = [
				{
					details: [
						...this.configJSON.customConfig.filter(item => item.isHas === 1),
						...this.configJSON.addConfig[0].details,
					],
					function: '',
				}
			]
			
			const params = {
				id: this.orderCarInfo.deliveryInfoId,
				carId: this.carId,
				deliveryType: this.orderCarInfo.category,
				newType: this.newType,
				orderId: this.orderId,
				otherConfigInfo: JSON.stringify(this.configJSON),  
				otherConfigList,
				createId: this.orderCarInfo.createId,
			}
			
			const res = await this.$getRequest(this.$url.insertOrUpdateCheckOtherConfig, 'POST', params)
			if (res.code == 0) {
				uni.navigateTo({
					url: `/order/orderInfo/uploadDeliveryCarPics?carId=${this.carId}&orderId=${this.orderId}&newOrOld=${this.newType}&validId=${res.data}`
				})
			}
			
		},
		
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
	
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
				margin-top: 4px;
				font-size: 12px;
				line-height: 36rpx;
				color: #86909C;
			}
			.plate {
				margin-top: 8px;
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
		}
	}
	.section {
		margin-top: 24px;
		.has-config-item {
			margin-top: 16px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.config-name {
				font-size: 15px;
				color: #1D2129;
			}
			.right {
				display: flex;
				.radio-item {
					margin-left: 24rpx;
					width: 140rpx;
					height: 70rpx;
					border-radius: 8rpx;
					background: rgba(10, 15, 45, 0.04);
					font-size: 14px;
					color: #1A1A1A;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.active-radio {
					color: #4170EE;
				}
			}
		}
		.add-config-item {
			margin-top: 16px;
			display: flex;
			align-items: center;
			.input-wrap {
				height: 96rpx;
				line-height: 96rpx;
				border-radius: 16rpx;
				background: #F7F8FA;
				padding: 0 24rpx;
				display: flex;
				align-items: center;
			}
			.input {
				flex: 1;
				height: 96rpx;
				line-height: 96rpx;
			}
		}
		.add-wrap {
			margin-top: 16px;
			display: flex;
			align-items: center;
			.add {
				display: flex;
				align-items: center;
			}
			.tip {
				height: 40rpx;
				font-size: 14px;
				line-height: 40rpx;
				color: #1D2129;
				padding-left: 14rpx;
			}
		}
	}
	
	

}

</style>