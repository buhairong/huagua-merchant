<template>
	<view>
		<view class="title-wrap">
			<view class="left-border"></view>
			上传车辆信息
		</view>
		<view class="item-wrap">
			<view class="item-title">车架号</view>
			<view class="item-content">
				<input
					v-model="createData.carVin"
					class="input"
					maxlength="30"
					placeholder="请输入车架号"
					placeholder-style="font-size:14px;color:#A4AEBB;"
				/>
			</view>
		</view>
		
		<view class="item-wrap">
			<view class="item-title">发动机号</view>
			<view class="item-content">
				<input
					v-model="createData.carEngineNum"
					class="input"
					maxlength="30"
					placeholder="请输入发动机号"
					placeholder-style="font-size:14px;color:#A4AEBB;"
				/>
			</view>
		</view>
		
		<view class="item-wrap">
			<view class="item-title">实表里程数</view>
			<view class="item-content">
				<input
					v-model="createData.mileage"
					class="input"
					type="digit"
					placeholder="请输入实表里程数"
					placeholder-style="font-size:14px;color:#A4AEBB;"
				/>
			</view>
		</view>
		
		<view class="fixed-btn-wrap">
			<view class="step1-wrap" @click="nextStep">
				下一步
			</view>
		</view>
	</view>
</template>

<script>
import { validIntegerNum } from '@/utils/validate'

export default {
	props: {
		createData: {
			type: Object,
			default: () => ({})
		}
	},
	
	mounted() {
		
	},
	
	data() {
		return {
			
		}
	},
	
	methods: {
		validate() {
			if(!this.createData.carVin) {
				uni.showToast({
					title: '请输入车架号',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.createData.carEngineNum) {
				uni.showToast({
					title: '请输入发动机号',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.createData.mileage && this.createData.mileage !== 0) {
				uni.showToast({
					title: '请输入实表里程数',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!validIntegerNum(this.createData.mileage)) {
				uni.showToast({
					title: '请正确输入实表里程数',
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
				carVin: this.createData.carVin,
				carEngineNum: this.createData.carEngineNum,
				mileage: this.createData.mileage,
			})
		},
	}
}
</script>

<style lang="scss" scoped>
@import "../styles/car.scss";

.step1-wrap {
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
</style>
