<template>
	<view class="page-wrap">
		<view class="container" v-if="list">
			<view class="left" v-if="companyRole == 2">
				<view
					v-for="(item, index) in list"
					:key="index"
					class="left-item"
					:class="{'active-left-item': index === currentSelect}"
					@click="changeLeftItem(index)"
				>
					<view class="logo">
						<image
							style="width: 100%;height:100%;"
							:src="item.carBrandUrl"
						/>
					</view>
					{{item.carBrand}}（{{item.carOfferList.length}}）
				</view>
			</view>
			<view class="right">
				<view
					v-for="item in list[currentSelect].carOfferList"
					:key="item.id"
					class="car-item"
				>
					<view class="car-item-left">
						<view class="brand">{{item.carBrand}} {{item.carType}}</view>
						<view class="discount-item">
							我司采购优惠：{{item.ownerPurchaseDiscount ? item.ownerPurchaseDiscount + '%' : '-'}}
						</view>
						<view class="discount-item" style="margin-top:8rpx;">
							直客购车优惠：{{item.clientPurchaseDiscount ? item.clientPurchaseDiscount + '%' : '-'}}
						</view>
					</view>
					<view class="car-item-right">
						<view class="set-btn" @click="goPriceDetailPage(item)">
							{{item.ownerPurchaseDiscount ? '编辑' : '设置'}}
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<u-empty v-if="errMsg" :text="errMsg" mode="list"></u-empty>
	</view>
</template>

<script>
export default {
	data() {
		return {
			companyRole: null, // （商户角色）角色选择：1 4s，2 二级销售网络，3 二手车商
			companyId: null,
			list: null,
			errMsg: '',
			currentSelect: 0,
		}
	},
	
	onLoad(options) {
		this.companyRole = options.companyRole
		this.companyId = options.companyId
	},
	
	onShow() {
		this.selectCarOfferList()
	},
	
	methods: {
		async selectCarOfferList() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				chooseRole: this.companyRole,
				companyId: this.companyId,
			}
			
			const res = await this.$getRequest(this.$url.selectCarOfferList, "GET", params)
			
			if (res.code == 0 && res.data) {
				this.list = res.data
			} else {
				this.errMsg = '暂无数据'
			}
			
			uni.hideLoading()
		},
		
		changeLeftItem(index) {
			this.currentSelect = index
		},
		
		goPriceDetailPage(item) {
			uni.setStorageSync('setDiscount', item)
			uni.navigateTo({
				url: `/pages/price/setDiscount?companyRole=${this.companyRole}&companyId=${this.companyId}`
			})
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	padding-left: 0;
	padding-right: 0;
	height: 100vh;
	.container {
		width: 100vw;
		height: 100%;
		display: flex;
		.left {
			width: 200rpx;
			background: #F7F8FA;
			padding-bottom: 60px;
			.left-item {
				width: 100%;
				height: 120rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 14px;
				color: rgba(10, 15, 45, 0.8);
				&.active-left-item {
					background: #fff;
					font-weight: 500;
					color: #1D2129;
					position: relative;
					&:before {
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						width: 8rpx;
						height: 100%;
						background: #4170EE;
						border-radius: 0 8rpx 8rpx 0;
					}
				}
				.logo {
					width: 40rpx;
					height: 40rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					margin-right: 12rpx;
				}
			}
		}
		.right {
			width: 0;
			flex: 1;
			padding: 0 32rpx;
			.car-item {
				padding: 32rpx 0;
				border-bottom: 2rpx solid rgba(10, 15, 45, 0.04);
				display: flex;
				.car-item-left {
					width: 0;
					flex: 1;
					padding-right: 24rpx;
					.brand {
						margin-bottom: 20px;
						font-size: 14px;
						line-height: 44rpx;
						color: #0A0F2D;
					}
					.discount-item {
						padding-right: 24rpx;
						font-size: 12px;
						height: 40rpx;
						line-height: 40rpx;
						color: #64696F;
					}
				}
				.car-item-right {
					.set-btn {
						width: 80rpx;
						height: 54rpx;
						border-radius: 8rpx;
						border: 2rpx solid rgba(65, 112, 238, 0.8);
						font-size: 12px;
						color: #4170EE;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
			}
			
		}
	}
}
</style>
