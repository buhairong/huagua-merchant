<template>
	<view class="add-policy">
		 <view v-for="item,index in insCompany" :key="index" class="one-box" >
			 <view class="title">{{index==0?'机动车交强险':'机动车商业险'}}</view>
			 
			 <view @click="nextStep(index)" v-if="!item.imageUrl" class="addImg">
				 <image src="https://image.51cheyaoshi.com/xcx/merchant/static/product/Group.png"></image>
				 <text>添加电子保险单或照片</text>
			 </view>
			 <view v-else>
				<view class="companyName">{{item.value}}</view>
				<view class="companyInfo">
					<view>{{carPlateNum}}</view>
					<view @click="nextSee(index,item)">查看保单</view>
					<view @click="nextStep(index,item)">修改保单</view>
				</view>
			 </view>
		 </view>
		 <view class="next-btn-box">
		 	<view style="font-size: 24rpx;color: #4E5969;margin-bottom:30rpx;">如车辆暂无保单信息可跳过此流程</view>
		 	<view class="next-btn" @click="backList"><text>下一步</text></view>
		 </view>
	</view>
</template>

<script>
	export default {
		data() {
			return{
				carId:'',
				newOrOld:'',
				insCompany:[],
				carPlateNum:''
			}
		},
		onLoad(option){
			this.carId = option.carId
			this.newOrOld = option.newOrOld
			this.carPlateNum = option.carPlateNum
			uni.setStorageSync('carInfo',{
			carId:this.carId,
			newOrOld:this.newOrOld,
			insCompany:[{
					insuranceCompany:'',
					insuranceNumber: '',
					amountOfThree:'',
					lastValidDate: '',
					imageUrl: '',
					fileId:'',
					value: '',
				},{
					insuranceCompany:'',
					insuranceNumber: '',
					amountOfThree:'',
					lastValidDate: '',
					imageUrl: '',
					fileId:'',
					value: '',
			}]
		 })
		},
		onShow(){
			let carInfo = uni.getStorageSync('carInfo') //保险单
			if(carInfo){
				console.log(carInfo,1111);
				this.insCompany = carInfo.insCompany
			}
		},
		methods:{
			nextStep(type,item){
				console.log(item,1111);
				uni.setStorageSync('insuranceList',item)
				uni.navigateTo({
					url:'./addCarPolicy?carid=' + this.carId+'&newOrOld='+this.newOrOld+'&type='+type
				})
			},
			nextSee(index,item) {
				uni.setStorageSync('insuranceList',item)
				uni.navigateTo({
					url:'./seePolicy?type='+index
				})
			},
			async backList(){
				let params = {
					// carId:this.carId*1,
					newOrOld:this.newOrOld*1,
					insuranceList:[]
				}
				let insuranceList = this.insCompany.map((item,index) => {
					let temp = {}
					temp.amountOfThree = item.amountOfThree
					temp.expireDate = item.lastValidDate
					temp.insuranceCompany = item.insuranceCompany
					temp.insuranceNo = item.insuranceNumber
					temp.insurancePicsList = item.imgArr
					temp.insuranceType = index
					return temp
				})
				
				let arr=[]
				if(insuranceList[0].insuranceNo!=''){
					arr.push(insuranceList[0])
				}
				if(insuranceList[1].insuranceNo!=''){
					arr.push(insuranceList[1])
				}
				params.insuranceList = arr
				uni.setStorageSync('updateCarInsuranceInfo',params)//存储信息
				// const res = await this.$getRequest(this.$url.updateCarInsuranceInfo, 'POST', params)  //接口
				uni.navigateTo({
					// url:'./carPhoto?carid=' + this.carId+'&newOrOld='+this.newOrOld+'&type='+this.type
					url:'./carPhoto?newOrOld='+this.newOrOld+'&type='+this.type
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.flex-center{
		display: flex;
		align-items: center;
	}
	.add-policy {
		padding: 0;
		margin: 36rpx 32rpx;
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
		.next-btn-box{
			position: fixed;
			bottom: 80rpx;
			.next-btn{
				width: 686rpx;
				height: 116rpx;
				border-radius: 16rpx;
				background: #4170EE;
				line-height: 116rpx;
				text-align: center;
				text{
					font-size: 34rpx;
					color: #FFFFFF;
				}
			}
		}
	}
</style>