<template>
	<view class="page-wrap">
		<view>
			<view class="item-wrap">
				<view class="item-title">{{shopName}}</view>
				<view class="item-content">
					{{merchantRate}} 
					<text class="right-icon">%</text>
				</view>
			</view>
			
			<view class="item-wrap">
				<view class="item-title">总经理</view>
				<view class="item-content">
					<input
						v-model="generalManagerRate"
						class="input"
						type="digit"
						inputmode="numeric"
						placeholder="请输入佣金比例"
						placeholder-style="font-size:14px;color:#A4AEBB;"
					/>
					<text class="right-icon">%</text>
				</view>
			</view>
			
			<view class="item-wrap">
				<view class="item-title">销售总监</view>
				<view class="item-content">
					<input
						v-model="salesDirectorRate"
						class="input"
						type="digit"
						inputmode="numeric"
						placeholder="请输入佣金比例"
						placeholder-style="font-size:14px;color:#A4AEBB;"
					/>
					<text class="right-icon">%</text>
				</view>
			</view>
			
			<view class="item-wrap">
				<view class="item-title">销售</view>
				<view class="item-content">
					<input
						v-model="saleRate"
						class="input"
						type="digit"
						inputmode="numeric"
						placeholder="请输入佣金比例"
						placeholder-style="font-size:14px;color:#A4AEBB;"
					/>
					<text class="right-icon">%</text>
				</view>
			</view>
			
			<view class="tip">
				订单成交后，将会按照您所设置的分配比例将佣金发放至个人账户，金额未含税。
			</view>
		</view>
		
		<view class="bottom-btn" @click="setCommission">
			保 存
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentCompany: {},
			generalManagerRate: undefined,
			salesDirectorRate: undefined,
			saleRate: undefined,
			merchantId: null,
			shopName: '',
		}
	},
	
	computed: {
		merchantRate() {
			return 100 - (this.generalManagerRate || 0) - (this.salesDirectorRate || 0) - (this.saleRate || 0)
		},
	},
	
	onLoad(options) {
		this.type = options.type
		
		const value = uni.getStorageSync('current_company')
		if (value) {
			this.merchantId = value.company.id
			this.shopName = value.company.shopName
		}
		
		this.selectBrokerageDistribution()
	},
	
	methods: {
		async selectBrokerageDistribution() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				merchantId: this.merchantId,
			}
			
			const res = await this.$getRequest(this.$url.selectBrokerageDistribution, "GET", params)
			
			if (res.code == 0 && res.data) {
				this.generalManagerRate = res.data.generalManagerRate
				this.salesDirectorRate = res.data.salesDirectorRate
				this.saleRate = res.data.saleRate
			}
			
			uni.hideLoading()
		},
		
		async setCommission() {
			if(!this.generalManagerRate) {
				uni.showToast({
					title: '请输入总经理的佣金比例',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.salesDirectorRate) {
				uni.showToast({
					title: '请输入销售总监的佣金比例',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.saleRate) {
				uni.showToast({
					title: '请输入销售的佣金比例',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				merchantId: this.merchantId,
				generalManagerRate: this.generalManagerRate,
				salesDirectorRate: this.salesDirectorRate,
				saleRate: this.saleRate,
				merchantRate: this.merchantRate,
			}
			
			const res = await this.$getRequest(this.$url.addOrUpdateDistribution, "POST", params)
			
			if (res.code == 0) {
				uni.showToast({
					title: '保存成功',
					duration: 2000,
					icon: "none"
				})
				
				uni.navigateBack({
					delta: 1
				})
			}
			
			uni.hideLoading()
		},
		
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.item-wrap {
		padding: 16px 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: inset 0px -1px 0px 0px rgba(10, 15, 45, 0.04);
		.item-title {
			font-size: 14px;
			color: #0A0F2D;
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
		}
	}
	.tip {
		padding-top: 12px;
		font-size: 12px;
		font-weight: normal;
		line-height: 44rpx;
		color: #86909C;
	}
}
</style>
