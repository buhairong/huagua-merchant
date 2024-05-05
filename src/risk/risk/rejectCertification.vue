<template>
  <view class="page-wrap">
	  <view>
	  	<view class="title">
	  		<text style="color: #EA0000;">*</text>拒绝原因
	  	</view>
			
			<u-input 
				v-model="remark" 
				type="textarea" 
				placeholder="请输入补充材料拒绝原因~最多可输入100个字"
				maxlength="100"
				:border="true" 
				:auto-height="true"
				:clearable="false"
				:height="320"
			/>
	  </view>
		
		<view class="buttom-disabled-btn-group">
			<view class="cancel-btn" @click="back">取消</view>
			<button :disabled="!remark.trim()" @click="rejectRiskOrder">确定</button>
		</view>
  </view>
</template>

<script>
export default {
	data() {
		return {
			id: null,
			remark: '',
		}
	},
	
	onLoad(options) {
		this.id = options.id
	},
	
	methods:{
		back() {
			uni.navigateBack({
				delta: 2
			})
		},
		
		async rejectRiskOrder() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				certificationId: this.id,
				confirmed: 0,
			}
			
			const res = await this.$getRequest(this.$url.updateCertificationStatus, "POST", params)
			
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
