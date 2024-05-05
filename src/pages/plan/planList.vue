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
			<view class="filter" @click="goBrandFilterPage" v-if="companyRole == 2 || companyRole == 3">
				品牌筛选
				<image
					class="filter-img"
					src="https://image.51cheyaoshi.com/xcx/merchant/static/home/filter.png"
				/>
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
					<NewCarListItem
						v-for="item in newCarList.list"
						:key="item.id"
						:item="item"
					/>				
					
					<u-empty v-if="newCarList.errMsg" :text="newCarList.errMsg" mode="list"></u-empty>
					<view class="loadmore">
						<u-loadmore
							v-if="newCarList.list.length"
							:status="newCarList.status"
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
					<OldCarListItem
						v-for="item in secondCarList.list"
						:key="item.id"
						:item="item"
					/>				
					
					<u-empty v-if="secondCarList.errMsg" :text="secondCarList.errMsg" mode="list"></u-empty>
					<view class="loadmore">
						<u-loadmore
							v-if="secondCarList.list.length"
							:status="secondCarList.status"
							:load-text="loadText"
						/>
					</view>
				</scroll-view>
			</view>
		</view>
		
	</view>
</template>

<script>
import { carTypeTabs } from '@/constants/index.js'
import NewCarListItem from './components/NewCarListItem.vue'
import OldCarListItem from './components/OldCarListItem.vue'
	
export default {
	components: {
		NewCarListItem,
		OldCarListItem,
	},
	
	data() {
		return {
			currentCompany: {},
			carTypeTabs,
			activeTab: 1,
			newCarScrollTop: 0,
			secondCarScrollTop: 0,
			companyRole: null, // （商户角色）角色选择：1 4s，2 二级销售网络，3 二手车商
			companyId: null,
			newCarList: {
				scrollTop: 0,
				brandList: [],
				list: [],
				limit: 10,
				page: 1,
				totalPage: 0,
				errMsg: '',
				status: 'loadmore',
			},
			secondCarList: {
				scrollTop: 0,
				brandList: [],
				list: [],
				limit: 10,
				page: 1,
				totalPage: 0,
				errMsg: '',
				status: 'loadmore',
			},
			loadText: {
				loadmore: '轻轻上拉',
				loading: '努力加载中',
				nomore: '实在没有了'
			},
			showCarFilterPopup: false,
			userinfo: {},
		}
	},
	
	onLoad(options) {
		this.companyRole = options.companyRole
		this.companyId = options.companyId
		
		try {
			const value = uni.getStorageSync('current_company')
			if (value) {
				this.currentCompany = value
				if (this.companyRole == 2 || this.companyRole == 3) {
					const brandListForNewCarPlan = uni.getStorageSync('BrandListForNewCarPlan')
					if (brandListForNewCarPlan) {
						this.newCarList.brandList = brandListForNewCarPlan
					}
					
					const brandListForOldCarPlan = uni.getStorageSync('BrandListForOldCarPlan')
					if (brandListForOldCarPlan) {
						this.secondCarList.brandList = brandListForOldCarPlan
					}
				}
				this.getNewCarList()
				this.getSecondCarList()
			}
		} catch (e) {
			// error
		}
	},
	
	onShow() {
		if (this.companyRole == 2 || this.companyRole == 3) {
			const from = uni.getStorageSync('fromBrandFilterPage')
			if (from) {
				if (this.activeTab === 1) {
					const brandListForNewCarPlan = uni.getStorageSync('BrandListForNewCarPlan')
					if (brandListForNewCarPlan) {
						this.newCarList.brandList = brandListForNewCarPlan
					}
					this.newCarList.list = []
					this.newCarList.page = 1
					this.getNewCarList()
				} else {
					const brandListForOldCarPlan = uni.getStorageSync('BrandListForOldCarPlan')
					if (brandListForOldCarPlan) {
						this.secondCarList.brandList = brandListForOldCarPlan
					}
					this.secondCarList.list = []
					this.secondCarList.page = 1
					this.getSecondCarList()
				}
			}
			
			uni.removeStorageSync('fromBrandFilterPage')
		}
		
		
		
	},
	
	methods: {
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
		
		async getNewCarList() {
			uni.showLoading({
				title: '加载中'
			})
			
			let params = {
				...this.newCarList,
				chooseRole: this.companyRole,
				companyId: this.currentCompany.company.id,
				newType: 1,
			}
			
			const res = await this.$getRequest(this.$url.getCarSubscribeList, "POST", params)
			
			if (res.code == 0 && res.data) {
				if (res.data.records && res.data.records.length) {
					this.newCarList.list = [...this.newCarList.list, ...res.data.records]
				}
				if (res.data.pages) {
					this.newCarList.totalPages = res.data.pages
					if(this.newCarList.page >= this.newCarList.totalPages) {
						this.newCarList.status = 'nomore'
					}
				} else {
					this.newCarList.errMsg = '暂无车辆'
				}
			} else {
				this.newCarList.errMsg = '暂无车辆'
			}
			
			uni.hideLoading()
		},
		
		async getSecondCarList() {
			uni.showLoading({
				title: '加载中'
			})
			
			let params = {
				...this.secondCarList,
				chooseRole: this.companyRole,
				companyId: this.currentCompany.company.id,
				newType: 2,
			}
			
			const res = await this.$getRequest(this.$url.getCarSubscribeList, "POST", params)
			
			if (res.code == 0 && res.data) {
				if (res.data.records && res.data.records.length) {
					this.secondCarList.list = [...this.secondCarList.list, ...res.data.records]
				}
				if (res.data.pages) {
					this.secondCarList.totalPages = res.data.pages
					if(this.secondCarList.page >= this.secondCarList.totalPages) {
						this.secondCarList.status = 'nomore'
					}
				} else {
					this.secondCarList.errMsg = '暂无车辆'
				}
			} else {
				this.secondCarList.errMsg = '暂无车辆'
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
				this.newCarList.status = 'nomore'
				return
			}
			this.newCarList.status = 'loading'
			++this.newCarList.page;
			
			this.getNewCarList()
		},
		
		secondCarListBottom() {
			if(this.secondCarList.page >= this.secondCarList.totalPages) {
				this.secondCarList.status = 'nomore'
				return
			}
			this.secondCarList.status = 'loading'
			++this.secondCarList.page
			
			this.getSecondCarList()
		},
		
		createCar() {
			this.showCarFilterPopup = true
		},
		
		goBrandFilterPage() {
			uni.navigateTo({
				url: `/pages/plan/brandFilter?companyId=${this.currentCompany.company.id}&newType=${this.activeTab}`,
			})
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "styles/plan.scss";

.page-wrap {
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.filter {
		height: 40rpx;
		font-size: 14px;
		color: #393D3F;
		.filter-img {
			margin-left: 16rpx;
			width: 20rpx;
			height: 20rpx;
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
