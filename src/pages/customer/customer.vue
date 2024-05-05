<template>
	<view class="page-wrap">
		<view class="card" v-for="item in list" :key="item.id" @click="goClientDetailPage(item)">
			<view class="left">
				<view class="info">
					{{item.name}}
				</view>
				<view class="mobile">
					电话：{{item.mobile}}
				</view>
			</view>
			
			<view class="right" @click.stop="callPhone(item.mobile)">
				<view class="phone-tag">
					<u-icon name="phone-fill" color="#0256FF" size="28"></u-icon>
				</view>
				打电话
			</view>
		</view>
		
		<u-empty v-if="errMsg" :text="errMsg" mode="list"></u-empty>
		<view class="loadmore">
			<u-loadmore
				v-if="list.length"
				:status="loadstatus"
				:load-text="loadText"
			/>
		</view>
		
		<view class="fixed-bottom-btn">
			<view class="bottom-btn" @click="goSetClientPage">
				添加客户
			</view>
		</view>
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentCompany: {},
			list: [],
			roleId: null,
			limit: 10,
			page: 1,
			totalPage: 0,
			totalPage: 0,
			errMsg: '',
			loadstatus: 'loadmore',
			loadText: {
				loadmore: '轻轻上拉',
				loading: '努力加载中',
				nomore: '实在没有了'
			},
		}
	},
	
	onLoad(options) {
		try {
			const value = uni.getStorageSync('current_company')
			if (value) {
				this.currentCompany = value
				this.getClientList()
			}
		} catch (e) {
			// error
		}
	},
	
	onShow() {
		
	},
	onReachBottom() {
		this.loadstatus = 'loading'
		++this.page
		if (this.page >= this.totalPages) {
			this.loadstatus = 'nomore'
		} else {
			this.list = []
			this.getClientList()
		}
	},
	
	methods: {
		async getClientList() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				limit: this.limit,
				page: this.page,
			}
			
			const res = await this.$getRequest(this.$url.getClientList, "POST", params)
			
			if (res.code == 0 && res.data) {
				if (res.data.records && res.data.records.length) {
					this.list = [...this.list, ...res.data.records]
				}
				if (res.data.pages) {
					this.totalPages = res.data.pages
					if(this.page >= this.totalPages) {
						this.loadstatus = 'nomore'
					}
				} else {
					this.errMsg = '暂无客户'
				}
			} else {
				this.errMsg = '暂无客户'
			}
			
			uni.hideLoading()
		},
		
		callPhone(mobile) {
			uni.makePhoneCall({
				phoneNumber: mobile
			})
		},
		
		// 1.添加 2.编辑
		goSetClientPage() {
			uni.navigateTo({
				url: `/pages/customer/setCustomer?type=1`
			})
		},
		
		goClientDetailPage(item) {
			uni.navigateTo({
				url: `/pages/customer/customerDetail?userId=${item.id}&merchantId=${this.currentCompany.company.id}&salesmanId=${this.currentCompany.userId}`
			})
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	min-height: 100vh;
	padding-bottom: 140px;
}

.card {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.left {
		.info {
			height: 48rpx;
			display: flex;
			align-items: center;
			color: #1D2129;
			font-size: 16px;
			.tag {
				margin-left: 16rpx;
				height: 36rpx;
				line-height: 36rpx;
				border-radius: 4rpx;
				background: #E8F3FF;
				color: #4170EE;
				font-size: 11px;
				padding: 0 8rpx;
			}
		}
		.mobile {
			margin-top: 10rpx;
			height: 36rpx;
			font-size: 12px;
			line-height: 36rpx;
			color: #86909C;
		}
	}
	.right {
		display: flex;
		align-items: center;
		.phone-tag {
			margin-right: 14rpx;
			width: 40rpx;
			height: 40rpx;
			background: rgba(22, 93, 255, 0.1);
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
}

</style>
