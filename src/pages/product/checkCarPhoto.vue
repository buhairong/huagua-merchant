<template>
	<view class="car-photo">
		<view class="content">
			<view class="left-text">
				<view class="name" v-for="(item, index) in car" :key="index" :class="{ 'active': carOption == index }"
					@click="carClick(index)">
					{{ item.name }}
				</view>
			</view>
			<view class="right-img">
				<!-- <view v-for="(itemP,indexP) in currentImgList" :key="indexP">
					<image mode="aspectFill" :src="itemP.image"></image>
				</view> -->
				<u-upload @on-remove="upRemove" ref="upLoad" @on-success="upSuccess" :index="carOption" :action="action"
					:file-list="currentImgList"></u-upload>
			</view>
		</view>
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
				{ name: '左前45度', carPicsType: 0, carPicList: [] },
				{ name: '车辆正前', carPicsType: 1, carPicList: [] },
				{ name: '右前45度', carPicsType: 2, carPicList: [] },
				{ name: '车辆正侧', carPicsType: 3, carPicList: [] },
				{ name: '左后45度', carPicsType: 4, carPicList: [] },
				{ name: '车辆正后', carPicsType: 5, carPicList: [] },
				{ name: '右后45度', carPicsType: 6, carPicList: [] },
				{ name: '车辆内饰', carPicsType: 7, carPicList: [] },
				{ name: '其他细节', carPicsType: 8, carPicList: [] },
				{ name: '提车照片', carPicsType: 9, carPicList: [] }
			],
			action: 'https://api.51cheyaoshi.com/merchantapp/sysFiles/upload',//图片上传地址
			// action: this.$url.uploadText,
			// https://uat-api.51cheyaoshi.com/merchantapp/sysFiles/upload'
			currentImgList: [],
			carid: '',
			newOrOld: '',
			orderId:''
		}
	},
	onLoad(option) {
		this.orderId = option.id
		this.carid = option.carId
		this.newOrOld = option.newOrOld
		this.currentImgList = JSON.parse(JSON.stringify(this.car[0].carPicList))
	},
	methods: {
		carClick(index) {
			this.$refs.upLoad.clear()
			this.carOption = index
			this.currentImgList = JSON.parse(JSON.stringify(this.car[index].carPicList))
		},
		async gotoOrderList() {
			for(let item of this.car){
				if(!item.carPicList.length){
					uni.showToast({
					  title: '请上传完整图片！',
					  duration: 2000,
					  icon: 'none'
					});
					return
				}
			}
			console.log(this.car)
			let params = {
				carId: this.carid,
				newOrOld: this.newOrOld,
				userCarSubscribeId:this.orderId,
				specificLocationCarPicsList: [],
				category: 1,
			}
			let picsList = this.car.map(item => {
				return { carPicList: item.carPicList, carPicsType: item.carPicsType }
			})
			params.specificLocationCarPicsList = picsList
			const res = await this.$getRequest(this.$url.uploadCarCheckedPics,'POST', params)
			console.log(res)
			if (res.code == 0) {
				uni.navigateBack()
			}
		},
		upSuccess(data, index, lists, name) {
			console.log(data, index, lists, name)
			let imgItem = { fileId: data.data.fileId, url: data.data.src }
			this.car[this.carOption].carPicList.push(imgItem)
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