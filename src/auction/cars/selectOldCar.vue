<template>
	<view class="page-wrap">
		<view class="header">
			<u-search placeholder="输入品牌、车系、车系、年款" v-model="carTypeYearProduct" :show-action="false" @search="handleSearch"></u-search>
		</view>
		<view class="list-wrap">
			<view
				v-for="item in list"
				:key="item.secondHandCarId"
			>
				<CarItem
					:item="item"
					type="2"
				/>	
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
		<view class="fixed-bottom-btn">
			<view class="bottom-btn" @click="createCar">添加车辆</view>
		</view>
		
		<carFilterPopup
			:showCarFilterPopup.sync="showCarFilterPopup"
			:type="2"
			workType="3"
		/>
	</view>
</template>

<script>
import { formatThousandNumber } from '@/utils/index.js'
import CarItem from '../components/CarItem.vue'
import carFilterPopup from '../components/carFilterPopup.vue'

export default {
	components: {
		CarItem,
		carFilterPopup,
	},
	
	data() {
		return {
			brandId: null,
			brandName: null,
			carTypeId: null,
			carType: null,
			carTypeYearId: null,
			carTypeYear: null,
			carTypeYearProductId: null,
			carTypeYearProduct: '',
			list: [],
			pageSize: 1000,
			page: 1,
			totalPage: 0,
			errMsg: '',
			status: 'loadmore',
			loadText: {
				loadmore: '轻轻上拉',
				loading: '努力加载中',
				nomore: '实在没有了'
			},
			from: '',
			showCarFilterPopup: false,
		}
	},
	
	onLoad(options) {
		this.from = options.from || ''
		this.brandId = options.brandId || ''
		this.brandName = options.brandName || ''
		this.carTypeId = options.carTypeId || ''
		this.carType = options.carType || ''
		this.carTypeYearId = options.carTypeYearId || ''
		this.carTypeYear = options.carTypeYear || ''
		this.carTypeYearProductId = options.carTypeYearProductId || ''
		this.carTypeYearProduct = options.carTypeYearProduct || ''
	},
	
	onShow() {
		this.handleSearch()
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
		handleSearch() {
			this.list = []
			this.page = 1
			this.selectSecondHandCarsByMerchant()
		},
		
		async selectSecondHandCarsByMerchant(page = 1) {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				newType: 2,
				carTypeYearProduct: this.carTypeYearProduct,
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
		
		formatThousandNumber(price) {
			return formatThousandNumber(price)
		},
		
		createCar() {
			this.showCarFilterPopup = true
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	padding-bottom: 240rpx;
	.header {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		z-index: 100;
		background: #fff;
		padding: 32rpx;
	}
}

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
	margin-top: 100rpx;
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
