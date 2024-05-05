<template>
	<view>
		<view class="photo_wrap">
			<view class="left">
				<view
					v-for="item in photoType"
					:key="item.id"
					class="photo-type"
					:class="{'active-photo-type': item.id === selectPhotoType}"
					@click="changePhotoType(item.id)"
				>
					<view class="is-required" v-if="item.isRequired">*</view>
					{{item.text}}
				</view>
			</view>
			<view class="right">
				<view class="imgs" v-if="secondCarInfo.carPicsMap[selectPhotoType] && secondCarInfo.carPicsMap[selectPhotoType].length">
					<view
						class="img-wrap"
						v-for="(item, index) in secondCarInfo.carPicsMap[selectPhotoType]"
						:key="item.id"
					>
						<view class="img-box">
							<image
								class="car-img"
								:src="item.url"
								mode="widthFix"
								@click="preview(index)"
							/>
							<image
								class="del-icon"
								src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_509.png"
								@click="delImg(item.id)"
							/>
						</view>
						<view class="remark-wrap" @click="showRemarkInput(item.id)">
							<view class="icon-box">
								<image
									class="edit-icon"
									src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_497.png"
								/>
							</view>
							<input
								v-model="item.remark"
								class="input"
								placeholder="请输入备注"
								placeholder-style="font-size:12px;color:#A4AEBB;"
								maxlength="100"
								@blur="(e) => handlerInputRemark(e, item)"
							/>
							<!-- <view v-else class="remark">
								{{item.remark}}
							</view> -->
						</view>
					</view>
					<view
						class="img-wrap"
						@click="uploadPhoto"
					>
						<view class="img-box add-photo">
							<image
								style="width:64rpx;height:64rpx;"
								src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_464.png"
							/>
							<view class="tip">上传照片</view>
						</view>
					</view>
				</view>
				<view v-else>
					<view class="empty" @click="uploadPhoto">
						<view class="empty-wrap">
							<view class="empty-text">
								{{photoType.find(item => item.id === selectPhotoType).tip}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getImageInfo } from '@/utils/index'
	
export default {
	props: {
		type: {
			type: Number,
			required: true,
		},
		
		secondCarInfo: {
			type: Object,
			required: true
		},
	},
	
	watch: {
		secondCarInfo: {
			handler(value) {
				console.log('secondCarInfo', value)
				for(const key in value.carPicsMap) {
					value.carPicsMap[key].forEach(async item => {
						item.url = await getImageInfo(item.url)
					})
				}
			},
			deep: true,
			immediate: true
		}
	},
	
	data() {
		return {
			photoType: [
				{id: 0, text: '左前45度', tip: '添加车辆左前45度及细节照片', removeTip: '车辆左前45度至少保留一张照片', isRequired: true},
				{id: 1, text: '车辆正前', tip: '添加车辆正前及细节照片', removeTip: '车辆正前至少保留一张照片', isRequired: true},
				{id: 3, text: '车辆正侧', tip: '添加车辆正侧及细节照片', removeTip: '车辆正侧至少保留一张照片', isRequired: true},
				{id: 5, text: '车辆正后', tip: '添加车辆正后及细节照片', removeTip: '车辆正后至少保留一张照片', isRequired: true},
				{id: 7, text: '车辆内饰', tip: '添加车辆内饰及细节照片', isRequired: false},
				{id: 2, text: '右前45度', tip: '添加右前45度及细节照片', isRequired: false},
				{id: 4, text: '左后45度', tip: '添加左后45度及细节照片', isRequired: false},
				{id: 6, text: '右后45度', tip: '添加右后45度及细节照片', isRequired: false},
				{id: 8, text: '其他细节', tip: '添加其他细节照片', isRequired: false},
			],
			requiredImgIndex: [0, 1, 3, 5],
			selectPhotoType: 0,
			action: 'https://api.51cheyaoshi.com/merchantapp/sysFiles/upload', //图片上传地址
			canInputIndex: null,
		}
	},
	
	methods: {
		changePhotoType(index) {
			this.selectPhotoType = index
			this.canInputIndex = null
		},
		
		getImgList(item) {
			return [item.url]
		},
		
		handlerInputRemark(e, item) {
			const index = this.secondCarInfo.carPicsMap[this.selectPhotoType].findIndex(img => item.id === img.id)
			if (index !== -1) {
				this.secondCarInfo.carPicsMap[this.selectPhotoType][index].remark = e.detail.value
				this.updateCarPicsInfo()
			}
		},
		
		uploadPhoto() {
			uni.chooseImage({
				sourceType: ['album'], //从相册选择
				success: async (res) => {
					uni.showLoading({
						title: '图片上传中'
					})
					if (!this.secondCarInfo.carPicsMap[this.selectPhotoType]) {
						this.secondCarInfo.carPicsMap[this.selectPhotoType] = []
					}
					for(const item of res.tempFilePaths) {
						const res = await this.uploadImgFile(item)
						this.secondCarInfo.carPicsMap[this.selectPhotoType].push({
							fileId: res.fileId,
							url: res.src,
						})
					}
					this.updateCarPicsInfo()
				}
			})
		},
		
		uploadImgFile(filePath) {
			return new Promise((resolve, reject) => {
				uni.showLoading({
					title: '图片上传中'
				})
				uni.uploadFile({
					url: this.action,
					filePath,
					name: 'file',
					success: (uploadFileRes) => {
						const res = JSON.parse(uploadFileRes.data)
						if (res.code == 0) {
							resolve(res.data)
						}
					},
					fail: () => {
						reject('上传失败')
					},
				})
			})
		},
		
		delImg(id) {
			if(this.requiredImgIndex.includes(this.selectPhotoType) && this.secondCarInfo.carPicsMap[this.selectPhotoType].length === 1) {
				const findItem = this.photoType.find(item => item.id == this.selectPhotoType)
				uni.showToast({
					title: findItem.removeTip,
					duration: 2000,
					icon: 'none'
				})
				return
			}
			
			const index = this.secondCarInfo.carPicsMap[this.selectPhotoType].findIndex(item => item.id === id)
			if (index !== -1) {
				uni.showModal({
					title: '提示',
					content: '确定要删除这张图片吗？',
					success: (res) => {
						if (res.confirm) {
							this.secondCarInfo.carPicsMap[this.selectPhotoType].splice(index, 1)
							this.updateCarPicsInfo()
						}
					}
				})
			}
		},
		
		async updateCarPicsInfo() {
			const specificLocationCarPicsList = []
			for(let index = 0; index < this.photoType.length; index++) {
				specificLocationCarPicsList.push({
					carPicsType: index,
					carPicList: this.secondCarInfo.carPicsMap[index],
				})
			}
			const params = {
				carId: this.secondCarInfo.id,
				newOrOld: this.type,
				specificLocationCarPicsList,
			}
			
			const res = await this.$getRequest(this.$url.updateCarPicsInfo, "POST", params)
			
			if (res.code == 0) {
				this.$emit('updateImgInfo')
			}
		},
		
		showRemarkInput(index) {
			this.canInputIndex = index
		},
		
		preview(current) {
			const urls = []
			this.secondCarInfo.carPicsMap[this.selectPhotoType].forEach(item => urls.push(item.url))
			console.log('preview', current, this.secondCarInfo.carPicsMap[this.selectPhotoType], urls)
			uni.previewImage({
				current,
				urls,
			})
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";	
	
.photo_wrap {
	margin-left: -32rpx;
	width: 100vw;
	display: flex;
	.left {
		width: 204rpx;
		background: #F7F8FA;
		padding-bottom: 60px;
		.photo-type {
			width: 100%;
			height: 120rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 14px;
			color: #86909C;
			.is-required {
				font-size: 14px;
				font-weight: 500;
				color: #F53F3F;
			}
			&.active-photo-type {
				background: #fff;
				font-weight: 500;
				color: #1D2129;
				position: relative;
				&:before {
					content: '';
					position: absolute;
					top: 0;
					left: 0;
					width: 8rpx;
					height: 100%;
					background: #4170EE;
					border-radius: 0 8rpx 8rpx 0;
				}
			}
		}
	}
	.right {
		flex: 1;
		.imgs {
			flex: 1;
			padding: 24px 32rpx 0 28rpx;
			display: flex;
			flex-wrap: wrap;
		}
		.img-wrap {
			width: 232rpx;
			height: 226rpx;
			margin-right: 20rpx;
			margin-bottom: 34px;
			overflow: hidden;
			&:nth-of-type(2n) {
				margin-right: 0;
			}
			.img-box {
				width: 100%;
				height: 174rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				overflow: hidden;
				border-radius: 8rpx;
				position: relative;
				.del-icon {
					position: absolute;
					top: 0;
					right: 0;
					width: 24rpx;
					height: 24rpx;
				}
				.car-img {
					width: 100%;
				}
				.tip {
					height: 34rpx;
					font-size: 12px;
					line-height: 34rpx;
					color: #4E5969;
				}
			}
			.add-photo {
				align-items: center;
				flex-direction: column;
				background: #F7F8FA;
				border: 1px dashed #4170EE;
			}
		}
		
		.remark-wrap {
			width: 100%;
			margin-top: 16rpx;
			display: flex;
			align-items: center;
			.icon-box {
				margin-right: 8rpx;
			}
			.edit-icon {
				width: 24rpx;
				height: 24rpx;
			}
			.remark {
				flex: 1;
				width: 0;
				height: 36rpx;
				font-size: 12px;
				line-height: 36rpx;
				color: #4E5969;
				@include text-overflow;
			}
			.input {
				flex: 1;
				width: 0;
				height: 36rpx;
				min-height: 36rpx;
				font-size: 12px;
				line-height: 36rpx;
				color: #4E5969;
			}
		}
	}
}

.empty {
	width: 100%;
	display: flex;
	justify-content: center;
}
.empty-wrap {
	width: 486rpx;
	height: 364rpx;
	background: url(https://image.51cheyaoshi.com/xcx/merchant/static/product/car_shadow.png) no-repeat 100%/100%;
	.empty-text {
		padding-top: 200rpx;
		height: 44rpx;
		font-size: 12px;
		line-height: 44rpx;
		text-align: center;
		color: #4E5969;
	}
}
</style>