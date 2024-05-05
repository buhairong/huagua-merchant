<template>
	<view class="page-wrap">
		计算器
	</view>
</template>

<script>
export default {
	data() {
		return {
			
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


</style>
