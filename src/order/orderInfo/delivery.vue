<template>
	<view class="page">
		<view>
			<view class="upload-wrap">
				<view class="title">请上传客户与车辆的合影照片</view>
				
				<view class="img-wrap">
					<view class="img-box" v-if="carPersonImage">
						<image
							style="width:100%;height:100%;"
							:src="carPersonImage"
							@click.stop="preview([carPersonImage])"
						/>
					</view>
					<view class="img-box add-photo" @click="uploadPhoto(index)">
						<image
							style="width:64rpx;height:64rpx;"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_464.png"
						/>
						<view class="tip">上传人车合照</view>
					</view>
				</view>
				
				<u-modal
					v-model="showModal"
					title="确认交车"
					:show-cancel-button="true"
					:mask-close-able="true"
					confirm-text="确认"
					cancel-text="取消"
					@confirm="save"
					@cancel="closeModal"
				>
					<view class="modal-content">
						<view class="modal-tip">您确定已经于 {{dateStr}} 成功将车辆交付给了用户 {{username}}。</view>
					</view>
				</u-modal>
			</view>
			
			<canvas v-if="canvasW && canvasH" :style="{
				width: `${canvasW}px`,
				height: `${canvasH}px`,
				position: 'absolute',
				top: '-10000px'
			}" canvas-id="firstCanvas" id="firstCanvas"></canvas>
		</view>
		
		<view class="btn-wrap">
			<view class="bottom-btn" @click="openModal">确 认</view>
		</view>
		
		
	</view>
</template>

<script>
import dayjs from 'dayjs'
import { uploadActionWithWaterMark, uploadAction } from '@/constants/index.js'

export default {
	data() {
		return {
			orderId: '',
			carPersonImage: '',
			username: '',
			locationAddress: {},
			currentCompany: {},
			orderCarInfo: {},
			validId: '',
			canvasW: 0,
			canvasH: 0,
			watermark: {
				type: '',
				date: '',
				location: '',
				address: '',
				carVin: '',
				carEngineNum: '',
				username: '',
			},
			showModal: false,
			dateStr: '',
		}
	},
	
	onLoad(options){
		this.orderId = options.orderId
		this.carPersonImage = options.carPersonImage
		this.username = options.username
		
		const locationAddress = uni.getStorageSync('locationAddress')
		if (locationAddress) {
			this.watermark.address = locationAddress.address
		}
		
		this.watermark.date = `拍摄时间：${dayjs().format('YYYY年MM月DD日 HH:mm:ss')}`
		
		const currentCompany = uni.getStorageSync('current_company')
		if (currentCompany) {
			this.currentCompany = currentCompany
			this.watermark.username = `验车人员：${currentCompany.username}`
		}
		
		const orderCarInfo = uni.getStorageSync('orderCarInfo')
		if (orderCarInfo) {
			this.orderCarInfo = orderCarInfo
			this.watermark.carVin = `车架号：${orderCarInfo.carVin}`
			this.watermark.carEngineNum = `发动机号：${orderCarInfo.carEngineNum}`
		}
		
		this.getDate()
	},
	
	methods: {
		getDate() {
		  const date = new Date()
			const year = date.getFullYear()
			const month = (date.getMonth()+1).toString().padStart(2, '0')
			const monthDay = (date.getDate()).toString().padStart(2, '0')
			
			const day = date.getDay()
			let dayStr = ''
			switch(day) {
				case 0: dayStr = '日'
								break
				case 1: dayStr = '一'
								break
				case 2: dayStr = '二'
								break
				case 3: dayStr = '三'
								break
				case 4: dayStr = '四'
								break
				case 5: dayStr = '五'
								break
				case 6: dayStr = '六'
								break
			}
			
			this.dateStr = `${year}年${month}月${monthDay}日 星期${dayStr}`
		},
		
		uploadPhoto(index) {
			uni.chooseImage({
				sourceType: ['album'], //从相册选择
				success: (result) => {
					uni.getImageInfo({
						src: result.tempFilePaths[0],
						success: (frame) => {
							uni.showLoading({
								title: '图片上传中'
							})
							const ctx = uni.createCanvasContext('firstCanvas')
							this.canvasW = frame.width
							this.canvasH = frame.height
							const fontSize = frame.width/30
							const bottom = 10
							ctx.drawImage(result.tempFilePaths[0], 0, 0, frame.width, frame.height)
							ctx.draw()
							ctx.beginPath()
							ctx.setFontSize(fontSize)
							
							
							ctx.setFillStyle('rgba(0,0,0,0.3)')
							ctx.fillRect(0, this.canvasH - (fontSize*6), this.canvasW, fontSize*6)
							
							ctx.setFillStyle('white')
							ctx.fillText(this.watermark.username, 10, this.canvasH - (fontSize*4) - bottom)
							ctx.fillText(this.watermark.date, 10, this.canvasH - (fontSize*3) - bottom)
							ctx.fillText(`拍摄地址：${this.watermark.address}`, 10, this.canvasH - (fontSize*2) - bottom)
							ctx.fillText(this.watermark.carEngineNum, 10, this.canvasH - fontSize - bottom)
							ctx.fillText(this.watermark.carVin, 10, this.canvasH - bottom)
							
							ctx.draw(true, () => {
								uni.canvasToTempFilePath({
								  x: 0,
									y: 0,
									width: frame.width,
									height: frame.height,
									canvasId: 'firstCanvas',
									fileType: 'jpg',
									destWidth: frame.width,
									destHeight: frame.height,
								  success: (res) => {
										uni.uploadFile({
											url: uploadAction,
											filePath: res.tempFilePath,
											name: 'file',
											success: (uploadFileRes) => {
												const res = JSON.parse(uploadFileRes.data)
												if (res.code == 0) {
													this.carPersonImage = res.data.src
												}
												uni.hideLoading()
											},
										})
								  },
								})
							})
							
						},
						fail(err) {
							console.log(err)
						}
					})
					
					
					
					
					
					
					
					
					// const params = {
					// 	userName: this.currentCompany.username,
					// 	carVin: this.orderCarInfo.carVin,
					// 	carEngineNum: this.orderCarInfo.carEngineNum,
					// 	picAddress: this.locationAddress.address,
					// 	file: result.tempFilePaths[0]
					// }
					
					// this.$getFileUpload1(uploadActionWithWaterMark, params).then(res => {
					// 	if (res.code == 0) {
					// 			this.photoType[index].carPicList = [{
					// 				fileId: res.data.fileId,
					// 				url: res.data.src,
					// 			}]
					// 	}
					// })
					
					
					
					
				}
			})
		},
		
		preview(urls) {
			uni.previewImage({
				urls,
			})
		},
		
		openModal() {
			if(!this.carPersonImage) {
				uni.showToast({
					title: '请上传人车合照',
					duration: 2000,
					icon: 'none'
				})
				return
			}
			
			this.showModal = true
		},
		
		closeModal() {
			this.showModal = false
		},
		
		async save() {
			const params = {
				businessId: this.orderId,
				carPersonImage: this.carPersonImage,
				userId: this.currentCompany.userId
			}
			
			const res = await this.$getRequest(this.$url.carDeliveryConfirm, 'POST', params)
			if (res.code == 0) {
				uni.navigateBack({
					delta: 1
				})
				this.closeModal()
			}
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
	
.page {
	padding: 16px 40rpx 40px;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.upload-wrap {
		margin-bottom: 20px;
		.title {
			margin-bottom: 12px;
			height: 44rpx;
			font-size: 15px;
			line-height: 44rpx;
			color: #0A0F2D;
		}
		.img-wrap {
			display: flex;
			justify-content: space-between;
			.img-box {
				width: 48%;
				height: 240rpx;
				border-radius: 8rpx;
			}
			.add-photo {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				background: #F7F8FA;
				border: 2rpx dashed #4170EE;
				.tip {
					margin-top: 7px;
					height: 36rpx;
					font-size: 12px;
					line-height: 36rpx;
					color: #4E5969;
				}
			}
		}
	}
}

.modal-content {
	padding: 20px 32rpx 60px;
	.modal-tip {
		font-size: 14px;
		line-height: 44rpx;
		color: #3D3D3D;
	}
}

</style>