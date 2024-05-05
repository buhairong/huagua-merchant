<template>
	<view class="page-wrap">
		<view class="plan-list-wrap">
			<PlanItem
				v-for="item in planList"
				:key="item.id"
				:item="item"
				type="1"
				@delPlan="delPlan"
			/>
		</view>
		
		<u-empty v-if="errMsg" :text="errMsg" mode="list" margin-top="400"></u-empty>
		<view class="loadmore">
			<u-loadmore
				v-if="status == 'nomore'"
				:status="status"
				:load-text="loadText"
			/>
		</view>
		
		<view class="add-btn-wrap">
			<view class="add-btn" @click="createPlan">
				创建方案
			</view>
		</view>
		
		<carFilterPopup 
			:showCarFilterPopup.sync="showCarFilterPopup"
			type="1"
		/>
	</view>
</template>

<script>
import PlanItem from './components/PlanItem.vue'
import carFilterPopup from './components/carFilterPopup.vue'
	
export default {
	components: {
		PlanItem,
		carFilterPopup,
	},
	
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
		if(options.create) {
			this.showCarFilterPopup = true
		}
		this.planList = []
		this.page = 1
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
				carType: 1,
				pageSize: this.pageSize,
				pageNo,
			}
			
			const res = await this.$getRequest(this.$url.getCarPlanList, "POST", params)
			
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
		
		async delPlan(id) {
			uni.showLoading({
				title: '删除中'
			})
			
			const params = {
				newType: 1,
				id,
			}
			
			const res = await this.$getRequest(this.$url.delCarPlan, "GET", params)
			
			uni.hideLoading()
			
			if (res.code == 0) {
				uni.showToast({
					title: '删除成功',
					duration: 2000
				})
				
				this.page = 1
				this.planList = []
				this.getCarPlanList()
			} else {
				uni.showToast({
					title: '删除失败',
					duration: 2000,
					icon: 'none'
				})
			}
		},
		
		createPlan() {
			this.showCarFilterPopup = true
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "styles/plan.scss";

</style>
