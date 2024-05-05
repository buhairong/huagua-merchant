<template>
	<view>
		<view v-if="inStoreCars" class="cars-wrap">
			<view 
				class="card"
				v-for="(item, index) in inStoreCars"
				:key="item.id"
			>
				<view class="title-wrap">
					<view class="title">
						<view class="left-border"></view>
						车辆{{index+1}}
					</view>
				</view>
				
				<view class="item">
					<view class="item-title">外观颜色：</view>
					<view class="item-content">{{item.carColor || '-'}}</view>
				</view>
				
				<view class="item">
					<view class="item-title">车 架 号：</view>
					<view class="item-content">{{item.carVin || '-'}}</view>
				</view>
				
				<view class="item">
					<view class="item-title">发动机号：</view>
					<view class="item-content">{{item.carEngineNum || '-'}}</view>
				</view>
				
				<view class="item">
					<view class="item-title">实表里程：</view>
					<view class="item-content">{{item.mileage ? `${item.mileage}公里` : '-'}}</view>
				</view>
				
				<view class="item">
					<view class="item-title">可增配项：</view>
					<view class="item-content">
						<view v-if="item.otherConfigs && item.otherConfigs.length">
							<view
								class=""
								v-for="(config,index) in item.otherConfigs[0].details"
								:key="index"
							>
								{{config.detailName}} {{config.money}}元
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="btn-wrap">
			<view class="btn" @click="addCar">
				添加车辆
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		type: {
			type: Number,
			required: true,
		},
		
		inStoreCars: {
			type: Array,
			required: true
		},
		
		detail: {
			type: Object,
			default: () => ({})
		},
	},
	
	data() {
		return {
			
		}
	},
	
	methods: {
		addCar() {
			uni.navigateTo({
				url: `/pages/car/addNewCar?brandId=${this.detail.carType.carBrandId}&brandName=${this.detail.carType.carBrand}&carTypeId=${this.detail.carType.carTypeId}&carType=${this.detail.carType.carType}&carTypeYearId=${this.detail.carType.carTypeYearId}&carTypeYear=${this.detail.carType.carTypeYear}&carTypeYearProductId=${this.detail.carType.id}&carTypeYearProduct=${this.detail.carType.carTypeYearProduct}`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
.cars-wrap {
	padding-bottom: 100px;
}

.card {
	padding: 20px 32rpx;
	.title {
		margin-bottom: 16px;
	}
	.item {
		display: flex;
		margin-bottom: 12px;
		&:last-child {
			margin-bottom: 0;
		}
		.item-title {
			width: 140rpx;
			height: 44rpx;
			font-size: 14px;
			line-height: 44rpx;
			color: #86909C;
			margin-left: 10rpx;
			margin-right: 32rpx;
		}
		.item-content {
			flex: 1;
			display: flex;
			flex-wrap: wrap;
			font-size: 14px;
			line-height: 44rpx;
			color: #1D2129;
		}
	}
}

.btn-wrap {
	padding: 0 32rpx;
	position: fixed;
	left: 0;
	bottom: 50px;
	width: 100%;
	.btn {
		width: 100%;
		height: 116rpx;
		border-radius: 16rpx;
		background: #4170EE;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 17px;
		font-weight: 500;
		color: #FFFFFF;
	}
}
</style>