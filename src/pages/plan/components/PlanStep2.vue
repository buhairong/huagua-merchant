<template>
	<view>
		<!-- <view class="plan-step-card">
			<view class="title-wrap">
				<view class="left-border"></view>
				差异化服务
			</view>
			<view class="item-wrap">
				<view class="item-title">订阅限定里程</view>
				<view class="item-content">
					<input
						v-model="createData.limitMileage"
						type="number"
						class="input"
						placeholder="请输入公里数"
						placeholder-style="font-size:14px;color:#A4AEBB;"
					/>
					<text class="right-icon">公里</text>
				</view>
			</view>
			<view class="item-wrap">
				<view class="item-title">超出里程另付</view>
				<view class="item-content">
					<input
						v-model="createData.overMileageFee"
						type="number"
						class="input"
						placeholder="请输入金额"
						placeholder-style="font-size:14px;color:#A4AEBB;"
					/>
					<text class="right-icon">元/公里</text>
				</view>
			</view>
		</view> -->
		
		<view class="plan-step-card">
			<view class="title-wrap">
				<view class="left-border"></view>
				特色服务
			</view>
			
			<view 
				class="item-wrap"
				v-for="(item, index) in carSubscribeFreeServiceList"
				:key="index"
			>
				<u-checkbox v-model="item.isChecked" label-size="28">{{item.serviceName}}</u-checkbox>
				<u-number-box 
					v-if="item.size"
					v-model="item.size"
					:min="1"
					:disabled-input="true"
					bg-color="#ffffff"
					color="#1D2129"
					size="24"
					:disabled="!item.isChecked"
				></u-number-box>
			</view>
		</view>
		
		<view class="plan-step-card">
			<view class="title-wrap">
				<view class="left-border"></view>
				保障服务
			</view>
			
			<view 
				class="item-wrap"
				v-for="(item, index) in safeguardServices"
				:key="index"
			>
				<u-checkbox v-model="item.isChecked" label-size="28">{{item.serviceName}}</u-checkbox>
			</view>
		</view>
		
		<view class="btn-group">
			<view class="btn" @click="prevStep">
				上一步
			</view>
			<view class="btn next-step" @click="nextStep">
				保存方案
			</view>
		</view>
	</view>
</template>

<script>
import { validIntegerNum } from '@/utils/validate'

export default {
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
			carSubscribeFreeServiceList: [],
			safeguardServices: [],
			limitMileage: null,
			overMileageFee: null,
		}
	},
	
	watch: {
		createData: {
			handler(value) {
				this.carSubscribeFreeServiceList = value.carSubscribeFreeServiceList
				this.safeguardServices = value.safeguardServices
			},
			deep: true,
			immediate: true
		}
	},
	
	methods: {
		validate() {
			if(!this.createData.limitMileage) {
				uni.showToast({
					title: '请输入公里数',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!validIntegerNum(this.createData.limitMileage)) {
				uni.showToast({
					title: '请正确输入公里数',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.createData.overMileageFee) {
				uni.showToast({
					title: '请输入金额',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!validIntegerNum(this.createData.overMileageFee)) {
				uni.showToast({
					title: '请正确输入金额',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			return true
		},
		
		prevStep() {
			// if(!this.validate()) {
			// 	return
			// }
			
			this.$emit('prevStep', {
				step: 0,
				limitMileage: this.createData.limitMileage,
				overMileageFee: this.createData.overMileageFee,
				carSubscribeFreeServiceList: this.carSubscribeFreeServiceList,
				safeguardServices: this.safeguardServices,
			})
		},
		
		nextStep() {
			// if(!this.validate()) {
			// 	return
			// }
			
			this.$emit('save', {
				step: 2,
				limitMileage: this.createData.limitMileage,
				overMileageFee: this.createData.overMileageFee,
				carSubscribeFreeServiceList: this.createData.carSubscribeFreeServiceList,
				safeguardServices: this.createData.safeguardServices,
			})
		},
	}
}
</script>

<style lang="scss" scoped>
@import "../styles/plan.scss";

u-checkbox {
	font-size: 14px;
	color: #1D2129;
}

u-number-box {
	border: 1px solid #F2F3F5;
	::v-deep .u-number-input{
		margin: 0;
		border: 1px solid #F2F3F5;
	}
}

.plan-step-card {
	padding-top: 20px;
	padding-bottom: 20px;
	.item-wrap {
		margin-bottom: 12px;
		height: 44rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;
		color: #1D2129;
		.item-content {
			padding-left: 60rpx;
			flex: 1;
			display: flex;
			justify-content: space-between;
		}
		.input {
			flex: 1;
			height: 44rpx;
			line-height: 44rpx;
		}
		
	}
}
</style>
