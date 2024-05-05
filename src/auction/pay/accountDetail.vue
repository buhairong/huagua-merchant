<template>
	<view class="wrap">
		<view class="card">
			<view class="item">
				<view class="label">{{cashRecordObj[type].label[0]}}：</view>
				<view class="item-content">
					<view v-if="type > 3">{{cashRecordObj[type].label1Content}}</view>
					<view v-else>
						{{detail.payWay === 1 ? '微信支付' : '银行转账'}}
					</view>
				</view>
			</view>
			
			<view class="item" v-if="type == 12">
				<view class="label">提现卡号：</view>
				<view class="item-content">{{detail.bankCardNo}}</view>
			</view>
			
			<view class="item">
				<view class="label">{{cashRecordObj[type].label[1]}}：</view>
				<view class="item-content">{{money | $numFormat1}}元</view>
			</view>
			
			<view class="item">
				<view class="label">{{cashRecordObj[type].label[2]}}：</view>
				<view class="item-content">{{createdTime}}</view>
			</view>
			
			<view class="item" v-if="type <= 3 && detail.payWay === 1">
				<view class="label">交易单号：</view>
				<view class="item-content">{{detail.wxOrderNum}}</view>
			</view>
		</view>
		
		<view v-if="type <= 3 && detail.payWay === 2">
			<view class="title">转账凭证</view>
			<view
				class="img-wrap"
				v-for="(img, index) in detail.imageList"
				:key="index"
				@click.stop="preview(index)"
			>
				<image
					:src="img"
					mode="widthFix"
				/>
			</view>
		</view>
	</view>
</template>

<script>
import { cashRecordObj } from '@/constants/index.js'

export default {
	components: {
	  
	},
	
	data() {
		return {
			detail: {},
			cashRecordObj,
			type: null,
			bankBills: [],
			money: '',
			createdTime: '',
			id: '',
		}
	},
	
	onLoad(options) {
		this.type = options.type
		this.id = options.id
		this.money = options.money
		this.createdTime = options.createdTime
		uni.setNavigationBarTitle({
			title: cashRecordObj[this.type].title
		})
		this.getDetail()
	},
	
	onShow() {
		
	},
	
	methods: {
		async getDetail() {
			uni.showLoading({
				title: '加载中'
			})
			
			let params = {
				id: this.id,
			}
			
			const res = await this.$getRequest(this.$url.getTurnoverRecordDetail, "GET", params)
			uni.hideLoading()
			if (res.code === 0) {
				this.detail = res.data
			}
		},
		
		preview(current) {
			uni.previewImage({
				current,
				urls: this.detail.imageList,
			})
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";	

.wrap {
	padding: 40rpx 32rpx;
	.card {
		.item {
			margin-bottom: 16rpx;
			display: flex;
			color: #64696F;
			font-size: 28rpx;
			.label {
				height: 44rpx;
				line-height: 44rpx;
			}
			.item-content {
				width: 0;
				flex: 1;
				line-height: 44rpx;
				word-wrap: break-word; 
			}
		}
	}
	.title {
		margin: 32rpx 0;
		font-size: 17px;
		color: #3D3D3D;
	}
	.img-wrap {
		margin-bottom: 32rpx;
		width: 100%;
		border-radius: 8rpx;
		overflow: hidden;
		image {
			width: 100%;
		}
	}
}
</style>