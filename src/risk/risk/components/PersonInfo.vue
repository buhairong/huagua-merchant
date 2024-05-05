<template>
	<view class="card">
		<view class="title-wrap">
			<u-section
				title="用车人信息" 
				line-color="#165DFF"
				font-size="34"
				color="#0A0F2D"
				:right="false"
			></u-section>
		</view>
		
		<view class="item-wrap">
			<view class="item">
				<view class="item-title">审核状态</view>
				<view class="item-content">{{RiskOrderStatus[detail.riskResult].label}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">客户姓名</view>
				<view class="item-content">{{detail.orderAndUserDetail.name}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">联系方式</view>
				<view class="item-content">{{detail.orderAndUserDetail.mobile}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">身份证号</view>
				<view class="item-content">{{detail.orderAndUserDetail.idcard}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">准驾级别</view>
				<view class="item-content">{{detail.orderAndUserDetail.driveCarType}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">下单时间</view>
				<view class="item-content">{{detail.orderAndUserDetail.orderDate}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">身份证照片</view>
				<view class="item-content">
					<view class="img-list">
						<image
							class="img"
							mode="aspectFill"
							:src="detail.orderAndUserDetail.idcardUrl"
							@click="preview([detail.orderAndUserDetail.idcardUrl])"
						/>
						
						<image
							class="img"
							mode="aspectFill"
							:src="detail.orderAndUserDetail.idcardBackUrl"
							@click="preview([detail.orderAndUserDetail.idcardBackUrl])"
						/>
					</view>
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">驾驶证照片</view>
				<view class="item-content">
					<view class="img-list">
						<image
							class="img"
							mode="aspectFill"
							:src="detail.orderAndUserDetail.driverLicenseUrl"
							@click="preview([detail.orderAndUserDetail.driverLicenseUrl])"
						/>
						
						<image
							class="img"
							mode="aspectFill"
							:src="detail.orderAndUserDetail.driverLicenseSecondSheetUrl"
							@click="preview([detail.orderAndUserDetail.driverLicenseSecondSheetUrl])"
						/>
					</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
import { RiskOrderStatus } from '@/constants/index.js'

export default {
	props: {
		detail: {
			type: Object,
			required: true,
		},
	},
	
	data() {
		return {
			RiskOrderStatus
		}
	},
	
	methods: {
		preview(urls) {
			uni.previewImage({
				urls,
			})
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "../../../order/orderInfo/styles/index.scss";

.img-list {
	display: flex;
	.img {
		margin-left: 24rpx;
		width: 140rpx;
		height: 92rpx;
	}
}


</style>