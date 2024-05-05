<template>
  <view class="page-wrap">
	  <view class="title-wrap">
	  	<u-section
	  		:title="detail.certificationName" 
	  		line-color="#165DFF"
	  		font-size="34"
	  		color="#0A0F2D"
	  		:right="false"
	  	></u-section>
	  </view>
		
		<view class="img-list">
			<image
				class="img"
				v-for="(item, index) in detail.imageUrl"
				:src="item"
				mode="widthFix"
				@click="preview(index)"
			/>
		</view>
		
		<view class="fixed-bottom-btn">
			<view class="bottom-btn" @click="openCheckOrderPopup">补充材料审核</view>
			<view class="bottom-btn remove-btn" @click="remove">移除此项</view>
		</view>
		
		<u-popup border-radius="14" mode="bottom" v-model="showCheckOrderPopup">
			<view class="popup-wrap">
				<view class="popup-btn pass-btn" @click="save">材料审核通过</view>
				<view class="popup-btn" @click="reject">材料审核拒绝</view>
			</view>
		</u-popup>
  </view>
</template>

<script>
export default {
	data() {
		return {
			orderId: null,
			detail: {},
			showCheckOrderPopup: false,
		}
	},
	
	onLoad(options) {
		this.orderId = options.orderId
		const value = uni.getStorageSync('currentCertificationItem')
		if (value) {
			this.detail = value
		}
	},
	
	methods:{
		back() {
			uni.navigateBack({
				delta: 1
			})
		},
		
		preview(current) {
			uni.previewImage({
				current,
				urls: this.detail.imageUrl,
			})
		},
		
		openCheckOrderPopup() {
			this.showCheckOrderPopup = true
		},
		
		reject() {
			this.showCheckOrderPopup = false
			uni.navigateTo({
				url: `/risk/risk/rejectCertification?id=${this.detail.id}`
			})
		},
		
		async save() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				certificationId: this.detail.id,
				confirmed: 1,
			}
			
			const res = await this.$getRequest(this.$url.updateCertificationStatus, "POST", params)
			
			if (res.code == 0) {
				this.back()
			}
			
			uni.hideLoading()
		},
		
		remove() {
			uni.showModal({
				title: '提示',
				content: '确定要移除此材料吗？',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: '加载中'
						})
						
						const params = {
							certificationId: this.detail.id,
							orderId: this.orderId,
						}
						
						const res = await this.$getRequest(this.$url.deleteUserCarSubscribeCertification, "POST", params)
						
						if (res.code == 0) {
							this.back()
						}
						
						uni.hideLoading()
					}
				}
			})
		},
		
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	min-height: 100vh;
	padding-bottom: 200px;
	.img {
		margin-top: 16px;
	}
	.fixed-bottom-btn {
		bottom: 110px;
		.remove-btn {
			margin-top: 12px;
			background: #AFAFAF;
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
