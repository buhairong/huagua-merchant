<template>
	<view class="page-wrap" v-if="currentCompany">
		<view class="header">
			<view
			    class="status-bar"
			    :style="{ height: custom.top + 'px' }"
			/>
			<view class="nav">
				<view class="switch-btn" @click="changeCompany" v-if="companyList.length > 1">
					<image
						class="switch-img"
						src="https://image.51cheyaoshi.com/xcx/merchant/static/home/swap.png"
						mode="widthFix"
					/>
					切换公司
				</view>
				工作台
			</view>
		</view>
		
		<view class="user-info-wrap">
			<view class="left">
				<template v-if="currentCompany.company.companyType != 0">
					<image
						v-if="currentCompany.company.logoImageUrl"
						class="logo-img"
						:src="currentCompany.company.logoImageUrl"
					/>
					<image
						v-else
						class="logo-img"
						src="https://image.51cheyaoshi.com/2022/09/05/logo_changyong.png"
					/>
				</template>
				
				<view class="company-info">
					<view class="user-name">
						{{currentCompany.username}}
						<view class="role-name">{{currentCompany.company.roleList[0].roleName}}</view>
					</view>
					<view class="company-name" v-if="currentCompany.company.companyType != 0">
						{{currentCompany.company.companyName}}
					</view>
				</view>
			</view>
			<view class="right" @click="goCashPage" v-if="currentCompany.company.companyType == 1">
				<view class="money">{{totalMoney | $numFormat}}元</view>
				<view class="money-type">账户余额</view>
			</view>
		</view>
		
		<view class="card" v-if="currentCompany.company.companyType == 1">
			<view class="title">菜单栏</view>
			<view class="item-wrap">
				<view class="item" @click="goPlanPage">
					<view class="img-wrap">
						<image
							style="width:54rpx;"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/home/plan-icon.png"
							mode="widthFix"
						/>
					</view>
					
					<view class="text">方案</view>
				</view>
				
				<view class="item" @click="goOrderPage">
					<view class="img-wrap">
						<image
							style="width:45rpx;"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/home/order-icon.png"
							mode="widthFix"
						/>
						<view class="badge" v-if="untreatedOrderNum">{{untreatedOrderNum}}</view>
					</view>
					
					<view class="text">订单</view>
				</view>
				
				<view class="item" @click="goCarPage">
					<view class="img-wrap">
						<image
							style="width:100rpx;"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/home/car-icon.png"
							mode="widthFix"
						/>
					</view>
					
					<view class="text">车辆</view>
				</view>
				
				<view class="item" @click="goCustomPage">
					<view class="img-wrap">
						<image
							style="width:52rpx;"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/home/customer-icon.png"
							mode="widthFix"
						/>
					</view>
					
					<view class="text">客户</view>
				</view>
				
				<view class="item" @click="goFinancePage" v-if="isManager">
					<view class="img-wrap">
						<image
							style="width:48rpx;"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/home/finance-icon.png"
							mode="widthFix"
						/>
					</view>
					
					<view class="text">财务</view>
				</view>
				
				<view class="item" @click="goStaffPage" v-if="isManager">
					<view class="img-wrap">
						<image
							style="width:62rpx;"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/home/staff-icon.png"
							mode="widthFix"
						/>
					</view>
					
					<view class="text">员工</view>
				</view>
				
				<view class="item" @click="goCalculatorPage">
					<view class="img-wrap">
						<image
							style="width:68rpx;"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/home/calculator-icon.png"
							mode="widthFix"
						/>
					</view>
					
					<view class="text">计算器</view>
				</view>
				
				<view class="item" @click="goPricePage" v-if="isManager && (companyRole === 1 || companyRole === 2)">
					<view class="img-wrap">
						<image
							style="width:54rpx;"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/home/price-icon.png"
							mode="widthFix"
						/>
					</view>
					
					<view class="text">报价</view>
				</view>
				
				<view class="item" @click="goNoticePage">
					<view class="img-wrap">
						<image
							style="width:60rpx;"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/home/notice-icon.png"
							mode="widthFix"
						/>
						<view class="badge" v-if="messageNum">{{messageNum}}</view>
					</view>
					
					<view class="text">通知</view>
				</view>
				
				<view class="item" @click="goCommissionPage" v-if="isManager2">
					<view class="img-wrap">
						<image
							style="width:52rpx;"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/order/commission.png"
							mode="widthFix"
						/>
					</view>
					
					<view class="text">佣金</view>
				</view>
				
				<view class="item" @click="goQualityPage" v-if="isManager">
					<view class="img-wrap">
						<image
							style="width:64rpx;"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/home/quality-icon.png"
							mode="widthFix"
						/>
					</view>
					
					<view class="text">精品/装潢</view>
				</view>
				
				<view class="item" @click="goAuctionPage">
					<view class="img-wrap">
						<image
							style="width:68rpx;"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/order/auction_icon.png"
							mode="widthFix"
						/>
					</view>
					
					<view class="text">竞卖</view>
				</view>
			</view>
		</view>
		
		
		
		<!-- 金融公司 -->
		<view class="card" v-if="currentCompany.company.companyType == 2">
			<view class="title">菜单栏</view>
			<view class="item-wrap">
				<view class="item" @click="goRiskOrderPage(1)">
					<view class="img-wrap">
						<image
							style="width:45rpx;"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/order/person-order.png"
							mode="widthFix"
						/>
						<view class="badge" v-if="personUntreatedOrderNum">{{personUntreatedOrderNum}}</view>
					</view>
					
					<view class="text">个人订单</view>
				</view>
				
				<view class="item" @click="goRiskOrderPage(2)">
					<view class="img-wrap">
						<image
							style="width:45rpx;"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/home/order-icon.png"
							mode="widthFix"
						/>
						<view class="badge" v-if="compnayUntreatedOrderNum">{{compnayUntreatedOrderNum}}</view>
					</view>
					
					<view class="text">企业订单</view>
				</view>
				
				<view class="item" @click="goStaffPage" v-if="isManager1">
					<view class="img-wrap">
						<image
							style="width:62rpx;"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/home/staff-icon.png"
							mode="widthFix"
						/>
					</view>
					
					<view class="text">员工</view>
				</view>
			
			</view>
			
		</view>
		
		
		<view class="risk-wrap" v-else-if="currentCompany.company.companyType == 0">
			<view class="search-header">
				<view class="tabs">
					<view 
						v-for="tab in rentalUserTypeTabs"
						:key="tab.id"
						class="tab"
						:class="{'tab-active': tab.id === activeTab}"
						@click="changeTab(tab.id)"
					>
						<view class="line" v-if="tab.id == activeTab"></view>
						{{tab.label}}
					</view>
				</view>
			</view>
			
			<view class="container">
				<view class="car-list" v-if="activeTab === 1">
					<scroll-view 
						:scroll-top="personOrderList.scrollTop" 
						scroll-y="true" 
						class="scroll-Y" 
						@scrolltolower="personOrderListBottom"
						@scroll="personOrderScroll"
					>
						<RentalOrderListItem
							v-for="item in personOrderList.list"
							:key="item.id"
							:item="item"
							:orderType="1"
						/>				
						
						<u-empty v-if="personOrderList.errMsg" :text="personOrderList.errMsg" mode="list"></u-empty>
						<view class="loadmore">
							<u-loadmore
								v-if="personOrderList.list.length"
								:status="personOrderList.status"
								:load-text="loadText"
							/>
						</view>
					</scroll-view>
				</view>
				
				<view class="car-list" v-if="activeTab === 2">
					<scroll-view
						:scroll-top="companyOrderList.scrollTop" 
						scroll-y="true" 
						class="scroll-Y" 
						@scrolltolower="companyOrderListBottom"
						@scroll="companyOrderScroll"
					>
						<RentalOrderListItem
							v-for="item in companyOrderList.list"
							:key="item.id"
							:item="item"
							:orderType="2"
						/>				
						
						<u-empty v-if="companyOrderList.errMsg" :text="companyOrderList.errMsg" mode="list"></u-empty>
						<view class="loadmore">
							<u-loadmore
								v-if="companyOrderList.list.length"
								:status="companyOrderList.status"
								:load-text="loadText"
							/>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
import QQMapWX from '@/qqmap-wx-jssdk.min.js'
import { CAR_RENTAL_ORDER_STATUS, rentalUserTypeTabs } from '@/constants/index.js'
import RentalOrderListItem from './components/RentalOrderListItem.vue'

const app = getApp()
export default {
	components: {
		RentalOrderListItem,
	},
	
	data() {
		return {
			rentalUserTypeTabs,
			CAR_RENTAL_ORDER_STATUS,
			activeTab: 1,
			custom: app.globalData.custom,
			currentCompany: {},
			personUntreatedOrderNum: 0,
			compnayUntreatedOrderNum: 0,
			messageNum: 0,
			showPage: false,
			roleList: [],
			search: '',
			page: 1,
			list: [],
			status: 'loadmore', // 加载更多 状态
			totalPages: 0, // 总页数
			loadText: {
			  loadmore: '轻轻上拉',
			  loading: '努力加载中',
			  nomore: '实在没有了'
			},
			delivery: {},
			userId: '',
			companyList: [],
			isManager: false, // 9.超级管理员  2.总经理  3.销售 总监  4.销售
			isManager2: false,
			isManager1: false, // 10.超级管理员  8.总经理
			companyRole: null, // （商户角色）角色选择：1 4s，2 二级销售网络，3 二手车商
			personOrderScrollTop: 0,
			companyOrderScrollTop: 0,
			personOrderList: {
				scrollTop: 0,
				list: [],
				type: 1,
				limit: 10,
				page: 1,
				totalPage: 0,
				errMsg: '',
				status: 'loadmore',
			},
			companyOrderList: {
				scrollTop: 0,
				list: [],
				type: 2,
				limit: 10,
				page: 1,
				totalPage: 0,
				errMsg: '',
				status: 'loadmore',
			},
			totalMoney: 0,
			isLoad: true,
		}
	},
	
	computed: {
		untreatedOrderNum() {
			return this.personUntreatedOrderNum + this.compnayUntreatedOrderNum
		},
	},
	
	onLoad() {
		wx.showShareMenu({
			withShareTicket:true,
			//设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
			menus:["shareAppMessage","shareTimeline"]
		})
		
	},
	
	onShow() {
		const tokenData = uni.getStorageSync('tokenData')
		const currentCompany = uni.getStorageSync('current_company')
		if (tokenData && currentCompany){
			this.getLocation()
			this.showPage = true
			
			const userinfo = uni.getStorageSync('userinfo')
			if (userinfo) {
				this.roleList = userinfo.roleList
				this.queryUserInfoAndCompanyList()
			}
		} else if (tokenData && !currentCompany){
			uni.reLaunch({
				url:'/pages/workspace/selectCompany'
			})
		} else {
			uni.reLaunch({
				url:'/pages/login/sign'
			})
		}
	},
	
	methods: {
		async selectListOfUserId() {
			const params = {
				brokerageType: this.currentCompany.isSuperManager ? 2 : 1
			}
			
			const res = await this.$getRequest(this.$url.selectListOfUserId, "GET", params)
			
			if (res.code == 0 && res.data) {
				this.totalMoney = res.data.totalMoney || 0
			}
		},
		
		async selectCarDeliveryInfo() {
			const params = {
				userId: this.userId,
			}
			
			const res = await this.$getRequest(this.$url.selectCarDeliveryInfo, "GET", params)
			
			if (res.code == 0 && res.data) {
				this.delivery = res.data
			}
		},
		
		async selectCarDeliveryOrderList() {
			const params = {
				userId: this.userId,
				search: this.search,
				page: this.page,
				limit: 10,
			}
			
			const res = await this.$getRequest(this.$url.selectCarDeliveryOrderList, "POST", params)
			
			if (res.code == 0) {
				this.list = [...this.list, ...res.data.records]
				this.totalPages = res.data.pages
			}
		},
		
		entryContent(e) {
			console.log('entryContent', e)
			this.page = 1
			this.list = []
			this.selectCarDeliveryOrderList()
		},
		
		changeCompany() {
			uni.navigateTo({
				url:'/pages/workspace/selectCompany'
			})
		},
		
		async queryUserInfoAndCompanyList() {
			const params = {
				systemTag: 1,
			}
			
			const res = await this.$getRequest(this.$url.queryUserInfoAndCompanyList, "GET", params)
			
			if (res.code == 0) {
				this.companyList = res.data.userCompanyList
				
				//res.data.userCompanyList[0].isCurrentLoginCompanyMerchantApp = 0
				//res.data.userCompanyList[1].isCurrentLoginCompanyMerchantApp = 1
				
				const current_company = res.data.userCompanyList.filter(item => item.isCurrentLoginCompanyMerchantApp === 1)[0]
				
				this.companyRole = current_company.chooseRole
				
				// 9.超级管理员  2.总经理  3.销售总监  4.销售
				this.isManager = current_company.roleList.some(item => item.id === 9 || item.id === 2 || item.id === 3)
				this.isManager2 = current_company.roleList.some(item => item.id === 9 || item.id === 2)
				this.isManager1 = current_company.roleList.some(item => item.id === 10 || item.id === 8)
				const isSuperManager = current_company.roleList.some(item => item.id === 9)
				
				const username = res.data.user.name
				const mobile = res.data.user.mobile
				this.currentCompany = {
					company: current_company,
					username,
					mobile,
					openid: res.data.user.merchantAppOpenId,
					userId: res.data.user.id,
					isSuperManager,
				}
				
				this.selectListOfUserId()
				
				this.selectUntreatedOrderNum()
				if (current_company.companyType === 1) {
					this.selectNoReadSystemMsgNum()
				} else if (current_company.companyType === 0 && this.isLoad) {
					this.getPersonOrderList()
					this.getCompanyOrderList()
				}
				
				this.isLoad = false
				
				try {
					uni.setStorageSync('current_company', this.currentCompany)
				} catch (e) {
					// error
				}
			}
		},
		
		async selectUntreatedOrderNum() {
			const params = {
				merchantId: this.currentCompany.company.id,
				roleType: this.isManager ? 1 : 2,
				userId: this.currentCompany.userId
			}
			
			const res = await this.$getRequest(this.$url.selectUntreatedOrderNum, "GET", params)
			
			if (res.code == 0 && res.data) {
				this.personUntreatedOrderNum = res.data.personNum || 0
				this.compnayUntreatedOrderNum = res.data.companyNum || 0
			}
		},
		
		async selectNoReadSystemMsgNum() {
			const params = {
				systemType: 1,
				userId: this.currentCompany.userId
			}
			
			const res = await this.$getRequest(this.$url.selectNoReadSystemMsgNum, "GET", params)
			
			if (res.code == 0 && res.data) {
				this.messageNum = res.data.messageNum
			}
		},
		
		goCustomPage() {
			uni.navigateTo({
				url: '/pages/customer/customer'
			})
			
		},
		
		goCarPage() {
			uni.navigateTo({
				url: '/pages/car/carList'
			})
		},
		
		goOrderPage() {
			uni.navigateTo({
				url: '/order/orderInfo/orderList'
			})
		},
		
		goPlanPage() {
			uni.navigateTo({
				url: `/pages/plan/planList?companyRole=${this.companyRole}&companyId=${this.currentCompany.company.id}`,
			})
		},
		
		goFinancePage() {
			uni.navigateTo({
				url: '/pages/finance/home',
			})
		},
		
		goStaffPage() {
			uni.navigateTo({
				url: '/pages/staff/home',
			})
		},
		
		goCalculatorPage() {
			uni.setStorageSync('url', 'https://h5.51cheyaoshi.com/h5/index.html')
			uni.navigateTo({
				url:'/pages/workspace/wxbview'
			})
		},
		
		goPricePage() {
			uni.navigateTo({
				url: `/pages/price/home?companyRole=${this.companyRole}&companyId=${this.currentCompany.company.id}`,
			})
		},
		
		goNoticePage() {
			uni.navigateTo({
				url: '/pages/notice/home',
			})
		},
		
		goCommissionPage() {
			uni.navigateTo({
				url: '/pages/commission/setCommission',
			})
		},
		
		goQualityPage() {
			uni.navigateTo({
				url: '/pages/quality/setQuality',
			})
		},
		
		goCashPage() {
			uni.navigateTo({
				url: '/cash/cash/home',
			})
		},
		
		goAuctionPage() {
			uni.navigateTo({
				url: '/auction/home',
			})
		},
		
		// 1.个人 2.企业
		goRiskOrderPage(orderType) {
			uni.navigateTo({
				url: `/risk/risk/orderList?orderType=${orderType}`,
			})
		},
		
		gotoDetail(item) {
			let carId = item.carId || ''
			uni.navigateTo({
				url: `/pages/orderInfo/handoverOrderDetailInfo?id=${item.id}&carId=${carId}&newType=${item.newType}&carBrand=${item.carBrand}&carType=${item.carType}&carTypeYear=${item.carTypeYear}&carTypeYearProduct=${item.carTypeYearProduct}&imageUrl=${item.imageUrl}`
			})
		},
		
		getLocation() {
				let latitude = ''
		    let longitude = ''
		    uni.getLocation({
		        type: 'gcj02', //返回可以用于uni.openLocation的经纬度
		        success: function (res) {
								latitude = res.latitude;
		            longitude = res.longitude;
		            // 逆地理
		            let qqmapsdk = new QQMapWX({
		                key: 'ONYBZ-WH6KF-BAIJO-NWS5O-KM4LS-BSFY4'
		            });
		            qqmapsdk.reverseGeocoder({
		                location: {
		                    latitude: latitude,
		                    longitude: longitude
		                },
		                get_poi: 1,
		                coord_type: 1,
		                poi_options: 'policy=3;page_size=20',
		                success: function (res) {
												if(res.status == 0) {
													const cityId = res.result.ad_info.adcode.slice(0,4) + '00'
													
													uni.setStorageSync("cityId", cityId)
													
													uni.setStorageSync("locationAddress", res.result)
		                    } 
		                },
		                fail: function (res) {
												console.log('reverseGeocoder fail', res)
		                },
		            })
		        },
						fail: function (res) {
							console.log('getLocation fail', res)
						}
		    })
		},
		
		changeTab(id) {
			this.activeTab = id
			this.$nextTick(() => {
				if (id === 1) {
					this.personOrderList.scrollTop = this.personOrderScrollTop
				} else {
					this.companyOrderList.scrollTop = this.companyOrderScrollTop
				}
			})
		},
		
		// 送车单
		async getPersonOrderList() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				...this.personOrderList,
				userId: this.currentCompany.userId,
			}
			
			const res = await this.$getRequest(this.$url.selectRentalOrderList, "POST", params)
			
			if (res.code == 0 && res.data) {
				if (res.data.records && res.data.records.length) {
					this.personOrderList.list = [...this.personOrderList.list, ...res.data.records]
				}
				if (res.data.pages) {
					this.personOrderList.totalPages = res.data.pages
					if(this.personOrderList.page >= this.personOrderList.totalPages) {
						this.personOrderList.status = 'nomore'
					}
				} else {
					this.personOrderList.errMsg = '暂无数据'
				}
			} else {
				this.personOrderList.errMsg = '暂无数据'
			}
			
			uni.hideLoading()
		},
		
		// 接车单
		async getCompanyOrderList() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				...this.companyOrderList,
				userId: this.currentCompany.userId,
			}
			
			const res = await this.$getRequest(this.$url.selectRentalOrderList, "POST", params)
			
			if (res.code == 0 && res.data) {
				if (res.data.records && res.data.records.length) {
					this.companyOrderList.list = [...this.companyOrderList.list, ...res.data.records]
				}
				if (res.data.pages) {
					this.companyOrderList.totalPages = res.data.pages
					if(this.companyOrderList.page >= this.companyOrderList.totalPages) {
						this.companyOrderList.status = 'nomore'
					}
				} else {
					this.companyOrderList.errMsg = '暂无数据'
				}
			} else {
				this.companyOrderList.errMsg = '暂无数据'
			}
			
			uni.hideLoading()
		},
		
		personOrderScroll(e) {
			this.personOrderScrollTop = e.detail.scrollTop
		},
		
		companyOrderScroll(e) {
			this.companyOrderScrollTop = e.detail.scrollTop
		},
		
		personOrderListBottom() {
			if(this.personOrderList.page >= this.personOrderList.totalPages) {
				this.personOrderList.status = 'nomore'
				return
			}
			this.personOrderList.status = 'loading'
			++this.personOrderList.page;
			
			this.getPersonOrderList()
		},
		
		companyOrderListBottom() {
			if(this.companyOrderList.page >= this.companyOrderList.totalPages) {
				this.companyOrderList.status = 'nomore'
				return
			}
			this.companyOrderList.status = 'loading'
			++this.companyOrderList.page
			
			this.getCompanyOrderList()
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	padding-top: 0;
	padding-bottom: 40px;
	height: 100vh;
	background-image: url(https://image.51cheyaoshi.com/xcx/merchant/static/home/group_333.png);
	background-repeat: no-repeat;
	background-size: 100vw 800rpx;
	display: flex;
	flex-direction: column;
	.header {
		.nav {
			width: 100%;
			line-height: 32px;
			position: relative;
			height: 32px;
			font-size: 17px;
			font-weight: 600;
			text-align: center;
			color: #000000;
			.switch-btn {
				position: absolute;
				top: 0;
				left: 0;
				display: flex;
				align-items: center;
				font-size: 14px;
				color: #4E5969;
				.switch-img {
					width: 40rpx;
					margin-right: 10rpx;
				}
			}
		}
	}
	
	.user-info-wrap {
		margin: 30px 0;
		display: flex;
		justify-content: space-between;
		.left {
			margin-right: 20rpx;
			flex: 1;
			display: flex;
			.logo-img {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				margin-right: 24rpx;
			}
			.company-info {
				flex: 1;
				.user-name {
					font-size: 17px;
					font-weight: 500;
					line-height: 48rpx;
					color: #1D2129;
					display: flex;
					align-items: center;
				}
				.company-name {
					margin: 6px 0 4px;
					font-size: 14px;
					color: #4E5969;
					line-height: 40rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.switch-btn {
						font-size: 12px;
						color: #4E5969;
					}
				}
				.role {
					display: flex;
					flex-wrap: wrap;
				}
				.role-name {
					margin-left: 8rpx;
					height: 36rpx;
					line-height: 36rpx;
					padding: 0px 8rpx;
					border-radius: 4rpx;
					background: #7F52FF;
					font-size: 12px;
					color: #FFFFFF;
				}
			}
		}
		.right {
			height: 120rpx;
			padding: 20rpx 16rpx;
			box-shadow: 0px -1px 24px 0px rgba(10, 15, 45, 0.04),0px 4px 24px 0px rgba(10, 15, 45, 0.04);
			background: #FFFFFF;
			border-radius: 8rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			.money {
				height: 32rpx;
				font-size: 16px;
				line-height: 32rpx;
				color: #565A69;
			}
			.money-type {
				height: 32rpx;
				font-size: 12px;
				line-height: 32rpx;
				color: #9496A0;
			}
			.bell-wrap {
				width: 56rpx;
				height: 56rpx;
				display: flex;
				align-items: flex-end;
				position: relative;
				.bell-img {
					width: 40rpx;
				}
				.badge {
					position: absolute;
					top: 0;
					right: 0;
					width: 36rpx;
					height: 36rpx;
					border-radius: 50%;
					background: #FF4D4F;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 10px;
					font-weight: 500;
					color: #FFFFFF;
				}
			}
		}
	}
	
	.card {
		padding: 20px;
		border-radius: 24rpx;
		background: #FFFFFF;
		.title {
			height: 48rpx;
			font-size: 16px;
			font-weight: 500;
			line-height: 48rpx;
			color: #1D2129;
			margin-bottom: 16px;
		}
		.item-wrap {
			display: flex;
			flex-wrap: wrap;
			.item {
				margin-top: 12px;
				margin-right: 98rpx;
				width: 130rpx;
				height: 130rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				.img-wrap {
					width: 68rpx;
					height: 68rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;
					.badge {
						padding: 0 8rpx;
						position: absolute;
						top: -12rpx;
						right: -8rpx;
						min-width: 36rpx;
						height: 36rpx;
						border-radius: 50%;
						background: #FF4D4F;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 10px;
						font-weight: 500;
						color: #FFFFFF;
					}
				}
				
				.text {
					margin-top: 8px;
					height: 36rpx;
					font-size: 13px;
					line-height: 36rpx;
					color: #1D2129;
				}
			}
			.item:nth-child(3n) {
				margin-right: 0;
			}
			.item:nth-child(-n + 3) {
				margin-top: 0;
			}
		}
		.item-wrap2 {
			margin-top: 12px;
		}
	}
}

.handover {
	.search-wrap {
		margin-top: 24px;
		width: 100%;
		height: 80rpx;
		padding-left: 20rpx;
		border-radius: 8rpx;
		background: rgba(255, 255, 255, 0.9);
		display: flex;
		align-items: center;
		u-input {
			flex: 1;
			margin: 0 24rpx;
		}
	}
	.list-wrap {
		margin-top: 14px;
		.list-card {
			margin-bottom: 12px;
			padding: 16px 32rpx;
			border-radius: 24rpx;
			background: #fff;
			.header {
				display: flex;
				justify-content: space-between;
				.brand {
					margin-right: 24rpx;
				}
				.brand-name {
					font-size: 16px;
					line-height: 48rpx;
					color: #1D2129;
				}
				.product {
					margin-top: 2px;
					font-size: 12px;
					line-height: 36rpx;
					color: #86909C;
				}
				.tag {
					width: 152rpx;
					height: 52rpx;
					border-radius: 8rpx;
					font-size: 12px;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.tag1 {
					background: #E7EFFE;
					color: rgba(65, 112, 238, 0.8);
				}
				.tag2 {
					background: #FFF7E8;
					color: #FF7D00;
				}
				.tag3 {
					background: rgba(46, 211, 155, 0.2);
					color: rgba(46, 211, 155, 0.8);
				}
			}
			.info {
				margin-top: 16px;
				.item {
					margin-top: 4px;
					display: flex;
					.item-title {
						height: 36rpx;
						font-size: 12px;
						line-height: 36rpx;
						color: #4E5969;
						padding-right: 8rpx;
					}
					.item-content {
						font-size: 12px;
						line-height: 36rpx;
						color: #1D2129;
					}
					.unbind {
						color: #4E5969;
					}
				}
				.item:first-child {
					margin-top: 0;
				}
			}
		}
	}
}

.risk-wrap {
	height: 0;
	flex: 1;
	display: flex;
	flex-direction: column;
}
.container {
	height: 0;
	flex: 1;
	.car-list {
		height: 100%;
		display: flex;
		flex-direction: column;
		.scroll-Y {
			height: 0;
			flex: 1;
		}
	}
}
</style>
