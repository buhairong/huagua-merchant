<template>
	<view class="page-wrap" v-if="detail">
		<view class="banner-wrap" v-if="bannerList.length">
			<u-swiper
			  class="banner-swiper"
			  :list="bannerList" 
			  :title="false"
			  height="300"
			  mode="number"
			  indicator-pos="bottomRight"
			  :effect3d="false"
			  autoplay
			  interval="3000"
			  :circular="true"
			  duration="500" 
			  bg-color=""
			/>
		</view>
		
		<view class="brand">
			{{detail.carTypeYearProductEntity.carBrand}} {{detail.carTypeYearProductEntity.carType}}
		</view>
		<view class="car-type">
			{{detail.carTypeYearProductEntity.carTypeYear}} {{detail.carTypeYearProductEntity.carTypeYearProduct}}
		</view>
		
		<view class="title">车辆档案</view>
		<view class="card">
			<view class="card-line">
				<view class="card-item">
					<view class="left">
						<view class="sub-item">{{detail.templateRespVO[0].regDateStr || '-'}}</view>
						<view class="sub-title">车龄</view>
					</view>
					<view class="right"></view>
				</view>
				
				<view class="card-item">
					<view class="left">
						<view class="sub-item">{{ detail.templateRespVO[0].mileage ? formatTenThousandNumber(detail.templateRespVO[0].mileage, 'W', '公里') : '-'}}</view>
						<view class="sub-title">里程</view>
					</view>
					<view class="right"></view>
				</view>
				
				<view class="card-item">
					<view class="left">
						<view class="sub-item">{{detail.templateRespVO[0].city || '-'}}</view>
						<view class="sub-title">所在城市</view>
					</view>
					<view class="right"></view>
				</view>
				
				<view class="card-item">
					<view class="left">
						<view class="sub-item">{{detail.carTypeYearProductEntity.powerMode ? powerMode[detail.carTypeYearProductEntity.powerMode].label : '-'}}</view>
						<view class="sub-title">能源方式</view>
					</view>
				</view>
			</view>
			
			<view class="card-line" style="margin-top:16px;">
				<view class="card-item">
					<view class="left">
						<view class="sub-item">事故检测</view>
						<view class="adopt-wrap">
							<view class="adopt-icon">
								<image
									style="width:100%;height:100%;"
									src="https://image.51cheyaoshi.com/xcx/app/static/adopt_icon.png"
								/>
							</view>
							通过
						</view>
					</view>
					<view class="right"></view>
				</view>
				
				<view class="card-item">
					<view class="left">
						<view class="sub-item">非火烧车</view>
						<view class="adopt-wrap">
							<view class="adopt-icon">
								<image
									style="width:100%;height:100%;"
									src="https://image.51cheyaoshi.com/xcx/app/static/adopt_icon.png"
								/>
							</view>
							通过
						</view>
					</view>
					<view class="right"></view>
				</view>
				
				<view class="card-item">
					<view class="left">
						<view class="sub-item">非泡水车</view>
						<view class="adopt-wrap">
							<view class="adopt-icon">
								<image
									style="width:100%;height:100%;"
									src="https://image.51cheyaoshi.com/xcx/app/static/adopt_icon.png"
								/>
							</view>
							通过
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="title">订阅方案</view>
		<view class="template-wrap">
			<TemplateItem
				:detail="detail"
				:newType="2"
			/>
		</view>
		
	</view>
</template>

<script>
import { formatTenThousandNumber } from '@/utils/index.js'
import { powerMode } from '@/constants/index.js'
import TemplateItem from './components/TemplateItem1.vue'
	
export default {
	components: {
		TemplateItem,
	},
	
	data() {
		return {
			powerMode,
			detail: null,
			currentCompany: {},
			companyId: null,
			merchantId: null,
			carId: null,
			bannerList: [],
		}
	},
	
	onLoad(options) {
		this.merchantId = options.merchantId
		this.carId = options.carId
		this.getProductDetail()
	},
	
	methods: {
		async getProductDetail() {
			uni.showLoading({
				title: '加载中'
			})
			
			let params = {
				merchantId: this.merchantId,
				carId: this.carId,
			}
			
			const res = await this.$getRequest(this.$url.selectSecondCarSubscribeDetail, "POST", params)
			
			if (res.code == 0 && res.data) {
				this.detail = res.data
				if (res.data.imageUrlList && res.data.imageUrlList.length) {
					this.bannerList = res.data.imageUrlList
				} else if (res.data.imageUrl) {
					this.bannerList.push(res.data.imageUrl)
				}
				
				res.data.templateRespVO.forEach(item => {
					const tempArr = []
					if (item.carSubscribeFreeServiceToWeb && item.carSubscribeFreeServiceToWeb.length) {
						item.carSubscribeFreeServiceToWeb.forEach(service => {
							tempArr.push(service.serviceName)
						})
						item.serviceStr = tempArr.join('、')
					}
				})
			}
			
			uni.hideLoading()
		},
		
		formatTenThousandNumber(number, unit1, unit2) {
			return formatTenThousandNumber(number, unit1, unit2)
		},
	
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "styles/plan.scss";

.page-wrap {
	.banner-wrap {
		margin-bottom: 16px;
	}
	.brand {
		line-height: 60rpx;
		font-size: 20px;
		color: #333333;
	}
	.car-type {
		margin-bottom: 12px;
		line-height: 44rpx;
		font-size: 14px;
		color: #767676;
	}
	.title {
		height: 48rpx;
		font-size: 17px;
		line-height: 48rpx;
		color: #333333;
		margin-bottom: 16px;
	}
	.card {
		.card-line {
			display: flex;
			.card-item {
				width: 0;
				flex: 1;
				display: flex;
				align-items: center;
				.left {
					width: 0;
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;
					.sub-item {
						height: 40rpx;
						font-size: 12px;
						line-height: 40rpx;
						color: rgba(10, 15, 45, 0.8);
					}
					.sub-title {
						margin-top: 2px;
						height: 40rpx;
						font-size: 12px;
						line-height: 40rpx;
						color: rgba(10, 15, 45, 0.5);
					}
					.adopt-wrap {
						display: flex;
						align-items: center;
						color: #08BD64;
						font-size: 12px;
						.adopt-icon {
							width: 36rpx;
							height: 36rpx;
							margin-right:12rpx;
						}
					}
				}
				.right {
					width: 2rpx;
					height: 40rpx;
					background: rgba(10, 15, 45, 0.04);
				}
			}
		}
	}
	
	
}


</style>
