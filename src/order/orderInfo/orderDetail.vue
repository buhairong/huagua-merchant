<template>
	<view class="order-detail">
		<view class="top-cow">
			<!-- <view class="right-col" @click="bindCar('carToStore')">
				<text>车辆到店</text>
			</view> -->
		</view>
		<view class="top-car-info">
			<view class="img">
				<image mode="aspectFill" :src="carInfo.image"></image>
			</view>
			<view class="info">
				<text class="brand">{{ carInfo.carBrand }}</text>
				<text class="time" v-show="carInfo.monthTotal">{{ carInfo.monthTotal }}期</text>
				<view class="typeYear" style="font-size:24rpx;color: #6E7376;">{{ carInfo.carYearType }}</view>
			</view>
		</view>

		<view class="car-one">
			<view class="basic-info">
				<u-steps :list="stepData" :current="greenSpot" active-color="#00B578"></u-steps>
				<view class="order-self">
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title left-col font-col">订单编号：</u-col>
						<u-col span="8"><text @click="copy(topInfo.orderNum)" class="f-right font-24"
								style="padding:0rpx 8rpx;border-radius: 8rpx;background: #F5F6F7;">复制</text><text
								class="f-right font-col">{{ topInfo.orderNum }}</text> </u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="5" class="o-content-title left-col font-col">签约主体：</u-col>
						<u-col span="7"><text class="f-right font-col">{{ topInfo.userName }}</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="5" class="o-content-title left-col font-col" style="word-spacing: 22px;">车 况：
						</u-col>
						<u-col span="7"><text class="f-right font-col" v-if="topInfo.newType == 1">新车</text></u-col>
						<u-col span="7"><text class="f-right font-col" v-if="topInfo.newType == 2">二手车</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="5" class="o-content-title left-col font-col">用户限定里程：</u-col>
						<u-col span="7"><text class="f-right font-col">{{ topInfo.limitMileage }}公里</text></u-col>
					</u-row>

					<u-row class="o-content-row">
						<u-col span="5" class="o-content-title left-col font-col">用户超出里程：</u-col>
						<u-col span="7"><text class="f-right font-col">{{ topInfo.overMileageFee }}元/公里</text></u-col>
					</u-row>
				</view>
			</view>


			<view class="basic-info">
				<u-steps :list="numList" :current="status" active-color="#00B578"></u-steps>
				<!-- <u-steps :list="numLists" :current="statuss" active-color="#00B578"></u-steps>
				<u-steps :list="numListss" :current="statusss" active-color="#00B578"></u-steps> -->
				<view class="o-c-t" style="margin-top:30rpx;">
					<view class="o-content-title">合约详情</view>
					<!-- <view>电子合约</view> -->
				</view>
				<view class="order-self">
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title left-col font-col">方案名称：</u-col>
						<u-col span="8"><text class="f-right font-col">{{ orderDetail.productSchemeName }}</text> </u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="5" class="o-content-title left-col font-col">签约主体：</u-col>
						<u-col span="7"><text class="f-right font-col">{{ orderDetail.userName }}</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="5" class="o-content-title left-col font-col">联系方式：</u-col>
						<u-col span="7"><text class="f-right font-col">{{ orderDetail.clientMobile }}</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="5" class="o-content-title left-col font-col" style="word-spacing: 22px;">车 况：
						</u-col>
						<u-col span="7"><text class="f-right font-col" v-if="topInfo.newType == 1">新车</text></u-col>
						<u-col span="7"><text class="f-right font-col" v-if="topInfo.newType == 2">二手车</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="5" class="o-content-title left-col font-col">订阅周期：</u-col>
						<u-col span="7"><text class="f-right font-col">{{ orderDetail.monthTotal }}</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="5" class="o-content-title left-col font-col">金融方：</u-col>
						<u-col span="7"><text class="f-right font-col">{{ orderDetail.financialCompanyName }}</text>
						</u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="5" class="o-content-title left-col font-col">保证金：</u-col>
						<u-col span="7"><text class="f-right font-col">{{ orderDetail.deposit }}</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="5" class="o-content-title left-col font-col">订阅费用：</u-col>
						<u-col span="7"><text class="f-right font-col">{{ orderDetail.monthPayment }}元/月</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="5" class="o-content-title left-col font-col">用户限定里程：</u-col>
						<u-col span="7"><text class="f-right font-col">{{ topInfo.limitMileage }}公里</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="5" class="o-content-title left-col font-col">用户超出里程：</u-col>
						<u-col span="7"><text class="f-right font-col">{{ topInfo.overMileageFee }}元/公里</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title left-col font-col">保障服务：</u-col>
						<u-col span="8"><text class="f-right font-col">{{ orderDetail.servicname }}</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="5" class="o-content-title left-col font-col">期末选择：</u-col>
						<u-col span="7"><text class="f-right font-col">期末可能买断车辆</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="5" class="o-content-title left-col font-col">尾款金额：</u-col>
						<u-col span="7"><text class="f-right font-col">{{ orderDetail.buyoutsFee }}</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title left-col font-col">订单编号：</u-col>
						<u-col span="8"><text class="f-right font-24"
								style="padding:0rpx 8rpx;border-radius: 8rpx;background: #F5F6F7;">复制</text><text
								class="f-right font-col">{{ orderDetail.orderNum }}</text> </u-col>
					</u-row>
				</view>
			</view>


			<view class="basic-info">
				<view class="o-c-t">
					<view class="o-content-title">车辆信息
						<text v-if="!orderDetail.carInfo" style="margin-left:10rpx;" class="font-24 left-col">暂无</text>
					</view>
					<view v-if="!orderDetail.carInfo" class="font-24 left-col">
						待绑定车辆
					</view>
				</view>
				<view v-if="orderDetail.carInfo" class="order-self">
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title left-col font-col">车辆牌照：</u-col>
						<u-col span="8"><text class="f-right font-col">{{ orderDetail.carInfo.carPlateNum }}</text>
						</u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title left-col font-col">车况信息</u-col>
						<u-col span="8"><text
								class="f-right font-col">{{ orderDetail.carInfo.newOrOld == 1 ? '新车' : orderDetail.carInfo.newOrOld == 2 ? '二手车' : '' }}</text>
						</u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title left-col font-col">实表里程数：</u-col>
						<u-col v-if="orderDetail.carInfo.mileage" span="8"><text class="f-right font-col">{{ orderDetail.carInfo.mileage }}</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="5" class="o-content-title left-col font-col">车辆生产日期：</u-col>
						<u-col span="7"><text class="f-right font-col">{{ orderDetail.carInfo.productDate }}</text>
						</u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title left-col font-col">车架号：</u-col>
						<u-col span="8"><text class="f-right font-col">{{ orderDetail.carInfo.carVin }}</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title left-col font-col">发动机号：</u-col>
						<u-col span="8"><text class="f-right font-col">{{ orderDetail.carInfo.carEngineNum }}</text>
						</u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title left-col font-col">外观颜色：</u-col>
						<u-col span="8"><text class="f-right font-col">{{ orderDetail.carInfo.carColor }}</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title left-col font-col">内饰颜色：</u-col>
						<u-col span="8"><text class="f-right font-col">{{ orderDetail.carInfo.trimColor }}</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title left-col font-col">选择增配项：</u-col>
						<u-col span="8">
							<div class="f-right font-col"></div>
						</u-col>


					</u-row>
					<u-row class="o-content-row">
						<u-col span="8" class="o-content-title left-col font-col">
							车辆照片：共{{ getLength }}张</u-col>
						<u-col span="4"><text class="f-right font-col">查看更多</text></u-col>
					</u-row>
				</view>
			</view>
			<view v-if="insuranceItem" class="basic-info">
				<view class="o-c-t">
					<view class="o-content-title">车辆保险

					</view>

				</view>
				<view class="order-self">
					<view v-for="item, index in insuranceItem" :key="index">
						<u-row class="o-content-row">
							<u-col span="4" class="o-content-title left-col font-col">商业保险：</u-col>
							<u-col span="8"><text class="f-right font-col">查看更多</text></u-col>
						</u-row>
						<u-row class="o-content-row">
							<u-col span="4" class="o-content-title left-col font-col">投保公司：</u-col>
							<u-col span="8"><text class="f-right font-col">{{ item.insuranceCompany }}</text>
							</u-col>
						</u-row>
						<u-row class="o-content-row">
							<u-col span="4" class="o-content-title left-col font-col">保险单号：</u-col>
							<u-col span="8"><text class="f-right font-col">{{ item.insuranceNo }}</text></u-col>
						</u-row>
						<u-row class="o-content-row">
							<u-col span="4" class="o-content-title left-col font-col">三者金额：</u-col>
							<u-col span="8"><text class="f-right font-col">{{ item.amountOfThree }}元</text>
							</u-col>
						</u-row>
						<u-row class="o-content-row">
							<u-col span="4" class="o-content-title left-col font-col">有效日期：</u-col>
							<u-col span="8"><text class="f-right font-col">{{ item.expireDate }}元</text>
							</u-col>
						</u-row>
					</view>
				</view>
			</view>

			<!-- <view class="basic-info">
				<view class="o-c-t">
					<view class="o-content-title">提车信息</view>
				</view>
				<view class="order-self">
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title left-col font-col">客户姓名：</u-col>
						<u-col span="8"><text class="f-right font-col">{{orderDetail.pickUpCar.userName}}</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title left-col font-col">联系方式：</u-col>
						<u-col span="8"><text class="f-right font-col">{{orderDetail.pickUpCar.clientMobile}}</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title left-col font-col">提车方式：</u-col>
						<u-col span="8"><text class="f-right font-col">{{orderDetail.pickUpCar.deliveryWay==1?'自提':orderDetail.pickUpCar.deliveryWay==2?'送车上门':''}}</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title left-col font-col">提车门店：</u-col>
						<u-col span="8"><text class="f-right font-col">{{orderDetail.pickUpCar.pickUpCarShopName}}</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title left-col font-col">提车日期：</u-col>
						<u-col span="8"><text class="f-right font-col">{{orderDetail.pickUpCar.pickUpCarDate}}</text></u-col>
					</u-row>
				</view>
			</view> -->

		</view>

		<u-popup mode="bottom" v-model="xianshi" closeable="true" border-radius="20">
			<view class="content">
				<view style="width:100%;font-size:34rpx;text-align:center;margin:28rpx 0 30rpx 0">绑定车辆</view>
				<scroll-view scroll-y="true" style="height: 500rpx;">
					<view>
						<view
							style="line-height: 2;margin-top:20rpx; display:flex;justify-content:space-between;align-items:center;width:100%"
							v-for="(item, index) in bindData" :key="index">
							<view class="left-img" style="width:33%;height:96rpx;">
								<image style="width:100%;height:100%" mode="aspectFill" :src="item.imageUrl"></image>
							</view>
							<view class="info-content" style="width:55%;">
								<text style="font-size:font-size:28rpx;color:#333333;">{{ item.carBrand }}</text>
								<text class="font-24" style="color:#999999;">{{ item.carTypeYear }}</text>
								<text
									style="background:#F7F7F7;padding:4rpx 10rpx;color:#666666;font-size:24rpx;margin-left:8rpx;"
									v-show="item.carColor">{{ item.carColor }}色</text>
								<view style="font-size:28rpx;color:#6A6A6A;"><text
										style="color:#505050;">车架号：</text>{{ item.carVin }}</view>
								<view style="font-size:28rpx;color:#6A6A6A;"><text
										style="color:#505050;">发动机号：</text>{{ item.carEngineNum }}</view>
							</view>
							<view class="right" style="width:10%">
								<u-radio-group v-model="valueraiod" @change="radioGroupChange">
									<u-radio @change="radioChange" :name="item.id">
									</u-radio>
								</u-radio-group>
							</view>
						</view>
						<view class="bindBtn" @click="getBindOrderMethod">
							<text>确定绑定</text>
						</view>
						<view v-show="showChange" class="bindBtn" @click="getChangeOrderMethod">
							<text>修改绑定</text>
						</view>
					</view>
					<u-gap v-if="showNote" height="100" margin-top="50" bg-color="#FFFFFF" />
				</scroll-view>
			</view>
		</u-popup>
		<u-gap v-if="showNote" height="100" margin-top="50" bg-color="#FFFFFF" />
		
		<u-popup border-radius="14" closeable=true mode="bottom" v-model="show">
			<u-row>
				<u-col span="12">
					<view class="popupTitle">车辆信息</view>
				</u-col>
			</u-row>
			<view class="popupInfo">
				<view class="itemInfo">
					<view class="itemTitle">实表里程</view>
					<input class="itemInput" v-model="mileage"  placeholder="请输入车辆实表里程" type="text" value="" />
					<view class="itemUnit">公里</view>
				</view>
				<view class="itemInfo">
					<view class="itemTitle">实时{{orderDetail.carInfo.powerMode==3?'电量':'油量'}}</view>
					<input v-model="electricity" :placeholder="`请输入车辆实时${orderDetail.carInfo.powerMode==3?'电量':'油量'}`" class="itemInput" type="text" value="" />
					<view class="itemUnit">%</view>
				</view>
				<view @click="upPic" class="nextBtn">下一步</view>
			</view>
		</u-popup>
		<templete>
			<view @click="bindCar('bind')" v-show="orderDetail.bindedCar == 0 && orderDetail.status == 3" class="bottomBtn">绑定车辆</view>
			<view v-show="showChange" @click="bindCar('change')" class="bottomBtn">修改车辆</view>
			<view v-show="orderDetail.status == 5" @click="bindCar('pay')" class="bottomBtn">交付车辆</view>
			<view v-show="orderDetail.status == 6" @click="bindCar('pay')" class="bottomBtn">订阅中</view>
		</templete>
		<templete>
		<view v-show="orderDetail.bindedCar == 1 && orderDetail.status == 3" class="bottomBtn"
			@click="bindCar('carToStore')">车辆到店</view>
		</templete>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// u-gap空位置
			showNote: true,
			xianshi: false,
			// 绑定车辆弹框下的数据
			valueraiod: '',
			bindData: [],
			// 显示步骤条到哪一步  从0开始
			greenSpot: 0,
			// 步骤条数据
			// stepData: [{name: ''}, {name: ''}, {name: ''}, {name: ''}],
			stepData: [],
			// 车辆id
			carId: '',
			// 用户订单id
			id: '',
			// 新车  二手车
			newType: '',
			// 顶部   车辆的信息
			carInfo: {
				image: '',
				carBrand: '',
				carYearType: '',
				monthTotal: '',
			},
			topInfo: {
				orderNum: '',
				userName: '',
				newType: '',
				limitMileage: '',
				overMileageFee: '',
				statusChain: [],
			},
			// 跳转拿过来的车辆信息
			itemId: {},
			pageNo: 1,
			pageSize: 10,
			totalPage: '',
			// 绑定车辆 确定绑定需要的id
			bindId: '',
			// 显示绑定车辆
			// showBind:true,
			// 显示修改车辆
			showChange: false,
			// 订单详情的数据
			orderDetail: {},
			userInfo: {},
			insuranceItem: [],
			show:false,
			mileage:'',
			electricity:''
			
		}
	},
	computed:{
		getLength:function(){
			let length = 0
			if(this.orderDetail.carInfo){
				for(key in this.orderDetail.carInfo.checkCarPicsMap){
					if(this.orderDetail.carInfo.checkCarPicsMap[value]){
						length += this.orderDetail.carInfo.checkCarPicsMap[value].length
					}
				}
			}
			return length
		}
	},
	methods: {
		// 复制订单号
		copy(orderNum) {
			uni.setClipboardData({
				data: orderNum,
			});
		},
		// 右上角[绑定车辆]
		getCarsMethod() {
			var params = {
				carBrandId: this.itemId.carBrandId,
				carTypeId: this.itemId.carTypeId,
				carTypeYearId: this.itemId.carTypeYearId,
				carTypeYearProductId: this.itemId.carTypeYearProductId,
				newOrOld: this.itemId.newType,
				pageNo: this.pageNo,
				pageSize: this.pageSize,
				pageTag:2
			}
			this.$getRequest(this.$url.getCars, 'POST', params).then((data) => {
				if (data.code == 0) {
					var that = this
					this.totalPage = data.data.pages
					var arr1 = that.bindData;
					var arr2 = data.data.records;
					arr1 = arr1.concat(arr2);
					that.bindData = arr1
				}
			})
		},
		getChangeCarsMethod() {
			var params = {
				carBrandId: this.itemId.carBrandId,
				carTypeId: this.itemId.carTypeId,
				carTypeYearId: this.itemId.carTypeYearId,
				carTypeYearProductId: this.itemId.carTypeYearProductId,
				newOrOld: this.itemId.newType,
				pageNo: this.pageNo,
				pageSize: this.pageSize,
			}
			this.$getRequest(this.$url.getCars, 'POST', params).then((data) => {
				if (data.code == 0) {
					var that = this
					this.totalPage = data.data.pages
					var arr1 = that.bindData;
					var arr2 = data.data.records;
					arr1 = arr1.concat(arr2);
					that.bindData = arr1
				}
			})
		},
		// 车辆到店
		getCarInShopMethod() {
			var params = { orderId: this.orderDetail.id }
			this.$getRequest(this.$url.getCarInShop, 'GET', params).then((data) => {
				if (data.code == 0) {
					// console.log(data)
					uni.showToast({
						title: '车辆到店',
						icon: "none"
					})
				}
			})
		},
		bindCar(type) {
			if (type == 'bind') {
				this.getCarsMethod()
				this.xianshi = true
			} else if (type == 'change') {
				this.getCarsMethod()
				this.xianshi = true
			} else if (type == 'pay') {
				this.show = true
			} else if (type == 'carToStore') {
				this.getCarInShopMethod()
			}
		},
		// 下一步上次照片
		upPic(){
			let params = {
				actualDrivenKilometer:this.mileage,
				carId:this.orderDetail.carId,
				status:this.orderDetail.status,
				userCarSubscribeId:this.orderDetail.id
			}
			if(this.orderDetail.carInfo.powerMode==3){
				params.actualElectricity=this.electricity
			}else{
				params.actualOil=this.electricity
			}
			this.$getRequest(this.$url.addCarInfo,'POST',params).then(res => {
				if(res.code == 0){
					this.show = false
					uni.navigateTo({
						url: '../product/checkCarPhoto?id='+this.orderDetail.id+'&carId='+this.orderDetail.carId+'&newOrOld='+this.orderDetail.carInfo.newOrOld
					})
				}
			})
			
		},
		// 绑定车辆- 确定绑定
		getBindOrderMethod() {
			var params = {
				carId: this.bindId,
				carSubscribeOrderId: this.id,
				newOrOld: this.newType
			}
			this.$getRequest(this.$url.getBindOrder, 'POST', params).then((data) => {
				if (data.code == 0) {
					this.xianshi = false
					uni.showToast({
						title: '绑定成功',
						icon: "none"
					})
					this.getOrderDetailMethod()
					// 这里成功之后改变页面右上角显示的状态  并且绑定车辆弹框里的按钮改变为修改车辆
					this.showChange = true
					// this.showBind = false
				}
			})
		},
		// 绑定车辆-  修改绑定
		getChangeOrderMethod() {
			var params = {
				carId: this.bindId,
				carSubscribeOrderId: this.id,
				newOrOld: this.newType
			}
			this.$getRequest(this.$url.getBindOrder, 'POST', params).then((data) => {
				if (data.code == 0) {
					this.xianshi = false
					uni.showToast({
						title: '修改成功',
						icon: "none"
					})
					this.getOrderDetailMethod()
				}
			})
		},
		// 订单详情
		getOrderDetailMethod() {
			var params = {
				id: this.id,
				carId: this.carId,
				newType: this.newType
			}
			uni.showLoading({
				title: '加载中',
				icon: 'none'
			})
			this.$getRequest(this.$url.getOrderDetail, 'POST', params).then((data) => {
				uni.hideLoading()
				if (data.code == 0) {
					let serviceName = {
						0: '24小时救援',
						1: '送车上门'
					}
					if (data.data.safeguardService) {
						let servicname = ''
						for (let i in JSON.parse(data.data.safeguardService)) {
							if (i == JSON.parse(data.data.safeguardService).length - 1) {
								servicname += serviceName[i]
							} else {
								servicname = servicname + serviceName[i] + ','
							}

						}
						data.data.servicname = servicname
					}
					var that = this
					this.carInfo.carBrand = data.data.carBrandInfo
					this.carInfo.carYearType = data.data.carYearTypeInfo
					this.carInfo.monthTotal = data.data.monthTotal
					this.orderDetail = data.data
					this.status = data.data.status
					this.topInfo.orderNum = data.data.orderNum
					this.topInfo.userName = data.data.userName
					this.topInfo.newType = data.data.newType
					this.topInfo.limitMileage = data.data.limitMileage
					this.topInfo.overMileageFee = data.data.overMileageFee
					this.topInfo.statusChain = data.data.statusChain
					this.insuranceItem = data.data.carInfo?data.data.carInfo.insuranceList:null
					var statusChain = data.data.statusChain

					var array = statusChain.map(item => {
						var names = {}
						names.name = item.statusName
						return names
					})
					this.stepData = array

					if (!statusChain.length) {
						return
					}
					if (statusChain[3].greenLightOn == 1) {
						this.greenSpot = 3
					} else if (statusChain[2].greenLightOn == 1) {
						this.greenSpot = 2
					} else if (statusChain[1].greenLightOn == 1) {
						this.greenSpot = 1
					} else if (statusChain[0].greenLightOn == 1) {
						this.greenSpot = 0
					}
				}
			})
		},
		// 选中某个单选框时，由radio时触发
		radioChange(e) {
			console.log("radioChange", e);
			this.bindId = e
		},
		// 选中任一radio时，由radio-group触发
		radioGroupChange(e) {
			// console.log(e);
		}
	},
	created() {

	},
	onShow(){
		this.getOrderDetailMethod()
	},
	onLoad(option) {
		// console.log(option)
		this.id = option.id
		this.carId = option.carId
		this.newType = option.newType
		this.carInfo.image = option.image
		const itemId = JSON.parse(uni.getStorageSync('item'))
		this.itemId = itemId
		console.log("itemId:", itemId)
		//this.getOrderDetailMethod()
		getApp().globalData.getUserInfo((data) => {
			this.userInfo = data.data;
		})
	},
	onReachBottom() {
		// if(this.pageNo >= this.totalPage){
		// 	uni.showToast({
		// 		title:'没有更多了···',
		// 		icon:'none'
		// 	})
		// }else{
		// 	var pagenum = this.pageNo + 1; 
		// 	this.pageNo= pagenum, 
		// 	this.getCarsMethod()
		// }
	},
}
</script>

<style lang="scss" scoped>
	.bottomBtn{
		position: fixed;
		bottom: 30px;
		left: 25px;
		right: 25px;
		height: 40px;
		background-color: #4170EE;
		color: #fff;
		text-align: center;
		border-radius: 8px;
		height: 40px;
		line-height: 40px;
	}
	.popupInfo{
		padding: 30px 20px;
		.itemInfo{
			padding: 15px 0;
			border-bottom: 1px solid rgba(216,216,216,0.6);
			font-size: 14px;
			// color: #000;
			.itemTitle{
				display: inline-block;
				vertical-align: middle;
				width: 23%;
			}
			.itemInput{
				display: inline-block;
				vertical-align: middle;
				width: 67%;
			}
			.itemUnit{
				display: inline-block;
				vertical-align: middle;
				text-align: right;
				width: 10%;
			}
		}
		.nextBtn{
			margin-top: 50px;
			background-color: #4170EE;
			color: #fff;
			text-align: center;
			border-radius: 8px;
			height: 40px;
			line-height: 40px;
		}
	}
	.popupTitle {
		font-style: 15px;
		text-align: center;
		padding: 20px 0 0px 0;
	}
.flex-center {
	display: flex;
	align-items: center;
}

.car-tabbar-title {
	font-size: 28rpx;
	color: #4E5969;
}

.m-left {
	margin-left: 40rpx;
}

.left-col {
	color: #86909C;
}

.font-col {
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

.f-right {
	float: right;
}

.font-24 {
	font-size: 24rpx;
}

.margin-top-16 {
	margin-top: 16rpx;
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

.order-detail {
	padding: 0;
	margin: 36rpx 40rpx;

	.top-cow {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20rpx;

		.left-col {
			display: flex;
			align-items: center;

			image {
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
			}
		}

		.right-col {
			border-radius: 20rpx;
			background: #D8D8D8;

			text {
				font-family: PingFangSC-Regular;
				font-size: 24rpx;
				color: #3D3D3D;
				text-align: center;
				padding: 8rpx 10rpx;
			}
		}
	}

	.top-car-info {
		margin: 30rpx 6rpx 40rpx 6rpx;
		display: flex;
		align-items: center;
		width: 100%;

		.img {
			width: 40%;

			image {
				width: 224rpx;
				height: 106rpx;
			}
		}

		.info {
			width: 52%;
			maring-left: 20rpx;

			.brand {
				font-size: 32rpx;
				color: #333333;
			}

			.time {
				border-radius: 8rpx;
				background: #F7F7F7;
				padding: 4rpx 20rpx;
				font-size: 24rpx;
				color: #666666;
			}
		}
	}

	.car-one {
		.order-content {
			padding: 20rpx 12rpx 20rpx 16rpx;
			margin-top: 26rpx;
			border-radius: 24rpx;
			box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02),
				0px 8px 24px rgba(10, 15, 45, 0.06);

			.o-c-t {
				.o-content-title {
					font-size: 34rpx;
					position: relative;
					padding-left: 20rpx;
				}

				.o-content-title:before {
					content: "";
					position: absolute;
					width: 4rpx;
					height: 28rpx;
					border-radius: 4rpx;
					background-color: #0AEB7D;
					top: 10rpx;
					left: 4rpx;
				}
			}

			.order-self {
				margin-top: 20rpx;
				padding-left: 16rpx;

				.o-content-row {
					line-height: 2.2;
				}
			}
		}

		.basic-info {
			min-height: 300rpx;
			padding: 20rpx 12rpx 20rpx 16rpx;
			margin-top: 32rpx;
			border-radius: 24rpx;
			box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02),
				0px 8px 24px rgba(10, 15, 45, 0.06);

			.o-c-t {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.o-content-title {
					font-size: 34rpx;
					position: relative;
					padding-left: 20rpx;
				}

				.o-content-title:before {
					content: "";
					position: absolute;
					width: 4rpx;
					height: 28rpx;
					border-radius: 4rpx;
					background-color: #0AEB7D;
					top: 10rpx;
					left: 4rpx;
				}
			}

			.order-self {
				margin-top: 16rpx;
				padding-left: 16rpx;

				.o-content-row {
					line-height: 2.2;
				}
			}
		}
	}
}
</style>