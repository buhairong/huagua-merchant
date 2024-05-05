<template>
	<view class="page-wrap">
		<view class="card" v-for="item in list" :key="item.id">
			<view class="left">
				<view class="info">
					{{item.name}}
					<view class="tag">{{item.roleName}}</view>
				</view>
				<view class="mobile">
					电话：{{item.mobile}}
				</view>
			</view>
			
			<view class="right">
				<view class="right-text" v-if="currentCompany.userId === item.id">
					本人
				</view>
				<view class="edit-btn" @click="goSetStaffPage(2, item)" v-else-if="roleGrade <= managerGrade">
					管理员工
				</view>
			</view>
		</view>
		
		<view class="fixed-bottom-btn" v-if="roleGrade <= managerGrade">
			<view class="bottom-btn" @click="goSetStaffPage(1)">
				添加员工
			</view>
		</view>
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentCompany: {},
			list: [],
			roleGrade: null,
			managerGrade: 2,
		}
	},
	
	onLoad(options) {
		try {
			const value = uni.getStorageSync('current_company')
			if (value) {
				this.currentCompany = value
			}
		} catch (e) {
			// error
		}
	},
	
	onShow() {
		this.getUserList()
	},
	
	methods: {
		async getUserList() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				limit: 100,
				page: 1,
			}
			
			const res = await this.$getRequest(this.$url.getUserList, "POST", params)
			
			if (res.code == 0 && res.data) {
				this.list = res.data.records.map(item => {
					let roleName = ''
					const roleList = item.userRoleList
					roleList.sort((a,b) => a.roleGrade - b.roleGrade)
					item.roleName = roleList[0].roleName
					item.roleGrade = roleList[0].roleGrade
					
					if (this.currentCompany.userId === item.id) {
						this.roleGrade = item.roleGrade
					}
					
					return item
				})
			}
			
			uni.hideLoading()
		},
		
		// 1.添加 2.编辑
		goSetStaffPage(type, item) {
			if (item) {
				uni.setStorageSync("staffInfo", item)
			}
			
			uni.navigateTo({
				url: `/pages/staff/setStaff?type=${type}`
			})
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	min-height: 100vh;
	padding-bottom: 140px;
}

.card {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.left {
		.info {
			height: 48rpx;
			display: flex;
			align-items: center;
			color: #1D2129;
			font-size: 16px;
			.tag {
				margin-left: 16rpx;
				height: 36rpx;
				line-height: 36rpx;
				border-radius: 4rpx;
				background: #E8F3FF;
				color: #4170EE;
				font-size: 11px;
				padding: 0 8rpx;
			}
		}
		.mobile {
			margin-top: 10rpx;
			height: 36rpx;
			font-size: 12px;
			line-height: 36rpx;
			color: #86909C;
		}
	}
	.right {
		.right-text {
			font-size: 12px;
			color: #4170EE;
		}
		.edit-btn {
			width: 128rpx;
			height: 56rpx;
			border-radius: 8rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 2rpx solid rgba(65, 112, 238, 0.8);
			color: #4170EE;
			font-size: 12px;
		}
	}
}

</style>
