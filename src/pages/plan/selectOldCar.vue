<template>
	<view class="page-wrap">
		<view class="header">
			<view class="brand">{{brandName}} {{carType}}</view>
			<view class="car-type">
				{{carTypeYear}} {{carTypeYearProduct}}
			</view>
		</view>
		<view class="list-wrap">
			<view
				class="card"
				v-for="item in list"
				:key="item.secondHandCarId"
				@click="createPlan(item)"
			>
				<view class="title-wrap">
					<view class="car-detail">
						{{formatThousandNumber(item.mileage)}}公里/{{item.regTime}}
					</view>
					<view class="plate">
						<view class="city">{{item.carPlateNum && item.carPlateNum.slice(0,1)}}</view>
						<view class="number">{{item.carPlateNum && item.carPlateNum.slice(1)}}</view>
					</view>
				</view>
				<view class="car-info">
					<view class="left">
						<view class="item">
							<view class="item-title">车 架 号：</view>
							<view class="item-content">{{item.carVin}}</view>
						</view>
						<view class="item">
							<view class="item-title">发动机号：</view>
							<view class="item-content">{{item.carEngineNum}}</view>
						</view>
						<view class="item">
							<view class="item-title">车辆售价：</view>
							<view class="item-content">{{formatThousandNumber(item.dealerReferencePrice)}}</view>
						</view>
					</view>
					<view class="right">
						<image
							class="car-img"
							:src="item.imageUrl"
							mode="widthFix"
						/>
					</view>
				</view>
			</view>
		</view>
		<u-empty v-if="errMsg" :text="errMsg" mode="list" margin-top="400"></u-empty>
		<view class="loadmore">
			<u-loadmore
				v-if="status == 'nomore'"
				:status="status"
				:load-text="loadText"
			/>
		</view>
	</view>
</template>

<script>
import { formatThousandNumber } from '@/utils/index.js'

export default {
	data() {
		return {
			brandId: null,
			brandName: null,
			carTypeId: null,
			carType: null,
			carTypeYearId: null,
			carTypeYear: null,
			carTypeYearProductId: null,
			carTypeYearProduct: null,
			list: [],
			pageSize: 10,
			page: 1,
			totalPage: 0,
			errMsg: '',
			status: 'loadmore',
			loadText: {
				loadmore: '轻轻上拉',
				loading: '努力加载中',
				nomore: '实在没有了'
			},
		}
	},
	
	onLoad(options) {
		this.brandId = options.brandId
		this.brandName = options.brandName
		this.carTypeId = options.carTypeId
		this.carType = options.carType
		this.carTypeYearId = options.carTypeYearId
		this.carTypeYear = options.carTypeYear
		this.carTypeYearProductId = options.carTypeYearProductId
		this.carTypeYearProduct = options.carTypeYearProduct
	},
	
	onShow() {
		this.list = []
		this.page = 1
		this.selectSecondHandCarsByMerchant()
	},
	
	onReachBottom() {
		if(this.page >= this.totalPages) {
			this.status = 'nomore'
			return
		}
		this.status = 'loading';
		this.page = ++this.page;
		
		this.selectSecondHandCarsByMerchant(this.page)
	},
	
	methods: {
		async selectSecondHandCarsByMerchant(page = 1) {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				carTypeYearProductId: this.carTypeYearProductId,
				limit: this.pageSize,
				page,
			}
			
			const res = await this.$getRequest(this.$url.selectSecondHandCarsByMerchant, "POST", params)
			
			if (res.code == 0 && res.data) {
				if (res.data.records && res.data.records.length) {
					this.list = [...this.list, ...res.data.records]
				}
				if (res.data.pages) {
					this.totalPages = res.data.pages
				} else {
					this.errMsg = '暂无数据'
				}
			} else {
				this.errMsg = '暂无数据'
			}
			
			uni.hideLoading()
		},
		
		createPlan(item) {
			uni.navigateTo({
				url: `/pages/plan/oldCarPlanDetail?secondHandCarId=${item.secondHandCarId}&brandId=${this.brandId}&brandName=${this.brandName}&carTypeId=${this.carTypeId}&carType=${this.carType}&carTypeYearId=${this.carTypeYearId}&carTypeYear=${this.carTypeYear}&carTypeYearProductId=${this.carTypeYearProductId}&carTypeYearProduct=${this.carTypeYearProduct}`
			})
		},
		
		formatThousandNumber(price) {
			return formatThousandNumber(price)
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.brand {
	font-size: 16px;
	font-weight: 500;
	line-height: 48rpx;
	color: #1D2129;
}

.car-type {
	margin-top: 2px;
	font-size: 12px;
	line-height: 36rpx;
	color: #86909C;
}

.list-wrap {
	margin-top: 12px;
}

.title-wrap {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.car-detail {
		height: 48rpx;
		font-size: 16px;
		font-weight: 500;
		line-height: 48rpx;
		color: #3D3D3D;
	}
	.plate {
		height: 19px;
		line-height: 19px;
		font-size: 12px;
		font-weight: 500;
		display: flex;
		.city {
			height: 100%;
			padding: 0 8rpx;
			color: #FFFFFF;
			background: #1D2129;
			border-top-left-radius: 2px;
			border-bottom-left-radius: 2px;
		}
		.number {
			border: 1px solid #0A0F2D;
			height: 100%;
			padding: 0 12rpx;
			color: #1D2129;
			border-top-right-radius: 2px;
			border-bottom-right-radius: 2px;
		}
	}
}

.car-info {
	margin-top: 12px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.left {
		padding-right: 30rpx;
		.item {
			display: flex;
			font-size: 12px;
			line-height: 36rpx;
			color: #4E5969;
			margin-top: 2px;
			.item-title {
				margin-right: 8rpx;
				width: 120rpx;
			}
		}
	}
	.car-img {
		width: 254rpx;
		border-radius: 16rpx;
	}
}
</style>
