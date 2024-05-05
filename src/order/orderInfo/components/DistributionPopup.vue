<template>
	<u-popup border-radius="14" closeable=true mode="bottom" v-model="show" @close="close">
		<view class="wrap">
			<view class="title">选择员工</view>
			
			<scroll-view
				scroll-y="true" 
				class="scroll-Y"
			>
				<view class="info" v-for="item in list" :key="item.id" @click="save(item)">
					{{item.name}}
					<view class="tag">{{item.roleName}}</view>
				</view>
			</scroll-view>
			
		</view>
	</u-popup>
</template>

<script>
export default {
	props: {
		show: {
			type: Boolean,
			default: false,
		},
		
		orderId: {
			type: Number | null,
			required: true,
		},
	},
	
	data() {
		return {
			currentCompany: {},
			roleId: null,
			list: [],
		}
	},
	
	mounted() {
		try {
			const value = uni.getStorageSync('current_company')
			if (value) {
				this.currentCompany = value
				
				if (value.company.roleList.some(item => item.id === 9)) {
					this.roleId = 9
				} else if (value.company.roleList.some(item => item.id === 2)) {
					this.roleId = 2
				} else {
					this.roleId = 3
				}
				
				this.getUserList()
				
				
			}
		} catch (e) {
			// error
		}
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
				this.list = res.data.records.filter(item => {
					let roleId = null
					let roleName = ''
					const roleList = item.userRoleList
					if (roleList.some(item => item.roleId === 9)) {
						roleId = 0
						roleName = '超级管理员'
					} else {
						roleList.sort((a,b) => a.roleId - b.roleId)
						roleId = roleList[0].roleId
						roleName = roleList[0].roleName
					}
					
					item.roleName = roleName
					item.roleId = roleId
					
					if (this.roleId === 9) {
						return true
					} else if (this.roleId === 2) {
						return roleId == 2 || roleId == 3 || roleId == 4
					}
					
					return roleId == 3 || roleId == 4
				})
			}
			
			uni.hideLoading()
		},
		
		async save(item) {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				merchantId: this.currentCompany.company.id,
				orderId: this.orderId,
				userId: this.currentCompany.userId,
				salesmanId: item.id,
				salesmanMobile: item.mobile,
				salesmanName: item.name,
			}
			
			const res = await this.$getRequest(this.$url.updateOrderSalesmanReqVo, "POST", params)
			
			if (res.code == 0) {
				uni.showToast({
					title: '分配成功',
					duration: 2000,
					icon: "none"
				})
				this.close()
				this.$emit('complete', {
					orderId: this.orderId,
					salesmanId: item.id,
					salesmanMobile: item.mobile,
					salesmanName: item.name,
				})
				
			}
			
			uni.hideLoading()
		},
		
		close() {
			this.$emit('update:show', false)
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	width: 100vw;
	padding: 18px 40rpx 40px;
	.title {
		margin-bottom: 20px;
		height: 42rpx;
		font-size: 15px;
		line-height: 42rpx;
		text-align: center;
		color: rgba(0, 0, 0, 0.9);
	}
	.scroll-Y {
		height: 600rpx;
	}
	.info {
		height: 100rpx;
		display: flex;
		align-items: center;
		color: rgba(26, 26, 26, 0.8);
		font-size: 14px;
		border-bottom: 2rpx solid #F2F3F5;
		.tag {
			margin-left: 16px;
			padding: 0 8rpx;
			height: 36rpx;
			line-height: 36rpx;
			border-radius: 4rpx;
			background: #E8F3FF;
			color: #4170EE;
			font-size: 11px;
		}
	}
}
</style>