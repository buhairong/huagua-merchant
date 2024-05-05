<template>
  <view class="page-wrap" v-if="detail">
	  <CarInfoHeader
	  	:brand="detail.carProductEntity.carBrand"
	  	:carType="detail.carProductEntity.carType"
	  	:carTypeYear="detail.carProductEntity.carTypeYear"
	  	:carTypeYearProduct="detail.carProductEntity.carTypeYearProduct"
	  	:imageUrl="detail.carProductEntity.imageUrl"
	  />
		
		<PlanInfo :detail="detail" :type="type" />
		
		<template v-if="orderType == 2">
			
			<companyInfo :detail="detail" />
			
			<companyQuery :detail="detail" />
			
		</template>
		
		<PersonInfo :detail="detail" />
		
		<PersonQuery :detail="detail" />
		
		<Certification :detail="detail" :orderId="id" v-if="detail.certificationList && detail.certificationList.length" />
		
		<view class="fixed-bottom-btn fixed-bottom-btns" v-if="detail.depositFreeApply && detail.depositFreeApply.status === 1 && detail.riskResult === 1">
			<view class="bottom-btn" style="background: #F6A605;" @click="goCertificationPage">补充材料</view>
			<view class="bottom-btn" style="background: #F61414;" @click="goAddDepositPage" v-if="type == 2">加收押金</view>
			<view class="bottom-btn" @click="openCheckOrderPopup">订单复审</view>
		</view>
		<view class="fixed-bottom-btn" v-else-if="detail.isOverTimeOfProhibit === 1">
			<view class="bottom-btn" @click="openCheckOrderPopup">重新审核</view>
		</view>
		
		<u-popup border-radius="14" mode="bottom" v-model="showCheckOrderPopup">
			<view class="popup-wrap">
				<view class="popup-btn pass-btn" @click="pass">复审通过</view>
				<view class="popup-btn" @click="reject">复审拒绝</view>
			</view>
		</u-popup>
		
		<u-modal
			v-model="showConfirmModel" 
			title="通知" 
			:content="`${detail.userConfirmStatus === 1 || detail.depositFreeApply.status === 2 ? '用户已经同意支付加收车辆押金，请及时进行订单复审。' : '用户拒绝支付加收车辆押金，订单已取消。'}`" 
			:mask-close-able="true"
			confirm-text='我知道了'
			@confirm='confirm'
		></u-modal>
		
  </view>
</template>

<script>
import CarInfoHeader from '@/components/CarInfoHeader.vue'
import PlanInfo from './components/PlanInfo.vue'
import PersonInfo from './components/PersonInfo.vue'
import companyInfo from './components/companyInfo.vue'
import companyQuery from './components/companyQuery.vue'
import PersonQuery from './components/PersonQuery.vue'
import Certification from './components/Certification.vue'

export default {
	components: {
		CarInfoHeader,
		PlanInfo,
		PersonInfo,
		companyInfo,
		companyQuery,
		PersonQuery,
		Certification,
	},
	
	data() {
		return {
			id: null,
			auditRate: null,
			orderType: null,
			type: null,
			detail: {},
			showCheckOrderPopup: false,
			showConfirmModel: false,
		}
	},
	
	onLoad(options) {
		this.id = options.id
		this.auditRate = options.auditRate
		this.orderType = options.orderType
		this.type = options.type
	},
	
	onShow() {
		this.selectRiskOrderDetail()
	},
	
	onHide() {
		this.showCheckOrderPopup = false
	},
	
	methods:{
		async selectRiskOrderDetail() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				id: this.id,
				auditRate: this.auditRate,
				type: this.type,
			}
			
			const res = await this.$getRequest(this.$url.selectRiskOrderDetail, "POST", params)
			
			if (res.code == 0 && res.data) {
				this.detail = res.data
				if (res.data.confirmedShow === 1) {
					uni.showModal({
						title: '通知',
						content: `${this.detail.userConfirmStatus === 1 ? '用户已经同意支付加收车辆押金，请及时进行订单复审。' : '用户拒绝支付加收车辆押金，订单已取消。'}`,
						showCancel: false,
						confirmText: '我知道了',
						success: async (res) => {
							if (res.confirm) {
								this.confirm()
							}
						}
					})
				}
			}
			
			uni.hideLoading()
		},
		
		async confirm() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				orderId: this.id,
			}
			
			const res = await this.$getRequest(this.$url.confirmOtherDeposit, "GET", params)
			
			if (res.code == 0) {
				this.selectRiskOrderDetail()
			}
			
			uni.hideLoading()
		},
		
		openCheckOrderPopup() {
			this.showCheckOrderPopup = true
		},
		
		pass() {
			this.showCheckOrderPopup = false
			uni.showModal({
				title: '订单复审',
				content: `确定要通过${this.orderType == 1 ? '个人' : '企业'}用户的订单审核？`,
				success: async (res) => {
					if (res.confirm) {
						this.passRiskOrder()
					}
				}
			})
		},
		
		reject() {
			this.showCheckOrderPopup = false
			let id = this.id
			if (this.type == 2) {
				id = this.detail.depositFreeApply.id
			}
			uni.navigateTo({
				url: `/risk/risk/rejectRiskOrder?id=${id}&auditRate=${this.auditRate}&orderType=${this.orderType}&type=${this.type}`
			})
		},
		
		async passRiskOrder() {
			uni.showLoading({
				title: '加载中'
			})
			
			let params = {
				orderId: this.id,
				auditRate: this.auditRate,
				riskResult: 5,
			}
			
			let url = this.$url.updateAuditStatusOfAgain
			
			let method = 'POST'
			
			if (this.type == 2) {
				params = {
					depositApplyId: this.detail.depositFreeApply.id,
					status: 1,
					reason: '',
				}
				
				url = this.$url.updateRentalAuditStatusOfAgain
				
				method = 'GET'
			}
			
			const res = await this.$getRequest(url, method, params)
			
			if (res.code == 0) {
				this.selectRiskOrderDetail()
			}
			
			uni.hideLoading()
		},
		
		goCertificationPage() {
			if (this.detail.certificationList && this.detail.certificationList.length) {
				uni.setStorageSync('currentCertificationList', this.detail.certificationList)
			}
			uni.navigateTo({
				url: `/risk/risk/chooseCertification?id=${this.id}&auditRate=${this.auditRate}&orderType=${this.orderType}`
			})
		},
		
		goAddDepositPage() {
			const deposit = this.detail.deposit || ''
			uni.navigateTo({
				url: `/risk/risk/addDeposit?id=${this.detail.depositFreeApply.id}&auditRate=${this.auditRate}&orderType=${this.orderType}&deposit=${deposit}`
			})
		},
		
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	padding-bottom: 140px;
	.fixed-bottom-btns {
		display: flex;
		justify-content: space-between;
		.bottom-btn {
			margin: 0 8rpx;
			flex: 1;
		}
	}
}

.popup-wrap {
	width: 100vw;
	padding: 60px 40rpx;
	.popup-btn {
		width: 100%;
		height: 116rpx;
		border-radius: 16rpx;
		background: #7D7D7D;
		font-size: 17px;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.pass-btn {
		margin-bottom: 20px;
		background: #4170EE;
	}
}

</style>
