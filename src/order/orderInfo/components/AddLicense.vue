<template>
	<view>
		<view class="title-wrap">
			<view class="left-border"></view>
			请上传行驶证正本照片，系统将为您自动识别
		</view>
		
		<view class="travel-license-wrap" @click="handleUploadTravelLicense">
			<image 
				v-if="travelLicenseUrl"
				class="travel-license-img"
				:src="travelLicenseUrl"
				mode="widthFix"
			/>
			<image
				v-else
				class="travel-license-img"
				src="https://image.51cheyaoshi.com/xcx/merchant/static/product/xszImg.png"
				mode="widthFix"
			/>
		</view>
		
		<view class="title-wrap" style="margin-top:20px;">
			<view class="left-border"></view>
			请确认行驶证信息（可手动修改）
		</view>
		
		<view class="item-wrap">
			<view class="item-content">
				<input
					v-model="carPlateNum"
					class="input"
					maxlength="8"
					placeholder="车牌号"
					placeholder-style="font-size:14px;color:#A4AEBB;"
				/>
			</view>
		</view>
		
		<view class="item-wrap">
			<view class="item-content">
				<input
					v-model="carVin"
					class="input"
					maxlength="30"
					placeholder="车架号"
					placeholder-style="font-size:14px;color:#A4AEBB;"
					disabled
				/>
			</view>
		</view>
		
		<view class="item-wrap">
			<view class="item-content">
				<input
					v-model="carEngineNum"
					class="input"
					maxlength="30"
					placeholder="发动机号"
					placeholder-style="font-size:14px;color:#A4AEBB;"
					disabled
				/>
			</view>
		</view>
		
		<view class="item-wrap">
			<view class="item-content">
				<input
					v-model="registerDate"
					class="input"
					placeholder="车辆注册日期"
					placeholder-style="font-size:14px;color:#A4AEBB;"
					disabled
					@click="showCalendarDate"
				/>
			</view>
		</view>
		
		<!-- <view class="item-wrap">
			<view class="item-content">
				<input
					v-model="mileage"
					class="input"
					inputmode="numeric"
					placeholder="实表里程数"
					placeholder-style="font-size:14px;color:#A4AEBB;"
				/>
			</view>
		</view> -->
		
		<view class="buttom-disabled-btn" style="margin-top:20px;">
			<button @click="nextStep">下一步</button>
		</view>
		
		<u-calendar 
			v-model="showCalendar" 
			mode="date" 
			max-date="2099-01-01"
			@change="changeDate"
		></u-calendar>
		
	</view>
</template>

<script>
import { validIntegerNum } from '@/utils/validate'
import { uploadAction } from '@/constants/index.js'

export default {
	props: {
		createData: {
			type: Object,
			default: () => ({})
		},
		
		hasCarInsurance: {
			type: String | Number,
			default: 0
		}
	},
	
	data() {
		return {
			detail: null,
			showCalendar: false,
			otherConfigs: [],
			isAgree: 0,
			showPopup: false,
			imgUrl: '',
			travelLicenseUrl: '',
			carPlateNum: '',
			carEngineNum: '',
			carVin: '',
			registerDate: '',
			mileage: '',
		}
	},
	
	computed: {
		disabled() {
			if (this.carPlateNum && this.carEngineNum && this.carVin && this.registerDate && this.travelLicenseUrl) {
				return false
			}
			
			return true
		}
	},
	
	mounted() {
		this.travelLicenseUrl = this.createData.travelLicenseUrl || ''
		this.carPlateNum = this.createData.carPlateNum || ''
		this.carEngineNum = this.createData.carEngineNum || ''
		this.carVin = this.createData.carVin || ''
		this.registerDate = this.createData.registerDate || ''
		this.mileage = this.createData.mileage || ''
		this.detail = this.createData
	},
	
	methods: {
		handleUploadTravelLicense() {
		  uni.chooseImage({
				count: 1,
		    success: async (chooseImageRes) => {
		      uni.showLoading({
		        title: '上传中'
		      });
		      const tempFilePaths = chooseImageRes.tempFilePaths;
		      const upload = await this.$getFileUpload(this.$url.getUpLoad, tempFilePaths)
					uni.hideLoading()
		      if(upload.code != 0) {
		        uni.showToast({
		          title: '识别失败，请重新上传',
		          duration: 2000,
		          icon: 'none'
		        });
		        return false
		      }
		      this.travelLicenseUrl = upload.data.src
					console.log('this.detail.travelLicenseUrl', this.travelLicenseUrl)
		      
					
					this.OCRCardImg({
							imageUrl: upload.data.src
					})
		    }
		  })
		},
		
		async OCRCardImg(params) {
		  uni.showLoading({
		    title: '上传成功，解析中'
		  })
		  const uploadInfo =  await this.$getRequest(this.$url.getLicense, 'POST', params)
			uni.hideLoading()
			// if (uploadInfo.data.carVin != this.carVin) {
			// 	uni.showToast({
			// 		title: '车架号与绑定车辆不符',
			// 		duration: 2000,
			// 		icon: "none"
			// 	})
			// 	return false
			// }
			
			// if (uploadInfo.data.carEngineNum != this.carEngineNum) {
			// 	uni.showToast({
			// 		title: '发动机号与绑定车辆不符',
			// 		duration: 2000,
			// 		icon: "none"
			// 	})
			// 	return false
			// }
			
			this.carPlateNum = uploadInfo.data.carPlateNum
			
			if (uploadInfo.data.registerDate) {
				this.registerDate = uploadInfo.data.registerDate.slice(0, 10)
			}
			
		  
		},
		
		showCalendarDate() {
		  this.showCalendar = true
		},
		
		changeDate(date) {
		  this.registerDate = date.result 
		},
		
		async validate() {
			if(!this.carEngineNum) {
				uni.showToast({
					title: '请输入发动机号',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.carVin) {
				uni.showToast({
					title: '请输入车架号',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.registerDate) {
				uni.showToast({
					title: '请选择车辆注册日期',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			// if(!this.mileage && this.mileage !== 0) {
			// 	uni.showToast({
			// 		title: '请输入实表里程数',
			// 		duration: 2000,
			// 		icon: "none"
			// 	})
			// 	return false
			// }
			
			// if(!validIntegerNum(this.mileage)) {
			// 	uni.showToast({
			// 		title: '请正确输入实表里程数',
			// 		duration: 2000,
			// 		icon: "none"
			// 	})
			// 	return false
			// }
			
			//判断车牌号是否存在
			// const carPlateNum = await this.$getRequest(this.$url.verifyCode,'POST', {
			// 	carId: this.detail.carId,
			// 	codeType: 0, //编号类型: 0 车牌号，1 发动机号，2 车架号
			// 	newOrOld: this.detail.newOrOld, //1 新车，2 二手车
			// 	verifyCode: this.detail.carPlateNum//	校验编号
			// })
			
			// if(carPlateNum.code != 0){
			// 	uni.showToast({
			// 		title: carPlateNum.msg,
			// 		duration: 2000,
			// 		icon: 'none'
			// 	})
				
			// 	return false
			// }
			
			//判断发动机号是否存在
			// const carEngineNum = await this.$getRequest(this.$url.verifyCode,'POST', {
			// 	carId: this.detail.carId,
			// 	codeType: 1, //编号类型: 0 车牌号，1 发动机号，2 车架号
			// 	newOrOld: 2, //1 新车，2 二手车
			// 	verifyCode: this.detail.carEngineNum//	校验编号
			// })
			
			// if(carEngineNum.code != 0){
			// 	uni.showToast({
			// 		title: '该发动机号已存在，请重新输入！',
			// 		duration: 2000,
			// 		icon: 'none'
			// 	})
				
			// 	return false
			// }
			
			//判断车架号是否存在
			// const carVin = await this.$getRequest(this.$url.verifyCode,'POST', {
			// 	carId: this.detail.carId,
			// 	codeType: 2, //编号类型: 0 车牌号，1 发动机号，2 车架号
			// 	newOrOld: 2, //1 新车，2 二手车
			// 	verifyCode: this.detail.carVin//	校验编号
			// })
			
			// if(carVin.code != 0){
			// 	uni.showToast({
			// 		title: carVin.msg,
			// 		duration: 2000,
			// 		icon: 'none'
			// 	})
				
			// 	return false
			// }
			
			return true
		},
		
		async nextStep() {
			if(!await this.validate()) {
				return
			}
			
			this.$emit('nextStep', {
				travelLicenseUrl: this.travelLicenseUrl,
				carPlateNum: this.carPlateNum,
				carVin: this.carVin,
				carEngineNum: this.carEngineNum,
				registerDate: this.registerDate,
				mileage: this.mileage,
				transcationNum: this.detail.transcationNum,
				carColor: this.detail.carColor,
				trimColor: this.detail.trimColor,
				accessReportUrl: this.detail.accessReportUrl,
				otherConfigs: this.otherConfigs,
			})
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "../../../pages/car/styles/car.scss";

.travel-license-wrap {
	width: 100%;
	height: 418rpx;
	border-radius: 24rpx;
	background: #0A0F2D;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	.travel-license-img {
		width: 100%;
	}
}

.step1-wrap {
	margin-top: 40px;
	width: 100%;
	height: 116rpx;
	border-radius: 16rpx;
	background: #4170EE;
	font-size: 17px;
	font-weight: 500;
	color: #FFFFFF;
	display: flex;
	justify-content: center;
	align-items: center;
}

.item-wrap {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #F7F8FA;
	border-radius: 16px;
	.item-title {
		padding-left: 32rpx;
		font-size: 14px;
		color: #86909C;
	}
}

.card .title-wrap {
	justify-content: left;
}

.input-item-wrap {
	margin-bottom: 12px;
	height: 96rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 14px;
	color: #1D2129;
	.left {
		flex: 1;
		display: flex;
		align-items: center;
		.input-wrap {
			margin-left: 8rpx;
			flex: 1;
		}
	}
	.input-wrap {
		height: 96rpx;
		line-height: 96rpx;
		border-radius: 16rpx;
		background: #F7F8FA;
		padding: 0 24rpx;
		display: flex;
		align-items: center;
	}
	.input {
		flex: 1;
		height: 96rpx;
		line-height: 96rpx;
	}
}

.add-wrap {
	margin-top: 16px;
	display: flex;
	align-items: center;
	.add {
		display: flex;
		align-items: center;
	}
	.tip {
		height: 40rpx;
		font-size: 14px;
		line-height: 40rpx;
		color: #1D2129;
		padding-left: 14rpx;
	}
}

.operator {
	margin-top: 32px;
	color: #5D5D5D;
	font-size: 12px;
	height: 44rpx;
	line-height: 44rpx;
	display: flex;
	::v-deep .u-checkbox__label {
		font-size: 12px;
		margin-right: 0;
	}
}

.popup-wrap {
	width: 100vw;
	padding: 24px 32rpx 60px;
	display: flex;
	flex-direction: column;
	align-items: center;
	.popup-title {
		height: 44rpx;
		font-size: 15px;
		line-height: 44rpx;
		color: #1D2129;
	}
	.img-wrap {
		margin-top: 16px;
		width: 408rpx;
		height: 576rpx;
		border-radius: 16rpx;
		.img-box {
			width: 100%;
			height: 100%;
		}
	}
	.btn-group {
		margin-top: 100rpx;
		width: 100%;
		justify-content: space-between;
		.btn {
			width: 326rpx;
			height: 116rpx;
			border-radius: 16rpx;
			background: #F7F8FA;
			font-size: 17px;
			color: #1D2129;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.save-btn {
			border: none;
			color: #FFFFFF;
			background: #4170EE;
		}
		button::after {
			border: none;
		}
		
		button[aria-disabled="true"] {
			background: rgba(65, 112, 238, 0.6);
		}
	}
}
</style>
