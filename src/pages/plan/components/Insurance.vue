<template>
	<view>
		<view>
			<view class="card">
				<view class="title-wrap">
					<view class="title">
						机动车交强险
					</view>
				</view>
				
				<view v-if="insuranceType1">
					<view class="insurance-company">
						{{insuranceType1.insuranceCompanyName}}
					</view>
					
					<view class="item">
						<view class="item-title">
							<view class="plate">
								<view class="city">{{secondCarInfo.carPlateNum && secondCarInfo.carPlateNum.slice(0,1)}}</view>
								<view class="number">{{secondCarInfo.carPlateNum && secondCarInfo.carPlateNum.slice(1)}}</view>
							</view>
						</view>
						<view class="item-content">
							<view class="icon-wrap" @click="previewInsurance(insuranceType1)">
								<image
									class="icon"
									src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_407.png"
								/>
								查看保单
							</view>
							<view class="icon-wrap" @click="modifyInsurance(insuranceType1, 0)">
								<image
									class="icon"
									src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_408.png"
								/>
								修改保单
							</view>
						</view>
					</view>
				</view>
				<view class="add-wrap" @click="addInsurance(0)" v-else>
					<image
						class="add-icon"
						src="https://image.51cheyaoshi.com/xcx/merchant/static/product/Group_660.png"
					/>
					<view class="add-tip">
						添加电子保险单或照片
					</view>
				</view>
			</view>
			
			<view class="card">
				<view class="title-wrap">
					<view class="title">
						机动车商业险
					</view>
				</view>
				
				<view v-if="insuranceType2">
					<view class="insurance-company">
						{{insuranceType2.insuranceCompanyName}}
					</view>
					
					<view class="item">
						<view class="item-title">
							<view class="plate">
								<view class="city">{{secondCarInfo.carPlateNum && secondCarInfo.carPlateNum.slice(0,1)}}</view>
								<view class="number">{{secondCarInfo.carPlateNum && secondCarInfo.carPlateNum.slice(1)}}</view>
							</view>
						</view>
						<view class="item-content">
							<view class="icon-wrap" @click="previewInsurance(insuranceType2)">
								<image
									class="icon"
									src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_407.png"
								/>
								查看保单
							</view>
							<view class="icon-wrap" @click="modifyInsurance(insuranceType2, 1)">
								<image
									class="icon"
									src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_408.png"
								/>
								修改保单
							</view>
						</view>
					</view>
				</view>
				<view class="add-wrap" @click="addInsurance(1)" v-else>
					<image
						class="add-icon"
						src="https://image.51cheyaoshi.com/xcx/merchant/static/product/Group_660.png"
					/>
					<view class="add-tip">
						添加电子保险单或照片
					</view>
				</view>
			</view>
			
			
		</view>
	</view>
</template>

<script>
export default {
	props: {
		secondCarInfo: {
			type: Object,
			required: true
		},
	},
	
	watch: {
		secondCarInfo: {
			handler(value) {
				if (value.insuranceList) {
					const insuranceType1 = value.insuranceList.find(item => item.insuranceType == 0)
					if (insuranceType1) {
						this.insuranceType1 = insuranceType1
					}
					
					const insuranceType2 = value.insuranceList.find(item => item.insuranceType == 1)
					if (insuranceType2) {
						this.insuranceType2 = insuranceType2
					}
				}
			},
			deep: true,
			immediate: true
		}
	},
	
	data() {
		return {
			insuranceType: ['机动车交强险', '机动车商业险'], // 保单类别：0 机动车交强险，1 机动车商业险
			insuranceType1: null, // 交强险
			insuranceType2: null, // 商业险
		}
	},
	
	onShow() {
		
	},
	
	methods: {
		previewInsurance(item) {
			try {
				uni.setStorageSync('insurance_detail', JSON.stringify(item))
				uni.navigateTo({
					url: '/pages/car/insuranceDetail'
				})
			} catch (e) {
				// error
			}
		},
		
		addInsurance(insuranceType) {
			uni.navigateTo({
				url: `/pages/car/addInsurance?operator=add&insuranceType=${insuranceType}&carId=${this.secondCarInfo.id}&newOrOld=${this.secondCarInfo.newOrOld}`
			})
		},
		
		modifyInsurance(item, insuranceType) {
			try {
				uni.setStorageSync('insurance_detail', JSON.stringify(item))
				uni.navigateTo({
					url: `/pages/car/addInsurance?operator=update&insuranceType=${insuranceType}&carId=${this.secondCarInfo.id}&newOrOld=${this.secondCarInfo.newOrOld}`
				})
			} catch (e) {
				// error
			}
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.cars-wrap {
	padding-bottom: 100px;
}

.card {
	padding: 20px 32rpx;
	.title {
		margin-bottom: 4px;
	}
	.insurance-company {
		height: 42rpx;
		font-size: 14px;
		line-height: 42rpx;
		color: #86909C;
	}
	.item {
		margin-top: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.item-title {
			padding-right: 20rpx;
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
		}
		.item-content {
			display: flex;
			.icon-wrap {
				margin-left: 48rpx;
				display: flex;
				align-items: center;
				height: 36rpx;
				font-size: 12px;
				color: #4E5969;
				.icon {
					width: 32rpx;
					height: 32rpx;
					margin-right: 8rpx;
				}
			}
		}
	}
	
	.add-wrap {
		margin-top: 30px;
		margin-bottom: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		.add-icon {
			width: 40rpx;
			height: 40rpx;
		}
		.add-tip {
			padding-left: 16rpx;
			font-size: 14px;
			color: #4E5969;
		}
	}
}

.btn-wrap {
	padding: 0 32rpx;
	position: fixed;
	left: 0;
	bottom: 50px;
	width: 100%;
	.btn {
		width: 100%;
		height: 116rpx;
		border-radius: 16rpx;
		background: #4170EE;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 17px;
		font-weight: 500;
		color: #FFFFFF;
	}
}
</style>