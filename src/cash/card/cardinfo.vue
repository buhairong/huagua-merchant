<template>
	<view class="page-wrap">
		<view class="bank-card">
			<view class="left">
				<view class="account">{{bankAccountId}}</view>
				<view class="bank-name">{{bankName}}</view>
			</view>
			<view class="right" @click="removeBind">
				解除绑定
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			bankAccountId: '',
			bankName: '',
			type: 1, // 2.竞价
		}
	},
	onLoad(options) {
		this.type = options.type || 1
		this.bankAccountId = options.bankAccountId
		this.bankName = options.bankName
	},
	
	methods: {
		removeBind() {
			uni.showModal({
				title: '',
				content: `您是否确定要解绑银行卡？`,
				confirmText: '解绑',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: '保存中'
						})
						const res =  await this.$getRequest(this.$url.updateBankBindStatus, 'GET', {})
						uni.hideLoading()
						
						if (res.code === 0) {
							uni.navigateBack({
								delta: 1
							})
						}
						
					}
				}
			})
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.bank-card {
	padding: 16px 32rpx;
	width: 100%;
	height: 186rpx;
	border-radius: 24rpx;
	overflow: hidden;
	background: linear-gradient(280deg, #5656FF 11%, #55D0FF 109%);
	display: flex;
	justify-content: space-between;
	align-items: center;
	.left {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.account {
			height: 44rpx;
			font-size: 18px;
			line-height: 44rpx;
			color: #FFFFFF;
		}
		.bank-name {
			height: 34rpx;
			font-size: 14px;
			line-height: 34rpx;
			color: #FFFFFF;
		}
	}
	.right {
		height: 100%;
		display: flex;
		align-items: center;
		color: #F3F3F3;
		font-size: 14px;
	}
}
</style>