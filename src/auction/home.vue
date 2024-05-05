<template>
	<view class="page-wrap">
		<view class="search-header">
			<view class="tabs">
				<view 
					v-for="tab in tabs"
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
					:scroll-top="secondCarList.scrollTop" 
					scroll-y="true" 
					class="scroll-Y" 
					@scrolltolower="secondCarListBottom"
					@scroll="secondCarScroll"
				>
					<AuctionCarItem
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
			
			<Account v-else-if="activeTab === 2" :detail="newCarList" :account="account" @search="getNewCarList" @scroll="handleScroll" />
		</view>
		
		<view class="bottom-btn" @click="createCar" v-if="activeTab === 1 && isAgree">选择车辆</view>
		
		<u-modal
			v-model="showAgreeModal"
			title="竟卖规则"
			:show-cancel-button="true"
			confirm-text="我已了解并同意"
			cancel-text="取消"
			@confirm="confirmModal"
			@cancel="cancelModal"
		>
			<view class="slot-content">
				<view class="model-content">
					<view class="model-block">
						<view class="model-title">产品上架规则：</view>
						<view class="model-item">1.1 竞卖方需确保所提交车辆信息的真实性和准确性，如有虚假行为，竞卖平台有权采取相应的处罚措施。</view>
						<view class="model-item">1.2 在车辆竞卖前，竞卖方需要支付上架产品时设置的保证金金额相同，并且用户和商家支付相同的金额。</view>
						<view class="model-item">1.3 保证金累计支付到达1000元后，竞卖方在未来的车辆上架过程中将不需要再支付保证金。</view>
					</view>
					
					<view class="model-block">
						<view class="model-title">佣金规则：</view>
						<view class="model-item">2.1 无论竞卖是否成功完成交易，上架的车辆都会扣除相应的佣金费用。</view>
						<view class="model-item">2.2 佣金金额将根据竞卖平台规定的比例进行计算和扣除。</view>
						<view class="model-item">2.3 若竞卖成功并完成交易，佣金将从交易款项中扣除。</view>
						<view class="model-item">2.4 若竞卖成功但未能完成交易，佣金将从竞卖方支付的保证金中扣除。如果保证金不足以支付佣金，则竞卖方需额外补足。</view>
					</view>
					
					<view class="model-block">
						<view class="model-title">取消交易规则：</view>
						<view class="model-item">3.1 竞卖方因实际原因取消交易，根据具体情况，保证金中扣除相应费用。</view>
					</view>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
import AuctionCarItem from './components/AuctionCarItem.vue'
import Account from './components/Account.vue'
	
export default {
	components: {
		AuctionCarItem,
		Account,
	},
	
	data() {
		return {
			currentCompany: {},
			tabs: [
				{id: 1, label: '竞卖列表'},
				{id: 2, label: '保证金'},
			],
			activeTab: 1,
			newCarScrollTop: 0,
			secondCarScrollTop: 0,
			secondCarList: {
				scrollTop: 0,
				list: [],
				pageSize: 10,
				page: 1,
				totalPage: 0,
				errMsg: '',
				status: 'loadmore',
			},
			newCarList: {
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
			showAgreeModal: false,
			isAgree: false,
			account: {},
		}
	},
	
	onLoad(options) {
		this.getSecondCarList()
		
		this.isAgree = uni.getStorageSync('isAgreeAuction')
		if (!this.isAgree) {
			this.showAgreeModal = true
		}
	},
	
	onShow() {
		const value = uni.getStorageSync('current_company')
		if (value) {
			this.currentCompany = value
			this.newCarList.list = []
			this.getNewCarList()
			this.getBankAndBalance()
		}
	},
	
	methods: {
		changeTab(id) {
			this.activeTab = id
			this.$nextTick(() => {
				if (id === 2) {
					this.newCarList.scrollTop = this.newCarScrollTop
				} else {
					this.secondCarList.scrollTop = this.secondCarScrollTop
				}
			})
		},
		
		async getNewCarList(pageIndex=1) {
			uni.showLoading({
				title: '加载中'
			})
			
			let params = {
				fromSys: 2,
				limit: this.newCarList.pageSize,
				pageIndex,
				userId: this.currentCompany.userId,
			}
			
			const res = await this.$getRequest(this.$url.getTurnoverRecord, "GET", params)
			
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
					this.newCarList.errMsg = '暂无记录'
				}
			} else {
				this.newCarList.errMsg = '暂无记录'
			}
			
			uni.hideLoading()
		},
		
		async getSecondCarList() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				newType: 3,
				limit: this.secondCarList.pageSize,
				page: this.secondCarList.page,
			}
			
			const res = await this.$getRequest(this.$url.selectSecondHandCarsByMerchant, "POST", params)
			
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
					this.secondCarList.errMsg = '暂无记录'
				}
			} else {
				this.secondCarList.errMsg = '暂无记录'
			}
			
			uni.hideLoading()
		},
		
		secondCarScroll(e) {
			this.secondCarScrollTop = e.detail.scrollTop
		},
		
		handleScroll(e) {
			this.newCarList.scrollTop = e
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
			uni.navigateTo({
				url: '/auction/cars/selectOldCar',
			})
		},
		
		confirmModal() {
			uni.setStorageSync('isAgreeAuction', true)
			this.isAgree = true
		},
		
		cancelModal() {
			uni.navigateBack({
				delta: 1
			})
		},
		
		async getBankAndBalance() {
			uni.showLoading({
				title: '加载中'
			})
			
			let params = {
				fromSys: 2,
				userId: this.currentCompany.userId,
			}
			
			const res = await this.$getRequest(this.$url.getBankAndBalance, "GET", params)
			uni.hideLoading()
			if (res.code === 0) {
				this.account = res.data
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
.model-content {
	height: 700rpx;
	overflow: auto;
	padding: 32rpx 40rpx;
	line-height: 44rpx;
	font-size: 28rpx;
	color: rgba(10, 15, 45, 0.8);
	.model-title {
		padding-top: 60rpx;
		padding-bottom: 32rpx;
		color: rgba(10, 15, 45, 1);
	}
	.model-item {
		padding-bottom: 24rpx;
	}
}
</style>
