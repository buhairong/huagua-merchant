<template>
	<view class="page-wrap">
		<view class="card">
			<view class="item">
				<view class="item-title">账户名称：</view>
				<view class="item-content">{{realName}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">账 户 号 ：</view>
				<view class="item-content">{{bankAccountId}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">开 户 行 ：</view>
				<view class="item-content">{{bankName}}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			bankAccountId: '',
			bankName: '',
			realName: '',
		}
	},
	onLoad(options) {
		this.bankAccountId = options.bankAccountId
		this.bankName = options.bankName
		this.realName = options.realName
	},
	
	methods: {
		
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.item {
	margin-bottom: 8px;
	display: flex;
	font-size: 14px;
	line-height: 44rpx;
	.item-title {
		color: #64696F;
	}
	.item-content {
		flex: 1;
		color: #0A0F2D;
	}
}
</style>