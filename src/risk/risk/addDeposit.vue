<template>
  <view class="page-wrap">
	  <view>
	  	<view class="title">
	  		<text style="color: #EA0000;">*</text>加收车辆押金
	  	</view>
			
			<view class="item">
				<input
					v-model="deposit"
					class="input"
					placeholder="请输入金额"
					type="digit"
					inputmode="numeric"
					placeholder-style="font-size:14px;color:#A4AEBB;"
				/>
				<view class="unit">元</view>
			</view>
			
			
	  </view>
		
		<view class="buttom-disabled-btn-group">
			<view class="cancel-btn" @click="back">取消</view>
			<button :disabled="!deposit" @click="save">确定</button>
		</view>
  </view>
</template>

<script>
export default {
	data() {
		return {
			id: null,
			auditRate: null,
			orderType: null,
			deposit: null,
			certificationList: [],
			currentCertification: [],
		}
	},
	
	onLoad(options) {
		this.id = options.id
		this.auditRate = options.auditRate
		this.orderType = options.orderType
		this.deposit = options.deposit
	},
	
	methods:{
		back() {
			uni.navigateBack({
				delta: 1
			})
		},
		
		async save() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				addDeposit: this.deposit,
				depositApplyId: this.id,
				remark: '',
			}
			
			const res = await this.$getRequest(this.$url.addOtherDeposit, "GET", params)
			
			if (res.code == 0) {
				this.back()
			}
			
			uni.hideLoading()
		},
		
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.title {
		height: 48rpx;
		font-size: 17px;
		line-height: 48rpx;
		color: #0A0F2D;
	}
	.item {
		margin-top: 16px;
		width: 100%;
		height: 96rpx;
		padding: 0 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.unit {
			padding-left: 32rpx;
			font-size: 14px;
			color: #3D3D3D;
		}
	}
}
</style>
