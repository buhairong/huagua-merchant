<template>
	<view class="page-wrap">
		<view class="header" :class="{'new-car-header': type == 1}">
			<view class="left">
				<view class="car-brand-wrap">
					<view class="brand">{{carInfo.carBrand}} {{carInfo.carType}}</view>
					<view class="car-type">
						{{carInfo.carTypeYear}} {{carInfo.carTypeYearProduct}}
					</view>
				</view>
			</view>
			<view class="right">
				<image
					class="car-img"
					:src="carInfo.imageUrl"
					mode="widthFix"
				/>
			</view>
		</view>
		
		<view class="line"></view>
		
		<view class="tabs">
			<view 
				v-for="tab in tabs"
				:key="tab.id"
				class="tab"
				:class="{'active-tab': tab.id == activeTab}"
				@click="changeTab(tab.id)"
			>
				{{tab.text}}
			</view>
		</view>
		
		<!-- 车辆信息 -->
		<NewCarBasicInfo 
			v-if="activeTab == 1"
			:carInfo="carInfo"
		/>
		
		<!-- 车辆照片 -->
		<!-- <CarPhotos 
			v-if="activeTab == 2"
			:type="1"
			:secondCarInfo="carInfo"
			@updateImgInfo="selectCarsInfo"
		/> -->
		
		<!-- 方案详情 -->
		<!-- <PlanBasicInfo 
			v-if="activeTab == 3"
			:type="1"
			:detail="carInfo"
		/> -->
	</view>
</template>

<script>
import NewCarBasicInfo from './components/NewCarBasicInfo.vue'
import CarPhotos from '../plan/components/CarPhotos.vue'
import PlanBasicInfo from './components/PlanBasicInfo.vue'

export default {
	components: {
		NewCarBasicInfo,
		CarPhotos,
		PlanBasicInfo,
	},
	
	data() {
		return {
			id: '',
			type: 1,
			activeTab: 1,
			tabs: [
				{
					id: 1,
					text: '车辆信息',
				},
				// {
				// 	id: 2,
				// 	text: '车辆照片',
				// },
				// {
				// 	id: 3,
				// 	text: '方案详情',
				// },
			],
			carInfo: {}, // 车辆信息
		}
	},
	
	onLoad(options) {
		this.id = options.id
		if (options.tab) {
			this.activeTab = options.tab
		}
	},
	
	onShow() {
		this.selectCarsInfo()
	},
	
	methods: {
		// 车辆详情
		async selectCarsInfo() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				id: this.id,
				newOrOld: 1,
			}
			
			const res = await this.$getRequest(this.$url.findCarInfoById, "POST", params)
			
			if (res.code == 0) {
				for(const item in res.data.carPicsMap) {
					res.data.carPicsMap[item].forEach((img, index) => {
						img.canInput = true
						if(img.remark) {
							img.canInput = false
						}
					})
				}
				this.carInfo = res.data
			}
			
			uni.hideLoading()
		},
		
		changeTab(id) {
			this.activeTab = id
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	
	
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.left {
			flex: 1;
			padding-right: 20rpx;
			.car-brand-wrap {
				display: flex;
				flex-direction: column;
			}
			.brand {
				font-size: 16px;
				font-weight: 500;
				line-height: 24px;
				color: #1D2129;
			}
			.car-type {
				margin-top: 2px;
				font-size: 12px;
				line-height: 18px;
				color: #86909C;
			}
		}
		.right {
			.car-img {
				width: 290rpx;
			}
		}
	}
	
	.new-car-header {
		.car-img {
			width: 340rpx;
			margin-right: -30rpx;
		}
	}
	
	.line {
		width: 100%;
		height: 1px;
		background-color: #F2F3F5;
		margin-bottom: 20px;
	}
	
	.tabs {
		display: flex;
		align-items: center;
		padding-bottom: 16px;
		.tab {
			margin-right: 40rpx;
			height: 44rpx;
			line-height: 1;
			font-size: 14px;
			color: #4E5969;
			&:last-child {
				margin-right: 0;
			}
			&.active-tab {
				font-size: 17px;
				font-weight: 600;
				color: #000000;
				position: relative;
				&:before {
					content: '';
					display: block;
					width: 100%;
					height: 12rpx;
					background: linear-gradient(89deg, #165DFF 0%, rgba(22,93,255,0.00) 80%);
					position: absolute;
					left: 0;
					bottom: 12rpx;
				}
			}
		}
	}
}
</style>