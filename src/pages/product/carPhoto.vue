<template>
	<view class="car-photo">
		<view class="content">
			<view class="left-text">
				<view class="name" v-for="(item, index) in car" :key="index" :class="{ 'active': carOption == index }"
					@click="carClick(index)">
					<text v-show="
					item.carPicsType==0&&newOrOld==2
					||item.carPicsType==1&&newOrOld==2
					||item.carPicsType==3&&newOrOld==2
					||item.carPicsType==5&&newOrOld==2"
					style="color:#EE3833"
					>*</text> {{ item.name }}
				</view>
			</view>
			<view class="right-img">
				<!-- <u-loading-icon></u-loading-icon> -->
				<!-- <view v-for="(itemP,indexP) in currentImgList" :key="indexP">
					<image mode="aspectFill" :src="itemP.image"></image>
				</view> -->
				
				<u-upload @on-remove="upRemove" ref="upLoad" @on-success="upSuccess" :index="carOption" :action="action"
					:file-list="currentImgList"></u-upload>
			</view>
		</view>
		<!-- <u-loading-icon text="加载中" textSize="18"></u-loading-icon> -->
		<view class="bindBtn" @click="gotoOrderList">
			<text>完成</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
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
			action: 'https://api.51cheyaoshi.com/merchantapp/sysFiles/upload',//图片上传地址
			// action: this.$url.uploadText,//图片上传地址
			// 'https://uat-api.51cheyaoshi.com/merchantapp/sysFiles/upload'
			currentImgList: [],
			carid: '',
			newOrOld: ''
		}
	},
	onLoad(option) {
		this.carid = option.carid
		this.newOrOld = option.newOrOld
		this.currentImgList = JSON.parse(JSON.stringify(this.car[0].carPicList))
	},
	methods: {
		carClick(index) {
			if(this.carOption == index){
			}else{
				this.$refs.upLoad.clear()
				this.carOption = index
				// this.currentImgLis=[{fileId:'1570364456506962046',url:'https://image.51cheyaoshi.com/2022/09/22/e531337533ad40f5bd4394d79542a87b.png'},]
				this.currentImgList = JSON.parse(JSON.stringify(this.car[index].carPicList))
				console.log(this.currentImgList,'currentImgList');
				// this.currentImgList = this.car[index].carPicList
				console.log(this.car[index].carPicList,'carPicList');
			}
		},
		toastMsg(msg) {
		  uni.showToast({
		      title: msg,
		      duration: 2000,
		      icon: 'none'
		  });
		},
		async gotoOrderList() {
			let params = {
				carId: this.carid,
				newOrOld: this.newOrOld,
				specificLocationCarPicsList: []
			}
			if(this.newOrOld=='2'){
				if(this.car[0].carPicList.length<1){
					this.toastMsg('请上传左前45°照片')
					return
				}
				if(this.car[1].carPicList.length<1){
					this.toastMsg('请上传正前视角照片')
					return
				}
				if(this.car[2].carPicList.length<1){
					this.toastMsg('请上传正侧视角照片')
					return
				}
				if(this.car[3].carPicList.length<1){
					this.toastMsg('请上传正后视角照片')
					return
				}
			}
			let picsList = this.car.map(item => {//车辆照片合集
				return { carPicList: item.carPicList, carPicsType: item.carPicsType }
			})
			let getAddCar=uni.getStorageSync('getAddCar')
			let getCarTravelLicense=uni.getStorageSync('getCarTravelLicense')
			let updateCarInsuranceInfo=uni.getStorageSync('updateCarInsuranceInfo')
			params={
				...getAddCar,
				...getCarTravelLicense,
				...updateCarInsuranceInfo,
				carTypeYearProductId:uni.getStorageSync('typeYearProductId'),
				specificLocationCarPicsList:picsList,
				otherConfigList:[],
			}
			if(this.newOrOld=='2'){
				params.colorConfigList=[]
				params.trimColorConfigList=[]
			}
			const res = await this.$getRequest(this.$url.addCarAtLastPage,'POST', params)
			if (res.code == 0) {
				this.toastMsg('添加成功')
				uni.switchTab({
					url: '/pages/product/carList'
				})
			}
		},
		upSuccess(data, index, lists, name) {
			console.log(data, index, lists, name)
			let imgItem = { fileId: data.data.fileId, url: data.data.src }
			console.log(imgItem);
			this.car[this.carOption].carPicList.push(imgItem)
			console.log(this.car);
		},
		upRemove(index) {
			this.car[this.carOption].carPicList.splice(index, 1)
		}
	}

}
</script>

<style lang="scss" scoped>
.car-photo {
	padding: 0;

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
			width: 68%;
			margin-left: 20rpx;
			display: flex;
			// flex-wrap: wrap;
			flex-direction: column;
			height: 154rpx;

			view {
				width: 100%;
				height: 154rpx;
				margin-top: 20rpx;

				image {
					width: 100%;
					height: 154rpx;
				}
			}
		}
	}

	.bindBtn {
		position: fixed;
		bottom: 26rpx;
		right: 0;
		left: 0;
		margin: 0 auto;
		width: 80%;
		text-align: center;
		background: #4170EE;
		height: 107rpx;
		border-radius: 16rpx;
		line-height: 107rpx;
		font-size: 34rpx;
		color: #FFFFFF
	}
}
</style>