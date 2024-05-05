<template>
	<view class="page-wrap">
		<view class="header">
			<view
			    class="status-bar"
			    :style="{ height: custom.top + 'px' }"
			/>
			<view class="nav">
				<view class="back-btn" @click="back">
					<u-icon name="arrow-left" color="#000000" size="40"></u-icon>
				</view>
				{{validJSON[firstMenuIndex].title || '车架号照片'}}
			</view>
		</view>
		
		<view class="main" :style="{marginTop: custom.top + 52 + 'px'}">
			<view class="first-menu" v-for="(firstMenu, index1) in validJSON" :key="index1">
				<view v-if="firstMenuIndex === index1">
					<view v-if="firstMenuIndex === 0">
						<view class="title">{{firstMenu.name}}</view>
						<view class="img-container">
							<view class="img-box" v-if="firstMenu.url">
								<image
									style="width:100%;height:100%;margin-right:2%;"
									:src="firstMenu.url"
									mode="aspectFill"
									@click.stop="preview([firstMenu.url])"
								/>
							</view>
							<view class="img-box add-photo" @click="uploadPhoto()" v-if="type !== 'review'">
								<image
									style="width:64rpx;height:64rpx;"
									src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_464.png"
								/>
								<view class="tip">{{firstMenu.uploadTip}}</view>
							</view>
						</view>
					</view>
					<view v-else>
						<view class="second-menu" v-for="(secondMenu, index2) in firstMenu.children" :key="index2">
							<view class="second-menu-item">
								<view class="second-menu-item-name">{{secondMenu.name}}</view>
								<view class="second-menu-item-status-list">
									<view 
										v-for="status in secondMenu.statusList" 
										:key="status.id" 
										class="status" 
										:class="{
											'status-active': secondMenu.status === status.id, 
											'status-active-dot': showDot(secondMenu, status.id)
										}"
										@click="changeStatus(status, index2)"
									>
										{{status.label}}
									</view>
								</view>
							</view>
							
							<view class="tyre" v-if="secondMenu.type === 'tyre'">
								<view class="left">轮胎信息</view>
								<view class="right" @click="openBrandList()">
									<view class="brand" v-if="secondMenu.brand">{{secondMenu.brand}} {{secondMenu.size}}</view>
									<view class="placeholder" v-else>请选择品牌、尺寸</view>
									<view class="icon-wrap" v-if="type !== 'review'">
										<u-icon name="arrow-right" color="rgba(0, 0, 0, 0.9)" size="28"></u-icon>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="fixed-buttom-disabled-btn-group">
			<view class="cancel-btn" @click="back" v-if="firstMenuIndex !== 0">
				<u-icon name="arrow-left" color="rgba(0, 0, 0, 0.9)" size="40"></u-icon>
			</view>
			<button :disabled="disabled" @click="save">{{firstMenuIndex === validJSON.length - 1 ? '完成验车' : '下一项'}}（{{firstMenuIndex + 1}}/{{validJSON.length}})</button>
		</view>
		
		<canvas v-if="canvasW && canvasH" :style="{
			width: `${canvasW}px`,
			height: `${canvasH}px`,
			position: 'absolute',
			top: '-10000px'
		}" canvas-id="firstCanvas" id="firstCanvas"></canvas>
		
		<u-select v-model="showBrandList" mode="mutil-column" :list="brandList" @confirm="confirm"></u-select>
		
		<CompleteCheckCarPopup 
			:show.sync="showPopup"
			:orderId="orderId"
		/>
		
		<view class="exception-page-wrap" :style="{paddingTop: custom.top + 52 + 'px'}" v-if="showExceptionPage">
			<view class="header">
				<view
				    class="status-bar"
				    :style="{ height: custom.top + 'px' }"
				/>
				<view class="nav">
					<view class="back-btn" @click="closeExceptionPage">
						<u-icon name="arrow-left" color="#000000" size="40"></u-icon>
					</view>
					{{validJSON[firstMenuIndex].children[secondMenuIndex].name}}
				</view>
			</view>
			
			<view class="exception-page-main">
				<view class="exception-page-container">
					<view class="left" v-if="validJSON[firstMenuIndex].children[secondMenuIndex].children">
						<view
							v-for="(thirdMenu, index3) in validJSON[firstMenuIndex].children[secondMenuIndex].children"
							:key="index3"
							class="third-menu"
							:class="{'active-third-menu': index3 === thirdMenuIndex}"
							@click="changeThirdMenu(index3)"
						>
							<view :class="{'status-active-dot': thirdMenu.exceptionDesc && thirdMenu.imgList.length}">{{thirdMenu.name}}</view>
						</view>
					</view>
					<view class="right">
						<view class="exception-title">请上传异常处照片</view>
						<view class="exception-img-container" v-if="validJSON[firstMenuIndex].children[secondMenuIndex].children">
							<view class="img-wrap" style="height: 192rpx" v-for="(item, exceptionImgIndex) in validJSON[firstMenuIndex].children[secondMenuIndex].children[thirdMenuIndex].imgList" :key="exceptionImgIndex">
								<image
									style="width:100%;height:100%;"
									:src="item"
									mode="aspectFill"
									@click.stop="preview1(exceptionImgIndex, validJSON[firstMenuIndex].children[secondMenuIndex].children[thirdMenuIndex].imgList)"
								/>
								<image
									v-if="type !== 'review'"
									class="del-icon"
									src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_509.png"
									@click.stop="delImg(exceptionImgIndex)"
								/>
							</view>
							<view class="img-wrap add-photo" style="height: 192rpx" @click="uploadPhoto1" v-if="type !== 'review'">
								<image
									style="width:64rpx;height:64rpx;"
									src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_464.png"
								/>
								<view class="tip">上传异常处照片</view>
							</view>
						</view>
						<view class="exception-img-container" v-else>
							<view class="img-wrap" style="height: 240rpx" v-for="(item, exceptionImgIndex) in validJSON[firstMenuIndex].children[secondMenuIndex].imgList" :key="exceptionImgIndex">
								<image
									style="width:100%;height:100%;"
									:src="item"
									mode="aspectFill"
									@click.stop="preview1(exceptionImgIndex, validJSON[firstMenuIndex].children[secondMenuIndex].imgList)"
								/>
								<image
									v-if="type !== 'review'"
									class="del-icon"
									src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_509.png"
									@click.stop="delImg(exceptionImgIndex)"
								/>
							</view>
							<view class="img-wrap add-photo" style="height: 240rpx" @click="uploadPhoto1" v-if="type !== 'review'">
								<image
									style="width:64rpx;height:64rpx;"
									src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_464.png"
								/>
								<view class="tip">上传异常处照片</view>
							</view>
						</view>
						<view class="exception-title">异常处说明</view>
						<view class="textarea" v-if="validJSON[firstMenuIndex].children[secondMenuIndex].children">
							<u-input
								v-model="validJSON[firstMenuIndex].children[secondMenuIndex].children[thirdMenuIndex].exceptionDesc" 
								type="textarea" 
								:height="220"
								:maxlength="1000"
								:clearable="false"
								:auto-height="true"
								:disabled="type === 'review'"
								placeholder="点击输入异常处说明"
							/>
						</view>
						<view class="textarea" v-else>
							<u-input
								v-model="validJSON[firstMenuIndex].children[secondMenuIndex].exceptionDesc" 
								type="textarea" 
								:height="220"
								:maxlength="1000"
								:clearable="false"
								:auto-height="true"
								:disabled="type === 'review'"
								placeholder="点击输入异常处说明"
							/>
						</view>
					</view>
				</view>
				<view class="buttom-disabled-btn">
					<button :disabled="disabled1" @click="closeExceptionPage">保存</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import dayjs from 'dayjs'
import { validJSON } from '@/constants/validOrderCar1.js'
import { uploadAction, uploadActionWithWaterMark } from '@/constants/index.js'
import CompleteCheckCarPopup from './components/CompleteCheckCarPopup.vue'

const app = getApp()
export default {
	components: {
		CompleteCheckCarPopup
	},
	
	data() {
		return {
			custom: app.globalData.custom,
			firstMenuIndex: 0,
			secondMenuIndex: 0,
			thirdMenuIndex: 0,
			validJSON: [],
			locationAddress: {},
			currentCompany: {},
			canvasW: 0,
			canvasH: 0,
			watermark: {
				date: '',
				location: '',
				address: '',
				username: '',
			},
			brandList: [[],[]],
			orderCarInfo: {},
			showPopup: false,
			showBrandList: false,
			showExceptionPage: false,
			orderId: '',
			type: '',
		}
	},
	
	computed: {
		disabled() {
			let res = true
			
			if (this.validJSON.length) {
				if (this.firstMenuIndex === 0) {
					if (this.validJSON[0].url) {
						res = false
					}
				} else {
					for(let index1 = 1; index1 < this.validJSON.length; index1++) {
						const firstMenu = this.validJSON[index1]
						if (this.firstMenuIndex === index1) {
							const res1 = firstMenu.children.every(item => {
								let flag = false
								if (item.status && (item.type !== 'tyre' || (item.brand && item.size))) {
									if (item.status === 1 || firstMenu.type === 'parts') {
										flag = true
									} else if (item.status === 2) {
										if (item.children) {
											const inputArray = item.children.filter(item1 => item1.exceptionDesc || item1.imgList.length)
											if (inputArray.length) {
												if (inputArray.every(item1 => item1.exceptionDesc && item1.imgList.length)) {
													flag =  true
												}
											}
										} else {
											if (item.exceptionDesc && item.imgList.length) {
												flag = true
											}
										}
									}
								}
								return flag
							})
							res = !res1
						}
					}
				}
			}
			
			return res
		},
		
		disabled1() {
			let res = true
			
			if (this.validJSON.length && this.validJSON[this.firstMenuIndex].children) {
				const secondMenu = this.validJSON[this.firstMenuIndex].children[this.secondMenuIndex]
				
				if (secondMenu.children) {
					const inputArray = secondMenu.children.filter(item => item.exceptionDesc || item.imgList.length)
					if (inputArray.length) {
						if (inputArray.every(item => item.exceptionDesc && item.imgList.length)) {
							res = false
						}
					}
				} else {
					if (secondMenu.exceptionDesc && secondMenu.imgList.length) {
						res = false
					}
				}
			}
			
			return res
		}
	},
	
	onLoad(options) {
		this.orderId = options.orderId
		this.type = options.type
		
		const deliveryCheckInfo = uni.getStorageSync('deliveryCheckInfo')
		if (deliveryCheckInfo) {
			this.validJSON = JSON.parse(deliveryCheckInfo)
		} else {
			this.validJSON = validJSON
		}
		
		this.selectTyreNameList()
		this.selectTyreNameSize()
		
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
	},
	
	methods: {
		showDot(secondMenu, id) {
			let res = false
			if (secondMenu.status === id && secondMenu.status === 2) {
				if (secondMenu.children) {
					const inputArray = secondMenu.children.filter(item => item.exceptionDesc || item.imgList.length)
					if (inputArray.length) {
						if (inputArray.every(item => item.exceptionDesc && item.imgList.length)) {
							res = true
						}
					}
				} else {
					if (secondMenu.exceptionDesc && secondMenu.imgList.length) {
						res = true
					}
				}
			}
			
			return res
		},
		
		back() {
			if (this.firstMenuIndex <= 0) {
				uni.navigateBack({
					delta: 1
				})
			}else {
				--this.firstMenuIndex
			}
		},
		
		closeExceptionPage() {
			this.showExceptionPage = false
			this.thirdMenuIndex = 0
		},
		
		preview(urls) {
			uni.previewImage({
				urls,
			})
		},
		
		preview1(current, urls) {
			uni.previewImage({
				current,
				urls,
			})
		},
		
		delImg(index) {
			uni.showModal({
				title: '提示',
				content: '确定要删除这张图片吗？',
				success: (res) => {
					if (res.confirm) {
						if (this.validJSON[this.firstMenuIndex].children[this.secondMenuIndex].children) {
							this.validJSON[this.firstMenuIndex].children[this.secondMenuIndex].children[this.thirdMenuIndex].imgList.splice(index, 1)
						} else {
							this.validJSON[this.firstMenuIndex].children[this.secondMenuIndex].imgList.splice(index, 1)
						}
					}
				}
			})
		},
		
		uploadPhoto() {
			uni.chooseImage({
				count: 1,
				success: async (res) => {
					uni.showLoading({
						title: '图片上传中'
					})
					
					const file = res.tempFilePaths[0]
					
					uni.getImageInfo({
						src: file,
						success: (frame) => {
							const ctx = uni.createCanvasContext('firstCanvas')
							this.canvasW = frame.width
							this.canvasH = frame.height
							const fontSize = frame.width/30
							const bottom = 10
							ctx.drawImage(file, 0, 0, frame.width, frame.height)
							ctx.draw()
							ctx.beginPath()
							ctx.setFontSize(fontSize)
							
							ctx.setFillStyle('rgba(0,0,0,0.3)')
							ctx.fillRect(0, this.canvasH - (fontSize*4), this.canvasW, fontSize*4)
							
							ctx.setFillStyle('white')
							ctx.fillText(this.watermark.username, 10, this.canvasH - (fontSize*2) - bottom)
							ctx.fillText(this.watermark.date, 10, this.canvasH - fontSize - bottom)
							ctx.fillText(`拍摄地址：${this.watermark.address}`, 10, this.canvasH - bottom)
							
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
													this.validJSON[0].url = res.data.src
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
				}
			})
		},
		
		uploadPhoto1() {
			uni.chooseImage({
				success: async (res) => {
					uni.showLoading({
						title: '图片上传中'
					})
					
					for(const item of res.tempFilePaths) {
						const res = await this.uploadImgFile(item)
						if (this.validJSON[this.firstMenuIndex].children[this.secondMenuIndex].children) {
							this.validJSON[this.firstMenuIndex].children[this.secondMenuIndex].children[this.thirdMenuIndex].imgList.push(res.src)
						} else {
							this.validJSON[this.firstMenuIndex].children[this.secondMenuIndex].imgList.push(res.src)
						}
					}
				}
			})
		},
		
		uploadImgFile(file) {
			return new Promise((resolve, reject) => {
				uni.showLoading({
					title: '图片上传中'
				})
				
				uni.getImageInfo({
					src: file,
					success: (frame) => {
						uni.showLoading({
							title: '图片上传中'
						})
						const ctx = uni.createCanvasContext('firstCanvas')
						this.canvasW = frame.width
						this.canvasH = frame.height
						const fontSize = frame.width/30
						const bottom = 10
						ctx.drawImage(file, 0, 0, frame.width, frame.height)
						ctx.draw()
						ctx.beginPath()
						ctx.setFontSize(fontSize)
						
						ctx.setFillStyle('rgba(0,0,0,0.3)')
						ctx.fillRect(0, this.canvasH - (fontSize*4), this.canvasW, fontSize*4)
						
						ctx.setFillStyle('white')
						ctx.fillText(this.watermark.username, 10, this.canvasH - (fontSize*2) - bottom)
						ctx.fillText(this.watermark.date, 10, this.canvasH - fontSize - bottom)
						ctx.fillText(`拍摄地址：${this.watermark.address}`, 10, this.canvasH - bottom)
						
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
												resolve(res.data)
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
			})
		},
		
		async selectTyreNameList() {
			const res = await this.$getRequest(this.$url.selectTyreNameList, 'GET', {})
			if (res.code == 0) {
				const list = res.data.map(item => {
					return {
						value: item.id,
						label: item.tyreName
					}
				})
				
				this.brandList[0] = list
			}
		},
		
		async selectTyreNameSize() {
			const res = await this.$getRequest(this.$url.selectTyreNameSize, 'GET', {})
			if (res.code == 0) {
				const list = res.data.map(item => {
					return {
						value: item.id,
						label: item.tyreSize + '寸'
					}
				})
				
				this.brandList[1] = list
			}
		},
		
		openBrandList() {
			if (this.type === 'review') {
				return
			}
			this.showBrandList = true
		},
		
		confirm(e) {
			this.validJSON[1].children[0].brand = e[0].label
			this.validJSON[1].children[0].size = e[1].label
		},
		
		changeStatus(item, index2) {
			this.validJSON[this.firstMenuIndex].children[index2].status = item.id
			this.secondMenuIndex = index2
			if (this.firstMenuIndex !== 4 && item.id === 2) {
				this.showExceptionPage = true
			}
		},
		
		changeThirdMenu(index3) {
			this.thirdMenuIndex = index3
		},
		
		async save() {
			if (this.firstMenuIndex === this.validJSON.length - 1) {
				const deliveryCarPics = uni.getStorageSync('deliveryCarPicsMap')
				
				
				
				let res
				
				if (this.type == 1) {
					const params = {
						id: this.orderId,
						deliveryCarPics,
						checkInfo: this.validJSON,
					}
					res = await this.$getRequest(this.$url.uploadRentalOrderCheckInfo, 'POST', params)
				} else {
					const params = {
						id: this.orderId,
						returnedDeliveryCarPics: deliveryCarPics,
						returnedCheckInfo: this.validJSON,
						returnedCheckUserName: this.currentCompany.username,
					}
					res = await this.$getRequest(this.$url.returnedCarInfo, 'POST', params)
				}
				
				if (res && res.code == 0) {
					this.showPopup = true
				}
			} else {
				++this.firstMenuIndex
			}
			this.secondMenuIndex = 0
			this.thirdMenuIndex = 0
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	padding: 0 0 140px 0;
	.header {
		width: 100vw;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		background: #fff;
		.nav {
			width: 100%;
			line-height: 32px;
			position: relative;
			height: 32px;
			font-size: 17px;
			font-weight: 600;
			text-align: center;
			color: #000000;
			.back-btn {
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				display: flex;
				align-items: center;
				padding: 0 32rpx;
			}
		}
	}
	.main {
		padding: 0 32rpx;
		.first-menu {
			.title {
				margin-bottom: 32rpx;
				height: 48rpx;
				font-size: 32rpx;
				line-height: 48rpx;
				color: #1D2129;
			}
			.img-container {
				display:flex;
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
		.second-menu {
			margin-bottom: 32rpx;
			.second-menu-item {
				height: 80rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.second-menu-item-name {
					font-size: 32rpx;
					color: #1D2129;
				}
				.second-menu-item-status-list {
					display: flex;
					.status {
						margin-left: 24rpx;
						width: 140rpx;
						height: 70rpx;
						border-radius: 8rpx;
						background: rgba(10, 15, 45, 0.04);
						font-size: 28rpx;
						color: #1A1A1A;
						display: flex;
						justify-content: center;
						align-items: center;
					}
					.status-active {
						background: rgba(65, 112, 238, 0.1);
						color: #4170EE;
					}
				}
			}
			.tyre {
				padding: 32rpx 20rpx;
				height: 44rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 2rpx solid #F2F3F5;
				font-size: 30rpx;
				color: rgba(10, 15, 45, 0.8);
				box-sizing: content-box;
				.right {
					height: 100%;
					display: flex;
					align-items: center;
				}
			}
		}
	}
	.cancel-btn {
		width: 148rpx;
	}
}

.status-active-dot {
	position: relative;
}
.status-active-dot::after {
	content: '';
	display: block;
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	background: #FF0000;
	position: absolute;
	top: -8rpx;
	right: -8rpx;
}

.exception-page-wrap {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background: #fff;
	z-index: 1000;
	padding-bottom: 40px;
	.exception-page-main {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.exception-page-container {
			height: 0;
			flex: 1;
			display: flex;
			.left {
				width: 204rpx;
				height: 100%;
				background: #F7F8FA;
				border-radius: 0 16rpx 16rpx 0;
				.third-menu {
					width: 100%;
					height: 120rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 28rpx;
					color: #86909C;
					border-radius: 0 16rpx 16rpx 0;
					&.active-third-menu {
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
						}
					}
				}
			}
			.right {
				width: 0;
				flex: 1;
				padding: 0 32rpx 40rpx;
				overflow: auto;
				.exception-title {
					margin: 24rpx 0;
					height: 44rpx;
					font-size: 28rpx;
					line-height: 44rpx;
					color: #0A0F2D;
				}
				.exception-img-container {
					display: flex;
					flex-wrap: wrap;
					.img-wrap {
						margin-right: 2%;
						margin-bottom: 16px;
						width: 48%;
						border-radius: 8rpx;
						position: relative;
						.del-icon {
							position: absolute;
							top: 0;
							right: 0;
							width: 24rpx;
							height: 24rpx;
						}
					}
					.img-wrap:nth-child(2n) {
						margin-right: 0;
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
				.textarea {
					background: #F7F8FA;
					border-radius: 8rpx;
					padding: 16rpx 32rpx;
				}
			}
		}
		.buttom-disabled-btn {
			padding: 0 32rpx;
		}
	}
}
</style>