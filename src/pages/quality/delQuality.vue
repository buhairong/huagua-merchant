<template>
	<view class="page-wrap">
		<view >
			<view class="item-wrap" v-for="(item, index) in list" :key="item.id">
				<view class="del" @click="del(item, index)">
					<u-icon name="minus-circle-fill" color="background: rgba(29, 33, 41, 0.6);" size="32"></u-icon>
				</view>
				<view class="item">
					{{item.decorateName}}
				</view>
			</view>
		</view>
		
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
			list: [],
			ids: [],
		}
	},
	
	onLoad(options) {
		const value = uni.getStorageSync('current_company')
		if (value) {
			this.merchantId = value.company.id
		}
		
		this.selectBrokerageDistribution()
	},
	
	methods: {
		async selectBrokerageDistribution() {
			const params = {
				companyId: this.merchantId,
			}
			
			const res = await this.$getRequest(this.$url.selectAllDecorate, "GET", params)
			
			if (res.code == 0 && res.data) {
				this.list = res.data
			}
			
			uni.hideLoading()
		},
		
		del(item, index) {
			uni.showModal({
				title: '提示',
				content: `确定要删除 ${item.decorateName} 吗？`,
				success: async (res) => {
					if (res.confirm) {
						this.list.splice(index, 1)
						this.ids.push(item.id)
					}
				}
			})
		},
		
		async save() {
			if(this.ids.length === 0) {
				uni.showToast({
					title: '请先删除精品/装潢',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				ids: this.ids
			}
			
			const res = await this.$getRequest(this.$url.deleteDecorate, "POST", params)
			
			if (res.code == 0) {
				uni.showToast({
					title: '删除成功',
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
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		.del {
			margin-right: 16rpx;
		}
		.item {
			flex: 1;
			padding-left: 32rpx;
			height: 96rpx;
			line-height: 96rpx;
			border-radius: 16rpx;
			background: #F7F8FA;
			font-size: 14px;
			color: #1A1A1A;
		}
	}
}
</style>
