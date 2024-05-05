<template>
	<view class="card">
		<view class="title-wrap">
			<u-section
				:title="`车辆增配项${total ? `（${formatThousandNumber(total)} 元）` : ''}`" 
				line-color="#165DFF"
				font-size="34"
				color="#0A0F2D"
				:right="false"
			></u-section>
			<!-- <view class="">
				{{(orderDetail.decorateMoney - 0) | $numFormat}} 元
			</view> -->
			<view @click="setQuality" v-if="orderDetail.status === 1">
				<view class="add-text" v-if="orderDetail.configRespVo.details.length === 0">
					添加车辆增配项
				</view>
				<view class="update-text" v-else>
					修改
				</view>
			</view>
		</view>
		
		<view class="list">
			<view class="list-item" v-for="(item, index) in details" :key="index">
				<view class="label">· {{item.detailName}}</view>
				<view class="price">{{item.money | $numFormat}} 元</view>
			</view>
		</view>	
	</view>
</template>

<script>
import { formatThousandNumber } from '@/utils/index.js'

export default {
	props: {
		orderDetail: {
			type: Object,
			required: true,
		}
	},
	
	data() {
		return {
			
		}
	},
	
	computed: {
		details() {
			return this.orderDetail.configRespVo.details.filter(item => item.hasCheck === 1)
		},
		
		total() {
			let res = 0
			
			if (this.details.length) {
				res = this.details.reduce((sum, cur) => {
					return sum + cur.money
				}, 0)
			}
			
			return res
		},
	},
	
	methods: {
		setQuality() {
			const config = JSON.stringify(this.details)
			uni.navigateTo({
				url: `/order/orderInfo/setConfig?orderId=${this.orderDetail.id}&brand=${this.orderDetail.carTypeYearProduct.carBrand}&carType=${this.orderDetail.carTypeYearProduct.carType}&carTypeYear=${this.orderDetail.carTypeYearProduct.carTypeYear}&carTypeYearProduct=${this.orderDetail.carTypeYearProduct.carTypeYearProduct}&imageUrl=${this.orderDetail.carTypeYearProduct.imageUrl}&config=${config}`
			})
		},
		
		formatThousandNumber(num) {
			return formatThousandNumber(num)
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "../styles/index.scss";

.add-text {
	height: 52rpx;
	line-height: 52rpx;
	border-radius: 8rpx;
	padding: 0 12rpx;
	background: #4170EE;
	color: #FFFFFF;
	font-size: 24rpx;
}
.update-text {
	height: 52rpx;
	font-size: 28rpx;
	line-height: 52rpx;
	text-decoration: underline;
	color: #3446AA;
}
.list {
	padding-top:16px;
	padding-left: 20px;
	.list-item {
		margin-bottom: 12px;
		height: 40rpx;
		font-size: 14px;
		line-height: 40rpx;
		color: rgba(10, 15, 45, 0.8);
		display: flex;
		justify-content: space-between;
	}
}
</style>