<template>
	<view>
		<view class="plan-step-card">
			<view class="item-wrap">
				<view class="item-title">方案模板</view>
				<view class="item-content">
					先用后买
				</view>
			</view>
			
			<view class="item-wrap">
				<view class="item-title">订阅周期</view>
				<view class="item-content">
					6期
				</view>
			</view>
			
			<view class="item-wrap">
				<view class="item-title">
					车辆价格
					<view style="margin-left:8rpx;" @click.stop="openPopup">
						<u-icon name="info-circle" color="rgba(10, 15, 45, 0.5)" size="32"></u-icon>
					</view>
				</view>
				<view class="item-content">
					<input
						v-model="nakedCarPrice"
						class="input"
						type="digit"
						inputmode="numeric"
						placeholder="请输入车辆价格"
						placeholder-style="font-size:14px;color:#A4AEBB;"
						@input="handlerInputNakedCarPrice"
					/>
					<text class="right-icon">元</text>
				</view>
			</view>
	
			<view class="item-wrap">
				<view class="item-title">订阅押金</view>
				<view class="item-content">
					{{deposit ? deposit : '根据车辆价格自动计算'}}
				</view>
			</view>
			
			<Slide 
				:nakedCarPrice="nakedCarPrice"
				:initAmortizeRate="createData.firstPeriodRate"
				:financeSchemeId="createData.financeSchemeId"
				:carTypeYearProductId="createData.carTypeYearProductId"
				:newType="createData.newType"
				@calculator="calculator"
			/>
			
			
			
			<view class="price-wrap">
				<view class="price-title">订阅费用</view>
				<view class="price-month">（{{monthPayment ? monthPayment : '-'}}元/月）</view>
				<view class="price">{{payment ? payment : '-'}}元</view>
			</view>
			
		</view>
		
		<view class="step1-wrap" @click="nextStep">
			下一步
		</view>
		
		
		<u-popup border-radius="14" closeable=true mode="bottom" v-model="showPopup">
			<view class="popup-wrap"> 
				<view class="popup-title">车辆价格</view>
				<view class="popup-container">
					如客户成功订阅，WEACARS支付给您的车辆采购价格，将取您设置的价格与该车辆在「车300App」中“车况良好”的车商收购评估价之间取低值。
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { validIntegerNum } from '@/utils/validate'
import { formatThousandNumber } from '@/utils/index.js'
import Slide from './Slide.vue'

export default {
	components: {
		Slide,
	},
	
	props: {
		type: {
			type: String,
			required: true, // 1.新车 2.二手车
		},
		
		createData: {
			type: Object,
			default: () => ({})
		}
	},
	
	data() {
		return {
			showGouZhiShui: false,
			showBaoZhengJinAndDingYueFei: false,
			gouzhishui: null,
			baozhengjin: null,
			dingyuefei: null,
			deposit: null,
			showPopup: false,
			payment: null,
			monthPayment: null,
			financeSchemeId: null,
			nakedCarPrice: null,
		}
	},
	
	mounted() {
		this.nakedCarPrice = this.createData.nakedCarPrice
	},
	
	methods: {
		calculator(data) {
			this.createData.firstPeriodRate = data.firstPeriodRate
			this.monthPayment = data.apportionRateReqVoList[0].mouthPayment
			this.payment = data.apportionRateReqVoList[0].totalPayment
		},
		
		async getProductTemplate() {
			const params = {
				newOrOld: this.createData.newType,
			}
			
			const res = await this.$getRequest(this.$url.getProductTemplate, "GET", params)
			
			if (res.code == 0) {
				this.financeSchemeId = res.data[0].financialSchemeId
			}
		},
		
		handlerInputNakedCarPrice(e) {
			const value = e.detail.value.trim()
			if(value) {
				if(!validIntegerNum(value)) {
					uni.showToast({
						title: '请输入正确的价格',
						duration: 2000,
						icon: "none"
					})
					return
				}
			}
		},
		
		formatThousandNumber(price) {
			return formatThousandNumber(price)
		},
		
		openPopup() {
			this.showPopup = true
		},
		
		validate() {
			if(!this.nakedCarPrice) {
				uni.showToast({
					title: '请输入裸车价格',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!validIntegerNum(this.nakedCarPrice)) {
				uni.showToast({
					title: '请正确输入裸车价格',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			return true
		},
		
		nextStep() {
			if(!this.validate()) {
				return
			}
			
			this.$emit('nextStep', {
				step: 1,
				nakedCarPrice: this.nakedCarPrice,
				firstPeriodRate: this.createData.firstPeriodRate,
			})
		},
	}
}
</script>

<style lang="scss" scoped>
@import "../styles/plan.scss";

.plan-step-card {
	padding-bottom: 16px;
}
.item-wrap {
	height: 112rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 14px;
	color: #0A0F2D;
	.item-title {
		display: flex;
		align-items: center;
	}
	.item-content {
		display: flex;
		align-items: center;
		.right-icon {
			padding-left: 16rpx;
		}
		.input {
			text-align: right;
			font-size: 14px;
			color: #0A0F2D;
		}
		.calculate-price {
			display: flex;
			align-items: center;
		}
	}
	box-shadow: inset 0px -1px 0px 0px rgba(10, 15, 45, 0.04);
	&:last-child {
		box-shadow: none;
	}
}

.step1-wrap {
	margin-top: 60px;
	width: 100%;
	height: 116rpx;
	border-radius: 16rpx;
	background: #4170EE;
	font-size: 17px;
	font-weight: 500;
	color: #FFFFFF;
	display: flex;
	justify-content: center;
	align-items: center;
}

.price-wrap {
	height: 44rpx;
	font-size: 14px;
	color: #0A0F2D;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.price-month {
		color: #BFBFBF;
	}
}

.popup-wrap {
	padding: 16px 40rpx 86px;
	.popup-title {
		height: 42rpx;
		font-size: 15px;
		line-height: 42rpx;
		color: rgba(0, 0, 0, 0.9);
		text-align: center;
	}
	.popup-container {
		padding-top: 30px;
		font-size: 14px;
		line-height: 44rpx;
		color: rgba(10, 15, 45, 0.8);
	}
}
</style>
