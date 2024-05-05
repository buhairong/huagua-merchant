<template>
	<view class="order-list">
		<view style="margin:20rpx 40rpx 0 40rpx;background:#EBE8E8;padding:0 20rpx;border-radius:20rpx;display:flex;">
			<u-icon name="search"></u-icon>
			<input @confirm="entryContent" clearable="true" style="margin:0 20rpx; width:100%;" v-model="value"
				type="text" height="60" placeholder="请输入客户姓名或订单编号" placeholder-style="font-size:24rpx;" />
		</view>
		<view class="">
			<u-dropdown>
				<u-dropdown-item @change="changeOption" v-model="value1" :title="currentLabel" :options="options1" menu-icon>
				</u-dropdown-item>
			</u-dropdown>
		</view>
		<view>
			<view class="content-box">
				<view class="content-list" v-for="(item, index) in newCarList" :key="index" @click="gotoDetail(item)">
					<view class="car-info">
						<view class="title">{{ item.carBrandInfo }}<text class="font-24"
								v-show="item.monthTotal">{{ item.monthTotal }}个月</text></view>
						<view class="type font-24">{{ item.carYearTypeInfo }}</view>
						
						
						
						<view class="val-text font-24 margin-top-16">
							<text class="val-title">客户姓名：</text>
							{{ item.userName }}
						</view>
						<view class="val-text font-24 margin-top-16">
							<text class="val-title">订单编号：</text>
							{{ item.orderNum }}
						</view>
								
								
								
					</view>
					
					
					
					<!-- <view class="car-img"> -->
						<view class="cph" :class="item.status == 3 ? 'statusColor' : item.status == 5 ? 'statusColor1' : ''">
							{{ item.cardRightStatus }}</view>

					<!-- </view> -->
				</view>
				<u-divider v-show="showNoMore" margin-top="20">没有更多了～</u-divider>
			</view>
		</view>

		<u-gap v-if="showNote" height="100" margin-top="50" bg-color="#FFFFFF" />
	</view>
</template>

<script>

export default {
	data() {
		return {
			// u-gap空位置
			showNote: true,
			// 搜索框值
			value: '',
			value1: '',
			currentLabel:'全部订单',
			options1: [{
				label: '全部订单',
				value: '',
			},
			{
				label: '待绑定车辆',
				value: 3,
			},
			{
				label: '待交付车辆',
				value: 5,
			}
			],

			// 订单列表
			newCarList: [],
			// 分页
			pageNo: 1,
			pageSize: 10,
			// 总页数
			totalPage: '',
			// 订单列表为空时为 true 
			showNoMore: false,
			userInfo:{}
		}
	},
	methods: {
		// 订单列表
		getOrderListMethod() {
			var params = {
				pageNo: this.pageNo,
				pageSize: this.pageSize,
				queryCondition: this.value,
				status: this.value1
			}
			if(this.userInfo.roleId==6){
				params.pageSign = 0
			}else if(this.userInfo.roleId==4){
				params.pageSign = 1
			}else if(this.userInfo.roleId==2){
				
			}
			this.$getRequest(this.$url.getOrderList, 'POST', params).then((data) => {
				if (data.code == 0) {
					var that = this
					this.totalPage = data.data.pages
					var arr1 = that.newCarList;
					var arr2 = data.data.records;
					arr1 = arr1.concat(arr2);
					that.newCarList = arr1

				}
			})
		},
		// input搜索
		entryContent(e) {
			this.value = e.detail.value
			if (this.value !== '') {
				this.getOrderListMethod()
			}
		},
		// 跳转订单详情
		gotoDetail(item) {
			let carId = item.carId || ''
			uni.setStorageSync('item', JSON.stringify(item))
			
			uni.navigateTo({
				url: `./orderDetailInfo?id=${item.id}&carId=${carId}&newType=${item.newType}&carBrandInfo=${item.carBrandInfo}&carYearTypeInfo=${item.carYearTypeInfo}&imageUrl=${item.imageUrl}`
			})
		},
		// 全部订单 -- 下拉选项
		changeOption(e) {
			this.value1 = e
			this.options1.map(item => {
				if(item.value == e){
					this.currentLabel = item.label
				}
			})
			this.pageNo = 1
			this.newCarList = []
			
			this.getOrderListMethod()
		},
		getColor(item) {
			return item.status == 3 ? 'statusColor' : item.status == 5 ? 'statusColor1' : ''
		}
	},
	created() {
		getApp().globalData.getUserInfo((data) => {
			this.userInfo = data.data;
			this.getOrderListMethod()
		})
		
	},
	onReachBottom() {
		if (this.pageNo >= this.totalPage) {
			uni.showToast({
				title: '没有更多了～',
				icon: 'none'
			})
			this.showNoMore = true
		} else {
			var pagenum = this.pageNo + 1;
			this.pageNo = pagenum,
				this.getOrderListMethod()
		}
	},
	onPullDownRefresh(){
		this.pageNo = 1
		this.newCarList = []
		this.getOrderListMethod()
		setTimeout(() => {
			uni.stopPullDownRefresh();
		},1000)
	},
	onLoad(){
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

.order-list {
	padding: 0;
	margin: 36rpx 32rpx;

	.content-box {
		margin-top: 26rpx;

		.content-list {
			position: relative;
			margin-top: 30rpx;
			border-radius: 24rpx;
			background: #FFFFFF;
			box-shadow: 0px -1px 24px 0px rgba(10, 15, 45, 0.04), 0px 4px 24px 0px rgba(10, 15, 45, 0.04);
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 24rpx 32rpx;
			width: 100%;

			.car-info {
				width: 70%;
				

				.title {
					font-size: 32rpx;

					text {
						border-radius: 8rpx;
						background: #F7F7F7;
						padding: 4rpx 22rpx;
						color: #666666;
						margin-left: 10rpx;
					}
				}

				.type {
					color: #86909C;
				}

				.xsz {
					color: #4170EE;
				}

				.val-text {
					color: #4E5969;

					.val-title {
						color: #4E5969;
					}
				}
			}

				.cph {
					position: absolute;
					top: 24px;
					right: 32px;
					font-size: 24rpx;
					padding: 4px 8px;
					color: #6A6A6A;
					border-radius: 4px;
				}

				.statusColor {
					background-color: rgba(65, 112, 238, 0.2);
					color: #4170EE;
				}

				.statusColor1 {
					background-color: rgba(46, 211, 155, 0.2);
					color: #2ED39B;
				}
			.car-img {
				
				width: 30%;
				height: 152rpx;

				.spot {
					position: absolute;
					bottom: 0;
					right: 0;
					width: 40rpx;
					height: 40rpx;
				}

				.img {
					// position: absolute;
					width: 100%;
					height: 100%;
				}

			}
		}
	}
}
</style>