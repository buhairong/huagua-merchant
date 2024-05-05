<template>
  <view class="sign">
    <view class="sign-logo">
      <u-image
        width="180rpx"
        height="180rpx"
        src="https://image.51cheyaoshi.com/xcx/merchant/static/logo.png"
      />
    </view>
    <view class="slogan">
      WECARS商户端
    </view>
    <view class="btu-wx">
      <u-button
				v-if="isAgree"
        :ripple="true"
        type="primary"
        open-type="getPhoneNumber"
        @getphonenumber="handleLogin"
      >
        <!-- <u-image
            width="56rpx"
            mode="aspectFit"
            height="70rpx"
            class="wx-icon"
            src="https://image.51cheyaoshi.com/xcx/merchant/static/wx_icon.png"
        >
          <u-loading slot="loading" />
        </u-image> -->
        手机号快捷登录
      </u-button>
			<view v-else class="btn" @click="handlerTip">
				手机号快捷登录
			</view>
    </view>
		<view class="operator">
			<u-checkbox-group>
				<u-checkbox 
					v-model="isAgree" 
					name="1"
					shape="circle"
				>
					已阅读、并自愿同意
					<text style="font-weight:500;color:#3D3D3D;" @click.stop="goAgreeMentPage">
						《WECARS隐私政策》
					</text>
				</u-checkbox>
			</u-checkbox-group>
		</view>
  </view> 
</template>

<script>
export default {
  name: "SignLogin",
  data() {
    return {
      title: "login",
      form: {
          name: "",
      },
      openId: '',
      session_key: '',
			code:'',
			mobile:'',
			token:'',
			isAgree: '',
    };
  },
  onLoad() {
  
  },
  methods: {
    async login(data) {
      const pageThis = this
      uni.setStorageSync('token', data.token);
      const userInfo = uni.getStorageSync('userInfo');
      getApp().globalData.openId = this.openId;
      
		  await this.wxLogin(async(res)=>{
			  await  this.getMemberInfo({code:res.code}, userInfo.avatarUrl, userInfo.name, function(data) {
				  if(data && data.username) {
					clearInterval(mt)
					uni.removeStorageSync('userInfo');
					uni.setStorageSync('openId', data.xcxOpenid);
					uni.showToast({
					  title: '登录成功',
					  duration: 1000,
					  success: () => {
						pageThis.$u.route({
						  type: 'navigateBack',
						  delta: 1,
						})
					  }
					});
				  }
				})
		  })
    },
	async wxLogin(callback){
		wx.login({
		  provider: 'weixin',
		  success: (loginRes) => {
			callback&&callback(loginRes)
		  },
		  fail: (loginRes) => {
			console.log('失败时loginRes', loginRes)
		  },
		})
	},
	getMemberInfo( mobile, imageUrl, name, cb){
	  console.log('app。vue=》',this.openId, mobile, imageUrl, name)
	  uni.showLoading({
	    title: '加载中'
	  });
	  let data = {
	    openid: this.openId,
	    // appUserEntity: {},
	    user: {}
	  }
	  if(mobile) {
	    data.user.phone = mobile;
	    data.user.xcxOpenId = this.openId
	  }
	  if(imageUrl) {
	    data.user.imageUrl = imageUrl;
	    data.user.logoImage = imageUrl;
	  }
	  if(name) {
	    data.user.nickName = name;
	  }
			// return
	  this.$getRequest(this.$url.getOpenId, 'POST', mobile).then((result) => {
		console.log("124",result)
		console.log(result,'result');
	    if(result.code == '3403') {
	      cb && cb(null); 
	    } else {
	      uni.setStorageSync('token', result.token);
	      uni.setStorageSync('cityId', result.data.cityId);
	      this.userInfo = result.data;
	      cb && cb(result.data);
	    }
	    uni.hideLoading()
	  })
	  
	  
	},
	async handleLogin(e) {
		if(e.detail.errMsg=='getPhoneNumber:ok'){
			uni.login({
			  provider: 'weixin',
			  onlyAuthorize: true,
			  success: (loginRes) => {
				this.code = loginRes.code
				this.$getRequest(this.$url.getOpenId, 'POST', {
					  code: loginRes.code,
				}).then( async (res) => {
						console.log('getOpenId', res)
						this.openId = res.data.data.openid
						this.session_key = res.data.data.session_key
						this.token = res.data.data.token
				  
						const tokenData = res.data.data.token
						const userinfo = {
							token: res.data.data.token,
							roleList: res.data.data.roleList,
						}
						
						if(res.data.data.userEntity) {
							userinfo.userid = res.data.data.userEntity.id
							userinfo.mobile = res.data.data.userEntity.mobile
						}
						
						uni.setStorageSync('tokenData',tokenData)
						uni.setStorageSync('userinfo',userinfo)
						
						if(res.data.data.loginResult == 0){
							const resData = await this.$getRequest(this.$url.getMobile, 'POST', {
								code: e.detail.code
							})
							if(resData.code == 0){
							  console.log("resData",resData.data)
							  this.mobile = resData.data.mobile
							  uni.navigateTo({
									url:'../mine/verifyCode?mobile=' + resData.data.mobile + '&openid='+this.openId
							  })
							}
						} else if(res.data.data.loginResult == 2){
							let flag = res.data.data.userCompanyList && res.data.data.userCompanyList.length
							uni.setStorageSync('flag',flag)
							uni.reLaunch({
								url:'/pages/workspace/selectCompany'
							})
							// if(flag){
							// 	uni.reLaunch({
							// 		url:'/pages/workspace/selectCompany'
							// 	})
							// }else{
							// 	this.$u.route('pages/wecars')
							// }
						} else if(res.data.data.loginResult == 3){
							this.$u.route('pages/wecars')
						} else {
							let flag = res.data.data.userCompanyList && res.data.data.userCompanyList.length
							uni.setStorageSync('flag',flag)
							uni.reLaunch({
								url: '/pages/workspace/workspace'
							})
							// if(flag){
							// 	this.$u.route('pages/workspace/workspace')
							// }else{
							// 	this.$u.route('pages/wecars')
							// }
						}
						
						uni.setStorageSync('loginResult',res.data.data.loginResult)
					})
				
				}
			})
		}else{
		}
   
	},
		
		goAgreeMentPage() {
			uni.navigateTo({
				url: `/cash/agreement/privacyAgreement`
			})
		},
		
		handlerTip() {
			uni.showModal({
				title: '温馨提示',
				content: '阅读并同意《WECARS隐私政策》可以继续登录',
				confirmColor: '#576B95',
			})
		},
  },
};
</script>

<style lang="scss" scoped>
  .sign {
    text-align: center;
    .sign-logo {
      display: inline-block;
      margin-top: 300rpx;
      margin-bottom: 40rpx;
    }
    .slogan {
      font-family: zihun35hao-jindianyahei, zihun35hao;
      font-weight: normal;
      letter-spacing: 6rpx;
      color: #343434;
      margin-bottom: 320rpx;
      font-size: 40rpx;
    }
    .mobile-sign {
      margin-top: 40rpx;
      color: rgba(10, 15, 45, 0.8);
    }
    .wx-icon {
      margin-right: 24rpx;
    }
  }
  .btu-wx {
    margin: 0 80rpx;
    border-radius: 16rpx;
    overflow: hidden;
  }
  .btu-wx ::v-deep button {
    background: #07C160;
    color: #ffffff;
    height: 100rpx;
    line-height: 100rpx;
    font-size: 36rpx;
    font-weight: 600;
    border-radius: 50rpx;
  }
	.operator {
		margin-top: 32px;
		color: #5D5D5D;
		font-size: 12px;
		height: 44rpx;
		line-height: 44rpx;
		display: flex;
		justify-content: center;
		::v-deep .u-checkbox__label {
			font-size: 12px;
			margin-right: 0;
		}
	}
	
	.btn {
		background: #07C160;
		color: #fff;
		background: #07C160;
		color: #ffffff;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 36rpx;
		font-weight: 600;
		border-radius: 50rpx;
		display: flex;
		justify-content: center;
	}
</style>
