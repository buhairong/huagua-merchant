<template>
	<view class="page">
		<CarInfoHeader 
			:brand="brand"
			:carType="carType"
			:carTypeYear="carTypeYear"
			:carTypeYearProduct="carTypeYearProduct"
			:imageUrl="imageUrl"
		/>
		
		<view>
			<view class="title-wrap" style="margin-top: 64rpx">
				<u-section
					title="设置增配项" 
					line-color="#165DFF"
					font-size="34"
					color="#0A0F2D"
					:right="false"
				></u-section>
			</view>
			
			<view style="margin-top: 32rpx">
				<view
					class="input-item-wrap"
					v-for="(item, index) in details"
					:key="index"
				>
					<view class="left">
						<view @click="del(index)">
							<u-icon name="minus-circle-fill" color="rgba(29, 33, 41, 0.6)" size="32"></u-icon>
						</view>
						<view class="input-wrap">
							<input
								v-model="item.detailName"
								class="input"
								placeholder="请输入增配项"
								placeholder-style="font-size:14px;color:#A4AEBB;"
								maxlength="20"
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
							/>
							<view class="unit">元</view>
						</view>
					</view>
				</view>
				
				<view class="add-wrap" >
					<view class="add" @click="addConfig">
						<u-icon name="plus-circle-fill" color="#4170EE" size="32"></u-icon>
						<view class="tip">更多增配项</view>
					</view>
					
					<view class="add" @click="delAllConfig" v-if="details.some(item => item.detailName || (item.money || item.money === 0))">
						<u-icon name="minus-circle-fill" color="#F53F3F" size="32"></u-icon>
						<view class="tip">删除所有增配项</view>
					</view>
				</view>
			</view>
			
		</view>
		
		<view class="fixed-buttom-disabled-btn">
			<button :disabled="disabled" @click="save">保存</button>
		</view>
	</view>
</template>

<script>
import { validIntegerNum } from '@/utils/validate'
import CarInfoHeader from './components/CarInfoHeader.vue'

export default {
	components: {
		CarInfoHeader,
	},
	
	data() {
		return {
			orderId: '',
			brand: '',
			carType: '',
			carTypeYear: '',
			carTypeYearProduct: '',
			imageUrl: '',
			merchantId: null,
			list: [],
			errMsg: '',
			details: [],
		}
	},
	
	onLoad(options) {
		this.orderId = options.orderId
		this.brand = options.brand
		this.carType = options.carType
		this.carTypeYear = options.carTypeYear
		this.carTypeYearProduct = options.carTypeYearProduct
		this.imageUrl = options.imageUrl
		
		if (options.config) {
			this.details = JSON.parse(options.config)
		}
		
		if (this.details.length === 0) {
			this.addConfig()
		}
	},
	
	computed: {
		disabled() {
			let res = true
			
			if (this.details.length) {
				const list = this.details.filter(item => item.detailName || (item.money || item.money === 0))
				if (list.length) {
					const flag = this.details.every(item => item.detailName && (item.money || item.money === 0))
					if (flag) {
						res = false
					}
				} else {
					res = false
				}
			} else {
				res = false
			}
			
			return res
		},
	},
	
	methods: {
		addConfig() {
			this.details.push({
				detailName: '',
				hasCheck: 1,
				money: undefined
			})
		},
		
		del(index) {
			uni.showModal({
				title: '提示',
				content: '确定要删除这个增配项吗？',
				success: (res) => {
					if (res.confirm) {
						this.details.splice(index, 1)
					}
				}
			})
		},
		
		delAllConfig() {
			uni.showModal({
				title: '提示',
				content: '确定要删除所有增配项吗？',
				success: (res) => {
					if (res.confirm) {
						this.details = []
					}
				}
			})
		},
		
		save() {
			this.details = this.details.filter(item => item.detailName && (item.money || item.money === 0))
			for(const item of this.details) {
				if (item.money && !validIntegerNum(item.money)) {
					uni.showToast({
						title: '请正确输入金额',
						duration: 2000,
						icon: "none"
					})
					return false
				}
			}
			
			uni.showLoading({
				title: '保存中',
				icon: 'none'
			})
			
			const params = {
				userCarSubscribeId: this.orderId,
				otherConfigVo: [
					{
						details: this.details,
						function: ''
					}
				],
			}
			
			this.$getRequest(this.$url.saveOtherConfig, 'POST', params).then(res => {
				if (res.code === 0) {
					uni.navigateBack({
						delta: 1
					})
				}
			}).finally(() => {
				uni.hideLoading()
			})
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "./styles/index.scss";

.page {
	padding: 16px 32rpx 140px;
	.item-wrap {
		margin-bottom: 20px;
		padding: 0 32rpx;
		height: 96rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #F7F8FA;
		border-radius: 16rpx;
		.input {
			width: 0;
			flex: 1;
		}
		.unit {
			padding-left: 32rpx;
			font-size: 14px;
			color: #1D2129;
		}
	}
	.item {
		margin-bottom: 12px;
		height: 68rpx;
		border-radius: 8rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(65, 112, 238, 0.1);
		font-size: 14px;
		color: #1A1A1A;
	}
	.active-item {
		color: #4170EE;
	}
	.input-item-wrap {
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
				margin: 0 16rpx;
				width: 332rpx;
			}
		}
		.right {
			width: 0;
			flex: 1;
			display: flex;
			align-items: center;
			.input-wrap {
				width: 100%;
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
			margin-right: 60rpx;
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
</style>