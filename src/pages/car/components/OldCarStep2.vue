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
				<view
					v-for="carPic in specificLocationCarPicsList"
					:key="carPic.carPicsType"
				>
					<view v-if="carPic.carPicsType == selectPhotoType">
						<view class="imgs" v-if="carPic.carPicList.length">
							<view
								class="img-wrap"
								v-for="(item,index) in carPic.carPicList"
								:key="index"
							>
								<view class="img-box">
									<image
										class="car-img"
										:src="item.url"
										mode="widthFix"
									/>
									<image
										class="del-icon"
										src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_509.png"
										@click="delImg(index)"
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
										{{photoType.find(item => item.id == selectPhotoType).tip}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="btn-group">
			<view class="btn" @click="prevStep">
				上一步
			</view>
			<view class="btn next-step" @click="nextStep">
				保存
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		createData: {
			type: Object,
			default: () => ({})
		}
	},
	
	data() {
		return {
			specificLocationCarPicsList: [],
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
		}
	},
	
	mounted() {
		this.specificLocationCarPicsList = this.createData.specificLocationCarPicsList
	},
	
	methods: {
		changePhotoType(index) {
			this.selectPhotoType = index
		},
		
		getImgList(item) {
			return [item.url]
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
						this.specificLocationCarPicsList.forEach(item => {
							if (item.carPicsType == this.selectPhotoType) {
								item.carPicList.push({
									fileId: res.fileId,
									url: res.src,
									remark: '',
								})
							}
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
		
		handlerInputRemark(e, index) {
			console.log('handlerInputRemark', e)
		},
		
		delImg(index) {
			if(this.requiredImgIndex.includes(this.selectPhotoType) && this.specificLocationCarPicsList.find(item => item.carPicsType == this.selectPhotoType).carPicList.length === 1) {
				const findItem = this.photoType.find(item => item.id == this.selectPhotoType)
				uni.showToast({
					title: findItem.removeTip,
					duration: 2000,
					icon: 'none'
				})
				return
			}
			
			uni.showModal({
				title: '提示',
				content: '确定要删除这张图片吗？',
				success: (res) => {
					if (res.confirm) {
						this.specificLocationCarPicsList.find(item => item.carPicsType == this.selectPhotoType).carPicList.splice(index, 1)
					}
				}
			})
		},
		
		validate() {
			for(const item of this.specificLocationCarPicsList) {
				if (this.requiredImgIndex.includes(item.carPicsType) && item.carPicList.length === 0) {
					uni.showToast({
						title: '请'+this.photoType.find(type => type.id == item.carPicsType).tip,
						duration: 2000,
						icon: "none"
					})
					return false
				}
				
				// for(const pic of item.carPicList) {
				// 	if(!(pic.remark && pic.remark.trim())) {
				// 		uni.showToast({
				// 			title: '请输入备注',
				// 			duration: 2000,
				// 			icon: "none"
				// 		})
				// 		return false
				// 	}
				// }
			}
			
			return true
		},
		
		prevStep() {
			this.$emit('prevStep', {
				step: 0,
				specificLocationCarPicsList: this.specificLocationCarPicsList,
			})
		},
		
		nextStep() {
			if(!this.validate()) {
				return
			}
			
			this.$emit('save', {
				specificLocationCarPicsList: this.specificLocationCarPicsList,
			})
		},
		
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";	
@import "../styles/car.scss";

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