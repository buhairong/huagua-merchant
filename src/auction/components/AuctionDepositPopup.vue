<template>
	<u-popup
		v-model="showPopup" 
		mode="bottom"
		border-radius="12"
		closeable="true"
		close-icon-color="#0A0F2D"
		@close="close"
	>
		<view class="popup-wrap">
			<view class="title">竞卖保证金</view>
			<view class="container">
				用户参与竞价前需要支付竞卖保证金，同时该保证金也作为您的上架保证金。
			</view>
		</view>
	</u-popup>
</template>

<script>
export default {
	props: {
		showPopup: {
			type: Boolean,
			default: false,
		},
	},
	
	data(){
		return {
			
		}
	},
	
	mounted() {
		
	},
	
	methods: {
		close() {
			this.$emit('update:showPopup', false)
		},
	}
}
</script>

<style lang="scss" scoped>
.popup-wrap {
	padding: 64rpx 64rpx 120rpx;
	.title {
		height: 60rpx;
		font-size: 20px;
		line-height: 60rpx;
		color: #141414;
		text-align: center;
		margin-bottom: 32px;
	}
}
</style>