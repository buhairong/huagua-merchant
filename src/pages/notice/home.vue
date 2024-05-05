<template>
	<view class="page-wrap">
		<view class="building-wrap">
			<image
				class="building-img"
				src="https://image.51cheyaoshi.com/xcx/app/static/home/building-function.png"
			/>
			<view class="building-title">敬请期待</view>
			<view class="building-sub-title">功能正在建设中...</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			planList: [],
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
			showCarFilterPopup: false,
		}
	},
	
	onLoad(options) {
		
		this.getCarPlanList()
	},
	
	onShow() {
		
	},
	
	onReachBottom() {
		if(this.page >= this.totalPages) {
			this.status = 'nomore'
			return
		}
		this.status = 'loading';
		this.page = ++this.page;
		
		this.getCarPlanList(this.page)
	},
	
	methods: {
		async getCarPlanList(pageNo = 1) {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				carType: 2,
				pageSize: this.pageSize,
				pageNo,
			}
			
			const res = await this.$getRequest(this.$url.getOldCarPlanList, "POST", params)
			
			if (res.code == 0 && res.data) {
				if (res.data.records && res.data.records.length) {
					this.planList = [...this.planList, ...res.data.records]
				}
				if (res.data.pages) {
					this.totalPages = res.data.pages
				} else {
					this.errMsg = '暂无方案'
				}
			} else {
				this.errMsg = '暂无方案'
			}
			
			uni.hideLoading()
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.building-wrap {
	display: flex;
	flex-direction: column;
	align-items: center;
	.building-img {
		width: 304rpx;
		height: 272rpx;
	}
	.building-title {
		margin-top: 8px;
		height: 48rpx;
		font-size: 16px;
		line-height: 48rpx;
		color: #0A0F2D;
	}
	.building-sub-title {
		margin-top: 4px;
		height: 44rpx;
		font-size: 14px;
		line-height: 44rpx;
		color: rgba(10, 15, 45, 0.5);
	}
}

.page-wrap {
	width: 100vw;
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
