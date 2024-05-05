<template>
	<view class="page">
		<view>
			<view class="first-menu" v-for="(firstMenu, index1) in validJSON" :key="index1" @click="() => changeActive(index1)">
				<template v-if="current >= firstMenu.id">
					<view class="title-wrap" :class="{active: active === index1}">
						<view class="left">{{firstMenu.name}}</view>
						<view class="right" @click="toggleExpand(index1)">
							{{firstMenu.rightText}}
							<view class="icon-wrap">
								<u-icon :name="firstMenu.isExpand ? 'arrow-up' : 'arrow-down' " color="rgba(0, 0, 0, 0.9)" size="32"></u-icon>
							</view>
						</view>
					</view>
					<view class="container-wrap">
						<view class="container" v-show="firstMenu.isExpand">
							<view v-if="firstMenu.children">
								<view class="second-menu" v-for="(secondMenu, index2) in firstMenu.children" :key="index2" @click="() => changeActive1(index2)">
									<template v-if="current >= secondMenu.id">
										<view class="second-title-wrap">
											<view class="left">{{secondMenu.name}}</view>
											<view v-if="secondMenu.rightText" class="right" @click="toggleSecondExpand(index1, index2)">
												{{secondMenu.rightText}}
												<view class="icon-wrap">
													<u-icon :name="secondMenu.isExpand ? 'arrow-up' : 'arrow-down' " color="rgba(0, 0, 0, 0.9)" size="32" v-if="type === 'review' && firstMenu.type !== 'parts'"></u-icon>
													<u-icon name="edit-pen" color="#86909C" size="28" v-if="type !== 'review'"></u-icon>
												</view>
											</view>
										</view>
										<view class="second-container" v-if="secondMenu.isExpand">
											<view class="tyre" v-if="secondMenu.type === 'tyre'">
												<view class="left">轮胎信息</view>
												<view class="right" @click="openBrandList(index1, index2)">
													<view class="brand" v-if="secondMenu.brand">{{secondMenu.brand}} {{secondMenu.size}}</view>
													<view class="placeholder" v-else>请选择品牌、尺寸</view>
													<view class="icon-wrap" v-if="type !== 'review'">
														<u-icon name="arrow-right" color="rgba(0, 0, 0, 0.9)" size="28"></u-icon>
													</view>
												</view>
											</view>
											
											<view class="parts" v-if="firstMenu.type === 'parts'">
												<template v-if="type !== 'review'">
													<view
														v-for="(checkStatus, checkStatusIndex) in radioList" 
														:key="checkStatusIndex" 
														class="choose-has" 
														:class="{'status-active': secondMenu.isHas === checkStatus.id}"
														@click="changeIsHas1(checkStatus, index1, index2)"
													>
														{{checkStatus.label}}
													</view>
												</template>
											</view>
											
											<view class="check-car-exception" v-else>
												<view v-if="secondMenu.requireChooseIfHas">
													<template v-if="type !== 'review'">
														<view
															v-for="(checkStatus, checkStatusIndex) in radioList" 
															:key="checkStatusIndex" 
															class="choose-has" 
															:class="{'status-active': secondMenu.isHas === checkStatus.id}"
															@click="changeIsHas(checkStatus, index1, index2)"
														>
															{{checkStatus.label}}
														</view>
													</template>
												</view>
												<view v-show="secondMenu.isHas === 1">
													<template v-if="type !== 'review'">
														<view
															v-for="(checkStatus, checkStatusIndex) in secondMenu.statusList" 
															:key="checkStatusIndex" 
															class="choose-has" 
															:class="{'status-active': secondMenu.status === checkStatus.id}"
															@click="changeStatus(checkStatus, index1, index2)"
														>
															{{checkStatus.label}}
														</view>
													</template>
												</view>
												
												<view class="exception" v-show="secondMenu.status === 2">
													<view class="img-container">
														<view class="img-wrap" v-for="(item, index5) in secondMenu.imgList" :key="index5">
															<image
																style="width:100%;height:100%;"
																:src="item"
																@click.stop="() => preview(index5, secondMenu.imgList)"
															/>
															<image
																v-if="type !== 'review'"
																class="del-icon"
																src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_509.png"
																@click="delImg(index5, index1, index2)"
															/>
														</view>
														<view class="img-wrap add-photo" @click="uploadPhoto(2, index1, index2)" v-if="type !== 'review'">
															<image
																style="width:64rpx;height:64rpx;"
																src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_464.png"
															/>
															<view class="tip">上传异常处照片</view>
														</view>
													</view>
													<view class="exception-desc">
														<view class="desc-title">异常处说明</view>
														<u-input 
															v-model="secondMenu.exceptionDesc" 
															type="textarea" 
															:height="120"
															:maxlength="1000"
															:clearable="false"
															:auto-height="true"
															:disabled="type === 'review'"
															placeholder="点击输入异常处说明"
														/>
													</view>
												</view>
											</view>
										</view>
									</template>
								</view>
							</view>
							<view v-else>
								<view v-if="firstMenu.imageType === 1" style="display:flex;justify-content: space-between;">
									<view class="img-box" v-if="firstMenu.url">
										<image
											style="width:100%;height:100%;margin-right:2%;"
											:src="firstMenu.url"
											@click.stop="preview(0, [firstMenu.url])"
										/>
									</view>
									<view class="img-box add-photo" @click="uploadPhoto(1, index1)" v-if="type !== 'review'">
										<image
											style="width:64rpx;height:64rpx;"
											src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_464.png"
										/>
										<view class="tip">{{firstMenu.uploadTip}}</view>
									</view>
								</view>
								<view class="img-container" v-else>
									<view class="img-wrap" v-for="(item, index3) in firstMenu.imgList" :key="index3">
										<image
											style="width:100%;height:100%;"
											:src="item"
											@click.stop="preview(index3, firstMenu.imgList)"
										/>
										<image
											v-if="type !== 'review'"
											class="del-icon"
											src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_509.png"
											@click="delImg(index3, index1)"
										/>
									</view>
									<view class="img-wrap add-photo" @click="uploadPhoto(2, index1)" v-if="type !== 'review'">
										<image
											style="width:64rpx;height:64rpx;"
											src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_464.png"
										/>
										<view class="tip">{{firstMenu.uploadTip}}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</template>
				
			</view>
			<canvas v-if="canvasW && canvasH" :style="{
				width: `${canvasW}px`,
				height: `${canvasH}px`,
				transform: 'transLateX(10000px)',
			}" canvas-id="firstCanvas" id="firstCanvas"></canvas>
		</view>
		
		<view class="buttom-disabled-btn btn-wrap" v-if="type !== 'review'">
			<button v-if="completeCount === total || orderCarInfo.deliveryCheckInfo" :disabled="completeCount < total" class="bottom-btn" @click="save">完成验车（{{completeCount}}/{{total}})</button>
			<button v-else :disabled="disabled" @click="next">下一项（{{completeCount}}/{{total}})</button>
		</view>
		
		<u-select v-model="showBrandList" mode="mutil-column" :list="brandList" @confirm="confirm"></u-select>
		
		<CompleteCheckCarPopup 
			:show.sync="showPopup"
			:orderId="orderId"
			:newType="newType"
			:carId="carId"
			:orderCarInfo="orderCarInfo"
		/>
	</view>
</template>

<script>
import dayjs from 'dayjs'
import { validJSON, pickup } from '@/constants/validOrderCar.js'
import { uploadAction, uploadActionWithWaterMark } from '@/constants/index.js'
import CompleteCheckCarPopup from './components/CompleteCheckCarPopup.vue'

export default {
	components: {
		CompleteCheckCarPopup
	},
	
	data() {
		return {
			orderId: '',
			newType: '',
			carId: '',
			validId: '',
			type: '',
			orderCarInfo: {},
			validJSON: [],
			active: 0,
			currentfirstMenu: 0,
			currentSecondMenu: 0,
			radioList: [
				{id: 1, label: '有'},
				{id: 2, label: '无'},
			],
			total: 0,
			showBrandList: false,
			brandList: [[],[]],
			brandIndex1: 0,
			brandIndex2: 0,
			showPopup: false,
			current: 1,
			locationAddress: {},
			currentCompany: {},
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
	
	computed: {
		disabled() {
			if(this.validJSON[this.currentfirstMenu]) {
				if (this.validJSON[this.currentfirstMenu].children) {
					if (this.validJSON[this.currentfirstMenu].children[this.currentSecondMenu].isComplete) {
						return false
					}
				} else {
					if (this.validJSON[this.currentfirstMenu].isComplete) {
						return false
					}
				}
			}
			return true
		},
		
		completeCount() {
			let total = 0
			
			for(const firstMenu of this.validJSON ) {
				if (firstMenu.children) {
					for(const secondMenu of firstMenu.children) {
						if (secondMenu.isComplete) {
							total += 1
						}
					}
				} else {
					if (firstMenu.isComplete) {
						total += 1
					}
				}
			}
			
			return total
		},
	},
	
	watch: {
		validJSON: {
			handler(val) {
				for(let i = 0; i < val.length; i++) {
					const firstMenu = val[i]
					if (firstMenu.children) {
						if (firstMenu.type !== 'parts') {
							for(let j = 0; j < firstMenu.children.length; j++) {
								const secondMenu = firstMenu.children[j]
								if (secondMenu.status === 1) {
									if (secondMenu.type === 'tyre') {
										if (secondMenu.brand && secondMenu.size) {
											this.validJSON[i].children[j].isComplete = true
										}
									} else {
										this.validJSON[i].children[j].isComplete = true
									}
								} else if (secondMenu.status === 2) {
									if (secondMenu.type === 'tyre') {
										if (secondMenu.brand && secondMenu.size && secondMenu.imgList.length && secondMenu.exceptionDesc.trim()) {
											this.validJSON[i].children[j].isComplete = true
										}
									} else {
										if (secondMenu.imgList.length && secondMenu.exceptionDesc.trim()) {
											this.validJSON[i].children[j].isComplete = true
										}
									}
								} else if (secondMenu.isHas === 2) {
									this.validJSON[i].children[j].isComplete = true
								}
							}
						}
					}
				}
			},
			deep: true,
		}
	},
	
	onLoad(options){
		this.orderId = options.orderId
		this.newType = options.newType
		this.carId = options.carId
		this.validId = options.validId || null
		this.type = options.type
		
		const orderCarInfo = uni.getStorageSync('orderCarInfo')
		if (orderCarInfo) {
			this.orderCarInfo = orderCarInfo
			this.watermark.carVin = `车架号：${orderCarInfo.carVin}`
			this.watermark.carEngineNum = `发动机号：${orderCarInfo.carEngineNum}`
			
			if (this.type === 'review') {
				if (orderCarInfo.deliveryCheckInfo) {
					this.validJSON = orderCarInfo.deliveryCheckInfo
				} else {
					this.validJSON = orderCarInfo.checkInfo
				}
				this.closeAll()
				
			} else {
				// if (orderCarInfo.category == 1) {
				// 	if (orderCarInfo.checkInfo) {
				// 		this.validJSON = orderCarInfo.checkInfo
				// 		this.closeAll()
				// 	} else {
				// 		this.validJSON = validJSON
				// 	}
				// } else {
					if (orderCarInfo.deliveryCheckInfo) {
						this.validJSON = orderCarInfo.deliveryCheckInfo
						this.closeAll()
					} else {
						this.validJSON = [...validJSON, ...pickup]
					}
				//}
			}
		}
		this.getTotal()
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
		
		closeAll() {
			this.validJSON.map(first => {
				first.isExpand = false
				if (first.children) {
					first.children.map(second => {
						second.isExpand = false
						
						return second
					})
				}
				
				return first
			})
			
			this.current = 1000
		},
		
		getTotal() {
			let total = 0
			for(const firstMenu of this.validJSON ) {
				if (firstMenu.children) {
					total += firstMenu.children.length
				} else {
					total += 1
				}
			}
			this.total = total
		},
		
		toggleExpand(index) {
			this.validJSON[index].isExpand = !this.validJSON[index].isExpand
		},
		
		toggleSecondExpand(index1, index2) {
			this.validJSON[index1].children[index2].isExpand = !this.validJSON[index1].children[index2].isExpand
		},
		
		changeActive(index) {
			this.active = index
			this.currentfirstMenu = index
		},
		
		changeActive1(index) {
			this.currentSecondMenu = index
		},
		
		uploadPhoto(imageType, index, index2) {
			const count = imageType === 1 ? 1 : 9
			uni.chooseImage({
				count,
				success: async (res) => {
					uni.showLoading({
						title: '图片上传中'
					})
					
					for(const item of res.tempFilePaths) {
						const res = await this.uploadImgFile(item)
						if (imageType === 1) {
							this.validJSON[index].url = res.src
						} else {
							if (index2 === undefined) {
								this.validJSON[index].imgList.push(res.src)
							} else {
								this.validJSON[index].children[index2].imgList.push(res.src)
							}
						}
					}
					
					if (index2 === undefined) {
						this.validJSON[index].rightText = '已上传'
						this.validJSON[index].isComplete = true
					}
					
					uni.hideLoading()
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
				
				// const params = {
				// 	userName: this.currentCompany.username,
				// 	carVin: this.orderCarInfo.carVin,
				// 	carEngineNum: this.orderCarInfo.carEngineNum,
				// 	picAddress: this.locationAddress.address,
				// 	file,
				// }
				
				// this.$getFileUpload1(uploadActionWithWaterMark, params).then(res => {
				// 	if (res.code == 0) {
				// 			resolve(res.data)
				// 	}
				// })
			})
		},
		
		preview(current, urls) {
			uni.previewImage({
				current,
				urls,
			})
		},
		
		openBrandList(index1, index2) {
			if (this.type === 'review') {
				return
			}
			this.brandIndex1 = index1
			this.brandIndex2 = index2
			this.showBrandList = true
		},
		
		confirm(e) {
			this.validJSON[this.brandIndex1].children[this.brandIndex2].brand = e[0].label
			this.validJSON[this.brandIndex1].children[this.brandIndex2].size = e[1].label
		},
		
		changeIsHas(item, index1, index2) {
			this.validJSON[index1].children[index2].isHas = item.id
			if (item.id === 2) {
				this.validJSON[index1].children[index2].rightText = '无'
			} else {
				this.validJSON[index1].children[index2].isComplete = false
				const status = this.validJSON[index1].children[index2].status
				if (status) {
					const label = this.validJSON[index1].children[index2].statusList[status-1].label
					let str = label
					const index = label.indexOf('（')
					if (index !== -1) {
						str = label.slice(0, index)
					}
					this.validJSON[index1].children[index2].rightText = str
				}
			}
		},
		
		changeIsHas1(item, index1, index2) {
			this.validJSON[index1].children[index2].isHas = item.id
			if (item.id === 1) {
				this.validJSON[index1].children[index2].rightText = '有'
			} else {
				this.validJSON[index1].children[index2].rightText = '无'
			}
			
			this.validJSON[index1].children[index2].isComplete = true
		},
		
		changeStatus(item, index1, index2) {
			this.validJSON[index1].children[index2].status = item.id
			let str = item.label
			const index = item.label.indexOf('（')
			if (index !== -1) {
				str = item.label.slice(0, index)
			}
			this.validJSON[index1].children[index2].rightText = str
			
			if (item.id === 2) {
				if(!this.validJSON[index1].children[index2].imgList.length || !this.validJSON[index1].children[index2].exceptionDesc) {
					this.validJSON[index1].children[index2].isComplete = false
				}
			}
			
			const isComplete = this.validJSON[index1].children.every(child => child.status || child.isHas === 2)
			if (isComplete) {
				const flag = this.validJSON[index1].children.every(child => child.status === 1 || child.isHas === 2)
				if (flag) {
					if (this.validJSON[index1].type === 'tyre') {
						this.validJSON[index1].rightText = '轮胎正常'
					} else {
						this.validJSON[index1].rightText = '正常'
					}
				} else {
					if (this.validJSON[index1].type === 'tyre') {
						this.validJSON[index1].rightText = '轮胎异常'
					} else {
						this.validJSON[index1].rightText = '异常'
					}
				}
			}
		},
		
		delImg(index, index1, index2) {
			uni.showModal({
				title: '提示',
				content: '确定要删除这张图片吗？',
				success: (res) => {
					if (res.confirm) {
						if (index2 === undefined) {
							this.validJSON[index1].imgList.splice(index, 1)
						} else {
							this.validJSON[index1].children[index2].imgList.splice(index, 1)
						}
					}
				}
			})
		},
		
		next() {
			let id = 0
			if (this.validJSON[this.currentfirstMenu].children) {
				if (this.currentSecondMenu === (this.validJSON[this.currentfirstMenu].children.length-1)) {
					++this.currentfirstMenu
					this.currentSecondMenu = 0
					this.validJSON[this.currentfirstMenu].isExpand = true
					id = this.validJSON[this.currentfirstMenu].id
				} else {
					++this.currentSecondMenu
					this.validJSON[this.currentfirstMenu].children[this.currentSecondMenu].isExpand = true
					id = this.validJSON[this.currentfirstMenu].children[this.currentSecondMenu].id
				}
				
			} else {
				++this.currentfirstMenu
				this.validJSON[this.currentfirstMenu].isExpand = true
				id = this.validJSON[this.currentfirstMenu].id
			}
			this.current = id
		},
		
		async save() {
			
			
			const deliveryType = this.orderCarInfo.category
			const params = {
				orderId: this.orderId,
				carId: this.carId,
				newType: this.newType,
				checkInfo: this.validJSON,
				deliveryType: 2,
				id: this.validId,
				createId: this.currentCompany.userId,
			}
			
			const res = await this.$getRequest(this.$url.insertOrUpdateCheckInfo, 'POST', params)
			if (res.code == 0) {
				this.showPopup = true
			}
		},
		
		
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
	
.page {
	padding: 16px 0 120px;
	.first-menu {
		padding-top: 8px;
		.title-wrap {
			padding: 0 40rpx;
			width: 100vw;
			height: 76rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.left {
				font-size: 16px;
				color: #1D2129;
			}
			.right {
				display: flex;
				align-items: center;
				font-size: 15px;
				color: rgba(10, 15, 45, 0.8);
			}
		}
		.active {
			position: relative;
		}
		.active:before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			display: block;
			width: 6rpx;
			height: 100%;
			background: #4170EE;
			border-top-right-radius: 3rpx;
			border-bottom-right-radius: 3rpx;
		}
		.container-wrap {
			margin: 0 40rpx;
			padding-bottom: 8px;
			border-bottom: 2rpx solid #F2F3F5; 
		}
		.container {
			margin-top: 10px;
		}
		.img-container {
			display: flex;
			flex-wrap: wrap;
		}
		.img-box {
			width: 48%;
			height: 240rpx;
			border-radius: 8rpx;
		}
		.img-wrap {
			margin-right: 2%;
			margin-bottom: 16px;
			width: 32%;
			height: 150rpx;
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
		.img-wrap:nth-child(3n) {
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
	
	.icon-wrap {
		height: 100%;
		display: flex;
		align-items: center;
		margin-left: 8rpx;
	}
	
	.second-menu {
		margin-top: 20px;
		.second-title-wrap {
			padding-left: 24rpx;
			height: 44rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.left {
				font-size: 15px;
				color: #0A0F2D;
			}
			.right {
				display: flex;
				align-items: center;
				font-size: 15px;
				color: #1D2129;
			}
		}
		.tyre {
			margin-top: 16px;
			height: 72rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 2rpx solid #F2F3F5;
			.left {
				font-size: 15px;
				color: rgba(10, 15, 45, 0.8);
			}
			.right {
				height: 100%;
				display: flex;
				align-items: center;
				.brand {
					font-size: 15px;
					color: rgba(10, 15, 45, 0.8);
				}
				.placeholder {
					font-size: 15px;
					color: #A4AEBB;
				}
			}
		}
		
		.parts {
			margin-top: 16px;
		}
		
		.choose-has {
			margin-bottom: 12px;
			width: 100%;
			height: 90rpx;
			border-radius: 8rpx;
			background: #F7F8FA;
			font-size: 14px;
			color: #1D2129;
			display: flex;
			justify-content: center;
			align-items: center;
			&.status-active {
				background: rgba(65, 112, 238, 0.1);
				color: #4170EE;
			}
		}
		
		.check-car-exception {
			margin-top: 16px;
			.exception {
				margin-top: 16px;
				.exception-desc {
					padding: 16px 40rpx;
					width: 100%;
					border-radius: 8rpx;
					background: #F7F8FA;
					.desc-title {
						margin-bottom: 12px;
						height: 44rpx;
						font-size: 15px;
						line-height: 44rpx;
						color: rgba(10, 15, 45, 0.8);
					}
				}
			}
		}
	}
	
	.second-menu:first-child {
		margin-top: 0;
	}
	
	.second-container {
		padding-left: 48rpx;
	}
	
	.btn-wrap {
		width: 100vw;
		background-color: #fff;
		padding: 0 32rpx;
		position: fixed;
		bottom: 40px;
		left: 0;
		z-index: 100;
	}
}
</style>