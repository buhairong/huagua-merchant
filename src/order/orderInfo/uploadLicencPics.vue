<template>
	<view class="page">
		<view>
			<view class="upload-wrap">
				<view class="title">车体发票</view>
				
				<view class="img-wrap">
					<view class="img-box" v-if="imageUrl1">
						<image
							style="width:100%;height:100%;"
							:src="imageUrl1"
							@click.stop="preview([imageUrl1])"
						/>
					</view>
					<view class="img-box add-photo" @click="uploadPhoto(1)">
						<image
							style="width:64rpx;height:64rpx;"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_464.png"
						/>
						<view class="tip">上传照片</view>
					</view>
				</view>
			</view>
			
			<view class="upload-wrap">
				<view class="title">购置税完税证明</view>
				
				<view class="img-wrap">
					<view class="img-box" v-if="imageUrl2">
						<image
							style="width:100%;height:100%;"
							:src="imageUrl2"
							@click.stop="preview([imageUrl2])"
						/>
					</view>
					<view class="img-box add-photo" @click="uploadPhoto(2)">
						<image
							style="width:64rpx;height:64rpx;"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_464.png"
						/>
						<view class="tip">上传照片</view>
					</view>
				</view>
			</view>
			
			<view class="upload-wrap" v-if="newType == 1">
				<view class="title">车辆合格证</view>
				
				<view class="img-wrap">
					<view class="img-box" v-if="imageUrl3">
						<image
							style="width:100%;height:100%;"
							:src="imageUrl3"
							@click.stop="preview([imageUrl3])"
						/>
					</view>
					<view class="img-box add-photo" @click="uploadPhoto(3)">
						<image
							style="width:64rpx;height:64rpx;"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_464.png"
						/>
						<view class="tip">上传照片</view>
					</view>
				</view>
			</view>
			
			<view class="upload-wrap">
				<view class="title">车辆登记证（大绿本）</view>
				
				<view class="img-wrap">
					<view class="img-box" v-if="imageUrl4">
						<image
							style="width:100%;height:100%;"
							:src="imageUrl4"
							@click.stop="preview([imageUrl4])"
						/>
					</view>
					<view class="img-box add-photo" @click="uploadPhoto(4)">
						<image
							style="width:64rpx;height:64rpx;"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_464.png"
						/>
						<view class="tip">上传照片</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="btn-wrap">
			<view class="bottom-btn" @click="save">完成备车</view>
		</view>
	</view>
</template>

<script>
import { uploadAction } from '@/constants/index.js'

export default {
	data() {
		return {
			id: '',
			brand: '',
			carType: '',
			carTypeYear: '',
			carTypeYearProduct: '',
			imageUrl: '',
			outColor: '',
			powerMode: '',
			carId: '',
			travelLicenseUrl: '',
			carPlateNum: '',
			carVin: '',
			carEngineNum: '',
			registerDate: '',
			mileage: '',
			newType: '',
			imageUrl1: '',
			imageUrl2: '',
			imageUrl3: '',
			imageUrl4: '',
			imageUrlList: [],
		}
	},
	
	onLoad(options){
		this.carId = options.carId
		this.powerMode = options.powerMode
		this.id = options.id
		this.newType = options.newOrOld
		this.brand = options.brand
		this.carType = options.carType
		this.carTypeYear = options.carTypeYear
		this.carTypeYearProduct = options.carTypeYearProduct
		this.imageUrl = options.imageUrl
		this.carVin = options.carVin
		this.carEngineNum = options.carEngineNum
		this.mileage = options.mileage
		this.outColor = options.outColor
		this.carPlateNum = options.carPlateNum
		
		const orderCarInfo = uni.getStorageSync('orderCarInfo')
		if (orderCarInfo && orderCarInfo.carCertificateList && orderCarInfo.carCertificateList.length) {
			this.imageUrlList = orderCarInfo.carCertificateList
			this.imageUrl1 = this.imageUrlList[0].imageUrl
			this.imageUrl2 = this.imageUrlList[1].imageUrl
			this.imageUrl3 = this.imageUrlList[2].imageUrl
			this.imageUrl4 = this.imageUrlList[3].imageUrl
		}
	},
	
	methods: {
		uploadPhoto(index) {
			uni.chooseImage({
				sourceType: ['album'], //从相册选择
				success: (result) => {
					uni.showLoading({
						title: '图片上传中'
					})
					
					uni.uploadFile({
						url: uploadAction,
						filePath: result.tempFilePaths[0],
						name: 'file',
						success: (uploadFileRes) => {
							const res = JSON.parse(uploadFileRes.data)
							if (res.code == 0) {
								this['imageUrl'+index] = res.data.src
							}
						},
					})
					
					uni.hideLoading()
				}
			})
		},
		
		preview(urls) {
			uni.previewImage({
				urls,
			})
		},
		
		async save() {
			if(!this.imageUrl1) {
				uni.showToast({
					title: '请上传车体发票',
					duration: 2000,
					icon: 'none'
				})
				return
			}
			
			if(!this.imageUrl2) {
				uni.showToast({
					title: '请上传购置税完税证明',
					duration: 2000,
					icon: 'none'
				})
				return
			}
			
			if(!this.imageUrl3 && this.newType == 1) {
				uni.showToast({
					title: '请上传车辆合格证',
					duration: 2000,
					icon: 'none'
				})
				return
			}
			
			if(!this.imageUrl4) {
				uni.showToast({
					title: '请上传车辆登记证',
					duration: 2000,
					icon: 'none'
				})
				return
			}
			
			
			
			const params = [
				{id: this.imageUrlList[0] && this.imageUrlList[0].id || '', imageUrl: this.imageUrl1, orderId: this.id, type: 1},
				{id: this.imageUrlList[1] && this.imageUrlList[1].id || '', imageUrl: this.imageUrl2, orderId: this.id, type: 2},
				{id: this.imageUrlList[2] && this.imageUrlList[2].id || '', imageUrl: this.imageUrl3, orderId: this.id, type: 3},
				{id: this.imageUrlList[3] && this.imageUrlList[3].id || '', imageUrl: this.imageUrl4, orderId: this.id, type: 4},
			]
			
			const res = await this.$getRequest(this.$url.insertOrUpdateOrderCarCertificateImage, 'POST', params)
			if (res.code == 0) {
				uni.navigateTo({
					url: `/order/orderInfo/addInsurance?id=${this.id}&carId=${this.carId}&powerMode=${this.powerMode}&newOrOld=${this.newType}&brand=${this.brand}&carType=${this.carType}&carTypeYear=${this.carTypeYear}&carTypeYearProduct=${this.carTypeYearProduct}&imageUrl=${this.imageUrl}&carPlateNum=${this.carPlateNum}&carVin=${this.carVin}&carEngineNum=${this.carEngineNum}&mileage=${this.mileage}&outColor=${this.outColor}`
				})
				// uni.reLaunch({
				// 	url: `/order/orderInfo/handoverOrderDetailInfo?id=${this.id}&carId=${this.carId}&newType=${this.newType}`
				// })
				// uni.navigateTo({
				// 	url: `/order/orderInfo/addLicense?carId=${this.carId}&powerMode=${this.powerMode}&id=${this.id}&newOrOld=${this.newType}&brand=${this.brand}&carType=${this.carType}&carTypeYear=${this.carTypeYear}&carTypeYearProduct=${this.carTypeYearProduct}&imageUrl=${this.imageUrl}&carVin=${this.carVin}&carEngineNum=${this.carEngineNum}&mileage=${this.mileage}&outColor=${this.outColor}`
				// })
				
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