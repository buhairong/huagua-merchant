<template>
	<view>
		<view class="plan-step-card" v-if="type == 1">
			<view class="title-wrap">
				<view class="left-border"></view>
				设置车辆颜色
			</view>
			
			<view class="sub-title">可提供的外观颜色（多选）</view>
			
			<view class="color-list">
				<view 
					class="color-wrap"
					v-for="(item, index) in colors"
					:key="index"
					@click="toggleCheckedColor(item)"
				>
					<view class="color" :style="{backgroundColor: item.colorNum}">
						<!-- <image
							v-if="item.hasCheck == 1"
							class="color-checked-img"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/home/checked.png"
							mode="widthFix"
						/> -->
						<u-icon v-if="item.hasCheck == 1" name="checkbox-mark" :color="whiteColors.includes(item.colorNum) ? '#000000' : '#ffffff'" size="28"></u-icon>
					</view>
					<view class="color-name">{{item.colorName}}</view>
				</view>
			</view>
		</view>
		
		<view class="plan-step-card">
			<view class="title-wrap">
				<view class="left-border"></view>
				可提供的增配项
			</view>
			<view 
				class="item-wrap"
				v-for="(item, index) in otherConfigs"
				:key="item.id"
			>
				<view class="left">
					<view @click="del(item.id)">
						<u-icon name="minus-circle-fill" color="rgba(29, 33, 41, 0.6)" size="32"></u-icon>
					</view>
					<view class="input-wrap">
						<input
							v-model="item.detailName"
							class="input"
							placeholder="请输入增配项"
							placeholder-style="font-size:14px;color:#A4AEBB;"
							maxlength="20"
							@input="(e) => handlerInputDetailName(e, item, index)"
						/>
					</view>
				</view>
				<view class="right">
					<view class="input-wrap">
						<input
							v-model="item.money"
							type="number"
							class="input"
							placeholder="请输入金额"
							placeholder-style="font-size:14px;color:#A4AEBB;"
							@input="(e) => handlerInputDetailMoney(e, item, index)"
						/>
						<view class="unit">元</view>
					</view>
				</view>
			</view>
			
			<view class="add-wrap" >
				<view class="add" @click="add">
					<u-icon name="plus-circle-fill" color="#4170EE" size="32"></u-icon>
					<view class="tip">更多增配项</view>
				</view>
			</view>
		</view>
		
		<view class="btn-group" :class="{'old-car-btn-group': type == 2}">
			<view class="btn" @click="prevStep">
				上一步
			</view>
			<view class="btn next-step" @click="nextStep">
				下一步
			</view>
		</view>
	</view>
</template>

<script>
import { validIntegerNum } from '@/utils/validate'
import { whiteColors } from '@/constants/index.js'

export default {
	props: {
		type: {
			type: String,
			required: true, // 1.新车 2.二手车
		},
		
		createData: {
			type: Object,
			default: () => ({})
		},
	},
	
	data() {
		return {
			otherConfigs: [],
			colors: [],
			whiteColors,
		}
	},
	
	watch: {
		createData: {
			handler(value) {
				this.colors = value.colors
				if (value.otherConfigs && value.otherConfigs.length) {
					this.otherConfigs = value.otherConfigs[0].details
				}
			
			},
			deep: true,
			immediate: true
		}
	},
	
	methods: {
		toggleCheckedColor(item) {
			if (item.hasCheck == 0) {
				item.hasCheck = 1
			} else {
				item.hasCheck = 0
			}
		},
		
		add() {
			let maxId = 1
			for(const item of this.otherConfigs) {
				if (item.id > maxId) {
					maxId = item.id
				}
			}
			
			maxId += 1
			
			this.otherConfigs.push(
				{
					id: maxId,
					detailName: "",
					hasCheck: 1,
					money: undefined,
				}
			)
		},
		
		handlerInputDetailName(e, item, index) {
			this.otherConfigs[index].detailName = e.detail.value
		},
		
		handlerInputDetailMoney(e, item, index) {
			this.otherConfigs[index].money = e.detail.value
		},
		
		del(id) {
			const index = this.otherConfigs.findIndex(item => item.id === id)
			if (index !== -1) {
				uni.showModal({
					title: '提示',
					content: '确定要删除这个增配项吗？',
					success: (res) => {
						if (res.confirm) {
							this.otherConfigs.splice(index, 1)
						}
					}
				})
			}
		},
		
		validate() {
			if(!this.colors.some(item => item.hasCheck)) {
				uni.showToast({
					title: '请设置车辆颜色',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			
			for(const item of this.otherConfigs) {
				if (item.money && !validIntegerNum(item.money)) {
					uni.showToast({
						title: '请正确输入金额',
						duration: 2000,
						icon: "none"
					})
					return false
				}
			}
			
			return true
		},
		
		prevStep() {
			// if(!this.validate()) {
			// 	return
			// }
			
			const params = {
				step: 1,
				otherConfigs: this.otherConfigs.filter(item => item.detailName && item.money),
			}
			
			if (this.type == 1) {
				params.color = this.colors
			}
			
			this.$emit('prevStep', params)
		},
		
		nextStep() {
			if(!this.validate()) {
				return
			}
			
			console.log('this.otherConfigs', this.otherConfigs)
			
			const params = {
				step: 3,
				otherConfigs: this.otherConfigs.filter(item => item.detailName && item.money),
			}
			
			if (this.type == 1) {
				params.color = this.colors
			}
			
			this.$emit('nextStep', params)
		},
	}
}
</script>

<style lang="scss" scoped>
@import "../styles/plan.scss";

.plan-step-card {
	padding-top: 20px;
	padding-bottom: 20px;
	margin-bottom: 12px;
	.item-wrap {
		margin-bottom: 12px;
		height: 96rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;
		color: #1D2129;
		.left {
			display: flex;
			align-items: center;
			.input-wrap {
				margin-left: 8rpx;
				width: 332rpx;
			}
		}
		.right {
			display: flex;
			align-items: center;
			.input-wrap {
				width: 228rpx;
				.unit {
					padding-left: 12rpx;
				}
			}
		}
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

.sub-title {
	height: 48rpx;
	font-size: 14px;
	line-height: 48rpx;
	color: #1D2129;
}

.color-list {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	.color-wrap {
		margin-right: 32rpx;
		margin-top: 32rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		.color {
			width: 48rpx;
			height: 48rpx;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 1px solid #F2F3F5;
			.color-checked-img {
				width: 20rpx;
			}
		}
		.color-name {
			margin-top: 4px;
			height: 36rpx;
			font-size: 10px;
			line-height: 36rpx;
			color: #86909C;
		}
	}
}

.old-car-btn-group {
	margin-top: 60px;
}
</style>
