<template>
	<view class="page-wrap">
		<view v-if="list.length">
			<view class="item" v-for="item in list" :key="item.id">
				{{item.decorateName}}
			</view>
		</view>
		<u-empty v-else-if="errMsg" :text="errMsg" mode="list"></u-empty>
		
		<view class="bottom-btn-group" v-if="list.length">
			<view class="btn save-btn" @click="add">添加精品/装潢</view>
			<view class="btn del-btn" @click="del">删除</view>
		</view>
		<view class="bottom-btn" @click="add" v-else>
			添加精品/装潢
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
			errMsg: '',
		}
	},
	
	onLoad(options) {
		const value = uni.getStorageSync('current_company')
		if (value) {
			this.merchantId = value.company.id
		}
	},
	
	onShow() {
		this.selectBrokerageDistribution()
	},
	
	methods: {
		async selectBrokerageDistribution() {
			const params = {
				companyId: this.merchantId
			}
			
			const res = await this.$getRequest(this.$url.selectAllDecorate, "GET", params)
			
			if (res.code == 0 && res.data && res.data.length) {
				this.list = res.data
			} else {
				this.errMsg = '暂无数据'
			}
			
			uni.hideLoading()
		},
		
		add() {
			uni.navigateTo({
				url: '/pages/quality/addQuality',
			})
		},
		
		del() {
			uni.navigateTo({
				url: '/pages/quality/delQuality',
			})
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
	.item {
		margin-bottom: 12px;
		padding-left: 32rpx;
		height: 96rpx;
		line-height: 96rpx;
		border-radius: 16rpx;
		background: #F7F8FA;
		font-size: 14px;
		color: #1A1A1A;
	}
	.del-btn {
		background: rgba(255, 0, 0, 0.9);
		color: #fff;
	}
}
</style>
