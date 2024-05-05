<template>
	<view class="page">
		<view class="detail">
			<view class="item">
				<view class="item-title">投保公司</view>
				<view class="item-content">{{insuranceDetail.insuranceCompanyName || '-'}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">保险单号</view>
				<view class="item-content">{{insuranceDetail.insuranceNo || '-'}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">有效日期</view>
				<view class="item-content">{{formatDate(insuranceDetail.expireDate)}}</view>
			</view>
		</view>
		
		<view class="img-list">
			<image
				v-for="item in insuranceDetail.insurancePicsList"
				:key="item.id"
				class="insurance-img"
				:src="item.url"
				mode="widthFix"
			/>
		</view>
	</view>
</template>

<script>
import dayjs from 'dayjs'

export default {
	data() {
		return {
			insuranceType: ['机动车交强险保单', '机动车商业险保单'], // 保单类别：0 机动车交强险，1 机动车商业险
			insuranceDetail: {},
		}
	},
	
	onShow() {
		try {
			const value = uni.getStorageSync('insurance_detail')
			if (value) {
				this.insuranceDetail = JSON.parse(value)
				uni.setNavigationBarTitle({
					title: this.insuranceType[this.insuranceDetail.insuranceType]
				})
			}
		} catch (e) {
			// error
		}
	},
	
	methods: {
		formatDate(value) {
			if (value) {
				return dayjs(value).format('YYYY年MM月DD日')
			}
		  return '-'
		},
		
		previewImage() {
			const imgList = []
			this.insuranceDetail.insurancePicsList.forEach(item => {
				imgList.push(item.url)
			})
			
			uni.previewImage({
				urls: imgList,
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.page {
	width: 100vw;
	min-height: 100vh;
	background-color: #000;
	padding-bottom: 100rpx;
	.detail {
		padding: 24px 48rpx 0;
	}
	.item {
		display: flex;
		margin-bottom: 8px;
		&:last-child {
			margin-bottom: 0;
		}
		.item-title {
			height: 42rpx;
			font-size: 14px;
			line-height: 42rpx;
			color: rgba(255, 255, 255, 0.6);
			padding-right: 60rpx;
		}
		.item-content {
			font-size: 14px;
			line-height: 42rpx;
			color: #FFFFFF;
		}
	}
	.img-list {
		margin-top: 40px;
		.insurance-img {
			width: 100vw;
			margin-bottom: 20px;
		}
	}
}
</style>