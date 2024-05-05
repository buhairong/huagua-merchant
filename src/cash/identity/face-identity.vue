<template>
	<view class="wrap">
		<!-- <view class="camera-wrap" style="width:400rpx;height:400rpx;border-radius:50%;overflow:hidden;-webkit-backface-visibility: hidden;-webkit-transform: translate3d(0, 0, 0);">
			<camera
				device-position="front" 
				flash="off" 
				@initdone="initdone" 
				@error="error" 
				style="width:100%;height:100%;border-radius:50%;-webkit-backface-visibility: hidden;-webkit-transform: translate3d(0, 0, 0);"
			></camera>
		</view>
		<view class="tip">{{tip}}</view>
		
		<canvas v-if="canvasW && canvasH" :style="{
			width: `${canvasW}px`,
			height: `${canvasH}px`,
			position: 'absolute',
			top: '-10000px'
		}" canvas-id="firstCanvas" id="firstCanvas"></canvas> -->
		
	</view>
</template>

<script>
import dayjs from 'dayjs'
import { uploadAction } from '@/constants/index.js'

export default {
	data() {
		return {
			ctx: null,
			idNum: '',
			username: '',
			tip: '请确保正对手机且光线充足',
			canvasW: 0,
			canvasH: 0,
			faceAudit: false,
			identityInfo: {},
		}
	},
	onLoad(options) {
		const identityInfo = uni.getStorageSync('identityInfo')
		if (identityInfo) {
			this.idNum = identityInfo.idcard
			this.username = identityInfo.realName
			this.identityInfo = identityInfo
		}
	},
	
	onUnload() {
		
	},
	
	methods: {
		initdone() {
			this.ctx = uni.createCameraContext()
			this.onCameraFrame()
		},
		
		onCameraFrame() {
				let count = 0
				let listener = this.ctx.onCameraFrame(frame => {
					if (count < 30 || this.faceAudit) {
						count++
						return
					}
					count = 0
					
					this.canvasW = frame.width
					this.canvasH = frame.height
					
					const data = new Uint8Array(frame.data)
					const clamped = new Uint8ClampedArray(data)
					
					const ctx1 = uni.createCanvasContext('firstCanvas')
					
					
					uni.canvasPutImageData({
					  canvasId: 'firstCanvas',
						x: 0,
						y: 0,
						width: frame.width,
						height: frame.height,
						data: clamped,
					  success: (res) => {
							console.log('canvasPutImageData', res)
								//ctx1.draw(true, () => {
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
											console.log('canvasToTempFilePath')
											uni.uploadFile({
												url: uploadAction,
												filePath: res.tempFilePath,
												name: 'file',
												success: (uploadFileRes) => {
													console.log('uploadFile')
													const res = JSON.parse(uploadFileRes.data)
													if (res.code == 0) {
														const imageUrl = res.data.src
														this.$getRequest(this.$url.faceAudit, 'POST', {
															resource: 20,
															businessNode: 30,
															imageUrl,
															idNum: this.idNum,
															name: this.username,
															// idNum: '210911200201170019',
															// name: '刘相辰',
															// idNum: '310107198204081711',
															// name: '卜海荣',
														}).then(async result => {
															if (result.code == 0 && result.data.pass) {
																if (listener) {
																	listener.stop()
																	listener = null
																}
																
																this.faceAudit = true
																
																this.tip = '认证通过'
																console.log('this.identityInfo', this.identityInfo)
																const result = await this.$getRequest(this.$url.userAuditSubmit, 'POST', this.identityInfo)
																if(result.code == 0){
																	uni.reLaunch({
																		url: `/cash/card/bindcard?realName=${this.username}`,
																	})
																}
																
															} else {
																this.tip = '抱歉，没有认出您'
																if (listener) {
																	listener.stop()
																	listener = null
																}
																this.onCameraFrame()
															}
														})
													}
												},
											})
									  },
										fail: (res) => {
											console.log('图片生成失败', res)
											if (listener) {
												listener.stop()
												listener = null
											}
											this.onCameraFrame()
										}
									})
								//})
						},
						fail: (res) => {
							console.log('调用失败', res)
							if (listener) {
								listener.stop()
								listener = null
							}
							this.onCameraFrame()
						}
					})
				})
				
				listener.start()
		},
		
		error(e) {
				console.log('error', e.detail);
		},
		
		clearTimer() {
			clearTimeout(this.timer)
			this.timer = null
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 40px 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.tip {
		margin-top: 16px;
		height: 44rpx;
		font-size: 16px;
		line-height: 44rpx;
		color: rgba(10, 15, 45, 0.5);
	}
}
</style>