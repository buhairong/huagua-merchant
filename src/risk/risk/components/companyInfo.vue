<template>
	<view class="card">
		<view class="title-wrap">
			<u-section
				title="企业信息" 
				line-color="#165DFF"
				font-size="34"
				color="#0A0F2D"
				:right="false"
			></u-section>
		</view>
		
		<view class="item-wrap">
			<view class="item">
				<view class="item-title">企业名称</view>
				<view class="item-content">{{detail.userCompanyEntity.companyName}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">企业地址</view>
				<view class="item-content">{{detail.userCompanyEntity.address}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">法定代表人</view>
				<view class="item-content">{{detail.userCompanyEntity.contactName}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">统一信用代码</view>
				<view class="item-content">{{detail.userCompanyEntity.corporationTaxNumber}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">营业期限</view>
				<view class="item-content">{{detail.userCompanyEntity.businessDeadline}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">营业执照</view>
				<view class="item-content">
					<image
						class="img"
						mode="aspectFill"
						:src="detail.userCompanyEntity.businessLicense"
						@click="preview([detail.userCompanyEntity.businessLicense])"
					/>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
export default {
	props: {
		detail: {
			type: Object,
			required: true,
		},
	},
	
	data() {
		return {
			
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

.img {
	width: 120rpx;
	height: 172rpx;
}


</style>