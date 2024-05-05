<template>
	<view>
		<view class="tip1">
			分销佣金是平台合伙人或其他商户帮您引荐客户，最终成交后您所给予的奖励。您设置分销佣金后，平台其他商户及海量的合伙人将会一起帮您推广，具体金额您可自由设置，金额越高合伙人和商户会越有动力。
		</view>
		
		<view class="title-wrap">
			<view class="left-border"></view>
			请设置分销佣金
		</view>
		
		<view class="input-wrap">
			<input
				v-model="createData.distributionBrokerage"
				class="input"
				type="number"
				placeholder="请输入分销佣金"
				placeholder-style="font-size:14px;color:#A4AEBB;"
			/>
			<view class="unit">元</view>
		</view>
		
		<view class="btn-group-wrap">
			<view class="tip2">未设置分销佣金则不开启分销，添加车辆后可在后台进行配置</view>
			<view class="btn-group">
				<view class="btn" @click="prevStep">
					上一步
				</view>
				<view class="btn save-btn" @click="save">
					保存方案
				</view>
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
			
		}
	},
	
	methods: {
		validate() {
			if ((this.createData.distributionBrokerage && this.createData.distributionBrokerage !== 0) && 
				!validIntegerNum(this.createData.distributionBrokerage)) {
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
				step: this.type == 1 ? 2 : 1,
				distributionBrokerage: this.createData.distributionBrokerage,
			})
		},
		
		save() {
			if(!this.validate()) {
				return
			}
			
			this.$emit('save', {
				distributionBrokerage: this.createData.distributionBrokerage
			})
		},
	}
}
</script>

<style lang="scss" scoped>
@import "../styles/plan.scss";

.tip1 {
	padding-top: 8px;
	font-size: 12px;
	line-height: 40rpx;
	color: #4E5969;
	text-indent: 2em;
}

.title-wrap {
	margin-top: 24px;
	.left-border {
		background: #1D2129;
	}
}

.input-wrap {
	height: 104rpx;
	line-height: 104rpx;
	border-radius: 16rpx;
	background: #F7F8FA;
	padding: 0 32rpx;
	display: flex;
	align-items: center;
}

.input {
	flex: 1;
	height: 104rpx;
	line-height: 104rpx;
}

.unit {
	padding-left: 32rpx;
}

.btn-group-wrap {
	width: 100%;
	position: fixed;
	left: 0;
	bottom: 40px;
	padding: 0 32rpx;
	.tip2 {
		height: 36rpx;
		font-size: 12px;
		line-height: 36rpx;
		color: #4E5969;
	}
}

.btn-group {
	margin-top: 12px;
}
</style>
