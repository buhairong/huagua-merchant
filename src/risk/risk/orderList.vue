<template>
	<view class="page-wrap">
		<view class="search-header">
			<view class="tabs">
				<view 
					v-for="tab in BUSINESS_TYPE"
					:key="tab.id"
					class="tab"
					:class="{'tab-active': tab.id === activeTab}"
					@click="changeTab(tab.id)"
				>
					<view class="line" v-if="tab.id == activeTab"></view>
					{{tab.label}}
				</view>
			</view>
		</view>
		
		<view class="list-wrap">
			<RiskOrderListItem
				v-for="item in list"
				:key="item.id"
				:item="item"
				:orderType="orderType"
				:type="activeTab"
			/>				
			
			<u-empty v-if="errMsg" :text="errMsg" mode="list"></u-empty>
			<view class="loadmore">
				<u-loadmore
					v-if="list.length"
					:status="status"
					:load-text="loadText"
				/>
			</view>
		</view>
	</view>
</template>

<script>
import { BUSINESS_TYPE } from '@/constants'
import RiskOrderListItem from './components/RiskOrderListItem.vue'

export default {
	components: {
		RiskOrderListItem,
	},
	
	data() {
		return {
			BUSINESS_TYPE,
			activeTab: 1,
			list: [],
			orderType: null,
			limit: 5,
			page: 1,
			errMsg: '',
			status: 'loadmore', // 加载更多 状态
			totalPages: 0, // 总页数
			loadText: {
			  loadmore: '轻轻上拉',
			  loading: '努力加载中',
			  nomore: '实在没有了'
			},
		}
	},
	
	onLoad(options) {
		this.orderType = options.orderType
		
		uni.setNavigationBarTitle({
		  title: options.orderType == 1 ? '个人订单' : '企业订单'
		})
		
		this.selectRiskList()
		
		try {
			const value = uni.getStorageSync('current_company')
			if (value) {
				this.currentCompany = value
				this.updateOrderViewNum(value.company.id, value.userId, options.orderType)
			}
		} catch (e) {
			// error
		}
		
	},
	
	onReachBottom() {
		if(this.page >= this.totalPages) {
			this.status = 'nomore'
			return
		}
		this.status = 'loading'
		++this.page;
		
		this.selectRiskList()
	},
	
	methods: {
		changeTab(id) {
			this.activeTab = id
			this.page = 1
			this.status = 'loading'
			this.list = []
			this.selectRiskList()
		},
		
		updateOrderViewNum(merchantId, userId, orderType) {
			const params = {
				merchantId,
				userId,
				orderType,
			}
			
			this.$getRequest(this.$url.updateOrderViewNum, "GET", params)
		},
		
		async selectRiskList() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				limit: this.limit,
				page: this.page,
				orderType: this.orderType,
				type: this.activeTab,
			}
			
			const res = await this.$getRequest(this.$url.selectRiskList, "POST", params)
			
			if (res.code == 0 && res.data) {
				if (res.data.records && res.data.records.length) {
					this.list = [...this.list, ...res.data.records]
				}
				if (res.data.pages) {
					this.totalPages = res.data.pages
					if(this.page >= this.totalPages) {
						this.status = 'nomore'
					}
				} else {
					this.errMsg = '暂无数据'
				}
			} else {
				this.errMsg = '暂无数据'
			}
			
			uni.hideLoading()
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	height: 100vh;
	.list-wrap {
		padding-bottom: 40px;
	}
}
</style>
