<template>
	<view class="page-wrap">
		<view class="search-header">
			<view class="tabs">
				<view 
					v-for="tab in carTypeTabs"
					:key="tab.id"
					class="tab"
					:class="{'tab-active': tab.id === activeTab}"
					@click="changeTab(tab.id)"
				>
					<view class="line" v-if="tab.id == activeTab"></view>
					{{tab.label}}
				</view>
			</view>
			<view class="filter">
				<view class="filter-item" @click="openOrderSourceList">
					<view v-if="activeTab == 1">
						{{newCarList.orderSource ? orderSourceObj[newCarList.orderSource] : '全部订单'}}
					</view>
					<view v-else>
						{{secondCarList.orderSource ? orderSourceObj[secondCarList.orderSource] : '全部订单'}}
					</view>
					<u-icon name="arrow-down" color="#999999" size="32" style="margin-left:4px;"></u-icon>
				</view>
				<view class="filter-item" @click="openOrderStatusList">
					<view v-if="activeTab == 1">
						{{newCarList.status ? orderStatusObj[newCarList.status] : '订单状态'}}
					</view>
					<view v-else>
						{{secondCarList.status ? orderStatusObj[secondCarList.status] : '订单状态'}}
					</view>
					<u-icon name="arrow-down" color="#999999" size="32" style="margin-left:4px;"></u-icon>
				</view>
			</view>
		</view>
		
		<view class="container">
			<view class="car-list" v-if="activeTab === 1">
				<scroll-view 
					:scroll-top="newCarList.scrollTop" 
					scroll-y="true" 
					class="scroll-Y" 
					@scrolltolower="newCarListBottom"
					@scroll="newCarScroll"
				>
					<OrderListItem
						v-for="item in newCarList.list"
						:key="item.id"
						:item="item"
						:isManager="isManager"
						:currentCompany="currentCompany"
						@distribution="distribution"
					/>				
					
					<u-empty v-if="newCarList.errMsg" :text="newCarList.errMsg" mode="list"></u-empty>
					<view class="loadmore">
						<u-loadmore
							v-if="newCarList.list.length"
							:status="newCarList.loadstatus"
							:load-text="loadText"
						/>
					</view>
				</scroll-view>
			</view>
			
			<view class="car-list" v-if="activeTab === 2">
				<scroll-view
					:scroll-top="secondCarList.scrollTop" 
					scroll-y="true" 
					class="scroll-Y" 
					@scrolltolower="secondCarListBottom"
					@scroll="secondCarScroll"
				>
					<OrderListItem
						v-for="item in secondCarList.list"
						:key="item.id"
						:item="item"
						:isManager="isManager"
						:currentCompany="currentCompany"
						@distribution="distribution"
					/>				
					
					<u-empty v-if="secondCarList.errMsg" :text="secondCarList.errMsg" mode="list"></u-empty>
					<view class="loadmore">
						<u-loadmore
							v-if="secondCarList.list.length"
							:status="secondCarList.loadstatus"
							:load-text="loadText"
						/>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<u-select
			v-model="showSourceList" 
			:list="orderSourceList"
			@confirm="confirmSource"
		></u-select>
		
		<u-select
			v-model="showStatusList" 
			:list="orderStatusList"
			@confirm="confirmStatus"
		></u-select>
		
		<DistributionPopup 
			:show.sync="showDistributionPopup"
			:orderId="currentOrderId"
			@complete="complete"
		/>
		
	</view>
</template>

<script>
import { carTypeTabs, orderSourceList, orderStatusList, orderSourceObj, orderStatusObj } from '@/constants/index.js'
import OrderListItem from './components/OrderListItem.vue'
import DistributionPopup from './components/DistributionPopup.vue'
	
export default {
	components: {
		OrderListItem,
		DistributionPopup,
	},
	
	data() {
		return {
			currentCompany: {},
			carTypeTabs,
			orderSourceList, 
			orderStatusList, 
			orderSourceObj, 
			orderStatusObj,
			showSourceList: false,
			showStatusList: false,
			activeTab: 1,
			newCarScrollTop: 0,
			secondCarScrollTop: 0,
			newCarList: {
				orderSource: '',
				status: '',
				scrollTop: 0,
				list: [],
				limit: 10,
				page: 1,
				totalPage: 0,
				errMsg: '',
				loadstatus: 'loadmore',
			},
			secondCarList: {
				orderSource: '',
				status: '',
				scrollTop: 0,
				list: [],
				limit: 10,
				page: 1,
				totalPage: 0,
				errMsg: '',
				loadstatus: 'loadmore',
			},
			loadText: {
				loadmore: '轻轻上拉',
				loading: '努力加载中',
				nomore: '实在没有了'
			},
			isManager: false,
			showDistributionPopup: false,
			currentOrderId: null,
		}
	},
	
	onLoad(options) {
		try {
			const value = uni.getStorageSync('current_company')
			if (value) {
				this.currentCompany = value
				
				// 9.超级管理员  2.总经理  3.销售总监  4.销售
				this.isManager = value.company.roleList.some(item => item.id === 9 || item.id === 2 || item.id === 3)
				
				this.getNewCarList()
				this.getSecondCarList()
				this.updateOrderViewNum(value.company.id, value.userId, 1)
				this.updateOrderViewNum(value.company.id, value.userId, 2)
			}
		} catch (e) {
			// error
		}
	},
	
	methods: {
		openOrderSourceList() {
			this.showSourceList = true
		},
		
		openOrderStatusList() {
			this.showStatusList = true
		},
		
		confirmSource(e) {
			if (this.activeTab == 1) {
				this.newCarList.orderSource = e[0].value
				this.newCarList.page = 1
				this.newCarList.list = []
				this.newCarList.scrollTop = 0
				this.getNewCarList()
			} else {
				this.secondCarList.orderSource = e[0].value
				this.secondCarList.page = 1
				this.secondCarList.list = []
				this.secondCarList.scrollTop = 0
				this.getSecondCarList()
			}
		},
		
		confirmStatus(e) {
			if (this.activeTab == 1) {
				this.newCarList.status = e[0].value
				this.newCarList.page = 1
				this.newCarList.list = []
				this.newCarList.scrollTop = 0
				this.getNewCarList()
			} else {
				this.secondCarList.status = e[0].value
				this.secondCarList.page = 1
				this.secondCarList.list = []
				this.secondCarList.scrollTop = 0
				this.getSecondCarList()
			}
		},
		
		changeTab(id) {
			this.activeTab = id
			this.$nextTick(() => {
				if (id === 1) {
					this.newCarList.scrollTop = this.newCarScrollTop
				} else {
					this.secondCarList.scrollTop = this.secondCarScrollTop
				}
			})
		},
		
		updateOrderViewNum(merchantId, userId, orderType) {
			const params = {
				merchantId,
				userId,
				orderType,
			}
			
			this.$getRequest(this.$url.updateOrderViewNum, "GET", params)
		},
		
		async getNewCarList() {
			uni.showLoading({
				title: '加载中'
			})
			
			let params = {
				...this.newCarList,
				salesmanId: this.currentCompany.userId,
				merchantId: this.currentCompany.company.id,
				newType: 1,
			}
			
			const res = await this.$getRequest(this.$url.selectSubscribeOrderByPage, "POST", params)
			
			if (res.code == 0 && res.data) {
				if (res.data.records && res.data.records.length) {
					this.newCarList.list = [...this.newCarList.list, ...res.data.records]
				}
				if (res.data.pages) {
					this.newCarList.totalPages = res.data.pages
					if(this.newCarList.page >= this.newCarList.totalPages) {
						this.newCarList.loadstatus = 'nomore'
					}
				} else {
					this.newCarList.errMsg = '暂无订单'
				}
			} else {
				this.newCarList.errMsg = '暂无订单'
			}
			
			uni.hideLoading()
		},
		
		async getSecondCarList() {
			uni.showLoading({
				title: '加载中'
			})
			
			let params = {
				...this.secondCarList,
				salesmanId: this.currentCompany.userId,
				merchantId: this.currentCompany.company.id,
				newType: 2,
			}
			
			const res = await this.$getRequest(this.$url.selectSubscribeOrderByPage, "POST", params)
			
			if (res.code == 0 && res.data) {
				if (res.data.records && res.data.records.length) {
					this.secondCarList.list = [...this.secondCarList.list, ...res.data.records]
				}
				if (res.data.pages) {
					this.secondCarList.totalPages = res.data.pages
					if(this.secondCarList.page >= this.secondCarList.totalPages) {
						this.secondCarList.loadstatus = 'nomore'
					}
				} else {
					this.secondCarList.errMsg = '暂无订单'
				}
			} else {
				this.secondCarList.errMsg = '暂无订单'
			}
			
			uni.hideLoading()
		},
		
		newCarScroll(e) {
			this.newCarScrollTop = e.detail.scrollTop
		},
		
		secondCarScroll(e) {
			this.secondCarScrollTop = e.detail.scrollTop
		},
		
		newCarListBottom() {
			if(this.newCarList.page >= this.newCarList.totalPages) {
				this.newCarList.loadstatus = 'nomore'
				return
			}
			this.newCarList.loadstatus = 'loading'
			++this.newCarList.page;
			
			this.getNewCarList()
		},
		
		secondCarListBottom() {
			if(this.secondCarList.page >= this.secondCarList.totalPages) {
				this.secondCarList.loadstatus = 'nomore'
				return
			}
			this.secondCarList.loadstatus = 'loading'
			++this.secondCarList.page
			
			this.getSecondCarList()
		},
		
		distribution(data) {
			this.currentOrderId = data.id
			this.showDistributionPopup = true
		},
		
		complete(data) {
			if (this.activeTab == 1) {
				this.newCarList.list.map(item => {
					if (item.id === data.orderId) {
						item.salesmanName = data.salesmanName
					}
					
					return item
				})
			} else {
				this.secondCarList.list.map(item => {
					if (item.id === data.orderId) {
						item.salesmanName = data.salesmanName
					}
					
					return item
				})
			}
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
	.filter {
		height: 40rpx;
		font-size: 14px;
		color: #393D3F;
		display: flex;
		.filter-item {
			margin-left: 16rpx;
			display: flex;
			align-items: center;
		}
	}
	.container {
		height: 0;
		flex: 1;
		.car-list {
			height: 100%;
			display: flex;
			flex-direction: column;
			.scroll-Y {
				height: 0;
				flex: 1;
			}
		}
	}
}


</style>
