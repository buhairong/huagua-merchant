<template>
	<view class="wrap">
		<view class="header">
			<view class="title">佣金余额</view>
			<view class="price-wrap">
				<view class="price">{{totalMoney | $numFormat1}}</view>
				<view class="right" @click="cardInfo">
					 {{isSuperManager ? '公司收款信息' : '银行卡'}}
					 <u-icon name="arrow-right" color="#ffffff" size="28" ></u-icon>
				</view>
			</view>
		</view>
		
		<view class="container" v-if="list.length">
			<view class="title">佣金记录</view>
			<view class="list-wrap">
				<view class="record" v-for="(item, index) in list" :key="index">
					<view class="record-item">
						<view>{{item.operation === 1 ? '返佣' : '提现'}}</view>
						<view>{{item.operation === 1 ? '+' : '-'}}{{item.money | $numFormat1}}</view>
					</view>
					<view class="record-item" style="margin-top:8px;">
						<view class="time">{{item.createTime}}</view>
						<view class="status" :class="{'error-status': item.operation === 2 && item.status === 0}">{{item.statusStr}}</view>
					</view>
				</view>
			</view>
		</view>
		<u-empty v-else-if="errMsg" :text="errMsg" mode="list"></u-empty>
		
		<view class="fixed-buttom-disabled-btn">
			<button @click="bindCard" v-if="(!detail.idcard || detail.bankCardBind === 0) && !isSuperManager">绑定银行卡</button>
			<button @click="goCashPage" v-else-if="totalMoney">立即提现</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentCompany: {},
			list: [],
			totalMoney: 0,
			errMsg: '',
			detail: {},
			isSuperManager: false,
		}
	},
	
	onLoad(options) {
		try {
			const value = uni.getStorageSync('current_company')
			if (value) {
				this.currentCompany = value
				this.isSuperManager = value.company.roleList.some(item => item.id === 9)
			}
		} catch (e) {
			// error
		}
	},
	
	onShow() {
		this.selectListOfUserId()
	},
	
	methods: {
		async selectListOfUserId() {
			const params = {
				brokerageType: this.currentCompany.isSuperManager ? 2 : 1
			}
			
			const res = await this.$getRequest(this.$url.selectListOfUserId, "GET", params)
			
			if (res.code == 0 && res.data) {
				this.totalMoney = res.data.totalMoney || 0
				this.list = res.data.recordList
				this.detail = res.data
				if (this.list.length === 0) {
					this.errMsg = '暂无记录'
				}
				if (res.data.needRemind === 1) {
					uni.showModal({
						title: '提示',
						content: `您绑定的银行卡信息错误，请重新绑定正确的银行卡信息后再次发起提现申请。`,
						confirmText: '重新绑定',
						success: async (res) => {
							if (res.confirm) {
								this.goBindCardPage()
							}
						}
					})
				}
			}
		},
		
		bindCard() {
			if (this.detail.idcard) {
				this.goBindCardPage()
			} else {
				uni.navigateTo({
					url: `/cash/identity/identity`,
				})
			}
		},
		
		goCashPage() {
			uni.navigateTo({
				url: `/cash/cash/cashMoney?totalMoney=${this.totalMoney}`,
			})
		},
		
		cardInfo() {
			if (this.isSuperManager) {
				uni.navigateTo({
					url: `/cash/card/companyCardinfo?bankAccountId=${this.detail.bankAccountId}&bankName=${this.detail.bankName}&realName=${this.detail.realName}`,
				})
			} else {
				if (this.detail.bankAccountId) {
					uni.navigateTo({
						url: `/cash/card/cardinfo?bankAccountId=${this.detail.bankAccountId}&bankName=${this.detail.bankName}`,
					})
				} else {
					this.bindCard()
				}
			}
			
		},
		
		goBindCardPage() {
			uni.navigateTo({
				url: `/cash/card/bindcard?realName=${this.detail.realName}`,
			})
		},
		
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.wrap {
	min-height: 100vh;
	padding: 232rpx 32rpx 140px;
	.header {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		padding: 32rpx 32rpx 64rpx;
		width: 100vw;
		height: 200rpx;
		background: #4170EE;
		color: #FFFFFF;
		.title {
			height: 48rpx;
			font-size: 28rpx;
			line-height: 48rpx;
			color: #FFFFFF;
		}
		.price-wrap {
			height: 72rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.price {
				font-size: 52rpx;
			}
			.right {
				display: flex;
				align-items: center;
				font-size: 28rpx;
			}
		}
	}
	
	.container {
		.title {
			margin-bottom: 16px;
			height: 48rpx;
			font-size: 16px;
			line-height: 48rpx;
			color: #3D3D3D;
		}
		.record {
			margin-bottom: 12px;
			padding: 20px 32rpx;
			box-shadow: 0px -1px 24px 0px rgba(10, 15, 45, 0.04),0px 4px 24px 0px rgba(10, 15, 45, 0.04);
			border-radius: 16rpx;
			.record-item {
				height: 44rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #333333;
				font-size: 16px;
				.time {
					font-size: 12px;
					color: #999999;
				}
				.status {
					font-size: 14px;
				}
				.error-status {
					color: #EA0000;
				}
			}
		}
	}
}
</style>
