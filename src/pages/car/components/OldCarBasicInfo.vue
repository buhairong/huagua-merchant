<template>
	<view>
		<view class="card">
			<view class="title-wrap">
				<view class="title">
					<view class="left-border"></view>
					基本信息
				</view>
			</view>
			<view class="item">
				<view class="item-title">实表里程</view>
				<view class="item-content">{{carInfo.mileage || carInfo.mileage == 0 ? `${carInfo.mileage}公里` : '-'}}</view>
			</view>
			<view class="item">
				<view class="item-title">车 牌 号</view>
				<view class="item-content">{{carInfo.carPlateNum || '-'}}</view>
			</view>
			<view class="item">
				<view class="item-title">车 架 号</view>
				<view class="item-content">{{carInfo.carVin || '-'}}</view>
			</view>
			<view class="item">
				<view class="item-title">发动机号</view>
				<view class="item-content">{{carInfo.carEngineNum || '-'}}</view>
			</view>
			<view class="item">
				<view class="item-title">上牌日期</view>
				<view class="item-content">{{carInfo.regDate || '-'}}</view>
			</view>
			<view class="item">
				<view class="item-title">过户次数</view>
				<view class="item-content">{{carInfo.transcationNum || carInfo.transcationNum == 0 ? `${carInfo.transcationNum}次` : '-'}}</view>
			</view>
		</view>
		
		<view class="card" v-if="carInfo.otherConfigList && carInfo.otherConfigList.length && carInfo.otherConfigList[0].details && carInfo.otherConfigList[0].details.length">
			<view class="title-wrap">
				<view class="title">
					<view class="left-border"></view>
					车辆增配
				</view>
			</view>
			<view 
				class="item"
				v-for="(item, index) in carInfo.otherConfigList[0].details"
				:key="index"
			>
				<view class="item-title">{{item.detailName}}</view>
				<!-- <view class="item-content">{{item.money}}元</view> -->
			</view>
		</view>
		
		<template v-if="carInfo.status !== 3">
			<view class="bottom-btn" @click="modifyCarInfo">修改车辆信息</view>
			<view class="bottom-del-btn" @click="delCar">删除车辆</view>
		</template>
		
	</view>
</template>

<script>
export default {
	props: {
		carInfo: {
			type: Object,
			required: true
		},
	},
	
	data() {
		return {
			currentCompany: {},
		}
	},
	
	mounted() {
		try {
			const value = uni.getStorageSync('current_company')
			if (value) {
				this.currentCompany = value
			}
		} catch (e) {
			// error
		}
	},
	
	methods: {
		modifyCarInfo() {
			try {
				uni.setStorageSync('old_car_detail', JSON.stringify(this.carInfo))
				
				uni.navigateTo({
					url: `/pages/car/addOldCar?id=${this.carInfo.id}`
				})
			} catch (e) {
				// error
			}
		},
		
		delCar() {
			uni.showModal({
				title: '提示',
				content: '确定要删除这辆车吗？',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: '删除中'
						})
						
						const params = {
							carId: this.carInfo.id,
							userId: this.currentCompany.userId,
						}
						
						const res = await this.$getRequest(this.$url.deleteNewCar, "POST", params)
						
						uni.hideLoading()
						
						if (res.code == 0) {
							uni.showToast({
								title: '删除成功',
								duration: 2000
							})
							
							uni.reLaunch({
								url: '/pages/car/carList'
							})
						} else {
							uni.showToast({
								title: '删除失败',
								duration: 2000,
								icon: 'none'
							})
						}
					}
				}
			})
			
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