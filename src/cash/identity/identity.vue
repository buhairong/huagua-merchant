<template>
  <view class="page-wrap">
		<u-section
			title="请上传清晰、无反光、无遮挡的证件照片"
			:right="false"
			line-color="#0A0F2D"
		/>
		
		<view class="identity-wrap">
			<view class="identity-card" @click="handleUploadFace(1)">
				<image
					v-if="form.idcardUrl"
					style="width:100%;height:100%;"
					:src="form.idcardUrl"
					mode="aspectFill"
				/>
				<image
					v-else
					style="width:100%;height:100%;"
					src="https://image.51cheyaoshi.com/xcx/app/static/home/717.png"
					mode="aspectFill"
				/>
			</view>
			<view class="identity-card" @click="handleUploadFace(2)">
				<image
					v-if="form.idcardBackUrl"
					style="width:100%;height:100%;"
					:src="form.idcardBackUrl"
					mode="aspectFill"
				/>
				<image
					v-else
					style="width:100%;height:100%;"
					src="https://image.51cheyaoshi.com/xcx/app/static/home/718.png"
					mode="aspectFill"
				/>
			</view>
		</view>
		
		<u-section
			title="请确认身份信息"
			:right="false"
			line-color="#0A0F2D"
		/>
		
		<view class="form">
			<view class="form-item-wrap">
				<view class="item-title">姓名</view>
				<view class="item-content">
					<input
						v-model="form.realName"
						class="input"
						maxlength="10"
						placeholder="请输入姓名"
						placeholder-style="font-size:14px;color:#A4AEBB;"
					/>
				</view>
			</view>
			
			<view class="form-item-wrap">
				<view class="item-title">身份证号</view>
				<view class="item-content">
					<input
						v-model="form.idcard"
						class="input"
						type="idcard"
						maxlength="30"
						placeholder="请输入身份证号"
						placeholder-style="font-size:14px;color:#A4AEBB;"
					/>
				</view>
			</view>
			
			<view class="form-item-wrap">
				<view class="item-title">有效期</view>
				<view class="item-content item-content1">
					<u-checkbox
						v-model="form.permanent"
						@change="checkboxChange"
					>
						永久有效
					</u-checkbox>
					<view v-if="!form.permanent" @click="openPicker">
						{{ form.idcardValidityTimeEnd || '请选择有效期' }}
					</view>
				</view>
				
				<u-picker
					v-model="showPicker"
					mode="time"
					@confirm="handleTime"
				/>
			</view>
		</view>
		
		<view class="fixed-buttom-disabled-btn">
			<button :disabled="disabled" @click="goFacePage">立即认证</button>
		</view>
  </view>
</template>

<script>
import dayjs from 'dayjs'
import { uploadAction } from '@/constants/index.js'

export default {
	name: 'IdentityCard',
		
	data() {
		return {
			form: {
				idcardUrl: '',
				idcardBackUrl: '',
				realName: '',
				idcard: '',
				idcardValidityTimeStart: '',
				idcardValidityTimeEnd: '',
				permanent: 0, // 身份证是否永久有效，0不是，1是
			},
			showPicker: false,
		}
	},
	
	computed: {
		disabled() {
			return !(this.form.idcardUrl && this.form.idcardBackUrl && this.form.realName && this.form.idcard && (this.form.permanent || this.form.idcardValidityTimeEnd))
		},
	},
	
	onLoad(option) {
			
	},
		
	onShow() {
			
	},
		
	methods: {
		// type   1： 前   2： 后
		handleUploadFace(type) {
			uni.chooseImage({
				success: (result) => {
					uni.showLoading({
						title: '上传中'
					})
					
					uni.uploadFile({
						url: uploadAction,
						filePath: result.tempFilePaths[0],
						name: 'file',
						success: (uploadFileRes) => {
							const res = JSON.parse(uploadFileRes.data)
							if (res.code == 0) {
								if (type === 1) {
									this.form.idcardUrl = res.data.src
								} else {
									this.form.idcardBackUrl = res.data.src
								}
								this.OCRCardImg(res.data.src, type)
							}
						},
					})
				}
			})
		},
		
		async OCRCardImg(src, type) {
			let params = {
				idcardImageUrl: src
			}
			
			if (type === 2) {
				params = {
					idcardBackImageUrl: src
				}
			}
			
			const res =  await this.$getRequest(this.$url.ocrIdcard, 'POST', params)
			uni.hideLoading()
			if (type === 1) {
				this.form.realName = res.data.resultJSON.name
				this.form.idcard = res.data.resultJSON.num
			} else {
				this.form.idcardValidityTimeStart = res.data.resultJSON.start_date
				this.form.idcardValidityTimeEnd = res.data.resultJSON.end_date
				this.form.permanent = res.data.resultJSON.is_fake
			}
		},
		
		checkboxChange() {
			this.form.permanent = !this.form.permanent
			if(this.form.permanent) {
					this.form.idcardValidityTimeEnd = ''
			}
		},
		
		openPicker() {
			this.showPicker = true
		},
		
		handleTime(obj) {
			const {year, month, day} = obj
			this.form.idcardValidityTimeEnd = `${year}-${month}-${day}`
		},
		
		async goFacePage() {
			// uni.setStorageSync('identityInfo', this.form)
			// uni.navigateTo({
			// 	url: '/cash/identity/face-identity-tip',
			// })
			
			const result = await this.$getRequest(this.$url.userAuditSubmit, 'POST', this.form)
			if(result.code == 0){
				uni.reLaunch({
					url: `/cash/card/bindcard?realName=${this.username}`,
				})
			}
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	padding-bottom: 140rpx;
	.identity-wrap {
		margin-top: 12px;
		margin-bottom: 40px;
		display: flex;
		justify-content: space-between;
		.identity-card {
			width: 320rpx;
			height: 200rpx;
			border-radius: 24rpx;
		}
	}
	.form {
		margin-top: 12px;
		.item-content {
			justify-content: space-between;
		}
	}
}
</style>
