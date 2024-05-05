<template>
	<view class="page" v-if="carInfo">
		<view class="header">
			<view class="left">
				<view class="car-brand-wrap">
					<view class="brand">{{carInfo.carBrand}} {{carInfo.carType}}</view>
					<view class="car-type">
						{{carInfo.carTypeYear}} {{carInfo.carTypeYearProduct}}
					</view>
					<view class="plate" v-if="carInfo.carPlateNum">
						<view class="city">{{carInfo.carPlateNum && carInfo.carPlateNum.slice(0,1)}}</view>
						<view class="number">{{carInfo.carPlateNum && carInfo.carPlateNum.slice(1)}}</view>
					</view>
				</view>
			</view>
			<view class="right">
				<view class="img-wrap">
					<image
						class="car-img"
						:src="carInfo.imageUrl"
						mode="aspectFill"
					/>
				</view>
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
		<OldCarBasicInfo 
			v-if="activeTab == 1"
			:carInfo="carInfo"
		/>
		
		<!-- 保险信息 -->
		<Insurance 
			v-if="activeTab == 2"
			:secondCarInfo="carInfo"
		/>
		
		<!-- 车辆照片 -->
		<CarPhotos 
			v-if="activeTab == 3"
			:type="2"
			:secondCarInfo="carInfo"
			@updateImgInfo="selectCarsInfo"
		/>
		
		<!-- 方案详情 -->
		<PlanBasicInfo 
			v-if="activeTab == 4"
			:type="2"
			:detail="carInfo"
		/>
		
		<!-- 竞价信息 -->
		<AuctionInfo 
			v-if="activeTab == 5"
			:type="2"
			:detail="carInfo"
			@update="selectCarsInfo"
		/>
	</view>
</template>

<script>
import OldCarBasicInfo from './components/OldCarBasicInfo.vue'
import Insurance from '../plan/components/Insurance.vue'
import CarPhotos from '../plan/components/CarPhotos.vue'
import PlanBasicInfo from './components/PlanBasicInfo.vue'
import AuctionInfo from './components/AuctionInfo.vue'

export default {
	components: {
		OldCarBasicInfo,
		Insurance,
		CarPhotos,
		PlanBasicInfo,
		AuctionInfo,
	},
	
	data() {
		return {
			id: '',
			type: 2,
			activeTab: 1,
			tabs: [
				{
					id: 1,
					text: '车辆信息',
				},
				{
					id: 2,
					text: '保险信息',
				},
				{
					id: 3,
					text: '车辆照片',
				},
				{
					id: 4,
					text: '方案详情',
				},
				{
					id: 5,
					text: '竞价信息',
				},
			],
			carInfo: null, // 车辆信息
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
				newOrOld: 2,
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

.page {
	padding: 16px 32rpx 50px;
	
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
			.plate {
				margin-top: 12px;
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
		.right {
			.car-img {
				border-radius: 12rpx;
				width: 228rpx;
				height: 158rpx;
			}
		}
	}
	
	.line {
		width: 100%;
		height: 1px;
		background-color: #F2F3F5;
		margin: 16px 0 20px 0;
	}
	
	.tabs {
		display: flex;
		align-items: center;
		padding-bottom: 16px;
		.tab {
			margin-right: 24rpx;
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