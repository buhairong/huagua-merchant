<template>
	<view>
		<view class="company-list">
			<view 
				v-for="item in companyList"
				:key="item.id"
				class="company"
				:class="{active: item.isCurrentLoginCompanyMerchantApp === 1}"
				@click="changeCompany(item)"
			>
				<!-- <view class="tag" v-if="item.isCurrentLoginCompanyMerchantApp === 1">当前公司</view> -->
				<image
					v-if="item.logoImageUrl"
					class="logo-img"
					:src="item.logoImageUrl"
				/>
				<image
					v-else
					class="logo-img"
					src="https://image.51cheyaoshi.com/2022/09/05/logo_changyong.png"
				/>
				<view class="right">
					<view class="company-name">
						{{item.companyName}}
						<view class="sign-tag" v-if="(item.contractStatus === 0 && item.companyType === 1 && item.signType === 1)">待签约</view>
					</view>
					<view class="role-wrap">
						<view
							class="role"
							v-for="(role, index) in item.roleList"
							:key="role.id"
						>
							<text v-if="index !== 0">｜</text> {{role.roleName}}
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<u-popup border-radius="14" closeable=true mode="bottom" v-model="showSignPopup">
			<view class="popup-wrap">
				<view class="sign-btn" @click="contractFn">签署合同</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			companyList: [],
			username: '',
			showSignPopup: false,
			userinfo: {},
			signItem: {},
			user: {},
		}
	},
	
	onLoad(options) {
		const value = uni.getStorageSync('userinfo')
		if (value) {
			if (typeof value === 'string') {
				this.userinfo = JSON.parse(value)
			} else {
				this.userinfo = value
			}
			
		}
	},
	
	onShow() {
		this.queryUserInfoAndCompanyList()
	},
	
	methods: {
		async queryUserInfoAndCompanyList() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				systemTag: 1,
			}
			
			const res = await this.$getRequest(this.$url.queryUserInfoAndCompanyList, "GET", params)
			
			if (res.code == 0) {
				this.companyList = res.data.userCompanyList
				this.user = res.data.user
				
				const current_company = res.data.userCompanyList.filter(item => item.isCurrentLoginCompanyMerchantApp === 1)[0]
				
			}
			
			uni.hideLoading()
		},
		
		async changeCompany(item) {
			if(item.contractStatus === 1 || item.companyType === 0 || item.companyType === 2 || item.signTime === 2 || item.signType === 2) {
				uni.showLoading({
					title: '更新中'
				})
				
				const params = {
					companyId: item.id,
					companyType: item.companyType,
					systemTag: 1,
					token: this.userinfo.token,
					userId: this.userinfo.userid || this.user.id,
				}
				
				const res = await this.$getRequest(this.$url.updateUserLoginCompanyInfo, "POST", params)
				
				uni.hideLoading()
				
				if (res.code == 0) {
					uni.showToast({
						title: '更新成功',
						duration: 2000,
						icon: 'none'
					})
					
					const currentCompany = {
						company: item,
						username: this.username,
					}
					try {
						uni.setStorageSync('current_company', currentCompany)
						uni.reLaunch({
							url: '/pages/workspace/workspace'
						})
					} catch (e) {
						// error
					}
					
				} else {
					uni.showToast({
						title: '更新失败',
						duration: 2000,
						icon: 'none'
					})
				}
			} else {
				this.openSignPopup(item)
			}
		},
		
		openSignPopup(item) {
			this.signItem = item
			this.showSignPopup = true
		},
		
		async contractFn(){
			const redirectUrl = '/pages/workspace/wxbview'
			let params={
				 companyId: this.signItem.id,
				 redirectUrl,
			}
			
			const result = await this.$getRequest(this.$url.esignCooperation, 'POST', params)
			if(result.code == 0) {
				const contractUrl = result.data.contractUrl || result.data
				uni.setStorageSync('url', result.data.contractUrl || result.data)
				
				const params = {
					companyId: this.signItem.id,
					companyType: this.signItem.companyType,
					systemTag: 1,
					token: this.userinfo.token,
					userId: this.userinfo.userid,
				}
				
				uni.setStorageSync('changeCompanyParams', params)
				uni.navigateTo({
					url: '/pages/workspace/wxbview?from=sign'
				})
				this.showSignPopup = false
			}
		},
		
	},
}
</script>

<style lang="scss" scoped>
.company-list {
	padding: 48rpx 32rpx;
	.company {
		border-radius: 24rpx;
		margin-bottom: 12px;
		background-color: #fff;
		padding: 40rpx 32rpx;
		display: flex;
		position: relative;
		box-shadow: 0px -1px 24px 0px rgba(10, 15, 45, 0.04),0px 4px 24px 0px rgba(10, 15, 45, 0.04);
		overflow: hidden;
		.tag {
			width: 112rpx;
			height: 40rpx;
			background: rgba(2, 86, 255, 0.1);
			font-size: 10px;
			font-weight: 500;
			color: #0256FF;
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			top: 0;
			right: 0;
			border-bottom-left-radius: 24rpx;
		}
		.logo-img {
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
			margin-right: 24rpx;
		}
		.right {
			.company-name {
				margin-bottom: 4px;
				font-size: 14px;
				font-weight: 500;
				line-height: 44rpx;
				color: #1D2129;
				display: flex;
				align-items: center;
				.sign-tag {
					margin-left: 12rpx;
					width: 100rpx;
					height: 40rpx;
					border-radius: 4rpx;
					background: #E5EEFF;
					font-size: 10px;
					color: #0256FF;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
			.role-wrap {
				display: flex;
				flex-wrap: wrap;
				.role {
					margin-bottom: 8rpx;
					height: 36rpx;
					font-size: 12px;
					line-height: 36rpx;
					color: #86909C;
				}
			}
		}
	}
	.active {
		border: 4rpx solid rgba(2, 86, 255, 0.4);
	}
}

.popup-wrap {
	width: 100vw;
	height: 528rpx;
	padding: 0 52rpx;
	display: flex;
	align-items: center;
	.sign-btn {
		width: 100%;
		height: 116rpx;
		border-radius: 16rpx;
		background: #4170EE;
		font-size: 17px;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>
