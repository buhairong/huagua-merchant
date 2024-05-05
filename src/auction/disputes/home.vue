<template>
	<view class="page-wrap" v-if="detail">
		<view>
			<CarInfoHeader
				:brand="detail.carBrand"
				:carType="detail.carType"
				:carTypeYear="detail.carTypeYear"
				:carTypeYearProduct="detail.carTypeYearProduct"
				:imageUrl="detail.imageUrl"
			/>
			
			<view class="list">
				<view class="card" v-if="otherDisputes && otherDisputes.status === 2">
					<view class="card-item">
						<view class="label">发起方</view>
						<view class="card-content">对方</view>
					</view>
					
					<view class="card-item">
						<view class="label">取消原因</view>
						<view class="card-content">
							<view class="desc">
								{{ otherDisputes.reason }}
							</view>
						</view>
					</view>
					
					<view class="card-item">
						<view class="label">上传凭证和描述</view>
						<view class="card-content" @click="openDescriptionPopup(2, otherDisputes)">
							<view class="desc">
								{{ otherDisputes.description }}
							</view>
							<u-icon name="arrow-right" color="#cccccc" size="32"></u-icon>
						</view>
					</view>
					
					<view class="card-item">
						<view class="label">纠纷状态</view>
						<view class="card-content">
							<view class="desc">
								{{ statusObj[otherDisputes.status] }}
							</view>
						</view>
					</view>
					
					<view class="card-item">
						<view class="label">处理结果</view>
						<view class="card-content">
							<view class="desc">
								{{ disputeResultStatus[otherDisputes.result] }}
							</view>
						</view>
					</view>
				</view>
				
				<view class="card">
					<view class="card-item">
						<view class="label">发起方</view>
						<view class="card-content">我</view>
					</view>
					
					<view class="card-item">
						<view class="label">取消原因</view>
						<view class="card-content" @click="openReasonPopup">
							<view class="desc">
								{{ myDisputes.reason || '请选择取消交易原因' }}
							</view>
							<u-icon name="arrow-right" color="#cccccc" size="32" v-if="myDisputes.status !== 2 && detail.detailVo.secondAuction.status === 5"></u-icon>
						</view>
					</view>
					
					<view class="card-item">
						<view class="label">上传凭证和描述</view>
						<view class="card-content" @click="openDescriptionPopup(1, myDisputes)">
							<view class="desc">
								{{ myDisputes.description || '上传取消原因凭证' }}
							</view>
							<u-icon name="arrow-right" color="#cccccc" size="32"></u-icon>
						</view>
					</view>
					
					<view class="card-item" v-if="myDisputes.status">
						<view class="label">纠纷状态</view>
						<view class="card-content">
							<view class="desc">
								{{ statusObj[myDisputes.status] }}
							</view>
						</view>
					</view>
					
					<view class="card-item" v-if="myDisputes.result">
						<view class="label">处理结果</view>
						<view class="card-content">
							<view class="desc">
								{{ disputeResultStatus[myDisputes.result] }}
							</view>
						</view>
					</view>
					
					<view class="card-item" v-if="myDisputes.rejectReason">
						<view class="label">驳回原因</view>
						<view class="card-content">
							{{ myDisputes.rejectReason }}
						</view>
					</view>
				</view>
			</view>
			
		</view>
		
		<view class="btn" @click="save" v-if="detail.detailVo.secondAuction.status === 5">提交申请</view>
		
		<AuctionDisputesReasonPopup 
			v-if="showReasonPopup"
			:showPopup.sync="showReasonPopup"
			:reason="myDisputes.reason"
			@save="changeReason"
		/>
		
		<AuctionDisputesDescribePopup
			v-if="showDescriptionPopup"
			:showPopup.sync="showDescriptionPopup"
			:type="type"
			:disputes="disputes"
			:status="detail.detailVo.secondAuction.status"
			@save="changeDescription"
		/>
	</view>
</template>

<script>
import { disputeResultStatus } from '@/constants/index.js'
import CarInfoHeader from '@/components/CarInfoHeader.vue'
import AuctionDisputesReasonPopup from '../components/AuctionDisputesReasonPopup.vue'
import AuctionDisputesDescribePopup from '../components/AuctionDisputesDescribePopup.vue'

export default {
	components: {
	  CarInfoHeader,
		AuctionDisputesReasonPopup,
		AuctionDisputesDescribePopup,
	},
	
	data() {
		return {
			disputeResultStatus,
			id: '',
			detail: null,
			myDisputes: {
				fromSys: 2,
				reason: '',
				description: '',
				imageList: [],
			},
			otherDisputes: null,
			currentCompany: {},
			statusObj: {
				1: '待审核',
				2: '已处理',
				3: '已驳回',
			},
			showReasonPopup: false,
			showDescriptionPopup: false,
			type: 1,
			disputes: null,
		}
	},
	
	onLoad(options) {
		this.id = options.id
		this.selectCarsInfo()
		const currentCompany = uni.getStorageSync('current_company')
		if (currentCompany){
			this.currentCompany = currentCompany
		}
	},
	
	onShow() {
		
	},
	
	methods: {
		async selectCarsInfo() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				id: this.id,
				newOrOld: 2,
			}
			
			const res = await this.$getRequest(this.$url.findCarInfoById, "POST", params)
			
			if (res.code == 0) {
				this.detail = res.data
				if (res.data.detailVo.biddingDisputesEntityList.length) {
					const myDisputes = res.data.detailVo.biddingDisputesEntityList.find(item => item.fromSys === 2)
					if (myDisputes) {
						this.myDisputes = myDisputes
					}
					
					const otherDisputes = res.data.detailVo.biddingDisputesEntityList.find(item => item.fromSys === 1 && item.status === 2)
					if (otherDisputes) {
						this.otherDisputes = otherDisputes
					}
				}
				
			}
			
			uni.hideLoading()
		},
		
		openReasonPopup() {
			if (this.detail.detailVo.secondAuction.status === 5) {
				this.showReasonPopup = true
			}
		},
		
		changeReason(data) {
			this.myDisputes.reason = data
		},
		
		// 1.我 2.对方
		openDescriptionPopup(type, disputes) {
			this.type = type
			this.disputes = disputes
			this.showDescriptionPopup = true
		},
		
		changeDescription(data) {
			this.myDisputes.description = data.description
			this.myDisputes.imageList = data.imageList
		},
		
		async save() {
			if (!this.myDisputes.reason) {
				uni.showToast({
					title: '请选择取消原因',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if (!this.myDisputes.description) {
				uni.showToast({
					title: '请输入取消原因',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if (!this.myDisputes.imageList.length) {
				uni.showToast({
					title: '请上传凭证',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				id: this.myDisputes.id,
				secondAuctionId: this.detail.detailVo.secondAuction.id,
				fromSys: 2,
				userId: this.currentCompany.userId,
				reason: this.myDisputes.reason,
				description: this.myDisputes.description,
				imageList: this.myDisputes.imageList,
				finalPrice: this.detail.detailVo.currentBid,
			}
			
			const res = await this.$getRequest(this.$url.createBiddingDisputes, "POST", params)
			uni.hideLoading()
			if (res.code == 0) {
				uni.reLaunch({
					url: `/pages/car/oldCarDetail?tab=5&id=${this.id}`
				})
			}
		},
	},
}
</script>

<style lang="scss" scoped>
	@import "~@/styles/common.scss";	
@import "~@/styles/mixin.scss";	

.page-wrap {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.list {
		margin-top: 40rpx;
		.card-item {
			margin-bottom: 24rpx;
			line-height: 44rpx;
			font-size: 28rpx;
			color: rgba(10, 15, 45, 0.8);
			display: flex;
			justify-content: space-between;
			.label {
				margin-right: 24rpx;
				color: rgba(10, 15, 45, 0.8);
			}
			.card-content {
				color: rgba(10, 15, 45, 0.6);
				width: 0;
				flex: 1;
				text-align: right;
				display: flex;
				justify-content: flex-end;
				.desc {
					width: 0;
					flex: 1;
					text-align: right;
					@include text-overflow;
				}
			}
		}
	}
	.btn {
		margin-top: 80rpx;
		height: 116rpx;
		border-radius: 16rpx;
		background: #4170EE;
		color: #FFFFFF;
		font-size: 34rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>