<template>
	<view class="add-car">
		<view class="car-title">
			选择车辆
		</view>
		<!-- <view class="content" @click="addCarBrand">
			<view class="left-c">
				<image src="https://image.51cheyaoshi.com/xcx/merchant/static/product/addCar.png"></image>
				<text>添加车辆</text>
			</view>
			<view class="right-img"><image mode="aspectFill" src="https://image.51cheyaoshi.com/xcx/merchant/static/home/launch.png"></image></view>
		</view> -->
		
		<!-- 车辆的信息 -->
		<view class="content-info">
			<view class="left-c">
				<view>{{carBrandName}}</view>
				<view style="font-size:24rpx;color:#666666;">{{carBrandType}} {{carYearType}}</view>
			</view>
			<view class="right-img"><image mode="aspectFills" :src="imageUrl"></image></view>
		</view>
		<!-- 车况 新-二手车 -->
		<view class="car-condition">
			<view class="title">车况</view>
			<view class="toggle-car">
				<view
					v-for="(item,index) in carCondition"
					:key="index"
					class="toggle-car-box"
					@click="toggleCar(index,item)"
					:class="{'active':conditionActive == item.id}">
					<text>{{item.name}}</text>
				</view>
			</view>
			<!-- 外观  内饰   颜色 -->
			<view class="car-color" v-if="conditionActive==1">
				<view class="car-w-color">
					<view class="car-w-title flex-center">
						<text class="color-title car-w-text">外观颜色</text>
						<!-- <text class="color-text car-w-money">{{colorName}} + ¥{{colorMoney}}</text> -->
						<text class="color-text car-w-money">{{colorName}}</text>
					</view>
					<view 
						v-for="(itemC,indexC) in outColor"
						:key="indexC"
						style="display: inline-block;">
						<view
							class="inColor" 
							:class="{'active': activeC == indexC}"
							:style="{background: itemC.colorNum}"
							@click="changeInColor(itemC,indexC)"></view>
					</view>
				</view>
				<view class="car-n-color">
					<view class="car-n-title flex-center">
						<text class="color-title car-n-text">内饰颜色</text>
						<!-- <text class="color-text car-n-money">{{colorNameO}} + ¥{{colorMoneyO}}</text> -->
						<text class="color-text car-n-money">{{colorNameO}}</text>
					</view>
					<view
						v-for="(itemO,indexO) in inColor"
						:key="indexO"
						style="display: inline-block;">
						<view
							class="otherColor"
							:class="{'active': activeO == indexO}"
							:style="{background: itemO.colorNum}"
							@click="changeOtherColor(itemO,indexO)">
							<view class="topView" :style="{background: back(itemO,'topView')}"></view>
							<view class="bomView" :style="{background: back(itemO,'bomView')}"></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="form-wrap" v-if="conditionActive == 2">
			<view class="title">
				添加信息
			</view>
			<view class="input-wrap">
				<text class="input-text">车辆售价</text>
				<view class="transcation">
					<u-input
						class="input"
						v-model="dealerReferencePrice" 
						type="idcard" 
						input-align="right"
						placeholder="请输入车辆售价"
						:clearable="false"
						@input="ceshi('dealerReferencePrice')"
						@keyboardheightchange="keydown($event)"
					/>
					<text class="unit">元</text>
				</view>
			</view>
			<view class="input-wrap">
				<text class="input-text">过户次数</text>
				<view class="transcation">
					<u-input
						class="input"
						v-model="transcationNum" 
						type="idcard" 
						input-align="right"
						placeholder="请输入过户次数"
						:clearable="false"
						@input="ceshi('transcationNum')"
					/>
					<text class="unit">次</text>
				</view>
			</view>
		</view>
		<view class="next-btn" @click="nextBtn"><text>下一步</text></view>
	</view>
</template>

<script>
	import { validIntegerNum } from '@/utils/validate'
	
	export default {
		data() {
			return{
				carCondition: [
					{id:1,name:'全新车'},
					{id:2,name:'二手车'}
				],
				conditionActive: 1,
				// 外观颜色
				outColor: [],
				// 内饰颜色
				inColor:[],
				
				activeC: 0,
				activeO: 0,
				// 外观颜色默认展示颜色名称和价钱和色号
				colorName: '',
				colorMoney:'',
				colorNum:'',
				// 内饰颜色默认展示颜色名称和价钱和色号
				colorNameO:'',
				colorMoneyO:'',
				colorNumO:'',
				
				carBrandName: '',
				carBrandType: '',
				carYearType: '',
				imageUrl:'',
				carType: '',
				id: '',
				brandid: '',
				typeYearId: '',
				typeYearProductId: '',
				carBrand:'',
				carTypeYear:'',
				carTypeYearProduct:'',
				dealerReferencePrice: null, // 车辆价格
				transcationNum: null, // 过户次数
			}
		},
		methods: {
			back(itemO,type){
				if(itemO.colorNum.indexOf("/")!=-1){
					let arr=itemO.colorNum.split('/')
					if(type=='topView'){
						return arr[0]
					}else{
						return arr[1]
					}
				}else{
					return itemO.colorNum
				}
			},
			keydown(event){
				if(event.keyCode == 8){
					event.returnValue = false
					uni.showToast({
						title: '不能输入空格',
						duration: 2000,
						icon: 'none'
					});
			    }
			},
			ceshi(v){
				if(v=='dealerReferencePrice'){
					console.log(this.dealerReferencePrice,'this.dealerReferencePrice');
					if (/^0/g.test(this.dealerReferencePrice)) {
						uni.showToast({
							title: '第一个数字不能为0',
							duration: 2000,
							icon: 'none'
						});
						return
					}
					if (/\s+/g.test(this.dealerReferencePrice)) {
					  	uni.showToast({
					  		title: '不能输入空格',
					  		duration: 2000,
					  		icon: 'none'
					  	});
					  	return
					}
					if (!/^[1-9][0-9]*$/.test(this.dealerReferencePrice)) {
						uni.showToast({
							title: '只能输入数字',
							duration: 2000,
							icon: 'none'
						});
						return
					}
				}else{
					if (/^0/g.test(this.transcationNum)) {
						uni.showToast({
							title: '第一个数字不能为0',
							duration: 2000,
							icon: 'none'
						});
						return
					 }
					if (/\s+/g.test(this.transcationNum)) {
					  	uni.showToast({
					  		title: '不能输入空格',
					  		duration: 2000,
					  		icon: 'none'
					  	});
					  	return
					}
					if (!/^[1-9][0-9]*$/.test(this.transcationNum)) {
						uni.showToast({
							title: '只能输入数字',
							duration: 2000,
							icon: 'none'
						});
						return
					}
				}
			
			},
			
			addCarBrand() {
				uni.showToast({
					title: '开发中',
					icon:"none"
				})
			},
			toggleCar(index,item){
				this.carType=item.id
				this.conditionActive = item.id
			},
			// 外观颜色切换
			changeInColor(item,index) {
				this.activeC = index
				this.colorName = item.colorName
				this.colorMoney = item.money
			},
			// 内饰颜色切换
			changeOtherColor(item,index) {
				this.activeO = index
				this.colorNameO = item.colorName
				this.colorMoneyO = item.money
				this.colorNumO=item.colorNum
			},
			// 下一步
			nextBtn(){
				if(this.conditionActive == 2) {
					if((!this.dealerReferencePrice && this.dealerReferencePrice != 0) ||!validIntegerNum(this.dealerReferencePrice)
					) {
						uni.showToast({
							title: '请输入正确的车辆售价',
							duration: 2000,
							icon: "none"
						})
						return
					}else{
						if (!/^[1-9][0-9]*$/.test(this.dealerReferencePrice)) {
							uni.showToast({
								title: '车辆售价只能输入数字',
								duration: 2000,
								icon: "none"
							})
							return
						}
					}
					if((!this.transcationNum && this.transcationNum != 0) ||
							!validIntegerNum(this.transcationNum)
						) {
						uni.showToast({
							title: '请输入正确的过户次数',
							duration: 2000,
							icon: "none"
						})
						return
					}else{
						if (!/^[1-9][0-9]*$/.test(this.transcationNum)) {
							uni.showToast({
								title: '过户次数只能输入数字',
								duration: 2000,
								icon: "none"
							})
							return
						}
					}
				}
				
				let params={}
				if(this.conditionActive==2){
					params= {
						newOrOld: this.carType,
						carBrand: this.carBrandName,
						carBrandId: this.id,
						carTypeId: this.brandid,
						carTypeYear: this.carTypeYear,
						carTypeYearId: this.typeYearId,
						carTypeYearProduct: this.carTypeYearProduct,
						carTypeYearProductId: this.typeYearProductId,
					}
				}else{
					 params= {
						newOrOld: this.carType,
						carBrand: this.carBrandName,
						carBrandId: this.id,
						carTypeId: this.brandid,
						carTypeYear: this.carTypeYear,
						carTypeYearId: this.typeYearId,
						carTypeYearProduct: this.carTypeYearProduct,
						carTypeYearProductId: this.typeYearProductId,
						trimColor: this.colorNameO,
						carColor: this.colorName,
						colorConfigList: [
							{
								colorName: this.colorName,
								colorNum: this.colorNum,
								hasCheck: 1,
								money: this.colorMoney
							}
						],
						trimColorConfigList: [
							{
								colorName: this.colorNameO,
								colorNum: this.colorNumO,
								hasCheck: 1,
								money: this.colorMoneyO
							}
						],
					}
				}
				
				if(this.conditionActive == 2) {
					params.dealerReferencePrice = this.dealerReferencePrice-0 // 车辆价格
					params.transcationNum = this.transcationNum-0 // 过户次数
				}
				console.log(params,'params');
				uni.setStorageSync('getAddCar',params)//存储信息
				
				// this.$getRequest(this.$url.getAddCar,'POST',params).then((data) => {
				// 	var carid = data.data.carId
				// 	var newOrOld = data.data.newOrOld
				// 	if(data.code== 0) {
						uni.navigateTo({
							// url:'./uploadDriving?carid=' + carid+'&newOrOld='+newOrOld
							url:'./uploadDriving?newOrOld='+this.conditionActive
						})
				// 	}
				// })
				// uni.navigateTo({
				// 	// url:'./uploadDriving?carid=' + carid+'&newOrOld='+newOrOld
				// 	url:'./carConfig?newOrOld='+this.conditionActive
				// })
			},
			getCarConfigAndColorMethod() {
				var params = {id:this.typeYearProductId}
				this.$getRequest(this.$url.getCarConfigAndColor,'GET',params).then((data) => {
					if(data.code == 0) {
						this.inColor = data.data.inColors
						this.outColor = data.data.outColors
						for(var i =0; i< this.inColor.length; i++){
							console.log(this.inColor[0].colorNum,'this.inColor[0].colorNum');
							this.colorNameO = this.inColor[0].colorName
							this.colorMoneyO = this.inColor[0].money
							this.colorNumO = this.inColor[0].colorNum
						}
						for(var j =0; j< this.outColor.length; j++){
							this.colorName = this.outColor[0].colorName
							this.colorMoney = this.outColor[0].money
							this.colorNum= this.outColor[0].colorNum
						}
					}
				})
			}
		},
		created(){
			this.carBrandName = uni.getStorageSync('carBrandName');
			this.carBrandType = uni.getStorageSync('carBrandType');
			this.carYearType = uni.getStorageSync('carYearType');
			this.imageUrl = uni.getStorageSync('imageUrl');
			this.carType = uni.getStorageSync('carType');
			this.id = uni.getStorageSync('id')
			this.brandid = uni.getStorageSync('brandid')
			this.typeYearId = uni.getStorageSync('typeYearId')
			this.typeYearProductId = uni.getStorageSync('typeYearProductId')
			this.carBrand = uni.getStorageSync('carBrand')
			this.carTypeYear = uni.getStorageSync('carTypeYear')
			this.carTypeYearProduct = uni.getStorageSync('carTypeYearProduct')
			// console.log("this.imageUrl12:",this.imageUrl)
			this.getCarConfigAndColorMethod()
		},
		onLoad(option) {
			this.conditionActive = option.newOrOld
		},
		onShow(option) {
		},
	}
</script>

<style lang="scss" scoped>
	.car-t-title {
		font-size: 34rpx;
		font-weight: 600;
	}
	.color-title {
		font-size: 34rpx;
		// font-weight: 600;
	}
	.color-text {
		font-size: 24rpx;
	}
	.flex-center{
		display: flex;
		align-items: center;
	}
	.add-car{
		padding: 0;
		margin: 36rpx 32rpx;
		padding-bottom: 300rpx;
		.car-title{
			font-size: 36rpx;
			color: #3D3D3D;
			margin: 24rpx 0;
		}
		.content{
			padding: 44rpx 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-radius: 24rpx;
			background: #FFFFFF;
			box-shadow: 0px -2px 48px 0px rgba(10, 15, 45, 0.04),0px 8px 48px 0px rgba(10, 15, 45, 0.04);
			.left-c{
				display: flex;
				align-items: center;
				image{
					width: 43.46rpx;
					height: 43.46rpx;
				}
				text{
					font-size: 32rpx;
					color: #333333;
					margin-left: 28rpx;
				}
			}
			.right-img{


				width: 274rpx;
				height: 144rpx;
				image{
					width: 274rpx;
					height: 144rpx;
				}
			}
		}
		.content-info{
			padding: 14rpx 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-radius: 24rpx;
			background: #FFFFFF;
			width: 100%;
			height: 220rpx;
			box-shadow: 0px -2px 48px 0px rgba(10, 15, 45, 0.04),0px 8px 48px 0px rgba(10, 15, 45, 0.04);
			.left-c{
				width: 50%;
				text{
					font-size: 32rpx;
					color: #333333;
					margin-left: 28rpx;
				}
			}
			.right-img{
				width: 274rpx;
				image{
					height: 144rpx;
					width: 274rpx;
					// height: 182rpx;
					// height: 100%;
				}
			}
		}
		.car-condition{
			.title{
				font-size: 36rpx;
				color: #3D3D3D;
				margin: 40rpx 0 32rpx 0;
			}
			.toggle-car{
				display: flex;
				align-items: center;
				.toggle-car-box{
					border-radius: 8rpx;
					padding: 16rpx 80rpx;
					background: #F7F8FA;
					color: #1D2129;
					margin-right: 32rpx;
					text{
						font-size: 28rpx;
					}
				}
				.toggle-car-box.active{
					color: #FFFFFF;
					background: #4170EE;
				}
			}
			
			.car-color{
				margin-top:48rpx;
				.car-w-color {
					.car-w-title {
						.car-w-money {
							margin-left: 14rpx;
						}
					}
					.inColor {
						width: 60rpx;
						height: 60rpx;
						border-radius: 50%;
						margin: 30rpx;
						box-shadow:0 0 0 5px #fff;
					}
					.inColor.active {
						box-shadow:0 0 0 5px rgba(115, 117, 126, 0.3);
					}
				}
				.car-n-color {
					margin-top: 20rpx;
					.car-n-title {
						.car-n-money {
							margin-left: 14rpx;
						}
					}
					.otherColor {
						width: 60rpx;
						height: 60rpx;
						border-radius: 50%;
						margin: 30rpx;
						box-shadow:0 0 0 5px #fff;
						overflow:hidden;
						.topView{
							width: 60rpx;
							height: 30rpx;
						}
						.bomView{
							width: 60rpx;
							height: 30rpx;
						}
					}
					.otherColor.active  {
						box-shadow:0 0 0 5px rgba(115, 117, 126, 0.3);
					}
				}
			}
		}
		.next-btn{
			width: 686rpx;
			height: 116rpx;
			border-radius: 16rpx;
			background: #4170EE;
			line-height: 116rpx;
			text-align: center;
			position: fixed;
			bottom: 80rpx;
			text{
				font-size: 34rpx;
				color: #FFFFFF;
			}
		}
	}
	
	.form-wrap {
		margin-top: 56rpx;
		.title {
			font-size: 34rpx;
			font-weight: 600;
			line-height: 50rpx;
			color: #1D2129;
			margin-bottom: 32rpx;
		}
		.input-wrap {
			height: 104rpx;
			border-radius: 16rpx;
			background: rgba(10, 15, 45, 0.04);
			padding: 0 32rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 24rpx;
			.input-text {
				padding-right: 32rpx;
				font-size: 30rpx;
				color: #86909C;
				white-space: nowrap;
			}
			.transcation {
				display: flex;
				align-items: center;
				.unit {
					font-size: 30rpx;
					color: #0A0F2D;
					padding-left: 4rpx;
				}
			}
		}
	}
</style>