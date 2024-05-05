<template>
	<view class="page">
		<view class="info-card">
			<view class="item">
				<view class="item-title">应转金额：</view>
				<view class="item-content">{{price | $numFormat}}元</view>
			</view>
			
			<view class="item">
				<view class="item-title">账户名称：</view>
				<view class="item-content">{{detail.companyName}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">账 户 号 ：</view>
				<view class="item-content">{{detail.bankAccountId}}</view>
				<view class="tag" @click="copyOrder">复制</view>
			</view>
			
			<view class="item">
				<view class="item-title">开 户 行 ：</view>
				<view class="item-content">{{detail.bankName}}</view>
			</view>
			
			<view class="del-icon" @click="deleteBankBill" v-if="billId">
				<image
					src="https://image.51cheyaoshi.com/xcx/app/static/home/delete-icon.png"
					mode="widthFix"
				/>
			</view>
		</view>
		<view class="btn" @click="upload" v-if="bankBills.length === 0">上传转账凭证</view>
		
		<view v-else>
			<view class="title-wrap">
				<view class="title">转账凭证</view>
				<view class="reupload" @click="upload">重新上传</view>
			</view>
			
			<view
				class="img-wrap"
				v-for="(img, index) in bankBills"
				:key="index"
			>
				<image
					:src="img"
					mode="widthFix"
				/>
				<image
					v-if="!billId"
					class="del-icon"
					src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_509.png"
					@click="delImg(index)"
				/>
			</view>
			
			<view v-if="billId && remark">
				<view class="title">备注说明</view>
				<view class="remark">{{remark}}</view>
			</view>
			
			<view class="fixed-bottom-btn" @click="createBankBill(billId)" v-if="billId">
				<view class="bottom-btn">
					重新上传转账凭证
				</view>
			</view>
			<view class="fixed-bottom-btn" @click="handleSubmit" v-else>
				<view class="bottom-btn">
					确认转账
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { uploadAction } from '@/constants/index.js'

export default {
	data() {
		return {
			carId: '',
			businessId: '',
			openid: '',
			userId: '',
			price: 0,
			payType: 0, // 9租车租金、10租车押金
			bankAccountId: null,
			bankBills: [],
			businessType: 0,
			detail: {},
			billId: null,
			remark: '',
			tab: 1,
			delta: 1,
		}
	},
	
	onLoad(options) {
		this.carId = options.carId
		this.businessId = options.businessId
		this.openid = options.openid || ''
		this.userId = options.userId
		this.businessType = options.businessType
		this.payType = options.payType
		this.bankAccountId = options.bankAccountId
		this.price = options.price - 0
		this.billId = options.billId
		this.tab = options.tab || 1
		if (options.delta) {
			this.delta = options.delta - 0
		}
		
		this.selectReceiptBankAccountInfo()
		
		if (this.billId) {
			this.selectPaymentDetail()
		}
	},
	
	methods: {
		async selectPaymentDetail(){
			const params = {
				 id: this.billId,
				 payType: this.payType,
			}
			const result = await this.$getRequest(this.$url.selectPaymentDetail, 'GET', params)
			if(result.code == 0){
				this.bankBills = result.data.bankBills
				this.remark = result.data.remark
			}
		},
		
		async selectReceiptBankAccountInfo(){
			const params = {
				 businessId: this.businessId,
				 businessType: this.businessType,
			}
			const result = await this.$getRequest(this.$url.selectReceiptBankAccountInfo, 'POST', params)
			if(result.code == 0){
				this.detail = result.data
			}
		},
		
		copyOrder() {
			uni.setClipboardData({
				data: this.detail.bankAccountId,
			})
		},
		
		upload() {
			uni.chooseImage({
				success: async (result) => {
					uni.showLoading({
							title: '上传中'
					})
					
					const tempFilePaths = result.tempFilePaths
					this.bankBills = []
					
					for(const filePath of tempFilePaths) {
						await uni.uploadFile({
							url: uploadAction,
							filePath,
							name: 'file',
							success: (uploadFileRes) => {
								const res = JSON.parse(uploadFileRes.data)
								if (res.code == 0) {
									this.bankBills.push(res.data.src)
								}
							},
						})
					}
					
					uni.hideLoading()
				}
			})
		},
		
		delImg(index) {
			uni.showModal({
				title: '提示',
				content: '确定要删除这张凭证吗？',
				success: (res) => {
					if (res.confirm) {
						this.bankBills.splice(index, 1)
					}
				}
			})
		},
		
		handleSubmit() {
			uni.showModal({
				title: '提示',
				content: '请确保上传转账凭证信息是否正确。一旦提交账单信息，将无法进行更改。',
				confirmText: '提交转账',
				success: (res) => {
					if (res.confirm) {
						this.handleBankPay()
					}
				},
				fail: (err) => {
					console.log('fail', err)
				}
			})
		},
		
		async createBankBill(id) {
			uni.showLoading({
					title: '保存中'
			})
			const params = {
				 fromSys: 2,
				 bankBills: this.bankBills,
				 id,
				 payType: this.payType,
				 userId: this.userId,
			}
			const result = await this.$getRequest(this.$url.createBankBill, 'POST', params)
			uni.hideLoading()
			if(result.code === 0){
				if (this.businessType == 7 && this.payType == 0) {
					uni.navigateBack({
						delta: this.delta
					})
				} else {
					uni.reLaunch({
						url: `/pages/car/oldCarDetail?tab=${this.tab}&id=${this.carId}`
					})
				}
			}
		},
		
		async handleBankPay() {
			const params = {
				fromSys: 2,
				businessId: this.businessId,
				businessType: this.businessType,
				payType: this.payType,
				total: this.price,
				userId: this.userId,
			}
			const result = await this.$getRequest(this.$url.createBankAccount, 'POST', params)
			if(result.code == 0){
				this.createBankBill(result.data)
			}
		},
		
		async deleteBankBill() {
			uni.showModal({
				title: '提示',
				content: '确定要删除这笔转账吗？',
				success: async (res) => {
					if (res.confirm) {
						const params = {
							 id: this.billId,
							 payType: this.payType,
							 isReject: 1,
						}
						const result = await this.$getRequest(this.$url.deleteBankBill, 'GET', params)
						if(result.code == 0){
							uni.reLaunch({
								url: `/pages/car/oldCarDetail?tab=${this.tab}&id=${this.carId}`
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

.page {
	width: 100vw;
	min-height: 100vh;
	padding: 12px 32rpx 140px;
	.info-card {
		margin-bottom: 32px;
		width: 100%;
		padding: 20px 32rpx;
		border-radius: 24rpx;
		box-shadow: 0px -2px 32px 0px rgba(10, 15, 45, 0.02),0px 8px 24px 0px rgba(10, 15, 45, 0.04);
		position: relative;
		.item {
			margin-bottom: 8px;
			height: 44rpx;
			font-size: 14px;
			display: flex;
			align-items: center;
			.item-title {
				margin-right: 10rpx;
				color: #64696F;
			}
			.item-content {
				color: #0A0F2D;
			}
			.tag {
				margin-left: 26rpx;
				width: 64rpx;
				height: 40rpx;
				border-radius: 8rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background: rgba(10, 15, 45, 0.04);
				font-size: 12px;
				color: rgba(10, 15, 45, 0.8);
			}
		}
		.item:last-child {
			margin-bottom: 0;
		}
		.del-icon {
			position: absolute;
			top: 0;
			right: 0;
			z-index: 100;
			width: 100rpx;
			height: 100rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			image {
				width: 26rpx;
			}
		}
	}
	
	.btn {
		width: 100%;
		height: 116rpx;
		border-radius: 16rpx;
		background: #0A0F2D;
		font-size: 17px;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.title-wrap {
		margin-bottom: 16px;
		height: 48rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.reupload {
			font-size: 12px;
			color: #4F4F4F;
		}
	}
	.title {
		font-size: 17px;
		color: #3D3D3D;
	}
	.img-wrap {
		margin-bottom: 14px;
		width: 100%;
		border-radius: 8rpx;
		overflow: hidden;
		position: relative;
		image {
			width: 100%;
		}
		.del-icon {
			position: absolute;
			top: 0;
			right: 0;
			width: 48rpx;
			height: 48rpx;
		}
	}
	
	.remark {
		margin-top: 12px;
		padding: 12px 32rpx;
		border-radius: 2px;
		background: #FFFFFF;
		box-shadow: 0px -1px 24px 0px rgba(10, 15, 45, 0.04),0px 4px 24px 0px rgba(10, 15, 45, 0.04);
		line-height: 40rpx;
		font-size: 14px;
		color: #3D3D3D;
	}
}
</style>