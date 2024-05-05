<template>
	<view class="page-wrap">
		<view>
			<view class="card">
				<view class="brand">
					<view class="logo">
						<image
							style="width: 100%;height:100%;"
							:src="detail.logoUrl"
						/>
					</view>
					{{detail.carBrand}} {{detail.carType}}
				</view>
			</view>
			
			<view class="card">
				<view class="item-wrap">
					<view class="item-title">我司采购优惠</view>
					<view class="item-content">
						<input
							v-model="detail.ownerPurchaseDiscount"
							class="input"
							type="digit"
							inputmode="numeric"
							placeholder="请输入采购优惠"
							placeholder-style="font-size:14px;color:#A4AEBB;"
						/>
						<text class="right-icon">%</text>
					</view>
				</view>
				<view class="item-wrap">
					<view class="item-title">直客购买优惠</view>
					<view class="item-content">
						<input
							v-model="detail.clientPurchaseDiscount"
							class="input"
							type="digit"
							inputmode="numeric"
							placeholder="请输入采购优惠"
							placeholder-style="font-size:14px;color:#A4AEBB;"
						/>
						<text class="right-icon">%</text>
					</view>
				</view>
			</view>
			
			<u-modal
				v-model="showModal"
				title="提示"
				:show-cancel-button="true"
				:mask-close-able="true"
				:confirm-text="`修改为${detail.merchantPurchaseDiscount}%`"
				cancel-text="保存"
				@confirm="modify"
				@cancel="createOrUpdateCarOffer"
			>
				<view class="slot-content">
					<view class="model-content">
						<view class="model-item">该车系市场平均采购平均优惠为 {{detail.merchantPurchaseDiscount}}%</view>
						<view class="model-item">您当前优惠报价可能导致产品竞争力下降</view>
					</view>
				</view>
			</u-modal>
		</view>
		
		<view class="bottom-btn-group">
			<view class="btn" @click="goBack">取消</view>
			<view class="btn save-btn" @click="save">保存报价</view>
		</view>
		
	</view>
</template>

<script>
import { validIntegerNum } from '@/utils/validate'

export default {
	data() {
		return {
			detail: {},
			showModal: false,
			companyRole: null, // （商户角色）角色选择：1 4s，2 二级销售网络，3 二手车商
			companyId: null,
		}
	},
	
	onLoad(options) {
		this.companyRole = options.companyRole
		this.companyId = options.companyId
		const value = uni.getStorageSync('setDiscount')
		if (value) {
			this.detail = value
		}
	},
	
	methods: {
		save() {
			if(!this.detail.ownerPurchaseDiscount) {
				uni.showToast({
					title: '请输入我司采购优惠',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.detail.clientPurchaseDiscount) {
				uni.showToast({
					title: '请输入直客购买优惠',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!validIntegerNum(this.detail.ownerPurchaseDiscount)) {
				uni.showToast({
					title: '请正确输入我司采购优惠',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!validIntegerNum(this.detail.clientPurchaseDiscount)) {
				uni.showToast({
					title: '请正确输入直客购买优惠',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if (this.detail.ownerPurchaseDiscount < this.detail.merchantPurchaseDiscount) {
				this.showModal = true
				return
			}
			
			this.createOrUpdateCarOffer()
		},
		
		modify() {
			this.detail.ownerPurchaseDiscount = 12
			this.createOrUpdateCarOffer()
		},
		
		async createOrUpdateCarOffer() {
			if (this.detail.clientPurchaseDiscount >= this.detail.ownerPurchaseDiscount) {
				uni.showToast({
					title: '直客购买优惠必须小于我司采购优惠',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				...this.detail,
				chooseRole: this.companyRole,
				companyId: this.companyId,
			}
			
			const res = await this.$getRequest(this.$url.createOrUpdateCarOffer, "POST", params)
			
			if (res.code == 0) {
				uni.showToast({
					title: '保存成功',
					duration: 2000,
					icon: "none"
				})
				this.goBack()
			}
			
			uni.hideLoading()
		},
		
		goBack() {
			uni.navigateBack({
				delta: 1
			})
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.brand {
		display: flex;
		align-items: center;
		.logo {
			width: 70rpx;
			height: 70rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: 24rpx;
		}
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
	}
}

.model-content {
	width: 640rpx;
	padding-bottom: 100rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.model-item {
		margin-top: 20px;
		color: #3D3D3D;
		font-size: 14px;
		height: 42rpx;
		line-height: 42rpx;
	}
}
</style>
