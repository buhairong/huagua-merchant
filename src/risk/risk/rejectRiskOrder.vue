<template>
  <view class="page-wrap">
	  <view>
	  	<view class="title">
	  		<text style="color: #EA0000;">*</text>拒绝原因
	  	</view>
			
			<u-input 
				v-model="remark" 
				type="textarea" 
				placeholder="请输入拒绝原因~最多可输入100个字"
				maxlength="100"
				:border="true" 
				:auto-height="true"
				:clearable="false"
				:height="320"
			/>
	  </view>
		
		<view class="buttom-disabled-btn-group">
			<view class="cancel-btn" @click="back">取消</view>
			<button :disabled="!remark.trim()" @click="reject">确定</button>
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
			type: null,
			remark: '',
		}
	},
	
	onLoad(options) {
		this.id = options.id
		this.auditRate = options.auditRate
		this.orderType = options.orderType
		this.type = options.type
	},
	
	methods:{
		back() {
			uni.navigateBack({
				delta: 1
			})
		},
		
		reject() {
			uni.showModal({
				title: '订单复审',
				content: `确定要拒绝${this.orderType == 1 ? '个人' : '企业'}用户的订单审核？`,
				success: async (res) => {
					if (res.confirm) {
						this.rejectRiskOrder()
					}
				}
			})
		},
		
		async rejectRiskOrder() {
			uni.showLoading({
				title: '加载中'
			})
			
			let params = {
				orderId: this.id,
				auditRate: this.auditRate,
				riskResult: 6,
				remark: this.remark.trim(),
			}
			
			let url = this.$url.updateAuditStatusOfAgain
			
			let method = 'POST'
			
			if (this.type == 2) {
				params = {
					depositApplyId: this.id,
					status: 2,
					reason: this.remark.trim(),
				}
				
				url = this.$url.updateRentalAuditStatusOfAgain
				
				method = 'GET'
			}
			
			const res = await this.$getRequest(url, method, params)
			
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
		margin-bottom: 12px;
		height: 48rpx;
		font-size: 17px;
		line-height: 48rpx;
		color: #0A0F2D;
	}
}
</style>
