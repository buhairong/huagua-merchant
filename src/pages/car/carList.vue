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
					<CarItem
						v-for="item in newCarList.list"
						:key="item.id"
						:item="item"
						type="1"
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
					<CarItem
						v-for="item in secondCarList.list"
						:key="item.id"
						:item="item"
						type="2"
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
		
		<view class="bottom-btn" @click="createCar">添加车辆</view>
		
		<carFilterPopup
			:showCarFilterPopup.sync="showCarFilterPopup"
			:type="activeTab"
			workType="2"
		/>
	</view>
</template>

<script>
import { carTypeTabs } from '@/constants/index.js'
import CarItem from './components/CarItem.vue'
import carFilterPopup from '../plan/components/carFilterPopup.vue'
	
export default {
	components: {
		CarItem,
		carFilterPopup,
	},
	
	data() {
		return {
			currentCompany: {},
			carTypeTabs,
			activeTab: 1,
			newCarScrollTop: 0,
			secondCarScrollTop: 0,
			newCarList: {
				scrollTop: 0,
				list: [],
				pageSize: 10,
				page: 1,
				totalPage: 0,
				errMsg: '',
				status: 'loadmore',
			},
			secondCarList: {
				scrollTop: 0,
				list: [],
				pageSize: 10,
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
		this.getNewCarList()
		this.getSecondCarList()
		
		try {
			const value = uni.getStorageSync('current_company')
			if (value) {
				this.currentCompany = value
			}
		} catch (e) {
			// error
		}
	},
	
	onShow() {
		
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
				newOrOld: 1,
				pageSize: this.newCarList.pageSize,
				pageNo: this.newCarList.page,
			}
			
			const res = await this.$getRequest(this.$url.getCarList, "POST", params)
			
			if (res.code == 0 && res.data) {
				if (res.data.records && res.data.records.length) {
					this.newCarList.list = [...this.newCarList.list, ...res.data.records]
					if(this.newCarList.page >= this.newCarList.totalPages) {
						this.newCarList.status = 'nomore'
					}
				}
				if (res.data.pages) {
					this.newCarList.totalPages = res.data.pages
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
			
			const params = {
				newOrOld: 2,
				pageSize: this.secondCarList.pageSize,
				pageNo: this.secondCarList.page,
			}
			
			const res = await this.$getRequest(this.$url.getCarList, "POST", params)
			
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
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "styles/car.scss";

.page-wrap {
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
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
