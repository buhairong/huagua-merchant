<template>
	<u-popup 
		v-model="showCarFilterPopup"
		mode="bottom"
		border-radius="8"
		:maxlength="10"
		:closeable="true"
		@close="close"
	>
		<view class="wrap">
			<view class="title">{{typeList[curType].title}}</view>
			<view v-if="curType == 1" class="brand-select">
				<view class="search-wrap">
					<u-icon name="search" color="#1D2129" size="40"></u-icon>
					<input 
						placeholder="搜索品牌"
						@input="handlerInput"
					/>
				</view>
				<view class="brand-list-wrap">
					<scroll-view
						:scroll-top="scrollTop" 
						scroll-y="true" 
						class="brand-list-scroll"
						:scroll-with-animation="true"
						:scroll-into-view="`letter-${currentLetter}`"
					>
						<view class="brand-list">
							<view 
								class="brand"
								v-for="(item, index) in filterBrandList"
								:key="index"
							>
								<view :id="`letter-${item[0].letter}`" class="brand-letter">
									{{item[0].letter}}
								</view>
								<view 
									class="brand-name"
									v-for="brand in item"
									:key="brand.id"
									@click="changeSelectBrand(brand)"
								>
									{{brand.brandName}}
								</view>
							</view>
						</view>
					</scroll-view>
					<view class="letter-wrap">
						<view class="letters">
							<view
								v-for="(letter, index) in brandLetterList"
								:key="index"
								class="letter"
								@click="scrollToLetter(letter)"
								@touchstart="touchStartLetter(letter)"
								@touchend="touchEndLetter"
							>
								{{letter}}
							</view>
							<!-- <view class="touch-letter">{{touchLetter}}</view> -->
						</view>
					</view>
				</view>
			</view>
			
			<view v-if="curType == 2">
				<view class="select-brand-name">
					{{selectBrand.brandName}} {{selectCarType.carType}}
				</view>
				<view class="select-wrap">
					<view class="left-scroll-wrap" :style="{width: drawer ? '334rpx' : '130rpx'}">
						<!-- <view class="drawer" @click="changeDrawer">
							<u-icon :name="drawer ? 'arrow-left' : 'arrow-right'" color="#fff" size="28"></u-icon>
						</view> -->
						<scroll-view
							scroll-y="true" 
							class="car-type-list-scroll"
							:scroll-with-animation="true"
							:style="{width: drawer ? '334rpx' : '130rpx'}"
						>
							<view class="car-type-list">
								<view 
									class="car-type"
									v-for="item in carType"
									:key="item.carTypeId"
									:class="{'active-car-type': item.carTypeId === selectCarType.carTypeId}"
									@click="changeSelectCarType(item)"
								>
									{{item.carType}}
								</view>
							</view>
						</scroll-view>
					</view>
					<view class="right">
						<scroll-view
							scroll-x="true" 
							class="car-type-year-list-scroll"
							:scroll-with-animation="true"
						>
							<view class="car-type-year-list">
								<view 
									class="car-type-year"
									v-for="item in carTypeYearList"
									:key="item.carTypeYearId"
									:class="{'active-car-type-year': item.carTypeYearId === selectCarTypeYear.carTypeYearId}"
									@click="changeSelectCarTypeYear(item)"
								>
									{{item.carTypeYear}}
								</view>
							</view>
						</scroll-view>
						<scroll-view
							scroll-y="true" 
							class="car-type-year-product-list-scroll"
							:scroll-with-animation="true"
						>
							<view class="car-type-year-product-list">
								<view 
									class="car-type-year-product"
									v-for="item in carTypeYearProductList"
									:key="item.id"
									@click="changeSelectCarTypeYearProduct(item)"
								>
									<view class="product-wrap">
										<view class="product">
											{{item.carTypeYearProduct}}
											<view class="price">指导价：{{formatTenThousandNumber(item.guidancePrice)}}</view>
										</view>
										<view style="width:32rpx;height:32rpx;">
											<image
												v-if="item.id === selectCarTypeYearProduct.id"
												style="width:32rpx;height:32rpx;"
												class="check-icon"
												src="https://image.51cheyaoshi.com/xcx/merchant/static/home/ok.png"
											/>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
				<view class="btn-group">
					<view class="btn" @click="backStep">上一步</view>
					<view class="btn save-btn" @click="goDetailPage">确定</view>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
import { formatTenThousandNumber } from '@/utils/index.js'

export default {
	props: {
		showCarFilterPopup: {
			type: Boolean,
			required: true,
		},
		
		type: {
			type: String,
			required: true, // 1.新车 2.二手车
		},
		
		workType: {
			type: String,
			default: "1", // 1.方案列表 2.车辆列表
		},
	},
	
	data() {
		return {
			inputValue: '',
			curType: '1',
			typeList: {
				'1': {
					id: 1,
					title: '选择品牌',
				},
				'2': {
					id: 2,
					title: '选择车型',
				},
			},
			brandList: [],
			filterBrandList: [],
			brandLetterList: [],
			scrollTop: 0,
			scrollTopList: [],
			currentLetter: 'A',
			selectBrand: {},
			carType: [],
			selectCarType: {},
			carTypeYearList: [],
			selectCarTypeYear: {},
			carTypeYearProductList: [],
			selectCarTypeYearProduct: {},
			touchLetter: '',
			drawer: true, // true 展开 false 收起
		}
	},
	
	mounted() {
		this.getCarBrandList()
	},
	
	methods: {
		async getCarBrandList() {
			const params = {
				
			}
			
			const res = await this.$getRequest(this.$url.getCarBrandList, "POST", params)
			
			if (res.code == 0 && res.data && res.data.length) {
				res.data.forEach(item => {
					const index = this.brandLetterList.findIndex(letter => letter === item.letter)
					if(index !== -1) {
						this.brandList[index].push(item)
					} else {
						this.brandList.push([item])
						this.brandLetterList.push(item.letter)
					}
				})
				this.filterBrandList = this.brandList
			}
		},
		
		changeSelectBrand(brand) {
			this.selectCarType = {}
			this.carType = []
			this.selectCarTypeYear = {}
			this.carTypeYearList = []
			this.selectCarTypeYearProduct = {}
			this.carTypeYearProductList = []
			
			this.selectBrand = brand
			this.getCarTypeList()
			this.curType = 2
		},
		
		async getCarTypeList() {
			const params = {
				carBrandId: this.selectBrand.id,
			}
			
			const res = await this.$getRequest(this.$url.getForSearch, "POST", params)
			
			if (res.code == 0) {
				this.carType = res.data.records
				this.selectCarType = this.carType[0]
				this.getCarYear()
			}
		},
		
		changeSelectCarType(carType) {
			this.selectCarType = carType
			this.selectCarTypeYear = {}
			this.carTypeYearList = []
			this.selectCarTypeYearProduct = {}
			this.carTypeYearProductList = []
			this.getCarYear()
		},
		
		async getCarYear() {
			const params = {
				carTypeId: this.selectCarType.carTypeId,
			}
			
			const res = await this.$getRequest(this.$url.getCarYear, "GET", params)
			
			if (res.code == 0) {
				this.carTypeYearList = res.data
				this.selectCarTypeYear = this.carTypeYearList[0]
				this.carTypeYearProductList = this.selectCarTypeYear.carTypeYearProducts
				this.selectCarTypeYearProduct = this.carTypeYearProductList[0]
			}
		},
		
		changeSelectCarTypeYear(item) {
			this.selectCarTypeYear = item
			this.carTypeYearProductList = this.selectCarTypeYear.carTypeYearProducts
			this.selectCarTypeYearProduct = this.carTypeYearProductList[0]
		},
		
		changeSelectCarTypeYearProduct(item) {
			this.selectCarTypeYearProduct = item
		},
		
		close() {
			this.$emit('update:showCarFilterPopup', false)
		},
		
		scroll(e) {
			
		},
		
		scrollToLetter(letter) {
			this.currentLetter = letter
		},
		
		handlerInput(e) {
			const value = e.detail.value.trim()
			this.filterBrandList = []
			if (value) {
				for(const key in this.brandList) {
					for(const item of this.brandList[key]) {
						if(item.brandName.includes(value)) {
							if(key in this.filterBrandList) {
								this.filterBrandList[key].push(item)
							} else {
								this.filterBrandList[key] = [item]
							}
						}
					}
				}
				
				this.filterBrandList = this.filterBrandList.filter(item => item)
			} else {
				this.filterBrandList = [...this.brandList]
			}
		},
		
		backStep() {
			this.curType = 1
		},
		
		goDetailPage() {
			if (!this.selectCarTypeYearProduct.id) {
				uni.showToast({
					title: '请选择车型',
					duration: 2000,
					icon: 'none'
				})
				return
			}
			
			if(this.workType == 1) {
				if (this.type == 1) {
					uni.navigateTo({
						url: `/pages/plan/newCarPlanDetail?brandId=${this.selectBrand.id}&brandName=${this.selectBrand.brandName}&carTypeId=${this.selectCarType.carTypeId}&carType=${this.selectCarType.carType}&carTypeYearId=${this.selectCarTypeYear.carTypeYearId}&carTypeYear=${this.selectCarTypeYear.carTypeYear}&carTypeYearProductId=${this.selectCarTypeYearProduct.id}&carTypeYearProduct=${this.selectCarTypeYearProduct.carTypeYearProduct}&imgUrl=${this.selectCarTypeYearProduct.imageUrl}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/plan/selectOldCar?brandId=${this.selectBrand.id}&brandName=${this.selectBrand.brandName}&carTypeId=${this.selectCarType.carTypeId}&carType=${this.selectCarType.carType}&carTypeYearId=${this.selectCarTypeYear.carTypeYearId}&carTypeYear=${this.selectCarTypeYear.carTypeYear}&carTypeYearProductId=${this.selectCarTypeYearProduct.id}&carTypeYearProduct=${this.selectCarTypeYearProduct.carTypeYearProduct}&imgUrl=${this.selectCarTypeYearProduct.imageUrl}`
					})
				}
			} else if(this.workType == 2) {
				if (this.type == 1) {
					uni.navigateTo({
						url: `/pages/car/addNewCar?brandId=${this.selectBrand.id}&brandName=${this.selectBrand.brandName}&carTypeId=${this.selectCarType.carTypeId}&carType=${this.selectCarType.carType}&carTypeYearId=${this.selectCarTypeYear.carTypeYearId}&carTypeYear=${this.selectCarTypeYear.carTypeYear}&carTypeYearProductId=${this.selectCarTypeYearProduct.id}&carTypeYearProduct=${this.selectCarTypeYearProduct.carTypeYearProduct}&imgUrl=${this.selectCarTypeYearProduct.imageUrl}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/car/addOldCar?brandId=${this.selectBrand.id}&brandName=${this.selectBrand.brandName}&carTypeId=${this.selectCarType.carTypeId}&carType=${this.selectCarType.carType}&carTypeYearId=${this.selectCarTypeYear.carTypeYearId}&carTypeYear=${this.selectCarTypeYear.carTypeYear}&carTypeYearProductId=${this.selectCarTypeYearProduct.id}&carTypeYearProduct=${this.selectCarTypeYearProduct.carTypeYearProduct}&imgUrl=${this.selectCarTypeYearProduct.imageUrl}`
					})
				}
			}
		},
		
		touchStartLetter(letter) {
			this.touchLetter = letter
			this.currentLetter = letter
		},
		
		touchEndLetter() {
			this.touchLetter = ''
		},
		
		changeDrawer() {
			this.drawer = !this.drawer
		},
		
		formatTenThousandNumber(num) {
			return formatTenThousandNumber(num)
		},
	},
}
</script>

<style lang="scss" scoped>
::v-deep ::-webkit-scrollbar {
	display: none
}

.wrap {
	padding: 16px 0 32px;
	.brand-select {
		padding: 0 32rpx;
	}
	.title {
		height: 24px;
		font-size: 16px;
		font-weight: 600;
		line-height: 24px;
		color: #1D2129;
		text-align: center;
	}
	.search-wrap {
		margin-top: 16px;
		width: 100%;
		height: 32px;
		padding-left: 16rpx;
		background: #F7F8FA;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		input {
			flex: 1;
			padding: 0 8rpx;
			font-size: 12px;
		}
	}
	.brand-list-wrap {
		margin-top: 16px;
		height: 468px;
		display: flex;
		justify-content: space-between;
		.brand-list-scroll {
			height: 100%;
			.brand {
				.brand-letter {
					margin-top: 28px;
					margin-bottom: 12px;
					height: 20px;
					font-size: 12px;
					line-height: 20px;
					color: #86909C;
					&:first-child {
						margin-top: 0;
					}
				}
				.brand-name {
					margin-bottom: 20px;
					height: 22px;
					font-size: 15px;
					line-height: 22px;
					color: #1D2129;
				}
			}
		}
		.letters {
			position: relative;
		}
		.touch-letter {
			position: absolute;
			top: 50%;
			left: -100rpx;
			width: 80rpx;
			height: 80rpx;
			transform: translateY(-50%);
			border-radius: 16rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #333;
			color: #fff;
			font-size: 17px;
			font-weight: 500;
		}
		.letter {
			width: 18px;
			height: 18px;
			line-height: 18px;
			text-align: center;
			font-size: 10px;
			color: rgba(10, 15, 45, 0.3);
			&.active-letter {
				color: #4170EE;
			}
		}
	}
	
	.select-brand-name {
		margin: 16px 0 10px;
		padding-left: 32rpx;
		height: 22px;
		font-size: 14px;
		font-weight: 500;
		line-height: 22px;
		color: #1D2129;
	}
	
	.select-wrap {
		height: 400px;
		display: flex;
		.left-scroll-wrap {
			height: 100%;
			position: relative;
			.drawer {
				width: 52rpx;
				height: 32px;
				background: rgba(0, 0, 0, 0.3);
				position: absolute;
				right: 0;
				top: 368px;
				z-index: 100;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		.car-type-list-scroll {
			width: 334rpx;
			height: 100%;
			background: #F7F8FA;
			.car-type-list {
				padding: 20px 0 20px 32rpx;
				.car-type {
					font-size: 12px;
					font-weight: 500;
					line-height: 18px;
					color: #1D2129;
					margin-bottom: 20px;
					&.active-car-type {
						color: #4170EE;
					}
				}
			}
		}
		.right {
			flex: 1;
			width: 0;
			.car-type-year-list-scroll {
				width: 100%;
				height: 22px;
				white-space: nowrap;
				.car-type-year-list {
					padding: 0 32rpx;
					display: flex;
					width: auto;
					.car-type-year {
						padding-right: 32rpx;
						font-size: 12px;
						line-height: 22px;
						color: #86909C;
						&.active-car-type-year {
							font-size: 15px;
							font-weight: 500;
							color: #1D2129;
							position: relative;
							&:before {
								content: '';
								display: block;
								width: 2px;
								height: 14px;
								border-radius: 2px;
								background: #165DFF; 
								position: absolute;
								top: 50%;
								left: -6px;
								transform: translateY(-50%);
							}
						}
					}
				}
			}
			.car-type-year-product-list-scroll {
				width: 100%;
				height: 378px;
				.car-type-year-product-list {
					padding: 0 32rpx;
				}
				.car-type-year-product {
					padding: 16px 0;
					border-bottom: 1px solid #F0F0F0;
					.product-wrap {
						display: flex;
						justify-content: space-between;
					}
					.product {
						flex: 1;
						padding-right: 16rpx;
						font-size: 12px;
						line-height: 18px;
						color: #1D2129;
						.price {
							margin-top: 4px;
							font-size: 12px;
							line-height: 36rpx;
							color: #86909C;
						}
					}
				}
			}
		}
	}
	
	.btn-group {
		margin-top: 32px;
		display: flex;
		justify-content: center;
		.btn {
			width: 216rpx;
			height: 40px;
			border-radius: 4px;
			background: #F7F8FA;
			font-size: 17px;
			font-weight: 500;
			color: #1D2129;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.save-btn {
			margin-left: 16px;
			background: #4170EE;
			color: #FFFFFF;
		}
	}
}
</style>