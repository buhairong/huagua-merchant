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
			<view class="title">车系偏好</view>
			<scroll-view
				scroll-x="true" 
				class="select-list-scroll"
				:scroll-with-animation="true"
			>
				<view class="select-list">
					<view class="select-list-item" v-for="item in selectList" :key="item.carTypeId">
						{{item.carBrand}}{{item.carType}}
						<view class="cancel-tag" @click="removeSelect(item)">x</view>
					</view>
				</view>
			</scroll-view>
			
			<view class="select-wrap">
				<view class="left-scroll-wrap" :style="{width: drawer ? '334rpx' : '130rpx'}">
					<scroll-view
						scroll-y="true" 
						class="car-type-list-scroll"
						:scroll-with-animation="true"
						:style="{width: drawer ? '334rpx' : '130rpx'}"
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
									v-for="brand in item"
									:key="brand.id"
									class="brand-name"
									:class="{'active-brand': selectList.some(sl => sl.carBrandId === brand.id)}"
									@click="changeSelectBrand(brand)"
								>
									{{brand.brandName}}
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="right">
					<scroll-view
						scroll-y="true" 
						class="car-type-year-product-list-scroll"
						:scroll-with-animation="true"
					>
						<view class="car-type-year-product-list">
							<view 
								class="car-type-year-product"
								v-for="item in carType"
								:key="item.carTypeId"
								@click="changeSelectCarType(item)"
							>
								<view class="product-wrap">
									<view class="product">
										{{item.carType}}
									</view>
									<view style="width:32rpx;height:32rpx;">
										<image
											v-if="selectList.some(sl => sl.carTypeId === item.carTypeId)"
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
				<view class="btn" @click="close">取消</view>
				<view class="btn save-btn" @click="goDetailPage">确定</view>
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
		
		list: {
			type: Array,
			default: () => []
		},
	},
	
	data() {
		return {
			brandList: [],
			filterBrandList: [],
			brandLetterList: [],
			scrollTop: 0,
			scrollTopList: [],
			selectBrand: {},
			carType: [],
			selectCarType: {},
			touchLetter: '',
			drawer: true, // true 展开 false 收起
			selectList: [],
		}
	},
	
	watch: {
		list: {
			handler(val) {
				this.selectList = val
			},
			deep: true,
		}
	},
	
	mounted() {
		this.selectList = this.list
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
				
				this.selectBrand = res.data[0]
				this.getCarTypeList()
			}
		},
		
		changeSelectBrand(brand) {
			this.selectCarType = {}
			this.carType = []
			
			this.selectBrand = brand
			this.getCarTypeList()
		},
		
		async getCarTypeList() {
			const params = {
				carBrandId: this.selectBrand.id,
			}
			
			const res = await this.$getRequest(this.$url.getForSearch, "POST", params)
			
			if (res.code == 0) {
				this.carType = res.data.records
				//this.selectCarType = this.carType[0]
			}
		},
		
		changeSelectCarType(carType) {
			const index = this.selectList.findIndex(item => item.carTypeId === carType.carTypeId)
			if (index !== -1) {
				this.selectList.splice(index, 1)
			} else {
				this.selectList.push(carType)
			}
		},
		
		removeSelect(carType) {
			const index = this.selectList.findIndex(item => item.carTypeId === carType.carTypeId)
			if (index !== -1) {
				this.selectList.splice(index, 1)
			}
		},
		
		close() {
			this.$emit('update:showCarFilterPopup', false)
		},
		
		scroll(e) {
			
		},
		
		scrollToLetter(letter) {
			this.currentLetter = letter
		},
		
		goDetailPage() {
			this.close()
			this.$emit('comfirm', this.selectList)
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
	.select-list-scroll {
		margin-top: 20px;
		width: 100%;
		height: 56rpx;
		white-space: nowrap;
	}
	.select-list {
		padding: 0 40rpx;
		display: flex;
		.select-list-item {
			margin-right: 16rpx;
			margin-bottom: 16px;
			padding-left: 16rpx;
			height: 56rpx;
			display: flex;
			align-items: center;
			color: #1D2129;
			font-size: 12px;
			background: #F7F8FA;
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
	.brand-list {
		padding: 20px 0 20px 32rpx;
	}
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
		.active-brand {
			color: #4170EE;
		}
	}
	
	.brand-list-wrap {
		margin-top: 16px;
		height: 468px;
		display: flex;
		justify-content: space-between;
		.brand-list-scroll {
			height: 100%;
			
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
		margin-top: 20px;
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