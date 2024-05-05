<template>
	<u-popup border-radius="14" closeable=true mode="bottom" v-model="show" @close="close">
		<u-row>
			<u-col span="12">
				<view class="popupTitle">车辆信息</view>
			</u-col>
		</u-row>
		<view class="popupInfo">
			<view class="itemInfo">
				<view class="itemTitle">实表里程</view>
				<input class="itemInput" v-model="mileageVal" placeholder="请输入车辆实表里程" inputmode="numeric" type="digit" />
				<view class="itemUnit">公里</view>
			</view>
			<view class="itemInfo">
				<view class="itemTitle">实时{{orderDetail.carInfo.powerMode==3?'电量':'油量'}}</view>
				<input v-model="electricity" :placeholder="`请输入车辆实时${orderDetail.carInfo.powerMode==3?'电量':'油量'}`" class="itemInput" inputmode="numeric" type="digit"/>
				<view class="itemUnit">{{orderDetail.carInfo.powerMode==3?'%':'/16'}}</view>
			</view>
			<view @click="upPic" class="nextBtn">下一步</view>
		</view>
	</u-popup>
</template>

<script>
import { validIntegerNum } from '@/utils/validate'
	
export default {
	props: {
		show: {
			type: Boolean,
			default: false,
		},
		
		powerMode: {
			type: Number | String,
			default: 3,
		},
		
		mileage: {
			type: Number | String,
			default: '',
		},
		
		tankSize: {
			type: Number | String,
			default: '',
		},
		
		newType: {
			type: Number | String,
			default: '',
		},
		
		carId: {
			type: Number | String,
			default: '',
		},
		
		orderId: {
			type: Number | String,
			default: '',
		},
		
		category: {
			type: Number | String,
			default: '',
		},
		
		orderDetail: {
			type: Object,
			required: true,
		},
	},
	
	data() {
		return {
			electricity: '',
			mileageVal: '',
		}
	},
	
	mounted() {
		this.mileageVal = this.mileage
		this.electricity = this.tankSize
	},
	
	methods: {
		close() {
			this.$emit('update:show', false)
		},
		
		upPic(){
			this.mileageVal = (this.mileageVal+'').trim()
			this.electricity = (this.electricity+'').trim()
			
			if (!this.mileageVal) {
				uni.showToast({
				  title: '请输入车辆实表里程',
				  duration: 2000,
				  icon: 'none'
				})
				
				return false
			}
			
			if (!this.electricity) {
				uni.showToast({
				  title: `请输入车辆实时${this.orderDetail.carInfo.powerMode == 3 ? '电量' : '油量'}`,
				  duration: 2000,
				  icon: 'none'
				})
				
				return false
			}
			
			if(!validIntegerNum(this.mileageVal)) {
				uni.showToast({
					title: '请正确输入实表里程数',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!validIntegerNum(this.electricity)) {
				uni.showToast({
					title: `请正确输入车辆实时${this.orderDetail.carInfo.powerMode == 3 ? '电量' : '油量'}`,
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if (this.orderDetail.carInfo.powerMode == 3) {
				if((this.electricity - 0) > 100) {
					uni.showToast({
						title: '电量不能大于100%',
						duration: 2000,
						icon: "none"
					})
					return false
				}
			} else {
				if((this.electricity - 0) > 16) {
					uni.showToast({
						title: '油量不能大于16',
						duration: 2000,
						icon: "none"
					})
					return false
				}
			}
			
			
			let params = {
				mileage: this.mileageVal,
				carId: this.carId,
				tankSize: this.electricity,
				newType: this.newType,
			}
			
			this.$getRequest(this.$url.updateMileage, 'POST', params).then(res => {
				if(res.code == 0){
					this.$emit('update:show', false)
					
					let url = ''
					
					if (this.orderDetail.configRespVo && this.orderDetail.configRespVo.configDtoList && this.orderDetail.configRespVo.configDtoList.length && this.orderDetail.configRespVo.configDtoList[0].details && this.orderDetail.configRespVo.configDtoList[0].details.length) {
						url = `/order/orderInfo/checkConfig?carId=${this.carId}&orderId=${this.orderId}&newType=${this.newType}`
					} else {
						url = `/order/orderInfo/uploadDeliveryCarPics?carId=${this.carId}&orderId=${this.orderId}&newOrOld=${this.newType}&category=2`
					}
					
					uni.navigateTo({
						url
					})
				}
			})
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "../styles/index.scss";

.popupTitle {
	font-style: 15px;
	text-align: center;
	padding: 20px 0 0px 0;
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
</style>