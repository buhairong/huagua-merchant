<template>
	<view class="card">
		<view class="title-wrap">
			<u-section
				title="补充材料" 
				line-color="#165DFF"
				font-size="34"
				color="#0A0F2D"
				:right="false"
			></u-section>
		</view>
		
		<view class="item-wrap">
			<view class="item" v-for="item in detail.certificationList" :key="item.id">
				<view class="item-title">{{item.certificationName}}</view>
				<view class="item-content">
					<view class="icon-wrap">
						<view @click="goCertificationDetailPage(item)" v-if="item.imageUrl && item.imageUrl.length">
							<u-icon name="checkmark" color="#4170EE" size="28" v-if="item.confirmed === 1"></u-icon>
							<u-icon name="close" color="#FF0000" size="28" v-else-if="item.confirmed === 0"></u-icon>
							<u-icon name="arrow-right" color="rgba(0, 0, 0, 0.9)" size="28" v-else></u-icon>
						</view>
						<view class="" v-else>待上传</view>
					</view>
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
		
		orderId: {
			type: String,
			required: true,
		},
	},
	
	data() {
		return {
			
		}
	},
	
	methods: {
		getStatus(ruleResult) {
			let status = ''
			
			if (ruleResult == 1) {
				status = '通过'
			} else if (ruleResult == 2) {
				status = '不通过'
			} else {
				status = '人工'
			}
			
			return status
		},
		
		goCertificationDetailPage(item) {
			uni.setStorageSync('currentCertificationItem', item)
			uni.navigateTo({
				url: `/risk/risk/checkCertification?orderId=${this.orderId}`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "../../../order/orderInfo/styles/index.scss";

</style>