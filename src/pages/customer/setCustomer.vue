<template>
	<view class="page-wrap">
		<view>
			<view class="item-wrap">
				<view class="item-title">姓名</view>
				<view class="item-content">
					<view class="input-wrap">
						<input
							v-model="customerInfo.name"
							class="input"
							maxlength="10"
							placeholder="请输入姓名"
							placeholder-style="font-size:14px;color:#A4AEBB;"
							:disabled="type == 2"
						/>
					</view>
				</view>
			</view>
			
			<view class="item-wrap">
				<view class="item-title">手机</view>
				<view class="item-content">
					<view class="input-wrap">
						<input
							v-model="customerInfo.mobile"
							class="input"
							inputmode="numeric"
							placeholder="请输入员工电话"
							placeholder-style="font-size:14px;color:#A4AEBB;"
						/>
					</view>
				</view>
			</view>
			
			<view class="item-wrap">
				<view class="item-title">价格偏好</view>
				<view class="item-content">
					<view class="price-wrap">
						<view class="input-wrap" @click="openMinPriceList">
							{{customerInfo.minPriceStr ? customerInfo.minPriceStr : '请选择价格'}}
							<u-icon name="arrow-right" color="rgba(0, 0, 0, 0.9)" size="32"></u-icon>
						</view>
						<view style="color:#343A40;font-size:12px;">至</view>
						<view class="input-wrap" @click="openMaxPriceList">
							{{customerInfo.maxPriceStr ? customerInfo.maxPriceStr : '请选择价格'}}
							<u-icon name="arrow-right" color="rgba(0, 0, 0, 0.9)" size="32"></u-icon>
						</view>
					</view>
				</view>
			</view>
			
			<view class="item-wrap">
				<view class="item-title">车系偏好</view>
				<view class="item-content">
					<view class="car-type-wrap">
						<view class="input-wrap" @click="openPopup">
							<view class="car-type-list" v-if="carTypeArr.length">
								<view class="select-list-item" v-for="item in carTypeArr" :key="item.carTypeId">
									{{item.carBrand}}{{item.carType}}
									<view class="cancel-tag" @click.stop="removeSelect(item)">x</view>
								</view>
							</view>
							<view v-else>
								请选择车系偏好
							</view>
							<u-icon name="arrow-right" color="rgba(0, 0, 0, 0.9)" size="32"></u-icon>
						</view>
					</view>
				</view>
			</view>
			
			
			<u-select v-model="showMinPriceList" :list="carPriceList" @confirm="confirmMinPrice"></u-select>
			<u-select v-model="showMaxPriceList" :list="carPriceList" @confirm="confirmMaxPrice"></u-select>
			
			<carFilterPopup
				:showCarFilterPopup.sync="showPopup"
				:list="carTypeArr"
				@comfirm="comfirm"
			/>
			
		</view>
		
		<view class="bottom-btn" @click="setCustomer">
			提交
		</view>
		
	</view>
</template>

<script>
import { carPriceList } from '@/constants/index.js'	
import carFilterPopup from './components/carFilterPopup.vue'
	
export default {
	components: {
		carFilterPopup,
	},
	
	data() {
		return {
			carPriceList,
			currentCompany: {},
			customerInfo: {
				id: null,
				mobile: '',
				name: '',
				minPrice: undefined,
				maxPrice: undefined,
				minPriceStr: '',
				maxPriceStr: '',
				customerSource: 0,
				carTypeIds: '',
			},
			carTypeArr: [],
			type: null, // 1.添加 2.编辑
			showMinPriceList: false,
			showMaxPriceList: false,
			showPopup: false,
		}
	},
	
	onLoad(options) {
		this.type = options.type
		
		const value = uni.getStorageSync('current_company')
		if (value) {
			this.currentCompany = value
		}
		
		if (this.type == 2) {
			const customerInfo = uni.getStorageSync('customerInfo')
			if (customerInfo) {
				this.customerInfo = customerInfo
				this.carTypeArr = customerInfo.intentionCarTypes
				this.customerInfo.carTypeIds = customerInfo.intentionCarTypes.map(item => item.carTypeId).join(',')
				if (customerInfo.minPrice) {
					this.customerInfo.minPriceStr = customerInfo.minPrice + '万'
				}
				if (customerInfo.maxPrice) {
					this.customerInfo.maxPriceStr = customerInfo.maxPrice + '万'
				}
			}
		}
	},
	
	methods: {
		openMinPriceList() {
			this.showMinPriceList = true
		},
		
		openMaxPriceList() {
			this.showMaxPriceList = true
		},
		
		confirmMinPrice(e) {
			this.customerInfo.minPrice = e[0].value
			this.customerInfo.minPriceStr = e[0].label
		},
		
		confirmMaxPrice(e) {
			this.customerInfo.maxPrice = e[0].value
			this.customerInfo.maxPriceStr = e[0].label
		},
		
		openPopup() {
			this.showPopup = true
		},
		
		comfirm(data) {
			this.carTypeArr = data
		},
		
		removeSelect(carType) {
			const index = this.carTypeArr.findIndex(item => item.carTypeId === carType.carTypeId)
			if (index !== -1) {
				this.carTypeArr.splice(index, 1)
			}
		},
		
		async setCustomer() {
			if(!this.customerInfo.name.trim()) {
				uni.showToast({
					title: '请输入客户姓名',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.customerInfo.mobile) {
				uni.showToast({
					title: '请输入客户电话',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(this.customerInfo.minPrice && this.customerInfo.maxPrice) {
				if (this.customerInfo.minPrice > this.customerInfo.maxPrice) {
					uni.showToast({
						title: '最小价格不能大于最大价格',
						duration: 2000,
						icon: "none"
					})
					return false
				}
			}
			
			if (this.carTypeArr.length) {
				this.customerInfo.carTypeIds = this.carTypeArr.map(item => item.carTypeId).join(',')
			}
			
			let url = this.$url.insertClient
			if (this.type == 2) {
				url = this.$url.InsertClientIntention
			}
			
			uni.showLoading({
				title: '加载中'
			})
			
			const res = await this.$getRequest(url, "POST", this.customerInfo)
			
			if (res.code == 0) {
				uni.showToast({
					title: '保存成功',
					duration: 2000,
					icon: "none"
				})
				
				uni.navigateTo({
					url: '/pages/customer/customer'
				})
			}
			
			uni.hideLoading()
		},
		
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.item-wrap {
		margin-bottom: 12px;
		.item-title {
			margin-bottom: 2px;
			height: 36rpx;
			line-height: 36rpx;
			font-size: 12px;
			color: #343A40;
		}
		.item-content {
			.input-wrap {
				width: 100%;
				height: 96rpx;
				border-radius: 16rpx;
				background: #F7F8FA;
				padding: 0 32rpx;
				display: flex;
				align-items: center;
			}
			.price-wrap {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.input-wrap {
					width: 300rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
			}
			.car-type-wrap {
				.input-wrap {
					padding: 0 32rpx;
					height: unset;
					min-height: 96rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.car-type-list {
						margin: 12px 0;
						display: flex;
						flex-wrap: wrap;
						align-items: center;
						.select-list-item {
							margin-right: 16rpx;
							margin-bottom: 12px;
							padding-left: 16rpx;
							height: 56rpx;
							display: flex;
							align-items: center;
							color: #1D2129;
							font-size: 12px;
							background: #FFFFFF;
							.cancel-tag {
								width: 52rpx;
								height: 100%;
								display: flex;
								justify-content: center;
								align-items: center;
								font-size: 14px;
								color: #1D2129;
							}
						}
					}
				}
			}
		}
	}
}
</style>
