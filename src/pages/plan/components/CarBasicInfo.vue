<template>
	<view v-if="detail">
		<view class="card">
			<view class="title-wrap">
				<view class="title">
					<view class="left-border"></view>
					基本信息
				</view>
			</view>
			<view class="item">
				<view class="item-title">实表里程</view>
				<view class="item-content">{{secondCarInfo.mileage ? `${secondCarInfo.mileage}公里` : '-'}}</view>
			</view>
			<view class="item">
				<view class="item-title">车 牌 号</view>
				<view class="item-content">{{secondCarInfo.carPlateNum || '-'}}</view>
			</view>
			<view class="item">
				<view class="item-title">车 架 号</view>
				<view class="item-content">{{secondCarInfo.carVinFull || '-'}}</view>
			</view>
			<view class="item">
				<view class="item-title">发动机号</view>
				<view class="item-content">{{secondCarInfo.carEngineNum || '-'}}</view>
			</view>
			<view class="item">
				<view class="item-title">注册日期</view>
				<view class="item-content">{{secondCarInfo.regDate || '-'}}</view>
			</view>
			<view class="item">
				<view class="item-title">过户次数</view>
				<view class="item-content">{{secondCarInfo.transcationNum ? `${secondCarInfo.transcationNum}次` : '-'}}</view>
			</view>
		</view>
		
		<view class="card" v-if="secondCarInfo.otherConfigList && secondCarInfo.otherConfigList.length && secondCarInfo.otherConfigList[0].details && secondCarInfo.otherConfigList[0].details.length">
			<view class="title-wrap">
				<view class="title">
					<view class="left-border"></view>
					车辆增配
				</view>
			</view>
			<view 
				class="item"
				v-for="(item, index) in secondCarInfo.otherConfigList[0].details"
				:key="index"
			>
				<view class="item-title">{{item.detailName}}</view>
				<view class="item-content">{{item.money}}元</view>
			</view>
		</view>
		
		<view class="btn" @click="modifyCarInfo">
			修改车辆信息
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
		
		detail: {
			type: Object,
			required: true
		},
		
		secondCarInfo: {
			type: Object,
			required: true
		},
	},
	
	data() {
		return {
			
		}
	},
	
	methods: {
		modifyCarInfo() {
			try {
				uni.setStorageSync('old_car_detail', JSON.stringify(this.secondCarInfo))
				
				uni.navigateTo({
					url: `/pages/car/addOldCar?id=${this.secondCarInfo.id}`
				})
			} catch (e) {
				// error
			}
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.card {
	padding: 20px 32rpx;
	.title {
		margin-bottom: 16px;
	}
	.item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 12px;
		&:last-child {
			margin-bottom: 0;
		}
		.item-title {
			height: 44rpx;
			font-size: 14px;
			line-height: 44rpx;
			color: #86909C;
			margin-left: 10rpx;
			margin-right: 20rpx;
		}
		.item-content {
			flex: 1;
			display: flex;
			justify-content: flex-end;
			font-size: 14px;
			line-height: 44rpx;
			color: #1D2129;
		}
	}
}

.btn {
	margin-top: 36px;
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
</style>