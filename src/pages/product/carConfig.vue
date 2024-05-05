<template>
	<view class="car-config">
		<view class="content" v-for="(item,index) in carConfig" :key="index">
			<view class="title">{{item.function}}</view>
			<view style="display: flex;flex-direction: column;">
				<u-checkbox 
					v-for="(itemI, indexI) in item.details" :key="indexI" 
					@change="checkboxChange()" 
					v-model="itemI.hasCheck"
					:wrap="true"
					:name="itemI.detailName"
					size='30'
					label-size= '26'
					style="font-size:28rpx;color:#1D2129;">
					<view style="display:inline-block;width:200rpx;">{{itemI.detailName}}</view>
					<u-input disabled="true" style="display:inline-block;width:50%;" v-model="itemI.money" placeholder="请输入金额" />
					<view style="display:inline-block;margin-left:40rpx;">元</view>
				</u-checkbox>
			</view>
		</view>
		
		<view class="next-btn-box">
			<view style="font-size: 24rpx;color: #4E5969;margin-bottom:30rpx;">如车辆暂无增配项可跳过此流程</view>
			<view class="next-btn" @click="nextBtn"><text>下一步</text></view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return{
				carConfig: [],
				// money: '',
				carid: '',
				newOrOld: '',
			}
		},
		methods:{
			// 选中某个复选框时，由checkbox时触发
			checkboxChange(e) {
				console.log(e);
				// for(var i = 0; i < this.carConfig.length; i++){
				// 	for(var j = 0; j < this.carConfig[i].details.length; j++) {
				// 		if(e.name == this.carConfig[i].details[j].detailName) {
				// 			this.money = this.carConfig[i].details[j].money
				// 		}
				// 	}
				// }
			},
			// 下一步
			nextBtn() {
				var params = {
					carId:this.carid,
					newOrOld: this.newOrOld
				}
				this.$getRequest(this.$url.getCarOtherConfig,'POST',params).then((data) => {
					if(data.code == 0) {
						uni.navigateTo({
							url:'./uploadDriving?carid=' + this.carid+'&newOrOld='+this.newOrOld
						})
					}
				})
			},
			// 获取增配项
			getCarConfigAndColorMethod() {
				var params = {id:833}
				this.$getRequest(this.$url.getCarConfigAndColor,'GET',params).then((data) => {
					if(data.code == 0) {
						this.carConfig = data.data.otherConfigs
					}
				})
			}
		},
		created() {
			this.getCarConfigAndColorMethod()
		},
		onLoad(option) {
			this.carid = option.carid
			this.newOrOld = option.newOrOld
		}
	}
</script>

<style lang="scss" scoped>
	.car-config{
		padding: 0;
		margin: 36rpx 32rpx;
		.content{
			padding: 40rpx 32rpx;
			border-radius: 24rpx;
			background: #FFFFFF;
			margin-top: 24rpx;
			box-shadow: 0px -2px 48px 0px rgba(10, 15, 45, 0.04),0px 8px 48px 0px rgba(10, 15, 45, 0.04);
			.title{
				font-size: 32rpx;
				color: #1D2129;
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