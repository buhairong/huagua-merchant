<template>
	<view class="">
	<view class="car-detail">
		<view class="top-car-info">
			<view class="left-name-box">
				<view class="title">{{carDetail.carBrand}} {{carDetail.carType}}</view>
				<view class="text">{{carDetail.carTypeYear}} {{carDetail.carTypeYearProduct}}</view>
				<view class="num" v-if="carDetail.carPlateNum!=''">
					<text class="text">{{carDetail.carPlateNum.charAt(0)}}</text>
					<text class="numberText">{{carDetail.carPlateNum.substring(1,20)}}</text>
				</view>
			</view>
			<view class="right-img-box">
				<image class="car-img" mode="aspectFill" src="https://image.51cheyaoshi.com/xcx/merchant/static/home/launch.png"></image>
				<image class="duigou" src="https://image.51cheyaoshi.com/xcx/merchant/static/product/duigou.png"></image>
			</view>
		</view>
		<u-line color="#F2F3F5" />
		<view class="car-info-content">
			<view class="car-tabbar">
				<text class="car car-tabbar-title" :class="{'active':carType == 'carInfo'}" @click="toggleTabbar('carInfo')">车辆信息</text>
				<text class="car car-tabbar-title m-left" :class="{'active':carType == 'safeInfo'}" @click="toggleTabbar('safeInfo')">保险信息</text>
				<text class="car car-tabbar-title m-left" :class="{'active':carType == 'carImg'}" @click="toggleTabbar('carImg')">车辆照片</text>
			</view>
			<view class="car-one" v-show="carType=='carInfo'">
				<view class="basic-info">
					<view class="o-c-t">
						<view class="o-content-title">基本信息</view>
					</view>
					<view class="order-self">
						<u-row class="o-content-row">
							<u-col span="4" class="o-content-title left-col font-col" style="word-spacing: 22px;">车 况：</u-col>
							<u-col span="8"><text class="f-right font-col">{{carDetail.newOrOld==1?'新车':carDetail.newOrOld==2?'二手车':''}}</text></u-col>
						</u-row>
					<!-- 	v-if="carDetail.newOrOld==2"
						v-if="carDetail.newOrOld==2" -->
						<!-- {{newOrOld==2}} -->
						<u-row class="o-content-row" v-if="newOrOld==1">
							<u-col span="4" class="o-content-title left-col font-col">外观颜色：</u-col>
							<u-col span="8"><text class="f-right font-col">{{carDetail.carColor}}</text></u-col>
						</u-row>
						<u-row class="o-content-row" v-if="newOrOld==1">
							<u-col span="4" class="o-content-title left-col font-col">内饰颜色：</u-col>
							<u-col span="8"><text class="f-right font-col">{{carDetail.trimColor}}</text></u-col>
						</u-row>
						<u-row class="o-content-row">
							<u-col span="4" class="o-content-title left-col font-col">实表里程：</u-col>
							<u-col span="8"><text class="f-right font-col" v-show="carDetail.mileage!=null">{{carDetail.mileage}}</text></u-col>
						</u-row>
						<u-row class="o-content-row">
							<u-col span="4" class="o-content-title left-col font-col" style="word-spacing: 3px;">车 架 号：</u-col>
							<u-col span="8"><text class="f-right font-col">{{carDetail.carVin}}</text></u-col>
						</u-row>
						<u-row class="o-content-row">
							<u-col span="4" class="o-content-title left-col font-col">发动机号：</u-col>
							<u-col span="8"><text class="f-right font-col">{{carDetail.carEngineNum}}</text></u-col>
						</u-row>
					</view>
				</view>
<!-- 				
				<view class="basic-info">
					<view class="o-c-t">
						<view class="o-content-title">车辆增配</view>
					</view>
					<view class="order-self">
						<u-row class="o-content-row">
							<u-col span="4" class="o-content-title left-col font-col">灯光功能：</u-col>
							<u-col span="8"><text class="f-right font-col">矩阵式灯光 1000元</text></u-col>
						</u-row>
						<u-row class="o-content-row">
							<u-col span="4" class="o-content-title left-col font-col">被动安全：</u-col>
							<u-col span="8"><text class="f-right font-col">矩阵式灯光 1000元</text></u-col>
						</u-row>
					</view>
				</view>
				 -->
				<u-gap
				    v-if="showNote"
				    height="150"
				    margin-top="50"
				    bg-color="#FFFFFF"
				/>
				<!-- <view class="foot-but u-flex-1 but but-bg ">
				   <view
				        class="foot-but-r u-text-center"
				        @click="">
				        修改车辆信息
				    </view>
				</view> -->
			</view>
			<!-- 保险信息 -->
			<view class="car-two" v-show="carType=='safeInfo'">
				<view v-if="carDetail.insuranceList.length<2&&carDetail.insuranceList[0].insuranceType!=0" class="one-box" style="margin-top: 24rpx;">
					 <view class="title">机动车交强险</view>
					 <view class="addImg" @click="nextStep(0,'set')">
						 <image src="https://image.51cheyaoshi.com/xcx/merchant/static/product/Group.png"></image>
						 <text>添加电子保险单或照片</text>
					 </view>
				</view>
				
				<view v-if="carDetail.insuranceList.length>0" v-for="item,index in carDetail.insuranceList" :key="index" class="one-box" >
					 <view class="title">{{item.insuranceType==0?'机动车交强险':'机动车商业险'}}</view>
					 <view @click="nextStep(index)" v-if="!item.insuranceNo" class="addImg">
						 <image src="https://image.51cheyaoshi.com/xcx/merchant/static/product/Group.png"></image>
						 <text>添加电子保险单或照片</text>
					 </view>
					 <view v-else>
						<view class="companyName">{{insuranceName(item.insuranceCompany)}}</view>
						<view class="companyInfo">
							<view>{{carDetail.carPlateNum}}</view>
							<view @click="nextSee(item.insuranceType,item)">查看保单</view>
							<view @click="nextStep(item.insuranceType,'get',item)">修改保单</view>
						</view>
					 </view>
				</view>
<!-- @click="gotoPopup" -->
				<view v-if="carDetail.insuranceList.length<2&&carDetail.insuranceList[0].insuranceType!=1" class="one-box" style="margin-top: 24rpx;" >
					 <view class="title">机动车商业险</view>
					 <view class="addImg" @click="nextStep(1,'set')">
						 <image src="https://image.51cheyaoshi.com/xcx/merchant/static/product/Group.png"></image>
						 <text>添加电子保险单或照片</text>
					 </view>
				</view>
				
<!-- 				<view class="add-box">
					 <view class="title">机动车交强险</view>
					 <view class="text">中国平安车险</view>
					 <view class="footerImg">
						 <text class="carNum">沪A88888</text>
						 <view class="right-t">
							 <view class="flex-center">
								 <image src="https://image.51cheyaoshi.com/xcx/merchant/static/product/see.png"></image>
								 <text>查看保单</text>
							 </view>
							 <view class="flex-center" style="margin-left:48rpx;">
								 <image src="https://image.51cheyaoshi.com/xcx/merchant/static/product/revise.png"></image>
								 <text>修改保单</text>
							 </view>
						 </view>
					 </view>
				</view> -->

			</view>
			
		</view>
		
		<view>
			<u-modal v-model="showModal" title=" " confirm-text="好的">
				<image style="width:128rpx;height:172rpx;margin:0 auto;display:block;" :src="src"></image>
				<view style="font-size: 36rpx;color: #000000;text-align: center;">添加成功</view>
				<view style="font-size:32rpx;text-align: center;margin:16rpx 0 40rpx 0;">玛莎拉蒂 Ghibli</view>
				<view style="font-size:28rpx;color: rgba(10, 15, 45, 0.5);text-align: center;margin:16rpx 0 40rpx 0;">2018款 3.0T 350Hp 经典版</view>
			</u-modal>
		</view>
	</view>
	<view class="car-three" v-show="carType=='carImg'">
		<view class="content">
			<view class="left-text">
				<view class="name" v-for="(item, index) in car" :key="index" :class="{ 'active': carOption == item.carPicsType}"
					@click="carClick(item.carPicsType)">
					{{ item.name }}
				</view>
			</view>
			<view class="right-img">
				<view v-for="item,index in currentImgList" :key="index" class="imgItem">
					<image class="itemSrc" :src="item.url" mode="aspectFit"></image>
				</view>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				showNote: true,
				carType:'carInfo',
				showModal:false,
				src:"../..https://image.51cheyaoshi.com/xcx/merchant/static/product/complete_1.png",
				id:'',
				newOrOld:'',
				carDetail:{
					insuranceList:[]
				},
				carOption: 0,
				car: [
					{ name: '左前45°', carPicsType: 0, carPicList: [] },
					{ name: '正前视角', carPicsType: 1, carPicList: [] },
					{ name: '正侧视角', carPicsType: 3, carPicList: [] },
					{ name: '正后视角', carPicsType: 5, carPicList: [] },
					{ name: '车辆内饰', carPicsType: 7, carPicList: [] },
					{ name: '右前45°', carPicsType: 2, carPicList: [] },
					{ name: '左后45°', carPicsType: 4, carPicList: [] },
					{ name: '右后45°', carPicsType: 6, carPicList: [] },
					{ name: '其他视角', carPicsType: 8, carPicList: [] },
				],
				currentImgList: [],
				actionSheetList:[]
			}
		},
		onShow() {
			// this.getInsCompany()
			this.getCarDetail()
		},
		onLoad(option){
			this.id = option.id
			this.newOrOld = option.newOrOld
			this.getInsCompany()
			uni.setStorageSync('carInfo',{
			    carId:this.id,
			    newOrOld:this.newOrOld,
			    insCompany:[{
					insuranceCompany:'',
					insuranceNumber: '',
					amountOfThree:'',
					lastValidDate: '',
					imageUrl: '',
					fileId:'',
			        value: '',
					imgArr:[]
				},{
					insuranceCompany:'',
					insuranceNumber: '',
					amountOfThree:'',
					lastValidDate: '',
					imageUrl: '',
					fileId:'',
			        value: '',
					imgArr:[]
				}]
			 })
		},
		computed:{
			insuranceName:function() {
				return (id) => {
					for(let i of this.actionSheetList){
						if(id == i.id){
							return i.insuranceName
						}
					}
					return ''
				}
				
			}
		},
		methods:{
			// 切换内容
			toggleTabbar(type) {
				this.carType = type
			},
			gotoPopup(){
				this.showModal = true
			},
			nextStep(type,method,item){
				console.log(item,'itemitem');
				uni.setStorageSync('insuranceList',item)
				if(method=='set'){
					uni.navigateTo({
						url:'./addCarPolicy?carid=' + this.id+'&newOrOld='+this.newOrOld+'&type='+type+'&name=set'
					})
				}else{
					console.log('修改');
					uni.navigateTo({
						url:'./addCarPolicy?carid=' + this.id+'&newOrOld='
						+this.newOrOld+'&type='+type+'&name=get'+'&insuranceId='+item.id+'&imgArr='+item.insurancePicsList
					})
				}
			},
			nextSee(index,item) {
				uni.setStorageSync('insuranceList',item)
				uni.navigateTo({
					url:'./seePolicy?type='+index
				})
			},
			// 获取车辆详情
			getCarDetail(){
				let params={
					id:this.id,
					newOrOld:this.newOrOld
				}
				this.$getRequest(this.$url.findCarInfoById,'POST',params).then(res => {
					this.carDetail = res.data
					let carInfo = JSON.parse(JSON.stringify(uni.getStorageSync('carInfo')))
					this.carDetail.insuranceList.map((item,index) => {
						let params = {
							value:this.getName(item.insuranceCompany),
							insuranceCompany:item.insuranceCompany,
							amountOfThree:item.amountOfThree,
							lastValidDate:item.expireDate,
							insuranceNumber:item.insuranceNo,
							imageUrl:item.insurancePicsList[0].url,
							
						}
						if(JSON.stringify(this.carDetail.carPicsMap)!='{}'){
							this.currentImgList = this.carDetail.carPicsMap['0']
						}
						
						carInfo.insCompany[index] = params
					})
					uni.setStorageSync('carInfo',carInfo)
				})
			},
			getName(id){
				console.log(id,'-----')
				for(let i of this.actionSheetList){
					if(id == i.id){
						return i.insuranceName
					}
				}
				return ''
			},
			// 获取保险公司列表
			async getInsCompany(){
			    const res =  await this.$getRequest(this.$url.listInsuranceCompany, 'POST', {})
			    this.actionSheetList = res.data
				this.getCarDetail()
			},
			carClick(index) {
				this.carOption = index
				if(JSON.stringify(this.carDetail.carPicsMap)!='{}' && this.carDetail.carPicsMap[index+'']){
					this.currentImgList = this.carDetail.carPicsMap[index+'']
				}else{
					this.currentImgList = []
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	.one-box{
		height: 260rpx;
		padding: 40rpx 32rpx;
		border-radius: 24rpx;
		background: #FFFFFF;
		box-shadow: 0px -2px 48px 0px rgba(10, 15, 45, 0.04),0px 8px 48px 0px rgba(10, 15, 45, 0.04);
		margin-top: 24rpx;
		&:first-child{
			margin-top: 0;
		}
		.title{
			font-size: 32rpx;
			color: #1D2129;
		}
		.companyName{
			font-size: 14px;
			color: #666;
			margin-top: 10rpx;
		}
		.companyInfo{
			margin-top: 30rpx;
			font-size: 14px;
			color: #666;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.addImg{
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 68rpx;
			image{
				width: 40rpx;
				height: 40rpx;
			}
			text{
				margin-left: 16rpx;
				font-size: 28rpx;
				color: #4E5969;
			}
		}
	}
	.content {
		display: flex;
		width: 100%;
	
		.left-text {
			width: 30%;
			background-color: #eee;
			display: flex;
			flex-direction: column;
	
			.name {
				padding: 30rpx;
				color: #848484;
			}
	
			.name.active {
				background-color: #35D687;
				color: #FFFFFF;
			}
		}
	
		.right-img {
			width: 70%;
			.imgItem{
				width: 50%;
				display: inline-block;
				vertical-align: middle;
				margin-top: 10px;
				.itemSrc{
					width: 90%;
					height: 90px;
					display: block;
					margin: 0 auto;
				}
			}
	
			
		}
	}
	.flex-center{
		display: flex;
		align-items: center;
	}
	.car-tabbar-title{
		font-size: 28rpx;
		color: #4E5969;
	}
	.m-left{
		margin-left:40rpx;
	}
	.left-col{
		color: #86909C;
	}
	.font-col{
		font-family: PingFangSC-Regular;
	}
	.foot-but {
	    position: fixed;
	    left: 40rpx;
	    right: 40rpx;
	    z-index: 1;
	    margin: 0 auto;
	    z-index: 111;
	    bottom: 60rpx;
	}
	.car-detail{
		padding: 0;
		margin: 36rpx 32rpx;
		margin-bottom: 0;
		.top-car-info{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 50rpx;
			margin-bottom: 40rpx;
			.left-name-box{
				.title{
					font-size: 32rpx;
					color: #1D2129;
				}
				.text{
					font-size: 24rpx;
					color: #86909C;
				}
				.num{
					font-size: 24rpx;
					color: #1D2129;
					margin-top: 24rpx;
					color: #6A6A6A;
					margin-bottom: 11px;
					height: 19px;
					width: 115px;
					border-radius: NaNpx 2px 2px 2px;
					border: 1px solid #1D2129;
					font-size: 12px;
					.text{
						font-family: PingFangSC-Medium;
						font-size: 12px;
						font-weight: normal;
						line-height: 17px;
						letter-spacing: 0em;
						color: #FFFFFF;
						background:#1D2129 ;
						padding: 1px 4px;
						border-radius: NaNpx 2px 2px 2px;
					}
					.numberText{
						font-family: PingFangSC-Medium;
						font-size: 12px;
						font-weight: normal;
						line-height: 17px;
						letter-spacing: 0em;
						color: #1D2129;
						padding: 1px 7px;
					}
				}
			}
			.right-img-box{
				width: 290rpx;
				height: 152rpx;
				position: relative;
				.car-img{
					width: 290rpx;
					height: 152rpx;
				}
				.duigou{
					position: absolute;
					bottom: 0;
					right: 0;
					width: 40rpx;
					height: 40rpx;
				}
			}
		}
		.car-info-content{
			margin-top:40rpx;
			.car-tabbar{
				display: flex;
				align-items: center;
				.car.active{
					font-size: 34rpx;
					color: #000000;
					border-bottom:1px solid blue;
				}
			}
			.car-one{
				.basic-info{
					padding: 20rpx 12rpx 20rpx 16rpx;
					margin-top: 32rpx;
					border-radius: 24rpx;
					box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02),
						0px 8px 24px rgba(10, 15, 45, 0.06);
						.o-c-t{
							margin-top: 16rpx;
							padding-left: 16rpx;
							.o-content-title {
								position: relative;
								padding-left: 20rpx;
								font-size: 32rpx;
								color: #1D2129;
							}
							.o-content-title:before {
								content: "";
								position: absolute;
								width: 4rpx;
								height: 28rpx;
								border-radius: 4rpx;
								background-color: #165DFF;
								top: 10rpx;
								left: 4rpx;
							}
						}
					.order-self {
						margin-top: 16rpx;
						padding-left: 16rpx;
						.o-content-row{
							line-height: 2.2;
						}
					}
				}
			}
			.car-two{
				.one-box{
					height: 260rpx;
					padding: 40rpx 32rpx;
					margin-top: 32rpx;
					border-radius: 24rpx;
					background: #FFFFFF;
					box-shadow: 0px -2px 48px 0px rgba(10, 15, 45, 0.04),0px 8px 48px 0px rgba(10, 15, 45, 0.04);
					.title{
						font-size: 32rpx;
						color: #1D2129;
					}
					.addImg{
						display: flex;
						align-items: center;
						justify-content: center;
						margin-top: 68rpx;
						.bx_img{
							width: 290rpx;
							height: 152rpx;
						}
						text{
							margin-left: 16rpx;
							font-size: 28rpx;
							color: #4E5969;
						}
					}
				}
				
				.add-box{
					margin-top: 24rpx;
					height: 260rpx;
					padding: 40rpx 32rpx;
					border-radius: 24rpx;
					background: #FFFFFF;
					box-shadow: 0px -2px 48px 0px rgba(10, 15, 45, 0.04),0px 8px 48px 0px rgba(10, 15, 45, 0.04);
					.title{
						font-size: 32rpx;
						color: #1D2129;
					}
					.text{
						margin-top: 10rpx;
						font-size: 28rpx;
						color: #86909C;
					}
					.footerImg{
						margin-top: 44rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.carNum{
							font-size: 24rpx;
							color: #1D2129;
							border-radius: 1px 4rpx 4rpx 4rpx;
						}
						.right-t{
							display: flex;
							align-items: center;
							image{
								width: 32rpx;
								height: 32rpx;
							}
							
						}
					}
				}
			}
		}
	}
</style>