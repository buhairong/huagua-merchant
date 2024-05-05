<template>
	<view class="page">
		<CarInfoHeader 
			:brand="brand"
			:carType="carType"
			:carTypeYear="carTypeYear"
			:carTypeYearProduct="carTypeYearProduct"
			:imageUrl="imageUrl"
		/>
		
		<view class="card">
			<view v-if="list.length">
				<view class="title-wrap">
					<u-section
						title="装潢总金额" 
						line-color="#165DFF"
						font-size="34"
						color="#0A0F2D"
						:right="false"
					></u-section>
				</view>
				
				<view style="padding-left:20rpx;">
					<view class="item-wrap">
						<input
							v-model="decorateMoney"
							class="input"
							inputmode="numeric" 
							type="digit"
							placeholder="请输入装潢总金额"
							placeholder-style="font-size:14px;color:#A4AEBB;"
						/>
						<view class="unit">元</view>
					</view>
					
					<u-section
						title="装潢详细" 
						line-color="#165DFF"
						font-size="34"
						color="#0A0F2D"
						:right="false"
						:show-line="false"
					></u-section>
					
					<view style="margin-top:16px;">
						<view v-for="(item, index) in list" :key="index" class="item" :class="{'active-item': item.checked}" @click="toggleCheck(item)">
							{{item.decorateName}}
						</view>
					</view>
				</view>
			</view>
			<view v-else-if="errMsg">
				请先添加 精品/装潢
			</view>
		</view>
		
		<view class="fixed-buttom-disabled-btn">
			<button :disabled="disabled" @click="save">确认</button>
		</view>
	</view>
</template>

<script>
import CarInfoHeader from './components/CarInfoHeader.vue'

export default {
	components: {
		CarInfoHeader,
	},
	
	data() {
		return {
			orderId: '',
			brand: '',
			carType: '',
			carTypeYear: '',
			carTypeYearProduct: '',
			imageUrl: '',
			merchantId: null,
			list: [],
			errMsg: '',
			decorateMoney: undefined,
			decorate: '',
		}
	},
	
	onLoad(options) {
		this.orderId = options.orderId
		this.brand = options.brand
		this.carType = options.carType
		this.carTypeYear = options.carTypeYear
		this.carTypeYearProduct = options.carTypeYearProduct
		this.imageUrl = options.imageUrl
		
		this.decorate = options.decorate
		if (options.decorateMoney) {
			this.decorateMoney = parseInt(options.decorateMoney)
		}
		
		const value = uni.getStorageSync('current_company')
		if (value) {
			this.merchantId = value.company.id
		}
		
		this.selectBrokerageDistribution()
	},
	
	computed: {
		disabled() {
			return !(this.decorateMoney && this.list.filter(item => item.checked).length)
		},
	},
	
	methods: {
		async selectBrokerageDistribution() {
			const params = {
				companyId: this.merchantId
			}
			
			const res = await this.$getRequest(this.$url.selectAllDecorate, "GET", params)
			
			if (res.code == 0 && res.data && res.data.length) {
				this.list = res.data.map(item => {
					item.checked = false
					return item
				})
				
				if (this.decorate) {
					const decorate = JSON.parse(this.decorate)
					decorate.map(item => {
						item.checked = true
						return item
					})
					this.list.forEach(item => {
						const index = decorate.findIndex(v => v.id === item.id)
						if (index !== -1) {
							item.checked = true
							decorate.splice(index, 1)
						}
					})
					this.list = [...decorate, ...this.list]
				}
			} else {
				this.errMsg = '暂无数据'
			}
			
			uni.hideLoading()
		},
		
		toggleCheck(item) {
			item.checked = !item.checked
		},
		
		save() {
			const decorateList = this.list.filter(item => item.checked)
			
			uni.showLoading({
				title: '保存中',
				icon: 'none'
			})
			
			const params = {
				orderId: this.orderId,
				decorateMoney: this.decorateMoney,
				decorateList,
			}
			
			this.$getRequest(this.$url.updateOrderDecorate, 'POST', params).then(res => {
				if (res.code === 0) {
					uni.navigateBack({
						delta: 1
					})
				}
			}).finally(() => {
				uni.hideLoading()
			})
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "./styles/index.scss";

.page {
	padding: 16px 32rpx 140px;
	.item-wrap {
		margin-bottom: 20px;
		padding: 0 32rpx;
		height: 96rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #F7F8FA;
		border-radius: 16rpx;
		.input {
			width: 0;
			flex: 1;
		}
		.unit {
			padding-left: 32rpx;
			font-size: 14px;
			color: #1D2129;
		}
	}
	.item {
		margin-bottom: 12px;
		height: 68rpx;
		border-radius: 8rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(65, 112, 238, 0.1);
		font-size: 14px;
		color: #1A1A1A;
	}
	.active-item {
		color: #4170EE;
	}
}
</style>