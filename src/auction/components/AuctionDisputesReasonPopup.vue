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
			<view class="title">选择取消原因</view>
			<u-radio-group v-model="currentReason" class="radio-group">
				<view class="radio-item" v-for="(item, index) in disputesList" :key="index" >
					<u-radio :name="item.label">{{item.label}}</u-radio>
				</view>
			</u-radio-group>
			
			<view class="btn" @click="save">确定</view>
		</view>
	</u-popup>
</template>

<script>
import { disputesList } from '@/constants/index.js'
	
export default {
	props: {
		showPopup: {
			type: Boolean,
			default: false,
		},
		
		reason: {
			type: String,
			default: '',
		},
	},
	
	data(){
		return {
			disputesList,
			currentReason: '',
		}
	},
	
	mounted() {
		this.currentReason = this.reason
	},
	
	methods: {
		close() {
			this.$emit('update:showPopup', false)
		},
		
		save() {
			if (!this.currentReason) {
				uni.showToast({
					title: '请选择取消原因',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			
			this.$emit('save', this.currentReason)
			this.close()
		},
	}
}
</script>

<style lang="scss" scoped>
.radio-item {
	margin-bottom: 16rpx;
	display: flex;
}

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
	
	.btn {
		margin-top: 80rpx;
		height: 80rpx;
		border-radius: 16rpx;
		background: #4170EE;
		color: #FFFFFF;
		font-size: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>