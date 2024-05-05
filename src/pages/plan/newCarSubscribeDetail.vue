<template>
	<view class="page-wrap" v-if="detail">
		<NewCarDetailHeader 
			:detail="detail"
		/>
		
		<view class="search-header" style="margin-top:20px;">
			<view class="tabs">
				<view 
					class="tab tab-active"
				>
					<view class="line"></view>
					新车订阅
				</view>
			</view>
		</view>
			
		<view class="scroll-wrap">
			<scroll-view class="scroll-view" scroll-x="true" :scroll-left="scrollLeft">
				<view class="car-product-wrap">
					<view
						v-for="item in detail.allCarTypeYearProductEntity" 
						:key="item.id" 
						class="car-product"
						:class="{'car-product-active': proId == item.id}"
						@click="changeProduct(item.id)"
					>
						{{item.carTypeYear}} {{item.carTypeYearProduct}}
					</view>
				</view>
			</scroll-view>
		</view>	
		
		<view class="template-wrap">
			<TemplateItem
				:detail="detail"
				:newType="1"
			/>
		</view>
		
		<template v-if="currentCompany.company.chooseRole === 2 || currentCompany.company.chooseRole === 3">
			<view class="search-header">
				<view class="tabs">
					<view 
						class="tab tab-active"
					>
						<view class="line"></view>
						提车地址
					</view>
				</view>
			</view>
			
			<view class="car-address-wrap">
				<view class="card">
					<view 
						class="address-card"
						v-for="(item, index) in carAddress"
						:key="item.id"
					>
						<view class="address-wrap" v-if="index < 2 || expand">
							<view class="img-box">
								<image
									class="item-img"
									mode="aspectFill"
									:src="item.deliveryPictureUrl"
								/>
							</view>
							<view class="address-info">
								<view class="top-line">
									<view class="address-name">{{item.deliveryName}}</view>
								</view>
								<view class="address-detail">
									<view class="address-icon-wrap">
										<u-icon name="map" color="rgba(10, 15, 45, 0.5)" size="28"></u-icon>
									</view>
									<view class="address">{{item.deliveryAddress}}</view>
								</view>
							</view>
						</view>
					</view>
					<view class="expand-btn" @click="changeExpand" v-if="carAddress.length > 2">
						<u-icon :name="expand ? 'arrow-up' : 'arrow-down'" color="rgba(10, 15, 45, 0.8)" size="28"></u-icon>
						<view class="expand-text">
							{{ expand ? '收起' : '更多提车地址' }}
						</view>
					</view>
				</view>
			</view>
		</template>
			
	</view>
</template>

<script>
import NewCarDetailHeader from './components/NewCarDetailHeader.vue'
import TemplateItem from './components/TemplateItem.vue'
	
export default {
	components: {
		NewCarDetailHeader,
		TemplateItem,
	},
	
	data() {
		return {
			detail: null,
			currentCompany: {},
			companyId: null,
			scrollLeft: 0,
			proId: null,
			carAddress: [],
			expand: false,
			carBrandId: null,
		}
	},
	
	onLoad(options) {
		this.proId = options.proId
		this.carBrandId = options.carBrandId
		const value = uni.getStorageSync('current_company')
		if (value) {
			this.currentCompany = value
			this.getProductDetail()
		}
		this.selectCarDeliveryAddress()
	},
	
	methods: {
		selectCarDeliveryAddress () {
			const carDetailData = this.$getRequest(this.$url.selectCarDeliveryAddress, "POST", {
		    brandId: this.carBrandId,
		  }).then(res => {
		    if (res.code === 0) {
					this.carAddress = res.data
				}
		  })
		},
		
		async getProductDetail() {
			uni.showLoading({
				title: '加载中'
			})
			
			let params = {
				carTypeYearProductId: this.proId,
				companyId: this.currentCompany.company.id,
				queryType: 1,
			}
			
			const res = await this.$getRequest(this.$url.getProductDetail, "POST", params)
			
			if (res.code == 0 && res.data) {
				res.data.carSubscribeList.forEach(city => {
					city.respVOS.forEach(item => {
						const tempArr = []
						if (item.carSubscribeFreeServiceToWeb && item.carSubscribeFreeServiceToWeb.length) {
							item.carSubscribeFreeServiceToWeb.forEach(service => {
								tempArr.push(`${service.serviceName}`)
							})
							item.serviceStr = tempArr.join('、')
						}
					})
				})
				
				this.detail = res.data
				
				this.$nextTick(() => {
					uni.createSelectorQuery().select('.car-product-active').boundingClientRect(res=>{
						let left = res.left
						if (left > 100) {
							this.scrollLeft = res.left - 50
						}
					}).exec()
				})
			}
			
			uni.hideLoading()
		},
		
		changeProduct(id) {
			if (this.proId == id) {
				return
			}
			
			this.proId = id
			this.getProductDetail()
		},
		
		changeExpand() {
			this.expand = !this.expand
		},
	
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "styles/plan.scss";

.page-wrap {
	padding: 0 0 40px;
	.search-header {
		padding-left: 32rpx;
	}
	
	.scroll-wrap {
		margin-bottom: 16px;
		width: 100vw;
		.scroll-view {
			white-space: nowrap;
			width: 100%;
			height: 64rpx;
			box-sizing: border-box;
		}
		.car-product-wrap {
			padding: 0 32rpx;
			display: flex;
		}
		.car-product {
			margin-right: 16rpx;
			padding: 0 24rpx;
			height: 64rpx;
			line-height: 64rpx;
			border-radius: 16rpx;
			background: rgba(10, 15, 45, 0.04);
			font-size: 12px;
			color: rgba(10, 15, 45, 0.8);
		}
		.car-product-active {
			background: #0256FF;
			color: #FFFFFF;
		}
	}
	
	.template-wrap {
		padding: 0 32rpx;
	}
	
	.car-address-wrap {
		padding: 0 32rpx;
		.card {
			padding: 20px 32rpx;
			.address-card {
				margin-bottom: 20px;
				&:last-child {
					margin-bottom: 0;
				}
			}
			.address-wrap {
				display: flex;
				.img-box {
					width: 204rpx;
					height: 130rpx;
					border-radius: 16rpx;
					overflow: hidden;
					.item-img {
						width: 100%;
						height: 100%;
					}
				}
				.address-info {
					padding-left: 24rpx;
					flex: 1;
					width: 0;
					.top-line {
						display: flex;
						justify-content: space-between;
					}
					.address-name {
						flex: 1;
						height: 44rpx;
						font-family: PingFangSC-Medium;
						font-size: 15px;
						line-height: 44rpx;
						color: rgba(10, 15, 45, 0.8);
						@include text-overflow;
					}
					.distance {
						padding-left: 20rpx;
						font-size: 12px;
						color: rgba(10, 15, 45, 0.8);
					}
					.address-detail {
						margin-top: 12px;
						display: flex;
						.address-icon-wrap {
							height: 40rpx;
							line-height: 40rpx;
						}
						.address {
							margin-left: 2px;
							font-size: 12px;
							line-height: 40rpx;
							color: rgba(10, 15, 45, 0.5);
						}
					}
				}
			}
			.expand-btn {
				margin-top: 20px;
				display: flex;
				justify-content: center;
				align-items: center;
				.expand-text {
					padding-left: 8rpx;
					height: 36rpx;
					font-family: PingFangSC-Regular;
					font-size: 12px;
					line-height: 36rpx;
					color: rgba(10, 15, 45, 0.8);
				}
			}
		}
	}
}
</style>
