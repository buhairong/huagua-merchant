<template>
  <view class="vcodePage commonPage">
    <view class="mobile-sign-t">
      输入验证码
    </view>
    <view class="mobile-sign-text">
      验证码已发送至<text class="mobile-txt u-padding-left-10">{{ mobile }}</text> 
    </view>
    <view class="mobile-box u-flex u-row-between">
      <view class="mobile-box-warp">
        <u-message-input
          class="mobile-box-item"
          mode="box"
          width="130"
          :focus="true"
          @finish="finishCode"
        />
        <!-- :breathe="true" -->
      </view>
    </view>
    <view class="mobile-sign-text u-padding-top-50">
      <view
        v-if="isSms"
        class="send-code"
        @click="handleSend"
      >
        获取验证码
      </view>
      <view v-else>
        剩余 {{ sms }} 秒
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "VerifyCode",
  data() {
    return {
      mobile: '',
      isSms: true,
      sms: 60,
	  codeMobile:'',
	  openid:"",
	  token:""
    };
  },
  onLoad(option) {
		console.log("options",option)
		this.codeMobile = option.mobile
		this.openid = option.openid
		this.token = uni.getStorageSync('tokenData')
		this.mobile = uni.getStorageSync("codePhone")
		this.handleSend()
		// this.isSms = false;
		// 	this.timer = setInterval(() => {
		// 	  if (--this.sms <= 0) {
		// 		this.sms = 60;
		// 		this.isSms = true;
		// 		clearInterval(this.timer);
		// 	  }
		// 	}, 1000);
  },
  methods: {
    finishCode(e) {
	  console.log(this.token,9);
	  var params = {
	    mobile: this.codeMobile,
			openid: this.openid,
			smsCode: e,
			token:this.token,
	  }
	  this.$getRequest(this.$url.decryptData, 'POST', params ).then((data) => {
		  if(data.data.code == 0) {
			  let flag = data.data.data.userCompanyList && data.data.data.userCompanyList.length
				
				const userinfo = {
					token: data.data.data.token,
					roleList: data.data.data.roleList,
				}
				
				if(data.data.data.userEntity) {
					userinfo.userid = data.data.data.userEntity.id
				}
				
				uni.setStorageSync('tokenData',data.data.data.token)
				uni.setStorageSync('userinfo',JSON.stringify(userinfo))
				
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
			  uni.setStorageSync('loginResult',data.data.data.loginResult)
		  }else{
			  // uni.setStorageSync("roleId",data.data.code)
			  this.isSms = true;
			  this.sms = 60;
			  clearInterval(this.timer);
			  uni.showToast({
			    title: data.data.msg,
			    duration: 2000,
			    icon: 'none'
			  });
		  }
	  })
      // 跳转
	  // uni.switchTab({
	  // 		url:'../product/carList'
	  // 	})
	
    },
    async handleSend() {
			this.isSms=false
			this.timer = setInterval(() => {
			  if (--this.sms <= 0) {
				this.sms = 60;
				this.isSms = true;
				clearInterval(this.timer);
			  }
			}, 1000);
      uni.vibrateShort({})
      uni.showLoading({
          title: '正在发送'
      });
			console.log('handleSend', this.codeMobile)
      const data = await this.$getRequest(this.$url.getIdentifyingCode, 'POST', {
        mobile: this.codeMobile
      })
      uni.hideLoading();
      
      if(data.code != 0) {
        uni.showToast({
          title: '验证码获取失败，请重试',
		  icon:"none",
          duration: 1500
        });  
      } else {
        uni.showToast({
          title: '验证码已发送',
		  icon:"none",
          duration: 1500
        });
      }
    },
    handleLogin(e) {
      console.log(e);
    },
    onshow(){
		this.token = uni.getStorageSync('tokenData')
	}
  },
};
</script>
<style lang="scss">
  .vcodePage {
    .u-char-flex {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      position: relative;
      justify-content: space-between !important;
    }
  }
</style>
<style lang="scss" scoped>
  .vcodePage {
    padding: 236rpx 50rpx;
    .mobile-sign-t {
      font-size: 48rpx;
      font-weight: bold;
      color: #333333;
    }
    .mobile-sign-text {
      padding-top: 18rpx;
      font-size: 24rpx;
      font-weight: 400;
      color: #666666;
      
      .mobile-txt {
        font-size: 14px;
        font-weight: 500;
        color: #333333;
      }
    }
    .mobile-box {
      margin-top: 50rpx;
      
      .send-code {
        color: rgba(10, 15, 45, 0.3);
        font-size: 28rpx;
      }
      .mobile-box-value {
        color: #0A0F2D;
      }
    }
  }
  .mobile-box-warp {
    width: 100%;
  }
  .mobile-box ::v-deep .u-char-box {
      width: 100%;
  }
  .mobile-box ::v-deep .u-box {
    width: 100%;
    background: rgba(10, 15, 45, 0.04);
    border: none;
    border-radius: 16rpx;
  }
   
</style>
