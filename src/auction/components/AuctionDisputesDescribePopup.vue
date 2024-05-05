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
			<view class="title">上传凭证和描述</view>
			
			<view class="textarea">
				<u-input
					v-model="currentDisputes.description" 
					type="textarea" 
					:height="220"
					:maxlength="1000"
					:clearable="false"
					:auto-height="true"
					placeholder="请详细描述取消原因，有助于更快处理取消交易"
					:disabled="!(type === 1 && status === 5)"
				/>
			</view>
			
			<view class="img-container">
				<view class="img-wrap" v-for="(item, index) in currentDisputes.imageList" :key="index">
					<image
						style="width:100%;height:100%;"
						:src="item"
						mode="aspectFill"
						@click.stop="preview(index, currentDisputes.imageList)"
					/>
					<image
						v-if="type === 1 && status === 5"
						class="del-icon"
						src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_509.png"
						@click.stop="delImg(index)"
					/>
				</view>
				<view class="img-wrap add-photo" @click="uploadPhoto" v-if="type === 1 && status === 5">
					<image
						style="width:64rpx;height:64rpx;"
						src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_464.png"
					/>
					<view class="tip">上传凭证</view>
				</view>
			</view>
			
			<view class="btn" @click="save" v-if="type === 1 && status === 5">确定</view>
		</view>
	</u-popup>
</template>

<script>
import { uploadAction } from '@/constants/index.js'

export default {
	props: {
		showPopup: {
			type: Boolean,
			default: false,
		},
		
		type: {
			type: Number,
			default: 1, // 1.我 2.对方
		},
		
		disputes: {
			type: Object,
			default: () => ({})
		},
		
		status: {
			type: Number,
			default: null,
		},
	},
	
	data(){
		return {
			currentDisputes: {}
		}
	},
	
	mounted() {
		this.currentDisputes = this.disputes
	},
	
	methods: {
		close() {
			this.$emit('update:showPopup', false)
		},
		
		save() {
			if (!this.currentDisputes.description) {
				uni.showToast({
					title: '请输入取消原因',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if (!this.currentDisputes.imageList.length) {
				uni.showToast({
					title: '请上传凭证',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			this.$emit('save', this.currentDisputes)
			this.close()
		},
		
		preview(current, urls) {
			uni.previewImage({
				current,
				urls,
			})
		},
		
		delImg(index) {
			uni.showModal({
				title: '提示',
				content: '确定要删除这张图片吗？',
				success: (res) => {
					if (res.confirm) {
						this.currentDisputes.imageList.splice(index, 1)
					}
				}
			})
		},
		
		uploadPhoto() {
			uni.chooseImage({
				success: async (result) => {
					uni.showLoading({
							title: '上传中'
					})
					
					const tempFilePaths = result.tempFilePaths
					
					for(const filePath of tempFilePaths) {
						await uni.uploadFile({
							url: uploadAction,
							filePath,
							name: 'file',
							success: (uploadFileRes) => {
								const res = JSON.parse(uploadFileRes.data)
								if (res.code == 0) {
									this.currentDisputes.imageList.push(res.data.src)
								}
							},
						})
					}
					
					uni.hideLoading()
				}
			})
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
	
	.textarea {
		background: #F7F8FA;
		border-radius: 8rpx;
		padding: 16rpx 32rpx;
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

.img-container {
	margin-top: 40rpx;
	display: flex;
	flex-wrap: wrap;
	.img-wrap {
		margin-right: 2%;
		margin-bottom: 16px;
		width: 32%;
		height: 192rpx;
		border-radius: 8rpx;
		position: relative;
		.del-icon {
			position: absolute;
			top: 0;
			right: 0;
			width: 24rpx;
			height: 24rpx;
		}
	}
	.img-wrap:nth-child(3n) {
		margin-right: 0;
	}
	.add-photo {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: #F7F8FA;
		border: 2rpx dashed #4170EE;
		.tip {
			margin-top: 12rpx;
			height: 44rpx;
			font-size: 28rpx;
			line-height: 44rpx;
			color: rgba(78, 89, 105, 0.6);
		}
	}
}
</style>