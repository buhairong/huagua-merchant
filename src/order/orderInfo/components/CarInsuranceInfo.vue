<template>
	<view class="card">
		<view class="title-wrap">
			<u-section
				title="车辆保险" 
				line-color="#165DFF"
				font-size="34"
				color="#0A0F2D"
				:right="false"
			></u-section>
		</view>
		
		<view class="item-wrap">
			<view v-for="(item, index) in orderDetail.carInfo.insuranceList" :key="index">
				<view style="margin:20px 0;" v-if="index === 1">
					<u-line color="rgba(216, 216, 216, 0.6)"/>
				</view>
				
				
				<view class="item">
					<view class="item-title">{{item.insuranceType === 0 ? '交通事故责任强制保险' : '商业保险'}}</view>
					<view class="item-content" @click="goInsuranceDetailPage(item)">
						查看更多
						<u-icon name="arrow-right" color="#CCCCCC" size="32" style="margin-left:8rpx"></u-icon>
					</view>
				</view>
				
				<view class="item">
					<view class="item-title">投保公司</view>
					<view class="item-content">{{item.insuranceCompanyName}}</view>
				</view>
				
				<view class="item">
					<view class="item-title">保险单号</view>
					<view class="item-content">{{item.insuranceNo}}</view>
				</view>
				
				<view class="item" v-if="item.insuranceType === 1">
					<view class="item-title">三者金额</view>
					<view class="item-content">￥{{item.amountOfThree | $numFormat}}</view>
				</view>
				
				<view class="item">
					<view class="item-title">有效日期</view>
					<view class="item-content">{{item.expireDate}}</view>
				</view>
				
			</view>
			
		</view>	
	</view>
</template>

<script>
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
	
	methods: {
		goInsuranceDetailPage(item) {
			try {
				uni.setStorageSync('insurance_list', JSON.stringify(item))
				uni.navigateTo({
					url: '/pages/car/insuranceDetail'
				})
			} catch (e) {
				// error
			}
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "../styles/index.scss";

</style>