<template>
	<view class="slide-wrap">
		<view @click.stop="minus">
			<u-icon name="minus-circle" color="#000000" size="32"></u-icon>
		</view>
		
		<view class="slide">
			<movable-area class="movable-area" ref="movable">
				<view class="process" :style="{width: processWidth+'px'}"></view>
				<movable-view ref="ball" class="movable-view" :x="x" direction="horizontal" @change="onChange"></movable-view>
			</movable-area>
		</view>
		
		<view @click.stop="plus">
			<u-icon name="plus-circle" color="#000000" size="32"></u-icon>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		nakedCarPrice: {
			type: Number,
			required: true,
		},
		
		initAmortizeRate: {
			type: Number,
			required: true,
		},
		
		financeSchemeId: {
			type: Number,
			required: true,
		},
		
		carTypeYearProductId: {
			type: Number,
			required: true,
		},
		
		newType: {
			type: Number,
			required: true,
		},
	},
	
	data() {
		return {
			processWidth: 0,
			x: 0,
			width: 0,
			min: 9,
			max: 11,
			amortizeRate: 9.6,
			allSlide: 2,
			init: true,
		}
	},
	
	watch: {
		nakedCarPrice: {
			handler(val) {
				if (val) {
					this.calculator()
				}
			},
			immediate: true,
		}
	},
	
	mounted() {
		this.amortizeRate = this.initAmortizeRate
		let movableWidth = 0
		let ballWidth = 0
		
		
		uni.createSelectorQuery().in(this).select('.movable-area').boundingClientRect(res=>{
			movableWidth = res.width
		}).exec()
		
		uni.createSelectorQuery().in(this).select('.movable-view').boundingClientRect(res=>{
			ballWidth = res.width
		}).exec()
		
		
		setTimeout(() => {
			this.width = movableWidth - ballWidth
			this.moveX()
		}, 500)
	},
	
	methods: {
		moveX() {
			this.init = true
			this.x = (this.amortizeRate - this.min) / this.allSlide * this.width
			this.processWidth = this.x
			this.calculator()
			setTimeout(() => {
				this.init = false
			}, 1000)
		},
		
		onChange(e) {
			if (!this.init) {
				this.x = e.detail.x
				if (this.x === 0) {
					this.amortizeRate = this.min
					this.processWidth = 0
				} else if (this.x >= this.width) {
					this.amortizeRate = this.max
					this.processWidth = this.width
				} else {
					this.amortizeRate = Math.floor((this.x / this.width * this.allSlide + this.min)*10)
					this.amortizeRate = this.amortizeRate / 10
					this.processWidth = this.x
				}
				
				this.calculator()
			}
		},
		
		minus() {
			if (this.amortizeRate <= this.min) {
				return
			}
			this.amortizeRate = Math.floor((this.amortizeRate*10 - 1)) / 10
			this.moveX()
		},
		
		plus() {
			if (this.amortizeRate >= this.max) {
				return
			}
			this.amortizeRate = Math.ceil((this.amortizeRate*10 + 1)) / 10
			this.moveX()
		},
		
		async calculator() {
			if (!this.nakedCarPrice) {
				return 
			}
			
			const params = {
				financeSchemeId: this.financeSchemeId,
				firstPeriodRate: this.amortizeRate,
				nakedCarPrice: this.nakedCarPrice,
				carTypeProductId: this.carTypeYearProductId,
				newType: this.newType,
			}
			
			const res = await this.$getRequest(this.$url.selectDepositAndMonthPayOfApportionRate, "POST", params)
			
			if (res.code == 0) {
				this.$emit('calculator', {
					firstPeriodRate: this.amortizeRate,
					apportionRateReqVoList: res.data,
				})
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.slide-wrap {
	height: 120rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.slide {
		padding: 0 16rpx;
		flex: 1;
		width: 0;
		.movable-area {
			width: 100%;
			height: 8rpx;
			border-radius: 4rpx;
			background: rgba(10, 15, 45, 0.08);
			position: relative;
		}
		
		.process {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 100;
			height: 8rpx;
			border-top-left-radius: 4rpx;
			border-bottom-left-radius: 4rpx;
			background: #0A0F2D;
		}
		
		.movable-view {
			width: 32rpx;
			height: 32rpx;
			background: #0A0F2D;
			border-radius: 50%;
			border: 4rpx solid #FFFFFF;
			margin-top: -12rpx;
			box-sizing: border-box;
		}
	}
}
</style>