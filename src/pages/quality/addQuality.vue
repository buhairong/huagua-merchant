<template>
	<view class="page-wrap">
		<input
			v-model="decorateName"
			class="input"
			maxlength="20"
			placeholder="请输入精品/装潢"
			placeholder-style="font-size:14px;color:#A4AEBB;"
		/>
		
		<view class="bottom-btn" @click="save">
			保存
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentCompany: {},
			merchantId: null,
			decorateName: '',
		}
	},
	
	onLoad(options) {
		const value = uni.getStorageSync('current_company')
		if (value) {
			this.merchantId = value.company.id
		}
	},
	
	methods: {
		async save() {
			const decorateName = this.decorateName.trim()
			if(!decorateName) {
				uni.showToast({
					title: '请输入精品/装潢',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				decorateName
			}
			
			const res = await this.$getRequest(this.$url.insertDecorate, "GET", params)
			
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
	.input {
		padding: 0 32rpx;
		height: 96rpx;
		line-height: 96rpx;
		border-radius: 16rpx;
		background: #F7F8FA;
		font-size: 14px;
		color: #1A1A1A;
	}
}
</style>
