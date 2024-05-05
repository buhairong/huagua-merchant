<template>
	<view class="carList">
		<view class="top-tabbar">
			<view class="top-l-title"></view>
			<view class="top-r-title">
				<view class="left-t">
					<text class="car-t" 
						:class="{'active':carType == 1}"
						@click="toggleCarList('1')">新车</text>
					<text>/</text>
					<text class="car-t" 
						:class="{'active':carType == 2}"
						@click="toggleCarList('2')">二手车</text>
				</view>
				<!-- <view class="right-t" @click="show= true"> -->
				<view class="right-t">
					<text>车辆品牌</text>
				</view>
			</view>
		</view>
		
		<!-- 新车 -->
		<view class="content-box" >
			<view class="content-list"
				v-for="(item, index) in newCarList"
				:key="index"
				@click="gotoDetail(item.id)">
				<view class="car-info">
					<view class="title">{{item.carBrand}} {{item.carType}}<text class="font-24" v-show="item.carColor">{{item.carColor}}</text></view>
					<view class="type font-24">{{item.carTypeYear}} {{item.carTypeYearProduct}}</view>
					<view class="xsz font-24 margin-top-16" v-show="item.uploadDriverLicence == 0"><text>行驶证</text>：待上传</view>
					<view class="xsz font-24 margin-top-16" v-show="item.uploadDriverLicence == 1"><text>行驶证</text>：已上传</view>
					<view class="val-text font-24 margin-top-16" v-show="item.uploadCarInsurance == 0"><text class="val-title">保险单</text>：待上传</view>
					<view class="val-text font-24 margin-top-16" v-show="item.uploadCarInsurance == 1"><text class="val-title">保险单</text>：已上传</view>
					<view class="val-text font-24 margin-top-16"><text class="val-title">车架号</text>：{{item.carVin}}</view>
					<view class="val-text font-24 margin-top-16"><text class="val-title">发动机号</text>：{{item.carEngineNum}}</view>
				</view>
				<view class="car-img">
					<view class="cph" v-if="item.carPlateNum!=''">
						<text class="text">{{item.carPlateNum.charAt(0)}}</text>
						<text class="numberText">{{item.carPlateNum.substring(1,20)}}</text>
					</view>
					<image mode="aspectFill" class="img" :src="item.imageUrl"></image>
					<image v-show="carType==2"  class="spot" src="https://image.51cheyaoshi.com/xcx/merchant/static/product/duigou.png"></image>
					<image v-show="item.bindedSubscribeOrder==1&&carType==1" class="spot" src="https://image.51cheyaoshi.com/xcx/merchant/static/product/duigou.png"></image>
				</view>
			</view>
			<u-divider v-show="showNoMore" margin-top="20">没有更多了～</u-divider>
		</view>
		<!-- 二手车 -->
		<view class="content-box" v-show="carType==8">
			<view class="content-list"
				v-for="(item, index) in carInfoLists"
				:key="index">
				<view class="car-info">
					<view class="title">{{item.title}} <text class="font-24">{{item.color}}</text></view>
					<view class="type font-24">{{item.type}}</view>
					<view class="xsz font-24 margin-top-16"><text>行驶证</text>：{{item.card}}</view>
					<view class="val-text font-24 margin-top-16"><text class="val-title">发动机号</text>：{{item.jihao}}</view>
				</view>
				<view class="car-img">
					<!-- <view class="cph">{{item.paihao}}</view> -->
					<view class="cph" v-if="item.paihao!=''">
						<text class="text">{{item.paihao.charAt(0)}}</text>
						<text class="numberText">{{item.paihao.substring(1,20)}}</text>
					</view>
					<image mode="aspectFill" class="img" :src="item.img"></image>
					<image class="spot" src="https://image.51cheyaoshi.com/xcx/merchant/static/product/duigou.png"></image>
				</view>
			</view>
		</view>
		
		<u-popup mode="bottom" v-model="xianshi">
			<view class="content">
				<scroll-view scroll-y="true" style="height: 500rpx;padding: 40rpx;">
					<view>
						<view style="line-height: 2;margin:10rpx; 0 10rpx 40rpx;" 
							v-for="(item,index) in carTypeArray" 
							:key="index"
							@click="showTwoMenu(item)">
							{{item.brandName}}
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
		
		<zhilin-cascader v-model="show" :options="options" @confirm="onConfirm" 
			@carImg="imageUrls"
			@carBrandId="brandids"
			@carTypeYearId="typeYearIds"
			@carTypeYearProductId="typeYearProductIds"
			@carBrand="carBrands"
			@carTypeYear="carTypeYears"
			@change="carTypeIdFn"
			@carTypeYearProduct="carTypeYearProducts">
		</zhilin-cascader>

		<u-gap
		    v-if="showNote"
		    height="120"
		    margin-top="50"
		    bg-color="#FFFFFF"
		/>
		<view @click="handleBookCar" class="addImg">
			<image src="https://image.51cheyaoshi.com/xcx/merchant/static/product/515.png"></image>
		</view>
	</view>
</template>

<script>
	import ZhilinCascader from 'zhilin-cascader/zhilin-cascader'
	export default {
		components:{
			ZhilinCascader
		},
		data() {
			return {
				pageNo: 1,
				pageSize: 10,
				totalPage: '',
				// 提示没有更多了
				showNoMore: false,
				options:[],
				show: false,
				showNote: true,
				// 1是新车2是二手车
				carType: 1,
				// 新车
				newCarList:[],
				// 二手车
				carInfoLists:[],
				carTypeArray: [],
				xianshi: false,
				// 车品牌id
				id: '',
				// 车品牌名字
				carBrandName: '',
				// 车品牌型号
				carBrandType:'',
				// 车年款型号
				carYearType:'',
				// 车图片
				carImg:'',
				brandid:'',
				typeYearId:'',
				typeYearProductId:'',
				carBrand:'',
				carTypeYear:'',
				carTypeYearProduct:'',
			}
		},
		
		methods: {
			leftText(text){
				
			},
			confirm(e) {
				// 返回值为一个数组
				console.log('eeee', e);
			},
			// 切换新/二手车
			toggleCarList(type) {
				this.carType = type
				this.newCarList=[]
				this.pageNo=1
				this.getCarListMethod()
			},
			// 添加车辆
			handleBookCar() {
				this.xianshi = true
				this.getCarBrandListMethod()
			},
			imageUrls(carImg){
				this.carImg = carImg
			},
			brandids(brandId){
				console.log(brandId,'brandId');
				this.brandid = brandId
			},
			typeYearIds(typeYearId){
				// console.log(typeYearId,111,888);
				this.typeYearId = typeYearId
			},
			typeYearProductIds(typeYearProductId) {
				console.log(typeYearProductId,'typeYearProductId');
				this.typeYearProductId=typeYearProductId
			},
			carBrands(carBrand){
				this.carBrand = carBrand
			},
			carTypeYears(carTypeYear){
				this.carTypeYear = carTypeYear
			},
			carTypeYearProducts(carTypeYearProduct){
				this.carTypeYearProduct = carTypeYearProduct
			},
			carTypeIdFn(val){
				let name=val[0]
				this.options.forEach((v)=>{
					if(v.brandType==name){
						this.brandid=v.carTypeId
					}
				})
			},
			onConfirm(value) {
				// console.log("组件1234",this.carImg)
			    console.log(value)
				this.carBrandType = value[0]
				this.carYearType = value[1]
				if(this.carYearType){
					uni.navigateTo({
						url:'./addCar?newOrOld='+this.carType
					})
					uni.setStorageSync('carBrandName',this.carBrandName)
					uni.setStorageSync('carBrandType',this.carBrandType)
					uni.setStorageSync('carYearType',this.carYearType)
					uni.setStorageSync('imageUrl',this.carImg)
					uni.setStorageSync('carType',this.carType)
					uni.setStorageSync('id',this.id)
					uni.setStorageSync('brandid',this.brandid)
					uni.setStorageSync('typeYearId',this.typeYearId)
					uni.setStorageSync('typeYearProductId',this.typeYearProductId)
					uni.setStorageSync('carBrand',this.carBrand)
					uni.setStorageSync('carTypeYear',this.carTypeYear)
					uni.setStorageSync('carTypeYearProduct',this.carTypeYearProduct)
				}else{
					uni.showToast({
						title:'请选择车型',
						icon:'none'
					})
				}
			},
			// 跳转详情
			gotoDetail(id){
				uni.navigateTo({
					url:'./carDetail?id='+id+'&newOrOld='+(this.carType*1)
				})
			},
			// 新车  二手车  列表   
			getCarListMethod(v) {
				var params = {
					newOrOld: this.carType,
					pageNo: this.pageNo,
				    pageSize: this.pageSize
				}
				this.$getRequest(this.$url.getCarList,'POST',params).then((data) => {
					if(data.code == 0) {
						// console.log(data.data.records,this.newCarList);
						 var that =this
						 this.totalPage = data.data.pages //总页数
						 if(v=='1'){
							 this.newCarList=data.data.records
						 }else{
							 var arr1 = that.newCarList; //从data获取当前newCarList数组
							 var arr2 = data.data.records; //从此次请求返回的数据中获取新数组
							 arr1 = arr1.concat(arr2); //合并数组
							 that.newCarList= arr1  //合并后更新newCarList
						 }
						
						 // this.newCarList= data.data.records //合并后更新newCarList
						 
						 
						 // if(this.carType=='1'){
						 // 	var arr1 = that.newCarList; //从data获取当前newCarList数组
						 // 	var arr2 = data.data.records; //从此次请求返回的数据中获取新数组
						 // 	arr1 = arr1.concat(arr2); //合并数组
						 // 	that.newCarList= arr1 //合并后更新newCarList
						 // }else{
						 // 	var arr1 = that.carInfoLists; //从data获取当前newCarList数组
						 // 	var arr2 = data.data.records; //从此次请求返回的数据中获取新数组
						 // 	arr1 = arr1.concat(arr2); //合并数组
						 // 	that.carInfoLists=arr1
						 // }
					}
				})
			},
			// 获取品牌列表
			getCarBrandListMethod() {
				var params = {carBrand:''}
				this.$getRequest(this.$url.getCarBrandList,'POST',params).then((data) => {
					if(data.code == 0) {
						// console.log(data.data)
						this.carTypeArray = data.data
					}
				})
			},
			// 获取车型号列表
			getForSearchMethod() {
				var params = {
					carBrandId: this.id,
					// pageNo: 1,
					// pageSize: 10,
					queryCondition: ""
				}
				this.$getRequest(this.$url.getForSearch,'POST',params).then((data) => {
					if(data.code == 0) {
						// console.log("车型数据：",data)
						// let options = this.changeData(data.data.records)
						this.options = data.data.records
					}
				})
			},
			changeData(dataList){
				return dataList.map(item => {
							item.label = item.brandType
							item.value = item.carTypeId
							item.children = Array.isArray(item.carYearTypeProductList)?this.changeData(item.carYearTypeProductList):[]
							return item
						})
			},
			showTwoMenu(item) {
				this.xianshi = false
				this.show = true
				this.id = item.id
				this.getForSearchMethod()
				this.carBrandName = item.brandName
				
			},
		},
		created() {
			this.getCarListMethod()
		},
		onReachBottom() {
			if(this.pageNo >= this.totalPage){
				uni.showToast({
					title:'没有更多了～',
					icon:'none'
				})
				this.showNoMore = true
			}else{
				var pagenum = this.pageNo + 1; 
				this.pageNo= pagenum, 
				this.getCarListMethod()
			}
		},
		onPullDownRefresh(){
			this.pageNo = 1
			this.newCarList = []
			this.getCarListMethod()
			setTimeout(() => {
				uni.stopPullDownRefresh();
			},1000)
		},
		onShow(){
			this.getCarListMethod("1")
			uni.removeStorageSync('carInfo')
		},
		onLoad(options){
			this.carType = options.carType
			this.getCarListMethod()
			wx.showShareMenu({
				withShareTicket:true,
				//设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
				menus:["shareAppMessage","shareTimeline"]
			})
		},
		onShareAppMessage(res) {
		    if (res.from === 'button') {// 来自页面内分享按钮
		        console.log(res.target)
		    }
		    return {
		        title: '商户小程序', //分享的名称
		        path: '/pages/customer/customer',
		        mpId:'wxd561b5dc0088ee14' //此处配置微信小程序的AppId
		    }
		},
		//分享到朋友圈
		onShareTimeline(res) {
		    return {
		        title: '商户小程序',
		        type: 0,
		        summary: "",
		    }
		},
	}
</script>

<style lang="scss" scoped>
	.font-24{
		font-size: 24rpx;
	}
	.margin-top-16{
		margin-top:2rpx;
		line-height: 18px;
	}
	
	.m-brand-scroll {
	  width: 100%;
	  overflow: hidden;
	  white-space: nowrap;
	  .m-item {
	    width: 22.22%;
	    display: inline-block;
	    align-items: center;
	  }
	}
	.brand {
	    color: rgba(10, 15, 45, 0.8);
	    font-size: 24rpx;
	    margin-top: 4rpx;
	}
	.carList{
		padding: 0;
		margin: 36rpx 32rpx;
		.top-tabbar{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.top-l-title{
				font-size: 28rpx;
				color: #3D3D3D;
			}
			.top-r-title{
				display: flex;
				align-items: center;
				.left-t{
					font-size: 24rpx;
					color: #787878;
					.car-t.active{
						font-size: 28rpx;
						color: #333333;
					}
				}
				.right-t{
					display: flex;
					align-items: center;
					margin-left: 44rpx;
					margin-right: 40rpx;
					font-size: 28rpx;
					color: #4E5969;
					position: relative;
					// text:before{
					// 	position: absolute;
					// 	content: "";
					// 	width: 0;
					// 	height: 0;
					// 	top: 6px;
					// 	left: 58px;
					// 	border-right: solid 8rpx transparent;
					// 	border-left: solid 8rpx transparent;
					// 	border-top: solid 12rpx #4E5969;
					// }
				}
			}
		}
		.content-box{
			margin-top: 26rpx;
			.content-list{
				margin-top: 30rpx;
				border-radius: 24rpx;
				background: #FFFFFF;
				box-shadow: 0px -1px 24px 0px rgba(10, 15, 45, 0.04),0px 4px 24px 0px rgba(10, 15, 45, 0.04);
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 24rpx 32rpx;
				box-sizing: border-box;
				width: 100%;
				.car-info{
					// width: 50%;
					.title{
						font-size: 32rpx;
						text{
							border-radius: 8rpx;
							background: #F7F7F7;
							padding: 4rpx 22rpx;
							color: #666666;
							margin-left: 10rpx;
						}
					}
					.type{
						color: #86909C;
						margin-bottom:16px;
					}
					.xsz{
						color: #4170EE;
					}
					.val-text{
						color: #4E5969;
						.val-title{
							color: #4E5969;
						}
					}
				}
				.car-img{
					position: relative;
					// width: 50%;
					height: 152rpx;
					.spot{
						position: absolute;
						bottom: 0;
						right: 0;
						width: 40rpx;
						height: 40rpx;
					}
					.img{
						// position: absolute;
						// width: 100%;
						width: 125px;
						height: 100%;
						margin-top: 15px;
					}
					.cph{
						position: absolute;
						top: -20px;
						right: 0;
						font-size: 24rpx;
						color: #6A6A6A;
						margin-bottom: 11px;
						// height: 19px;
						border-radius: NaNpx 2px 2px 2px;
						border: 1px solid #1D2129;
						font-size: 12px;
						box-sizing: border-box;
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
							box-sizing: border-box;
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
			}
		}
		.addImg{
			position: fixed;
			right: 70rpx;
			bottom: 50rpx;
			image{
				width: 96rpx;
				height: 96rpx;
			}
		}
	}
</style>