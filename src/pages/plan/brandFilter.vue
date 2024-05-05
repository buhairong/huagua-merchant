<template>
	<view class="page-wrap">
		<view class="title-wrap">
			<view class="title">
				{{isEdit ? '显示品牌' : '品牌'}}
			</view>
			<view class="edit-btn" @click="handleEdit">
				{{isEdit ? '完成编辑' : '编辑'}}
			</view>
		</view>
		
		<view class="show-list">
			<view 
				v-for="item in showBrandList"
				:key="item.id"
				class="brand"
			>
				<view class="logo">
					<image
						style="width:100%;height:100%;"
						:src="item.logoUrl"
					/>
				</view>
				{{item.brandName}}
				
				<view class="operator" @click="hideBrand(item)" v-if="isEdit">
					<u-icon name="minus-circle-fill" color="#737373" size="28"></u-icon>
				</view>
			</view>
		</view>
		
		<template v-if="hideBrandList.length">
			<view class="title-wrap" style="margin-top: 32px;">
				<view class="title">隐藏品牌</view>
			</view>
			
			<view class="show-list">
				<view 
					v-for="item in hideBrandList"
					:key="item.id"
					class="brand"
				>
					<view class="logo">
						<image
							style="width:100%;height:100%;"
							:src="item.logoUrl"
						/>
					</view>
					{{item.brandName}}
					
					<view class="operator" @click="showBrand(item)" v-if="isEdit">
						<u-icon name="plus-circle-fill" color="#737373" size="28"></u-icon>
					</view>
				</view>
			</view>
		</template>
		
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			brandList: [],
			showBrandList: [],
			hideBrandList: [],
			companyId: null,
			newType: null,
			isEdit: false,
			level2SelectBrand: [],
			primaryKey: '',
		}
	},
	
	onLoad(options) {
		this.companyId = options.companyId
		this.newType = options.newType
		this.selectCarBrandListOfSubscribe()
		
		if (this.newType == 1) {
			const value = uni.getStorageSync('BrandListForNewCarPlan')
			if (value) {
				this.level2SelectBrand = value
			}
		} else {
			const value = uni.getStorageSync('BrandListForOldCarPlan')
			if (value) {
				this.level2SelectBrand = value
			}
		}
		
		uni.setStorageSync('fromBrandFilterPage', true)
	},
	
	methods: {
		async selectCarBrandListOfSubscribe() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				companyId: this.companyId,
				newType: this.newType,
			}
			
			const res = await this.$getRequest(this.$url.selectCarBrandListOfSubscribe, "GET", params)
			
			if (res.code == 0 && res.data) {
				this.primaryKey = res.data.primaryKey
				this.brandList = res.data.brandList
				this.showBrandList = res.data.brandList.filter(item => item.isShow === 1)
				this.hideBrandList = res.data.brandList.filter(item => item.isShow === 0)
			}
			
			uni.hideLoading()
		},
		
		async updateCarBrandListOfSubscribe() {
			uni.showLoading({
				title: '加载中'
			})
			
			const brandList = [
				...this.showBrandList,
				...this.hideBrandList,
			]
			
			const params = {
				brandList,
				companyId: this.companyId,
				newType: this.newType,
				primaryKey: this.primaryKey,
			}
			
			const res = await this.$getRequest(this.$url.updateCarBrandListOfSubscribe, "POST", params)
			
			if (res.code == 0) {
				const list = this.showBrandList.map(item => item.id)
				if (this.newType == 1) {
					uni.setStorageSync('BrandListForNewCarPlan', list)
				} else {
					uni.setStorageSync('BrandListForOldCarPlan', list)
				}
				this.isEdit = false
				this.selectCarBrandListOfSubscribe()
			}
			
			uni.hideLoading()
		},
		
		handleEdit() {
			if (this.isEdit) {
				this.updateCarBrandListOfSubscribe()
			} else {
				this.isEdit = true
			}
		},
		
		hideBrand(item) {
			if (this.showBrandList.length === 1) {
				uni.showToast({
					title: '至少保留一个显示品牌',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			const index = this.showBrandList.findIndex(brand => brand.id === item.id)
			if (index !== -1) {
				item.isShow = 0
				this.showBrandList.splice(index, 1)
				this.hideBrandList.push(item)
			}
		},
		
		showBrand(item) {
			const index = this.hideBrandList.findIndex(brand => brand.id === item.id)
			if (index !== -1) {
				item.isShow = 1
				this.hideBrandList.splice(index, 1)
				this.showBrandList.push(item)
			}
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.title-wrap {
	margin-bottom: 20px;
	height: 40rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.title {
	font-size: 14px;
	color: #1A1A1A;
}

.edit-btn {
	font-size: 14px;
	color: #393D3F;
}

.show-list {
	display: flex;
	flex-wrap: wrap;
	.brand {
		margin-right: 20rpx;
		margin-bottom: 12px;
		padding: 0 32rpx;
		height: 54rpx;
		border-radius: 10rpx;
		background: rgba(216, 216, 216, 0.6);
		font-size: 13px;
		color: rgba(10, 15, 45, 0.8);
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		.logo {
			width: 40rpx;
			height: 40rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: 12rpx;
		}
		.operator {
			position: absolute;
			top: -14rpx;
			right: -14rpx;
			z-index: 100;
		}
	}
}
</style>
