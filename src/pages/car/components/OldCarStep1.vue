<template>
	<view>
		<!-- <view class="title-wrap">
			<view class="left-border"></view>
			请上传行驶证正本照片，系统将为您自动识别
		</view>
		
		<view class="travel-license-wrap" @click="handleUploadTravelLicense">
			<image 
				v-if="detail.travelLicenseUrl"
				class="travel-license-img"
				:src="detail.travelLicenseUrl"
				mode="widthFix"
			/>
			<image
				v-else
				class="travel-license-img"
				src="https://image.51cheyaoshi.com/xcx/merchant/static/product/xszImg.png"
				mode="widthFix"
			/>
		</view> -->
		
		<view class="title-wrap">
			<view class="left-border"></view>
			车辆信息
		</view>
		
		<view class="item-wrap">
			<view class="item-title">发动机号</view>
			<view class="item-content">
				<input
					v-model="detail.carEngineNum"
					class="input"
					maxlength="30"
					placeholder="请输入发动机号"
					placeholder-style="font-size:14px;color:#A4AEBB;"
				/>
			</view>
		</view>
		
		<view class="item-wrap">
			<view class="item-title">车架号</view>
			<view class="item-content">
				<input
					v-model="detail.carVin"
					class="input"
					maxlength="30"
					placeholder="请输入车架号"
					placeholder-style="font-size:14px;color:#A4AEBB;"
				/>
			</view>
		</view>
		
		<view class="item-wrap">
			<view class="item-title">车牌号</view>
			<view class="item-content">
				<input
					v-model="detail.carPlateNum"
					class="input"
					maxlength="30"
					placeholder="请输入车牌号"
					placeholder-style="font-size:14px;color:#A4AEBB;"
				/>
			</view>
		</view>
		
		<view class="item-wrap">
			<view class="item-title">首次上牌日期</view>
			<view class="item-content">
				<input
					v-model="detail.registerDate"
					class="input"
					placeholder="请选择首次上牌日期"
					placeholder-style="font-size:14px;color:#A4AEBB;"
					disabled
					@click="showCalendarDate"
				/>
			</view>
		</view>
		
		<view class="item-wrap">
			<view class="item-title">过户次数</view>
			<view class="item-content">
				<input
					v-model="detail.transcationNum"
					class="input"
					type="digit"
					inputmode="numeric"
					placeholder="请输入过户次数"
					placeholder-style="font-size:14px;color:#A4AEBB;"
				/>
			</view>
		</view>
		
		<view class="item-wrap">
			<view class="item-title">实表里程数</view>
			<view class="item-content">
				<input
					v-model="detail.mileage"
					class="input"
					type="digit"
					inputmode="numeric"
					placeholder="请输入实表里程数"
					placeholder-style="font-size:14px;color:#A4AEBB;"
				/>
			</view>
		</view>
		
		<view class="item-wrap">
			<view class="item-title">外观颜色</view>
			<view class="item-content">
				<input
					v-model="detail.carColor"
					class="input"
					maxlength="30"
					placeholder="请输入外观颜色"
					placeholder-style="font-size:14px;color:#A4AEBB;"
				/>
			</view>
		</view>
		
		<view class="item-wrap">
			<view class="item-title">内饰颜色</view>
			<view class="item-content">
				<input
					v-model="detail.trimColor"
					class="input"
					maxlength="30"
					placeholder="请输入内饰颜色"
					placeholder-style="font-size:14px;color:#A4AEBB;"
				/>
			</view>
		</view>
		
		<!-- <view class="card">
			<view class="title-wrap">
				<view class="left-border"></view>
				车辆增配项
			</view>
			
			<view
				class="input-item-wrap"
				v-for="(item, index) in otherConfigs"
				:key="item.id"
			>
				<view class="left">
					<view @click="del(item.id)">
						<u-icon name="minus-circle-fill" color="rgba(29, 33, 41, 0.6)" size="40"></u-icon>
					</view>
					<view class="input-wrap">
						<input
							v-model="item.detailName"
							class="input"
							placeholder="请输入增配项"
							placeholder-style="font-size:14px;color:#A4AEBB;"
							maxlength="20"
							@input="(e) => handlerInputDetailName(e, item, index)"
						/>
					</view>
				</view>
			</view>
			
			<view class="add-wrap" >
				<view class="add" @click="add">
					<u-icon name="plus-circle-fill" color="#4170EE" size="40"></u-icon>
					<view class="tip">更多增配项</view>
				</view>
			</view>
		</view> -->
		
		<view class="operator">
			<u-checkbox-group>
				<u-checkbox 
					v-model="isAgree" 
					name="1"
					@change="checkboxChange" 
				>
					我承诺此车辆有车况承保的评估报告
				</u-checkbox>
			</u-checkbox-group>
		</view>
		
		<view class="buttom-disabled-btn" style="margin-top:20px;">
			<button :disabled="disabled" @click="nextStep">下一步</button>
		</view>
		
		<u-calendar 
			v-model="showCalendar" 
			mode="date" 
			max-date="2099-01-01"
			@change="changeDate"
		></u-calendar>
		
		<u-popup border-radius="14" mode="bottom" v-model="showPopup">
			<view class="popup-wrap">
				<view class="popup-title">请上传可为车况承保的评估报告</view>
				<view class="img-wrap" @click="uploadPhoto">
					<view class="img-box" v-if="detail.accessReportUrl">
						<image
							style="width:100%;height:100%;"
							:src="detail.accessReportUrl"
							mode="aspectFit"
						/>
					</view>
					<view class="img-box add-photo" v-else>
						<image
							style="width:100%;height:100%;"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/home/assessment.png"
						/>
					</view>
				</view>
				<view class="btn-group">
					<view class="btn" @click="closePopup">取消</view>
					<button class="btn save-btn" :disabled="!detail.accessReportUrl" @click="saveImg">保存</button>
				</view>
			</view>
		</u-popup>
		
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
			detail: {},
			showCalendar: false,
			otherConfigs: [],
			isAgree: 0,
			showPopup: false,
		}
	},
	
	computed: {
		disabled() {
			if (this.isAgree && this.detail.carEngineNum && this.detail.carVin && this.detail.registerDate && 
					this.detail.transcationNum && this.detail.mileage && this.detail.carColor && this.detail.trimColor &&
					this.detail.accessReportUrl
			) {
				return false
			}
			
			return true
		}
	},
	
	watch: {
		createData: {
			handler(value) {
				if (value.otherConfigList && value.otherConfigList.length) {
					this.otherConfigs = value.otherConfigList[0].details
				}
			
			},
			deep: true,
			immediate: true
		}
	},
	
	mounted() {
		this.detail = this.createData
	},
	
	methods: {
		handleUploadTravelLicense() {
		  uni.vibrateShort();
		  
		  uni.chooseImage({
				count: 1,
		    success: async (chooseImageRes) => {
		      uni.showLoading({
		        title: '上传中'
		      });
		      const tempFilePaths = chooseImageRes.tempFilePaths;
		      const upload = await this.$getFileUpload(this.$url.getUpLoad, tempFilePaths)
		
		      console.log(upload)
		
		      if(upload.code != 0) {
		        uni.showToast({
		          title: '识别失败，请重新上传',
		          duration: 2000,
		          icon: 'none'
		        });
		        return false;
		      }
		      this.detail.travelLicenseUrl = upload.data.src
		      uni.hideLoading()
					
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
			this.detail.carPlateNum = uploadInfo.data.carPlateNum
			this.detail.carVin = uploadInfo.data.carVin
			this.detail.carEngineNum = uploadInfo.data.carEngineNum
			this.detail.registerDate = uploadInfo.data.registerDate.slice(0, 10)
		  
		},
		
		showCalendarDate() {
		  this.showCalendar = true
		},
		
		changeDate(date) {
		  this.detail.registerDate = date.result 
		},
		
		async validate() {
			if(!this.detail.carEngineNum) {
				uni.showToast({
					title: '请输入发动机号',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.detail.carVin) {
				uni.showToast({
					title: '请输入车架号',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.detail.registerDate) {
				uni.showToast({
					title: '请选择上牌日期',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.detail.transcationNum && this.detail.transcationNum !== 0) {
				uni.showToast({
					title: '请输入过户次数',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!validIntegerNum(this.detail.transcationNum)) {
				uni.showToast({
					title: '请正确输入过户次数',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.detail.mileage && this.detail.mileage !== 0) {
				uni.showToast({
					title: '请输入实表里程数',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!validIntegerNum(this.detail.mileage)) {
				uni.showToast({
					title: '请正确输入实表里程数',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.detail.carColor) {
				uni.showToast({
					title: '请输入外观颜色',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.detail.trimColor) {
				uni.showToast({
					title: '请输入内饰颜色',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			//判断车牌号是否存在
			// const carPlateNum = await this.$getRequest(this.$url.verifyCode,'POST', {
			// 	carId: this.detail.carId,
			// 	codeType: 0, //编号类型: 0 车牌号，1 发动机号，2 车架号
			// 	newOrOld: 2, //1 新车，2 二手车
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
			const carEngineNum = await this.$getRequest(this.$url.verifyCode,'POST', {
				carId: this.detail.carId,
				codeType: 1, //编号类型: 0 车牌号，1 发动机号，2 车架号
				newOrOld: 2, //1 新车，2 二手车
				verifyCode: this.detail.carEngineNum//	校验编号
			})
			
			if(carEngineNum.code != 0){
				uni.showToast({
					title: '该发动机号已存在，请重新输入！',
					duration: 2000,
					icon: 'none'
				})
				
				return false
			}
			
			//判断车架号是否存在
			const carVin = await this.$getRequest(this.$url.verifyCode,'POST', {
				carId: this.detail.carId,
				codeType: 2, //编号类型: 0 车牌号，1 发动机号，2 车架号
				newOrOld: 2, //1 新车，2 二手车
				verifyCode: this.detail.carVin//	校验编号
			})
			
			if(carVin.code != 0){
				uni.showToast({
					title: carVin.msg,
					duration: 2000,
					icon: 'none'
				})
				
				return false
			}
			
			return true
		},
		
		add() {
			let maxId = 1
			for(const item of this.otherConfigs) {
				if (item.id > maxId) {
					maxId = item.id
				}
			}
			
			maxId += 1
			
			this.otherConfigs.push(
				{
					id: maxId,
					detailName: "",
					hasCheck: 1,
					money: undefined,
				}
			)
		},
		
		del(id) {
			const index = this.otherConfigs.findIndex(item => item.id === id)
			if (index !== -1) {
				uni.showModal({
					title: '提示',
					content: '确定要删除这个增配项吗？',
					success: (res) => {
						if (res.confirm) {
							this.otherConfigs.splice(index, 1)
						}
					}
				})
			}
		},
		
		handlerInputDetailName(e, item, index) {
			this.otherConfigs[index].detailName = e.detail.value
		},
		
		checkboxChange(e) {
			if (e.value) {
				this.showPopup = true
			}
		},
		
		closePopup() {
			if (!this.detail.accessReportUrl) {
				this.isAgree = 0
			}
			this.showPopup = false
		},
		
		saveImg() {
			this.showPopup = false
		},
		
		uploadPhoto() {
			uni.chooseImage({
				success: (result) => {
					console.log('result', result)
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
								this.detail.accessReportUrl = res.data.src
							}
						},
						fail: () => {
							reject('上传失败')
						},
					})
					
					uni.hideLoading()
				}
			})
		},
		
		async nextStep() {
			if(!await this.validate()) {
				return
			}
			
			this.$emit('nextStep', {
				step: 1,
				travelLicenseUrl: this.detail.travelLicenseUrl,
				carPlateNum: this.detail.carPlateNum,
				carVin: this.detail.carVin,
				carEngineNum: this.detail.carEngineNum,
				registerDate: this.detail.registerDate,
				mileage: this.detail.mileage,
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
@import "../styles/car.scss";

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
