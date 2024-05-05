<template>
	<view>
		<view class="photo_wrap">
			<view class="left">
				<view
					v-for="item in photoType"
					:key="item.carPicsType"
					class="photo-type"
					:class="{'active-photo-type': item.carPicsType === selectPhotoType}"
					@click="changePhotoType(item.carPicsType)"
				>
					<view class="is-required" v-if="item.isRequired">*</view>
					{{item.text}}
				</view>
			</view>
			<view class="right">
				<view class="imgs" v-if="currentCarPic.carPicList && currentCarPic.carPicList.length">
					<view
						class="img-wrap"
						v-for="(item, index) in currentCarPic.carPicList"
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
								@click="delImg(item.fileId)"
							/>
						</view>
						<view class="remark-wrap">
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
							/>
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
								{{currentCarPic.tip}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="btn-wrap">
			<view class="bottom-btn" @click="save">下一步</view>
		</view>
	</view>
</template>

<script>
import { uploadAction } from '@/constants/index.js'

export default {
	data() {
		return {
			carId: '',
			orderId: '',
			newType: '',
			photoType: [
				{carPicsType: 0, carPicList: [], text: '左前45度', tip: '添加车辆左前45度及细节照片', removeTip: '车辆左前45度至少保留一张照片', isRequired: true},
				{carPicsType: 1, carPicList: [], text: '车辆正前', tip: '添加车辆正前及细节照片', removeTip: '车辆正前至少保留一张照片', isRequired: true},
				{carPicsType: 3, carPicList: [], text: '车辆正侧', tip: '添加车辆正侧及细节照片', removeTip: '车辆正侧至少保留一张照片', isRequired: true},
				{carPicsType: 5, carPicList: [], text: '车辆正后', tip: '添加车辆正后及细节照片', removeTip: '车辆正后至少保留一张照片', isRequired: true},
				{carPicsType: 7, carPicList: [], text: '车辆内饰', tip: '添加车辆内饰及细节照片', isRequired: false},
				{carPicsType: 2, carPicList: [], text: '右前45度', tip: '添加右前45度及细节照片', isRequired: false},
				{carPicsType: 4, carPicList: [], text: '左后45度', tip: '添加左后45度及细节照片', isRequired: false},
				{carPicsType: 6, carPicList: [], text: '右后45度', tip: '添加右后45度及细节照片', isRequired: false},
				{carPicsType: 8, carPicList: [], text: '其他细节', tip: '添加其他细节照片', isRequired: false},
			],
			selectPhotoType: 0,
			currentCarPic: {},
			requiredImgIndex: [0, 1, 3, 5],
			category: null,
		}
	},
	
	onLoad(option) {
		this.carId = option.carId
		this.orderId = option.orderId
		this.newType = option.newOrOld
		this.category = option.category
		const carPicsMap = uni.getStorageSync('carPicsMap')
		if (carPicsMap) {
			this.photoType.map(item => {
				const index = carPicsMap.findIndex(pic => pic.carPicsType === item.carPicsType)
				if (index !== -1) {
					if (carPicsMap[index].picsList && carPicsMap[index].picsList.length) {
						item.carPicList = carPicsMap[index].picsList
					}
				}
				
				return item
			})
		}
		this.currentCarPic = this.photoType[0]
	},
	
	methods: {
		changePhotoType(carPicsType) {
			this.selectPhotoType = carPicsType
			const findItem = this.photoType.find(item => item.carPicsType === carPicsType)
			if (findItem) {
				this.currentCarPic = findItem
			}
		},
		
		preview(current) {
			const urls = []
			this.currentCarPic.carPicList.forEach(item => urls.push(item.url))
			uni.previewImage({
				current,
				urls,
			})
		},
		
		delImg(fileId) {
			if(this.requiredImgIndex.includes(this.selectPhotoType) && this.currentCarPic.carPicList.length === 1) {
				uni.showToast({
					title: this.currentCarPic.removeTip,
					duration: 2000,
					icon: 'none'
				})
				return
			}
			
			const index = this.currentCarPic.carPicList.findIndex(item => item.fileId === fileId)
			if (index !== -1) {
				uni.showModal({
					title: '提示',
					content: '确定要删除这张图片吗？',
					success: (res) => {
						if (res.confirm) {
							this.currentCarPic.carPicList.splice(index, 1)
						}
					}
				})
			}
		},
		
		handlerInputRemark(e, item) {
			const index = this.currentCarPic.carPicList.findIndex(img => item.fileId === img.fileId)
			if (index !== -1) {
				this.currentCarPic.carPicList[index].remark = e.detail.value.trim()
			}
		},
		
		uploadPhoto() {
			uni.chooseImage({
				sourceType: ['album'], //从相册选择
				success: async (res) => {
					uni.showLoading({
						title: '图片上传中'
					})
					
					for(const item of res.tempFilePaths) {
						const res = await this.uploadImgFile(item)
						this.currentCarPic.carPicList.push({
							fileId: res.fileId,
							url: res.src,
							remark: '',
						})
					}
					
					uni.hideLoading()
				}
			})
		},
		
		uploadImgFile(filePath) {
			return new Promise((resolve, reject) => {
				uni.showLoading({
					title: '图片上传中'
				})
				uni.uploadFile({
					url: uploadAction,
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
		
		async save() {
			for(const item of this.photoType) {
				if(this.requiredImgIndex.includes(item.carPicsType) && item.carPicList.length === 0) {
					uni.showToast({
						title: '请'+item.tip,
						duration: 2000,
						icon: 'none'
					})
					return
				}
			}
			
			const params = {
				carId: this.carId,
				newOrOld: this.newType,
				userCarSubscribeId: this.orderId,
				specificLocationCarPicsList: this.photoType,
				category: this.category,
			}
			
			const res = await this.$getRequest(this.$url.uploadCarCheckedPics, 'POST', params)
			if (res.code == 0) {
				uni.navigateTo({
					url: `/order/orderInfo/checkConfig?carId=${this.carId}&orderId=${this.orderId}&newType=${this.newType}`
				})
			}
		},
		
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";	
@import "~@/styles/mixin.scss";	
	
.photo_wrap {
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

.btn-wrap {
	padding: 32px 32rpx 40px;
}
</style>