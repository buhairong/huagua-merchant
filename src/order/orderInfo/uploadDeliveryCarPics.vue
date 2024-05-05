<template>
	<view class="page">
		<view>
			<view class="upload-wrap" v-for="(item, index) in photoType" :key="item.carPicsType">
				<view class="title">{{item.text}}</view>
				
				<view class="img-wrap">
					<view class="img-box" v-if="item.carPicList.length">
						<image
							style="width:100%;height:100%;"
							:src="item.carPicList[0].url"
							@click.stop="preview([item.carPicList[0].url])"
						/>
					</view>
					<view class="img-box add-photo" @click="uploadPhoto(index)">
						<image
							style="width:64rpx;height:64rpx;"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_464.png"
						/>
						<view class="tip">上传照片</view>
					</view>
				</view>
			</view>
			
			<canvas v-if="canvasW && canvasH" :style="{
				width: `${canvasW}px`,
				height: `${canvasH}px`,
				position: 'absolute',
				top: '-10000px'
			}" canvas-id="firstCanvas" id="firstCanvas"></canvas>
		</view>
		
		<view class="btn-wrap">
			<view class="bottom-btn" @click="save">下一步</view>
		</view>
		
		
	</view>
</template>

<script>
import dayjs from 'dayjs'
import { uploadActionWithWaterMark, uploadAction } from '@/constants/index.js'

export default {
	data() {
		return {
			carId: '',
			orderId: '',
			newType: '',
			category: '',
			photoType: [
				{carPicsType: 0, carPicList: [], text: '车辆左前45度', tip: '请上传车辆左前45度照片'},
				{carPicsType: 1, carPicList: [], text: '车辆正前', tip: '请上传车辆正前照片'},
				{carPicsType: 3, carPicList: [], text: '车辆正侧', tip: '请上传车辆正侧照片'},
				{carPicsType: 5, carPicList: [], text: '车辆正后', tip: '请上传车辆正后照片'},
			],
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
		}
	},
	
	onLoad(options){
		this.orderId = options.orderId
		this.carId = options.carId
		this.newType = options.newOrOld
		this.validId = options.validId || ''
		this.category = options.category
		this.watermark.carVin = `车架号：${options.carVin || ''}`
		this.watermark.carEngineNum = `发动机号：${options.carEngineNum || ''}`
		
		const deliveryCarPicsMap = uni.getStorageSync('carPicsMap')
		console.log('deliveryCarPicsMap', deliveryCarPicsMap)
		if (deliveryCarPicsMap) {
			this.photoType.map(item => {
				const index = deliveryCarPicsMap.findIndex(pic => pic.carPicsType === item.carPicsType)
				if (index !== -1) {
					if (deliveryCarPicsMap[index].picsList && deliveryCarPicsMap[index].picsList.length) {
						item.carPicList = deliveryCarPicsMap[index].picsList
					}
				}
				
				return item
			})
		}
		
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
			this.watermark.carVin = `车架号：${orderCarInfo.carVin || options.carVin}`
			this.watermark.carEngineNum = `发动机号：${orderCarInfo.carEngineNum || options.carEngineNum}`
		}
	},
	
	methods: {
		uploadPhoto(index) {
			uni.chooseImage({
				sourceType: ['album'], //从相册选择
				success: (result) => {
					console.log('result', result)
					
					
					uni.getImageInfo({
						src: result.tempFilePaths[0],
						success: (frame) => {
							console.log(frame)
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
													this.photoType[index].carPicList = [{
														fileId: res.data.fileId,
														url: res.data.src,
													}]
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
		
		async save() {
			for(const item of this.photoType) {
				if(item.carPicList.length === 0) {
					uni.showToast({
						title: item.tip,
						duration: 2000,
						icon: 'none'
					})
					return
				}
			}
			
			const params = {
				orderId: this.orderId,
				carId: this.carId,
				newOrOld: this.newType,
				userCarSubscribeId: this.orderId,
				specificLocationCarPicsList: this.photoType,
				category: this.category,
			}
			
			const res = await this.$getRequest(this.$url.uploadCarCheckedPics, 'POST', params)
			if (res.code == 0) {
				
				if (this.category == 1) {
					uni.reLaunch({
						url: `/order/orderInfo/handoverOrderDetailInfo?id=${this.orderId}&carId=${this.carId}&newType=${this.newType}`
					})
					// uni.navigateTo({
					// 	url: `/order/orderInfo/uploadLicencPics?carId=${this.carId}&id=${this.orderId}&newOrOld=${this.newType}`
					// })
				} else {
					uni.navigateTo({
						url: `/order/orderInfo/validOrderCar1?carId=${this.carId}&orderId=${this.orderId}&newType=${this.newType}&validId=${this.validId}`
					})
				}
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

</style>