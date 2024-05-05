<template>
	<view class="page-wrap">
		<view class="title-wrap">
			<view class="left-border"></view>
			点击上传电子保单或照片
		</view>
		
		<view class="insurance-pics-list">
			<view 
				class="insurance-img-wrap"
				v-for="item in insuranceDetail.insuranceInfo.insurancePicsList"
				:key="item.fileId"
			>
				<view class="del-icon-wrap" @click="removeImg(item.fileId)">
					<u-icon name="close-circle-fill" color="#606266" size="48"></u-icon>
				</view>
				<image
					class="insurance-img"
					:src="item.url"
					mode="widthFix"
				/>
			</view>
			<image
				class="insurance-img"
				src="https://image.51cheyaoshi.com/xcx/merchant/static/product/Group_1.png"
				mode="widthFix"
			  @click="handleUploadInsuranceImg"
			/>
		</view>
		
		<view class="title-wrap">
			<view class="left-border"></view>
			请确认保险信息
		</view>
		
		<view class="company-item-wrap">
			投保公司
			<view class="right-item" @click="selectInsuranceCompany">
				<view class="company-name">
					{{insuranceDetail.insuranceInfo.insuranceCompanyName ? insuranceDetail.insuranceInfo.insuranceCompanyName : '请选择投保公司'}}
				</view>
				<u-icon name="arrow-right" color="rgba(10, 15, 45, 0.5)" size="28"></u-icon>
			</view>
		</view>
		
		<view class="item-wrap">
			<view class="item-content">
				<view class="title">
					保单号
				</view>
				<input
					v-model="insuranceDetail.insuranceInfo.insuranceNo"
					class="input"
					maxlength="50"
					placeholder="请输入保单号"
					placeholder-style="font-size:14px;color:#A4AEBB;"
				/>
			</view>
		</view>
		
		<view class="item-wrap" v-if="insuranceType == 1">
			<view class="item-content">
				<view class="title">
					三者金额
				</view>
				<view class="input-wrap">
					<input
						v-model="insuranceDetail.insuranceInfo.amountOfThree"
						type="number"
						class="input"
						placeholder="请输入三者金额"
						placeholder-style="font-size:14px;color:#A4AEBB;"
					/>
					<view class="unit">元</view>
				</view>
			</view>
		</view>
		
		<view class="item-wrap">
			<view class="item-content">
				<view class="title">
					有效期
				</view>
				<input
					v-model="insuranceDetail.insuranceInfo.expireDate"
					class="input"
					placeholder="请输入有效期"
					placeholder-style="font-size:14px;color:#A4AEBB;"
					disabled
					@click="showCalendarDate"
				/>
			</view>
		</view>
		
		<view class="btn" @click="save">{{operator == 'add' ? '确认添加' : '确认修改'}}</view>
		
		<u-picker 
			v-model="showInsuranceCompanyPicker"
			mode="selector"
			:range="actionSheetList"
			range-key="insuranceName"
			@confirm="changeInsuranceCompany"
		></u-picker>
		
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
	
export default {
	data() {
		return {
			insuranceTypeList: ['机动车交强险保单', '机动车商业险保单'], // 保单类别：0 机动车交强险，1 机动车商业险
			insuranceType: null,
			insuranceDetail: {
				carId: null, // 车辆ID
				insuranceId: null, // 保单id
				newOrOld: 2, // 新车or二手车标识：1 新车，2 二手车
				insuranceInfo: {
					amountOfThree: undefined, // 三者金额
					expireDate: '', // 保险失效日期
					insuranceCompany: '', // 保险公司
					insuranceCompanyName: '', // 保险公司
					insuranceNo: '', // 保单单号
					insuranceType: null, // 保单类别：0 机动车交强险，1 机动车商业险
					insurancePicsList: [], // 保单图片集合
				},
			},
			actionSheetList: [],
			showInsuranceCompanyPicker: false,
			showCalendar: false,
			operator: 'add',
		}
	},
	
	onLoad(options) {
		this.insuranceType = options.insuranceType
		
		uni.setNavigationBarTitle({
			title: this.insuranceTypeList[this.insuranceType]
		})
		this.insuranceDetail.insuranceInfo.insuranceType = options.insuranceType
		this.insuranceDetail.carId = options.carId
		this.insuranceDetail.newOrOld = options.newOrOld
		
		
		this.operator = options.operator
		
		if (this.operator === 'update') {
			try {
				const value = uni.getStorageSync('insurance_detail')
				
				if (value) {
					const detail = JSON.parse(value)
					
					this.insuranceDetail.insuranceId = detail.id
					this.insuranceDetail.insuranceInfo.amountOfThree = detail.amountOfThree
					this.insuranceDetail.insuranceInfo.expireDate = detail.expireDate
					this.insuranceDetail.insuranceInfo.insuranceCompany = detail.insuranceCompany
					this.insuranceDetail.insuranceInfo.insuranceCompanyName = detail.insuranceCompanyName
					this.insuranceDetail.insuranceInfo.insuranceNo = detail.insuranceNo
					this.insuranceDetail.insuranceInfo.insurancePicsList = detail.insurancePicsList
				}
			} catch (e) {
				// error
			}
		}
	},
	
	onShow() {
		this.getInsCompany()
	},
	
	methods: {
		// 获取保险公司列表
		async getInsCompany(){
			const res =  await this.$getRequest(this.$url.listInsuranceCompany, 'POST', {})
			this.actionSheetList = res.data
		},
		
		selectInsuranceCompany() {
			this.showInsuranceCompanyPicker = true
		},
		
		changeInsuranceCompany(index) {
			this.insuranceDetail.insuranceInfo.insuranceCompany = this.actionSheetList[index].id
			this.insuranceDetail.insuranceInfo.insuranceCompanyName = this.actionSheetList[index].insuranceName
		},
		
		handleUploadInsuranceImg() {
			uni.vibrateShort();
			uni.chooseImage({
				success: async (chooseImageRes) => {
					uni.showLoading({
						title: '上传中'
					})
					const tempFilePaths = chooseImageRes.tempFilePaths
					
					tempFilePaths.forEach(async item => {
						const upload = await this.$getFileUpload(this.$url.getUpLoad, [item])
						if(upload.code == 0) {
							this.insuranceDetail.insuranceInfo.insurancePicsList.push({
								fileId: upload.data.fileId,
								url: upload.data.src,
							})
						} else {
							uni.showToast({
								title: '上传失败，请重新上传',
								duration: 2000,
								icon: 'none'
							})
						}
					})
					
					uni.hideLoading()
			 }
		 })
		},
		
		removeImg(fileId) {
			const index = this.insuranceDetail.insuranceInfo.insurancePicsList.findIndex(item => item.fileId === fileId)
			if (index !== -1) {
				uni.showModal({
					title: '提示',
					content: '确定要删除这张图片吗？',
					success: (res) => {
						if (res.confirm) {
							this.insuranceDetail.insuranceInfo.insurancePicsList.splice(index, 1)
						}
					}
				})
			}
		},
		
		showCalendarDate() {
		  this.showCalendar = true
		},
		
		changeDate(date) {
		  this.insuranceDetail.insuranceInfo.expireDate = date.result 
		},
		
		validate() {
			if(!this.insuranceDetail.insuranceInfo.insuranceCompany) {
				uni.showToast({
					title: '请选择投保公司',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(this.insuranceDetail.insuranceInfo.insurancePicsList.length === 0) {
				uni.showToast({
					title: '请上传保单图片',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.insuranceDetail.insuranceInfo.insuranceNo.trim()) {
				uni.showToast({
					title: '请输入保单号',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if (this.insuranceType == 1) {
				if(!this.insuranceDetail.insuranceInfo.amountOfThree && this.insuranceDetail.insuranceInfo.amountOfThree != 0) {
					uni.showToast({
						title: '请输入三者金额',
						duration: 2000,
						icon: "none"
					})
					return false
				}
				
				if(!validIntegerNum(this.insuranceDetail.insuranceInfo.amountOfThree)) {
					uni.showToast({
						title: '请正确输入三者金额',
						duration: 2000,
						icon: "none"
					})
					return false
				}
			}
			
			if(!this.insuranceDetail.insuranceInfo.expireDate) {
				uni.showToast({
					title: '请输入保单有效期',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			return true
		},
		
		async save() {
			if(!this.validate()) {
				return
			}
			
			uni.showLoading({
				title: '上传中'
			})
			
			let url = this.$url.updateCarInsuranceInfo
			
			if (this.operator == 'update') {
				url = this.$url.updateCarInsuranceInfoWithOnSheet
			}
			
			const data = await this.$getRequest(url, 'POST', this.insuranceDetail)
			
			uni.hideLoading()
			
			if(data.code == 0){
				uni.showToast({
				    title: '保存成功',
				    duration: 2000
				})
				
				this.$u.route({
				    type: 'navigateBack',
				    delta: 1
				})
			} else {
				uni.showToast({
				    title: '保存失败',
				    duration: 2000
				})
			}
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "styles/car.scss";

.page-wrap {
	padding-top: 0;
	.title-wrap {
		margin: 12px 0;
		font-size: 15px;
	}
	.company-item-wrap {
		margin-bottom: 12px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 96rpx;
		background: #F7F8FA;
		padding: 0 32rpx;
		font-size: 15px;
		color: rgba(10, 15, 45, 0.5);
		.right-item {
			display: flex;
			align-items: center;
			.company-name {
				color: #1D2129;
				padding-right: 16rpx;
			}
			u-icon {
				display: unset;
			}
		}
	}
	.insurance-pics-list {
		margin-top: 16px;
		.insurance-img {
			width: 100%;
			margin-bottom: 12px;
		}
		.insurance-img-wrap {
			position: relative;
			.del-icon-wrap {
				position: absolute;
				top: -16rpx;
				right: -16rpx;
			}
		}
	}
	
	.item-wrap {
		.item-content {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 104rpx;
			background: rgba(10, 15, 45, 0.04);
			padding: 0 32rpx;
			.title {
				font-size: 15px;
				color: #86909C;
			}
			.input-wrap {
				flex: 1;
				display: flex;
				align-items: center;
			}
			.input {
				flex: 1;
				height: 104rpx;
				line-height: 104rpx;
				text-align: right;
				padding-right: 0;
			}
			.unit {
				font-size: 15px;
				color: #1D2129;
			}
		}
	}
	
	.btn {
		margin-top: 20px;
		width: 100%;
		height: 116rpx;
		border-radius: 16rpx;
		background: #4170EE;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 17px;
		color: #FFFFFF;
	}
}
</style>