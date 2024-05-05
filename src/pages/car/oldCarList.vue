<template>
	<view class="page-wrap">
		<view class="plan-list-wrap">
			<CarItem
				v-for="item in list"
				:key="item.id"
				:item="item"
				type="2"
				@delCar="delCar"
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
			<view class="add-btn" @click="createCar">
				添加车辆
			</view>
		</view>
		
		<carFilterPopup 
			:showCarFilterPopup.sync="showCarFilterPopup"
			type="2"
			workType="2"
		/>
	</view>
</template>

<script>
import CarItem from './components/CarItem.vue'
import carFilterPopup from '../plan/components/carFilterPopup.vue'
	
export default {
	components: {
		CarItem,
		carFilterPopup,
	},
	
	data() {
		return {
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
			showCarFilterPopup: false,
			userinfo: {},
		}
	},
	
	onLoad(options) {
		if(options.create) {
			this.showCarFilterPopup = true
		}
		
		this.list = []
		this.page = 1
		this.getCarList()
		
		try {
			const value =uni.getStorageSync('userinfo')
			if (value) {
				this.userinfo = JSON.parse(value)
			}
		} catch (e) {
			// error
		}
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
		
		this.getCarList(this.page)
	},
	
	methods: {
		async getCarList(pageNo = 1) {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				newOrOld: 2,
				pageSize: this.pageSize,
				pageNo,
			}
			
			const res = await this.$getRequest(this.$url.getCarList, "POST", params)
			
			if (res.code == 0 && res.data) {
				if (res.data.records && res.data.records.length) {
					this.list = [...this.list, ...res.data.records]
				}
				if (res.data.pages) {
					this.totalPages = res.data.pages
				} else {
					this.errMsg = '暂无车辆'
				}
			} else {
				this.errMsg = '暂无车辆'
			}
			
			uni.hideLoading()
		},
		
		async delCar(carId) {
			uni.showLoading({
				title: '删除中'
			})
			
			const params = {
				userId: this.userinfo.userid,
				carId,
			}
			
			const res = await this.$getRequest(this.$url.deleteSecondCar, "POST", params)
			
			uni.hideLoading()
			
			if (res.code == 0) {
				uni.showToast({
					title: '删除成功',
					duration: 2000
				})
				
				this.page = 1
				this.list = []
				this.getCarList()
			} else {
				uni.showToast({
					title: '删除失败',
					duration: 2000
				})
			}
		},
		
		createCar() {
			this.showCarFilterPopup = true
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "styles/car.scss";

</style>
