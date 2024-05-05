<template>
	<view class="page-wrap">
		<view>
			<view class="item-wrap">
				<view class="item-title">员工姓名</view>
				<view class="item-content">
					<input
						v-model="staffInfo.name"
						class="input"
						maxlength="10"
						placeholder="请输入员工姓名"
						placeholder-style="font-size:14px;color:#A4AEBB;"
						:disabled="type == 2"
					/>
				</view>
			</view>
			
			<view class="item-wrap">
				<view class="item-title">员工电话</view>
				<view class="item-content">
					<input
						v-model="staffInfo.mobile"
						class="input"
						type="digit"
						inputmode="numeric"
						placeholder="请输入员工电话"
						placeholder-style="font-size:14px;color:#A4AEBB;"
						:disabled="type == 2"
					/>
				</view>
			</view>
			
			<view class="item-wrap">
				<view class="item-title">员工角色</view>
				<view class="item-content">
					<view class="role" @click="openRoleList">
						<view class="role-name">
							{{roleName ? roleName : '请选择员工角色'}}
						</view>
						<view style="margin-left:8rpx;">
							<u-icon name="arrow-down" color="#D8D8D8" size="32"></u-icon>
						</view>
					</view>
				</view>
			</view>
			
			<u-popup border-radius="14" mode="bottom" v-model="showRoleList">
				<view class="popup-wrap">
					<view class="popup-title">选择角色</view>
					<view class="popup-list">
						<view v-for="item in roleList" :key="item.id" class="role" :class="{'acitve-role': item.isChecked}" @click="changeRole(item)">
							<view class="role-name">{{item.roleName}}</view>
							<view v-if="item.isChecked">
								<u-icon name="checkbox-mark" color="#4170EE" size="32"></u-icon>
							</view>
						</view>
					</view>
				</view>
			</u-popup>
		</view>
		
		<view class="bottom-btn" @click="addStaff" v-if="type == 1">
			确认添加
		</view>
		<view class="bottom-btn-group" v-else-if="type == 2">
			<view class="btn" @click="delStaff">移除员工</view>
			<view class="btn save-btn" @click="editStaff">保存</view>
		</view>
		
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentCompany: {},
			staffInfo: {
				id: null,
				mobile: '',
				name: '',
				roleIdList: [],
			},
			type: null, // 1.添加 2.编辑
			roleList: [],
			showRoleList: false,
		}
	},
	
	onLoad(options) {
		this.type = options.type
		
		const value = uni.getStorageSync('current_company')
		if (value) {
			this.currentCompany = value
		}
		
		if (this.type == 2) {
			const staffInfo = uni.getStorageSync('staffInfo')
			if (staffInfo) {
				this.staffInfo = staffInfo
				this.staffInfo.roleIdList = staffInfo.userRoleList.map(item => item.roleId)
				
			}
		}
		
		this.getRoleList()
	},
	
	computed: {
		roleName() {
			let str = ''
			
			const list = this.roleList.filter(item => item.isChecked)
			
			if (list.length) {
				str = list.map(item => item.roleName).join('、')
			}
			
			return str
		},
	},
	
	
	methods: {
		async getRoleList() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				limit: 100,
				page: 1,
			}
			
			const res = await this.$getRequest(this.$url.getRoleList, "GET", params)
			
			if (res.code == 0 && res.data) {
				this.roleList = res.data.map(item => {
					item.isChecked = false
					
					if (this.type == 2 && this.staffInfo.roleIdList.includes(item.id)) {
						item.isChecked = true
					}
					
					return item
				})
			}
			
			uni.hideLoading()
		},
		
		openRoleList() {
			this.showRoleList = true
		},
		
		changeRole(item) {
			item.isChecked = !item.isChecked
		},
		
		async addStaff() {
			if(!this.staffInfo.name.trim()) {
				uni.showToast({
					title: '请输入员工姓名',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.staffInfo.mobile) {
				uni.showToast({
					title: '请输入员工电话',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.roleName) {
				uni.showToast({
					title: '请选择员工角色',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			this.staffInfo.roleIdList = this.roleList.filter(item => item.isChecked).map(item => item.id)
			
			uni.showLoading({
				title: '加载中'
			})
			
			const res = await this.$getRequest(this.$url.addUser, "POST", this.staffInfo)
			
			if (res.code == 0) {
				uni.showToast({
					title: '保存成功',
					duration: 2000,
					icon: "none"
				})
				
				uni.navigateBack({
					delta: 1
				})
			}
			
			uni.hideLoading()
		},
		
		async editStaff() {
			if(!this.roleName) {
				uni.showToast({
					title: '请选择员工角色',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			this.staffInfo.roleIdList = this.roleList.filter(item => item.isChecked).map(item => item.id)
			
			uni.showLoading({
				title: '加载中'
			})
			
			const res = await this.$getRequest(this.$url.editUser, "PUT", this.staffInfo)
			
			if (res.code == 0) {
				uni.showToast({
					title: '保存成功',
					duration: 2000,
					icon: "none"
				})
				
				uni.navigateBack({
					delta: 1
				})
			}
			
			uni.hideLoading()
		},
		
		delStaff() {
			uni.showModal({
				title: '提示',
				content: '确定要移除这个员工吗？',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: '加载中'
						})
						
						const params = [this.staffInfo.id]
						
						const res = await this.$getRequest(this.$url.delUser, "POST", params)
						
						if (res.code == 0) {
							uni.showToast({
								title: '保存成功',
								duration: 2000,
								icon: "none"
							})
							
							uni.navigateBack({
								delta: 1
							})
						}
						
						uni.hideLoading()
					}
				}
			})
			
			
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.item-wrap {
		padding: 16px 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: inset 0px -1px 0px 0px rgba(10, 15, 45, 0.04);
		.item-title {
			padding-left: 32rpx;
			font-size: 14px;
			color: #86909C;
		}
		.item-content {
			width: 0;
			flex: 1;
			.role {
				width: 100%;
				padding-left: 20rpx;
				display: flex;
				align-items: center;
				justify-content: flex-end;
			}
			.role-name {
				color: #A4AEBB;
				font-size: 14px;
				line-height: 44rpx;
			}
		}
		.input {
			text-align: right;
		}
	}
}

.popup-wrap {
	width: 100vw;
	padding: 20px 40rpx 60px;
	.popup-title {
		height: 42rpx;
		font-size: 16px;
		line-height: 42rpx;
		color: rgba(0, 0, 0, 0.9);
		margin-bottom: 16px;
		text-align: center;
	}
	.role {
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: rgba(26, 26, 26, 0.8);
		font-size: 14px;
		border-bottom: 2rpx solid #F2F3F5;
	}
	.acitve-role {
		color: #4170EE;
	}
}
</style>
