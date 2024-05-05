<template>
	<view class="card">
		<view class="title-wrap">
			<u-section
				title="交车信息" 
				line-color="#165DFF"
				font-size="34"
				color="#0A0F2D"
				:right="false"
			></u-section>
		</view>
		
		<view class="item-wrap">
			<view class="item">
				<view class="item-title">交车人员</view>
				<view class="item-content delivery-content">
					<view class="delivery-user">
						{{orderDetail.salesmanName}} 
					</view>
					<view class="delivery-user" v-for="item in orderDetail.recordEntities" :key="item.id">
						{{item.name}}
					</view>
					<view style="color: #0256FF;text-decoration: underline;" @click="openPopup" v-if="userId === orderDetail.salesmanId">
						{{orderDetail.recordEntities && orderDetail.recordEntities.length ? '修改' : '添加交车人员'}}
					</view>
				</view>
			</view>
			<view class="item">
				<view class="item-title">提车门店</view>
				<view class="item-content">{{orderDetail.pickUpCar.pickUpCarShopName || '-'}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">提车地址</view>
				<view class="item-content">{{orderDetail.pickUpCar.pickUpCarAddress || '-'}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">提车日期</view>
				<view class="item-content">{{orderDetail.pickUpCar.pickUpCarDate || '-'}}</view>
			</view>
			
			<template>
				<view class="item">
					<view class="item-title">实表里程数</view>
					<view class="item-content">{{orderDetail.carInfo.mileage}}公里</view>
				</view>
				
				<view class="item">
					<view class="item-title">{{orderDetail.carInfo.powerMode == 3 ? '实时电量' : '实时油量'}}</view>
					<view class="item-content">
						<view v-if="orderDetail.carInfo.tankSize">
							{{orderDetail.carInfo.tankSize}}{{orderDetail.carInfo.powerMode == 3 ? '%' : '/16'}}
						</view>
						<view v-else>-</view>
					</view>
					<!-- <view class="item-content">{{orderDetail.carInfo.powerMode == 3 ? `${orderDetail.pickUpCar.actualElectricity}%` : `${orderDetail.pickUpCar.actualOil}/16`}}</view> -->
				</view>
			</template>
		</view>	
		
		<u-popup border-radius="14" closeable=true mode="bottom" v-model="show">
			<view class="wrap">
				<view class="title">选择交车人员</view>
				
				<scroll-view
					scroll-y="true" 
					class="scroll-Y"
				>
					<u-checkbox-group @change="checkboxGroupChange">
						<view class="info" v-for="item in list" :key="item.id">
							<view class="user">
								{{item.name}}
								<view class="tag">{{item.roleName}}</view>
							</view>
							<u-checkbox 
								v-model="item.checked" 
								:name="item.id"
							></u-checkbox>
						</view>
					</u-checkbox-group>
				</scroll-view>
				
				<view class="btn-group">
					<view class="btn" @click="close">取消</view>
					<view class="btn save-btn" @click="save">确认</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	props: {
		orderDetail: {
			type: Object,
			required: true,
		},
		
		userId: {
			type: Number,
			required: true,
		}
	},
	
	data() {
		return {
			show: false,
			list: [],
			ids: [],
		}
	},
	
	mounted() {
		this.getUserList()
	},
	
	methods: {
		// 复制订单号
		copy() {
			uni.setClipboardData({
				data: orderDetail.orderNum,
			})
		},
		
		openPopup() {
			this.show = true
		},
		
		close() {
			this.show = false
		},
		
		checkboxGroupChange(e) {
			this.ids = e
		},
		
		async getUserList() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				limit: 100,
				page: 1,
			}
			
			const res = await this.$getRequest(this.$url.getUserList, "POST", params)
			
			if (res.code == 0 && res.data) {
				this.list = res.data.records.filter(item => {
					let roleId = null
					let roleName = ''
					const roleList = item.userRoleList
					if (roleList.some(item => item.roleId === 9)) {
						roleId = 0
						roleName = '超级管理员'
					} else {
						roleList.sort((a,b) => a.roleId - b.roleId)
						roleId = roleList[0].roleId
						roleName = roleList[0].roleName
					}
					
					item.roleName = roleName
					item.roleId = roleId
					
					return item.id !== this.userId
				})
			}
			
			uni.hideLoading()
		},
		
		async save() {
			if (this.ids.length === 0) {
				uni.showToast({
					title: '请选择交车人员',
					duration: 2000,
					icon: "none"
				})
				return
			}
			
			const list = []
			
			this.list.forEach(item => {
				if (this.ids.includes(item.id)) {
					list.push({
						...item,
						userId: item.id
					})
				}
			})
			
			const params = {
				orderId: this.orderDetail.id,
				reqVos: list,
			}
			
			uni.showLoading({
				title: '加载中'
			})
			
			const res = await this.$getRequest(this.$url.updateDeliveryUser, "POST", params)
			
			if (res.code == 0) {
				uni.showToast({
					title: '分配成功',
					duration: 2000,
					icon: "none"
				})
				this.close()
				this.$emit('refresh')
			}
			
			uni.hideLoading()
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "../styles/index.scss";

.item-content {
	width: 0;
	flex: 1;
	justify-content: flex-end;
}

.delivery-content {
	display: flex;
	flex-wrap: wrap;
	line-height: 44rpx;
}

.wrap {
	width: 100vw;
	padding: 18px 40rpx 40px;
	.title {
		margin-bottom: 20px;
		height: 42rpx;
		font-size: 15px;
		line-height: 42rpx;
		text-align: center;
		color: rgba(0, 0, 0, 0.9);
	}
	.scroll-Y {
		height: 600rpx;
	}
	.info {
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: rgba(26, 26, 26, 0.8);
		font-size: 14px;
		border-bottom: 2rpx solid #F2F3F5;
		.user {
			display: flex;
			align-items: center;
		}
		.tag {
			margin-left: 16px;
			padding: 0 8rpx;
			height: 36rpx;
			line-height: 36rpx;
			border-radius: 4rpx;
			background: #E8F3FF;
			color: #4170EE;
			font-size: 11px;
		}
	}
	
	.btn-group {
		display: flex;
		justify-content: space-between;
		.btn {
			width: 320rpx;
			height: 116rpx;
			border-radius: 16rpx;
			background: #F7F8FA;
			font-size: 17px;
			color: #1D2129;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.save-btn {
			background: #4170EE;
			color: #FFFFFF;
		}
	}
}

.delivery-user {
	padding-right: 20rpx;
}
</style>