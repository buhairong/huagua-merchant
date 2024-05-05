<template>
	<view class="wecars_index">
		<view class="wecars_logo">
			<image :src="src"></image>
		</view>
		<view class="title">
			<view>暂时无权限访问</view>
		</view>
		
		<view class="tip">
			请确认您使用的手机号已经授权角色，并使用该手机号进行登录
		</view>
		
		<view class="btn" @click="gotoLet">
			<text>开启订阅之旅</text>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				src:"..https://image.51cheyaoshi.com/xcx/merchant/static/wecars_logo.png"
			}
		},
		methods:{
			gotoLet(){
				uni.navigateToMiniProgram({
				  appId: 'wx068554113d5335d3',
				  path: 'pages/home/choose-index',
				  extraData: {
				    'data1': 'test'
				  }
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wecars_index{
		padding:0;

		.wecars_logo{
			width: 172rpx;
			height: 36rpx;
			margin: 100rpx auto;
			image{
				width:100%;
				height:100%;
			}
		}
		.title{
			text-align: center;
			font-size: 44rpx;
			color: #333333;
		}
		.btn{
			width: 594.22rpx;
			height: 100rpx;
			border-radius: 49.52rpx;
			background: #07C160;
			text-align: center;
			line-height:100rpx;
			font-size: 36rpx;
			color: #FFFFFF;
			position: fixed;
			bottom: 100rpx;
			left: 0;
			right: 0;
			margin: auto;
		}
	}
	
	.tip {
		padding: 35px 40rpx 0;
		font-size: 12px;
		line-height: 48rpx;
		color: #3D3D3D;
	}
</style>