<template>
	<view>
		<view v-if="detail.detailVo">
			<view class="card">
				<view class="item">
					<view class="item-title">起拍价格</view>
					<view class="item-content">￥{{detail.detailVo.secondAuction.startingPrice | $numFormat}}</view>
				</view>
				<view class="item">
					<view class="item-title">加价幅度</view>
					<view class="item-content">￥{{detail.detailVo.secondAuction.advance | $numFormat}}</view>
				</view>
				<view class="item">
					<view class="item-title" @click="openPop">
						竞卖保证金
						<u-icon
							style="margin-left:16rpx;"
							name="info-circle" 
							color="rgba(10, 15, 45, 0.8)" 
							size="32"
						></u-icon>
					</view>
					<view class="item-content">￥{{detail.detailVo.secondAuction.deposit | $numFormat}}</view>
				</view>
				
				<view class="item">
					<view class="item-title">参与人数</view>
					<view class="item-content">{{detail.detailVo.number || 0}}人</view>
				</view>
				
				<view class="item">
					<view class="item-title">当前出价</view>
					<view class="item-content">
						<view @click="goCurrentBidList" v-if="detail.detailVo.currentBid">
							￥{{detail.detailVo.currentBid | $numFormat}}
							<u-icon name="arrow-right" color="#cccccc" size="32" style="margin-left:4px;"></u-icon>
						</view>
						<view v-else>暂无出价</view>
					</view>
				</view>
				
				<view class="item">
					<view class="item-title">竞价周期</view>
					<view class="item-content">{{detail.detailVo.secondAuction.periodDay}}天</view>
				</view>
				
				<view class="item">
					<view class="item-title">竞价状态</view>
					<view class="item-content">{{auctionCarStatus[detail.detailVo.secondAuction.status].label}}</view>
				</view>
				
				<view class="item">
					<view class="item-title">开始时间</view>
					<view class="item-content">{{detail.detailVo.secondAuction.startTime}}</view>
				</view>
				
				<view class="item">
					<view class="item-title">结束时间</view>
					<view class="item-content">{{detail.detailVo.secondAuction.endTime}}</view>
				</view>
			</view>
			
			<view class="card" v-if="detail.detailVo.secondAuction.status >= 5 && detail.detailVo.isFullyPaid === 1">
				<view class="item">
					<view class="item-title">客户姓名</view>
					<view class="item-content">{{detail.detailVo.name}}</view>
				</view>
				
				<view class="item">
					<view class="item-title">联系方式</view>
					<view class="item-content">
						<view class="customer" @click="callPhone">
							{{getHideMobile()}}
							<view class="phone-tag">
								<u-icon name="phone-fill" color="#0256FF" size="28"></u-icon>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="end-tip" v-if="detail.detailVo.secondAuction.status === 5">
				请您在30个自然日内与竞买人完成交易。
			</view>
			
			<view class="btn" @click="delAuction" v-if="detail.detailVo.secondAuction.status === 0 || detail.detailVo.secondAuction.status === 2">
				删除竞价
			</view>
			<view class="btn" @click="handleBankPay(detail.detailVo.secondAuction.deposit, detail.billId)" v-else-if="detail.detailVo.secondAuction.status === 1 && detail.isPayDeposit && detail.isPayDeposit !== 1">
				{{detail.isPayDeposit === 2 ? '重新上传银行转账凭证' : '查看支付明细'}}
			</view>
			<view class="btn pay-btn" v-else-if="detail.detailVo.secondAuction.status === 1 && detail.isPayDeposit !== 1">
				<view class="left">
					竞卖保证金：¥ 
					<view class="pay-money">
						{{detail.detailVo.secondAuction.deposit | $numFormat}}
					</view>
				</view>
				<view class="right" @click.stop="handlePay(detail.detailVo.secondAuction.deposit)">
					支付
					<image
						style="width:24rpx;margin-left:12rpx;"
						src="https://image.51cheyaoshi.com/xcx/merchant/static/order/big_arrow_right.png"
						mode="widthFix"
					/>
				</view>
			</view>
			<view class="btn no-margin" @click="handleBankPay(detail.detailVo.supplementaryDeposit, detail.supplementaryBillId)" v-else-if="detail.detailVo.secondAuction.status === 5 && detail.isPaySupplementaryDeposit && detail.isPaySupplementaryDeposit >= 2">
				{{detail.isPaySupplementaryDeposit === 2 ? '重新上传银行转账凭证' : '查看支付明细'}}
			</view>
			<view class="btn pay-btn no-margin" v-else-if="detail.detailVo.secondAuction.status === 5 && detail.detailVo.isFullyPaid !== 1">
				<view class="left">
					补缴保证金：¥ 
					<view class="pay-money">
						{{detail.detailVo.supplementaryDeposit | $numFormat}}
					</view>
				</view>
				<view class="right" @click.stop="handlePay(detail.detailVo.supplementaryDeposit)">
					支付
					<image
						style="width:24rpx;margin-left:12rpx;"
						src="https://image.51cheyaoshi.com/xcx/merchant/static/order/big_arrow_right.png"
						mode="widthFix"
					/>
				</view>
			</view>
			<view class="buttom-disabled-btn-group" v-else-if="detail.detailVo.secondAuction.status >= 5 || detail.detailVo.secondAuction.status === 3">
				<view class="cancel-btn" @click="goDisputesPage" v-if="detail.detailVo.secondAuction.status !== 6 || detail.detailVo.biddingDisputesEntityList.length">
					{{ isBiddingDisputes ? '纠纷处理中' : '交易纠纷' }}
				</view>
				<button 
					v-if="detail.detailVo.secondAuction.status === 5 && detail.detailVo.secondAuction.merchantConfirm !== 1"
					:disabled="isDisabled" 
					@click="confirmAuction"
				>
					完成交易
				</button>
			</view>
		</view>
		
		<view class="empty-wrap" v-else>
			<image
				class="empty-img"
				src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_720.png"
			/>
			<view class="tip">暂无竞价信息</view>
		</view>
		
		<AuctionDepositPopup :showPopup.sync="showPopup" />
		
		<u-popup
			v-model="showBidPopup" 
			mode="center"
			border-radius="12"
			closeable="true"
			close-icon-color="#0A0F2D"
		>
			<view class="popup-wrap">
				<view class="title">出价记录</view>
				<view class="card">
					<u-table>
						<u-tr>
							<u-th>出价时间</u-th>
							<u-th>竞买人</u-th>
							<u-th>出价金额</u-th>
						</u-tr>
						<u-tr v-for="item in detail.detailVo.recordEntityList" :key="item.id">
							<u-td>{{item.auctionTime.slice(0, 10)}}</u-td>
							<u-td>{{item.userName}}</u-td>
							<u-td>{{item.price | $numFormat}}元</u-td>
						</u-tr>
					</u-table>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'
import { auctionCarStatus } from '@/constants/index.js'
import AuctionDepositPopup from './AuctionDepositPopup.vue'

export default {
	components: {
		AuctionDepositPopup,
	},
	
	props: {
		type: {
			type: Number,
			required: true,
		},
		
		detail: {
			type: Object,
			required: true
		},
	},
	
	data() {
		return {
			auctionCarStatus,
			showPopup: false,
			showBidPopup: false,
			currentCompany: {},
		}
	},
	
	computed: {
		isBiddingDisputes() {
			let res = false
			
			if (this.detail && this.detail.detailVo.biddingDisputesEntityList.length) {
				const result = this.detail.detailVo.biddingDisputesEntityList.some(item => item.status === 1)
				
				if (result) {
					res = true
				}
			}
			
			return res
		},
		
		isDisabled() {
			let res = false
			
			if (this.isBiddingDisputes) {
				res = true
			}
			
			if (this.detail && this.detail.detailVo.isFullyPaid !== 1) {
				res = true
			}
			
			return res
		},
	},
	
	mounted() {
		const currentCompany = uni.getStorageSync('current_company')
		if (currentCompany){
			this.currentCompany = currentCompany
		}
		if (this.detail.detailVo.secondAuction.status === 2) {
			uni.showModal({
				title: '提示',
				content: '您创建的竞价方案审核未通过',
				confirmText: '修改竞价',
				cancelText: '删除竞价',
				success: (res) => {
					if (res.confirm) {
						this.setAuctionInfo()
					} else if (res.cancel) {
						this.delAuction()
					}
				},
				fail: (err) => {
					console.log('fail', err)
				}
			})
		}
	},
	
	methods: {
		callPhone() {
			uni.makePhoneCall({
				phoneNumber: this.detail.detailVo.mobile
			})
		},
		
		openPop() {
			this.showPopup = true
		},
		
		getHideMobile() {
			const reg = /(\d{3})(\d{4})(\d{4})/
			return this.detail.detailVo.mobile.replace(reg, '$1****$3')
		},
		
		goCurrentBidList() {
			this.showBidPopup = true
		},
		
		setAuctionInfo() {
			uni.navigateTo({
				url: `/auction/cars/setAuctionInfo?carId=${this.detail.id}&carTypeId=${this.detail.carTypeId}&carTypeYearId=${this.detail.carTypeYearId}&carTypeYearProductId=${this.detail.carTypeYearProductId}&startingPrice=${this.detail.detailVo.secondAuction.startingPrice}&advance=${this.detail.detailVo.secondAuction.advance}&deposit=${this.detail.detailVo.secondAuction.deposit}&periodDay=${this.detail.detailVo.secondAuction.periodDay}&startTime=${this.detail.detailVo.secondAuction.startTime}`
			})
		},
		
		delAuction() {
			uni.showModal({
				title: '提示',
				content: '确定要删除这个竞拍吗？',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: '加载中'
						})
						
						const params = {
							secondCarId: this.detail.id,
						}
						
						const res = await this.$getRequest(this.$url.deleteSecondAuction, "GET", params)
						
						if (res.code == 0) {
							this.$emit('update')
						}
						
						uni.hideLoading()
					}
				},
				fail: (err) => {
					console.log('fail', err)
				}
			})
		},
		
		formatTenThousandNumber(num) {
			return formatTenThousandNumber(num)
		},
		
		formatThousandNumber(price) {
			return formatThousandNumber(price)
		},
		
		handlePay(payPrice) {
			// businessType 0租车、1长租产品、2新车订阅、3购买二手车、4团购、5会员、6、购买服务 7.竞拍
			// payType 0余额、1押金、2订金、3尾款、4长租费用（包月或季）、6二手车、7支付年费、8订阅费用、9租车租金、10租车押金
			uni.navigateTo({
				url: `/auction/pay/choosePay?businessId=${this.detail.detailVo.secondAuction.id}&carId=${this.detail.id}&price=${payPrice}&businessType=7&payType=10&tab=5`
			})
		},
		
		handleBankPay(payPrice, billId) {
			uni.navigateTo({
				url: `/auction/pay/bankPayInfo?businessId=${this.detail.detailVo.secondAuction.id}&carId=${this.detail.id}&billId=${billId}&price=${payPrice}&payType=10&openid=${this.currentCompany.openid}&userId=${this.currentCompany.userId}&businessType=7&tab=5`
			})
		},
		
		goDisputesPage() {
			if (this.isBiddingDisputes) {
				const result = this.detail.detailVo.biddingDisputesEntityList.some(item => item.fromSys === 1 && item.status === 1)
				
				if (!result) {
					this.navigateDisputesPage()
				}
			} else {
				this.navigateDisputesPage()
			}
		},
		
		navigateDisputesPage() {
			uni.navigateTo({
				url: `/auction/disputes/home?id=${this.detail.id}`
			})
		},
		
		confirmAuction() {
			uni.showModal({
				title: '提示',
				content: `确认已与买家完成交易？`,
				confirmText: "确认",
				success: async (res)=> {
					if (res.confirm) {
						const res = await this.$getRequest(this.$url.confirmAuction, 'GET', {
						    id: this.detail.detailVo.secondAuction.id,
						    fromSys: 2,
						})
						
						if(res.code === 0) {
							this.$emit('update')
							uni.showToast({
								title: '您已确认交易',
								duration: 2000
							})
						}
					}
				}
			})
		},
		
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.card {
	padding: 20px 32rpx;
	.title {
		margin-bottom: 16px;
	}
	.item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 12px;
		&:last-child {
			margin-bottom: 0;
		}
		.item-title {
			height: 44rpx;
			font-size: 14px;
			line-height: 44rpx;
			color: #86909C;
			padding-left: 10rpx;
			padding-right: 20rpx;
		}
		.item-content {
			flex: 1;
			display: flex;
			justify-content: flex-end;
			font-size: 14px;
			line-height: 44rpx;
			color: #1D2129;
			.service-list {
				display: flex;
				justify-content: flex-end;
				flex-wrap: wrap;
				.service {
					height: 44rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					padding: 0 8rpx;
					border-radius: 4rpx;
					background: #FFFFFF;
					border: 1px solid #E5E6EB;
					font-size: 12px;
					color: #1D2129;
					margin-left: 20rpx;
					margin-bottom: 16rpx;
				}
				.safeguard-service {
					margin-bottom: 0;
				}
			}
		}
	}
}

.subscribe-item {
	.item-title {
		flex: 1;
	}
	
}

.btn {
	margin-top: 80rpx;
	width: 100%;
	height: 116rpx;
	border-radius: 16rpx;
	background: #4170EE;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 17px;
	font-weight: 500;
	color: #FFFFFF;
}

.pay-btn {
	justify-content: space-between;
	padding: 0 40rpx;
	.left {
		display: flex;
		align-items: baseline;
		color: #FFFFFF;
		font-size: 24rpx;
		.pay-money {
			font-size: 40rpx;
		}
	}
	.right {
		display: flex;
		align-items: center;
		color: #FFFFFF;
		font-size: 34rpx;
	}
}

.empty-wrap {
	margin: 40px 0 100px 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	.empty-img {
		width: 220rpx;
		height: 220rpx;
	}
	.tip {
		margin-top: 24px;
		height: 48rpx;
		font-size: 16px;
		font-weight: 500;
		line-height: 48rpx;
		color: #0A0F2D;
	}
}

.customer {
	display: flex;
	align-items: center;
	.phone-tag {
		margin-left: 14rpx;
		width: 40rpx;
		height: 40rpx;
		background: rgba(22, 93, 255, 0.1);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}

.popup-wrap {
	padding: 16rpx 32rpx 40rpx;
	width: 640rpx;
	max-height: 900rpx;
	overflow: auto;
	.title {
		height: 60rpx;
		font-size: 20px;
		line-height: 60rpx;
		color: #141414;
		text-align: center;
		margin-bottom: 32px;
	}
}

.end-tip {
	margin-top: 40rpx;
	margin-bottom: 16rpx;
	height: 44rpx;
	font-size: 28rpx;
	line-height: 44rpx;
	color: #FF0000;
}

.buttom-disabled-btn-group, .no-margin {
	margin-top: 0;
}
</style>