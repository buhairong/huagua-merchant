
<template>
    <view class="identity">
        <view class="u-padding-top-36">
            <u-section
                title="点击上传电子保单或照片，系统将为您自动识别"
                :right="false"
                line-color="#0A0F2D"
            />
        </view>
		<view class="select-box">
			<view @click="showPicker" class="box">
				<text>投保公司</text>
				<u-input style="border-radius:16rpx;margin-right:24rpx" v-model="form.value" :type="type" />
			</view>
            
			<!-- <u-action-sheet :list="actionSheetList" v-model="show" @click="actionSheetCallback"></u-action-sheet> -->
		</view>
		<u-picker @confirm="actionSheetCallback" v-model="show" mode="selector" :range="actionSheetList" range-key="insuranceName"></u-picker>
        <view class="u-flex">
            <view
                class="identity-card u-flex-1"
                @click="handleUploadFace"
            >
                <template v-if="form.imageUrl">
                    <u-image
                        width="100%"
                        height="100%"
                        :src="form.imageUrl"
                    />
                </template>
                <template v-else>
                    <u-image
                        width="100%"
                        height="100%"
                        src="https://image.51cheyaoshi.com/xcx/merchant/static/product/Group_1.png"
                    />
                </template>
            </view>
        </view>
        <view class="u-padding-top-56">
            <u-section
                title="请确认保险信息（可手动修改）"
                :right="false"
                line-color="#0A0F2D"
            />
        </view>
        <view class="u-padding-top-12">
         
            <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
                <view style="color:#86909C;width: 60px;">保单号</view>
                <view class="u-text-right">
                    <u-input
                        v-model="form.insuranceNumber"
                        :custom-style="{
                            textAlign: 'right'
                        }"
                        placeholder="请输入保单号"
						placeholder-style="color:#86909C"
						@input='ceshi("insuranceNumber")'
                    />
                </view>
            </view>
            <view v-if="type == 1" class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
                <view style="color:#86909C;width: 80px;">三者金额</view>
                <view class="u-text-right">
                    <u-input
                        v-model="form.amountOfThree"
                        :custom-style="{
                            textAlign: 'right'
                        }"
                        placeholder="请输入三者金额"
						placeholder-style="color:#86909C"
						@input='ceshi("amountOfThree")'
                    />
                </view>
            </view>
            <view
                class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 "
                @click="isDate = true"
            >
                <view style="color:#86909C;">有效期</view>
                <view class="u-text-right" style="color:#86909C;">
                    {{ form.lastValidDate || '有效期' }}
                </view>
            </view>

        </view>
        <u-gap
            height="260"
            bg-color="#FFFFFF"
        />
        <view
            class="foot-but u-flex-1 but but-bg "
        >
            <view
                class="foot-but-r u-text-center"
                @click="handleSubmit"
            >
                {{btnText}}
            </view>
        </view>
        <u-picker
            v-model="isDate"
            mode="time"
            @confirm="handleDate"
        />
    </view>
</template>
<script>
// saveIDCardLicenseFile
import dayjs from 'dayjs';
import { statusName } from '@/constants'
export default {

    data() {
        return {
            isDate: false,
            userInfo: {},
            tempFilePathsFace: '',
            saveFaceInfo: null,
            form: {
                insuranceCompany:'',
                insuranceNumber: '',
                amountOfThree:'',
                lastValidDate: '',
                imageUrl: '',
                fileId:'',
                value: '',
				imgArr:[]
            },
            id: '',
			type: 'select',
			show: false,
			border: true,
			actionSheetList: [],
            type:'',
			name:'',//	判断是修改保单还是设置保单   没有就是添加车辆
			btnText:'确认添加',
			insuranceId:'',//修改保单id
			fileId:'',//修改图片的fileId
			imgArr:[]
        }
    },
    onLoad(option) {
        this.carid = option.carid
    	this.newOrOld = option.newOrOld
        this.type = option.type
		this.name=option.name
		this.insuranceId=option.insuranceId
		// this.form.imgArr=option.imgArr
		console.log(option,'11111option');
		console.log(option.carid,'carid', option.newOrOld,'newOrOld',option.type,'type',option.name,'option');
       
		let insuranceList=uni.getStorageSync('insuranceList')
	   
		if(option.name=='get'){
			this.btnText='确认修改'
			
			this.form.imageUrl=insuranceList.insurancePicsList[0].url
			this.form.imgArr=insuranceList.insurancePicsList
			this.form.insuranceNumber=insuranceList.insuranceNo
			this.form.lastValidDate=insuranceList.expireDate
			this.form.amountOfThree=insuranceList.amountOfThree
            // this.form = uni.getStorageSync('carInfo').insCompany[this.type]
			
			// setTimeout(()=>{
			// 	this.form.value=this.insuranceName(insuranceList.insuranceCompany)
			// },500)
        }else{
			if(option.name==undefined){
				this.form = uni.getStorageSync('carInfo').insCompany[this.type]
			}
		}
        this.getInsCompany()
		setTimeout(()=>{
			this.insuranceName(insuranceList.insuranceCompany)
		},600)
    },
    onShow() {
        getApp().globalData.getUserInfo((data) => {
            console.log(data);
            this.userInfo = data;
        })
    },
    methods: {
		ceshi(v){
			if(v=='insuranceNumber'){
				if (!/^[A-Za-z0-9]+$/.test(this.form.insuranceNumber)) {
					uni.showToast({
						title: '只能输入英文和数字',
						duration: 2000,
						icon: 'none'
					});
					return
				}
			}else{
				if (!/^[1-9][0-9]*$/.test(this.form.amountOfThree)) {
					uni.showToast({
						title: '只能输入数字',
						duration: 2000,
						icon: 'none'
					});
					return
				}
			}
		
		},
        handleDate(val) {
            this.form.lastValidDate = `${val.year}-${val.month}-${val.day} 00:00:00`
        },
        async handleSubmit() {
			if(this.form.value==''){
				uni.showToast({
					title: '请选择投保公司',
					duration: 2000,
					icon: 'none'
				});
				return
			}
			if(this.form.imageUrl==''){
				uni.showToast({
					title: '请上传保单照片',
					duration: 2000,
					icon: 'none'
				});
				return
			}
			if(this.form.insuranceNumber==''){
				uni.showToast({
					title: '请输入保单号',
					duration: 2000,
					icon: 'none'
				});
				return
			}else{
				if (!/^[A-Za-z0-9]+$/.test(this.form.insuranceNumber)) {
					uni.showToast({
						title: '保单号只能输入英文和数字',
						duration: 2000,
						icon: 'none'
					});
					return
				}
			}
			if(this.form.lastValidDate==''){
				uni.showToast({
					title: '请选择有效期',
					duration: 2000,
					icon: 'none'
				});
				return
			}
			if(this.type==1){
				if (!/^[1-9][0-9]*$/.test(this.form.amountOfThree)) {
					uni.showToast({
						title: '三者金额只能输入数字',
						duration: 2000,
						icon: 'none'
					});
					return
				}
				console.log(this.form.amountOfThree.length,'88888---------');
				if(this.form.amountOfThree.length>8){
					uni.showToast({
						title: '三者金额最多输入8位数字',
						duration: 2000,
						icon: 'none'
					});
					return
				}
			}
			if(this.name==undefined){
				let carInfo = uni.getStorageSync('carInfo')
				carInfo.insCompany[this.type] = this.form
				uni.setStorageSync('carInfo',carInfo)
				console.log(carInfo,'carInfo');
				uni.navigateBack()
				return
			}else{
				if(this.name=='get'){
					let str={
						carId: this.carid,
						insuranceId: this.insuranceId,
						insuranceInfo: {
							amountOfThree: this.form.amountOfThree,
							expireDate:this.form.lastValidDate,
							insuranceCompany:this.form.insuranceCompany,
							insuranceNo: this.form.insuranceNumber,
							insurancePicsList:this.form.imgArr,
							insuranceType: this.type
						},
						newOrOld: this.newOrOld
					}
					const data= await this.$getRequest(this.$url.updateCarInsuranceInfoWithOnSheet, 'POST',str)
					console.log(data);
					if(data.code==0){
						uni.showToast({
						    title: '修改成功',
						    duration: 2000
						});
						this.$u.route({
						    type: 'navigateBack',
						    delta: 1
						})
					}
				
				}else{
					let str={
						carId: this.carid,
						insuranceList: [
							{
								amountOfThree: this.form.amountOfThree,
								expireDate:this.form.lastValidDate,
								insuranceCompany:this.form.insuranceCompany,
								insuranceNo: this.form.insuranceNumber,
								insurancePicsList: this.form.imgArr,
								insuranceType: this.type
							}
						],
						newOrOld: this.newOrOld
					}
					const data= await this.$getRequest(this.$url.updateCarInsurance, 'POST',str)
					if(data.code==0){
						uni.showToast({
						    title: '添加成功',
						    duration: 2000
						});
						this.$u.route({
						    type: 'navigateBack',
						    delta: 1
						})
					}			
				}
			}
		
            // uni.showLoading({
            //     title: '加载中'
            // });
        },
		async imgUplod(v){
			console.log(this,'this',this.imgArr);
			const upload = await this.$getFileUpload(this.$url.getUpLoad, v)
			
			if(upload.code != 0) {
			    uni.showToast({
			        title: '识别失败，请重新上传',
			        duration: 2000,
			        icon: 'none'
			    });
			    return false;
			}
			this.imgArr.push({url:upload.data.src,fileId:upload.data.fileId})
			this.form.imgArr=this.imgArr
			this.form.imageUrl = this.form.imgArr[0].url;
			this.form.fileId = this.form.imgArr[0].fileId;
			uni.hideLoading()
		},
        handleUploadFace() {
            uni.vibrateShort();
            const self = this;
            uni.chooseImage({
                success: async (chooseImageRes) => {
                    uni.showLoading({
                        title: '上传中'
                    });
                    const tempFilePaths = chooseImageRes.tempFilePaths;
					console.log(chooseImageRes,chooseImageRes.tempFilePaths,'chooseImageRes');
					
					tempFilePaths.forEach((v)=>{
						console.log(v);
						let arr=[v]
						console.log(arr);
						this.imgUplod(arr)
					// let data=await this.$getFileUpload(this.$url.getUpLoad, arr)
					// console.log(data,'data');
					})
     //                const upload = await this.$getFileUpload(this.$url.getUpLoad, tempFilePaths)
     //                console.log(upload.data)
     //                if(upload.code != 0) {
     //                    uni.showToast({
     //                        title: '识别失败，请重新上传',
     //                        duration: 2000,
     //                        icon: 'none'
     //                    });
     //                    return false;
     //                }
     //                this.form.imageUrl = upload.data.src;
     //                this.form.fileId = upload.data.fileId;
     //                uni.hideLoading()
                }
            });
        },

        // 获取用户身份证信息
        async getUserInfo(userId) {
            const userInfo =  await this.$getRequest(this.$url.userInfo, 'POST', {userId})
            console.log(userInfo, 'userInfo')
        },
		// 点击actionSheet回调
		actionSheetCallback(index) {
            let indexCol = index[0]
            this.form.value = this.actionSheetList[indexCol].insuranceName
            this.form.insuranceCompany = this.actionSheetList[indexCol].id
			// this.value = this.actionSheetList[index].text;
		},
		insuranceName(id) {//获取保单公司
			for(let i of this.actionSheetList){
				if(id == i.id){
					this.form.value=i.insuranceName
				}
			}
		},
        // 获取保险公司列表
        async getInsCompany(){
            const res =  await this.$getRequest(this.$url.listInsuranceCompany, 'POST', {})
            this.actionSheetList = res.data
        },
        showPicker(){
            console.log('显示')
            this.show = true
        },
        // 修改车辆保险信息
        updatecompany(){
            let params = {
                carId:this.carId,
                newOrOld:this.newOrOld,
                insuranceList:[
                    this.form
                ]
            }
            console.log(params)
        }

    }
}
</script>
<style lang="scss" scoped>
    .identity {
        padding: 0 40rpx;
		.select-box{
			background: rgba(10, 15, 45, 0.04);
			margin:24rpx 0 20rpx 0;
			border-radius: 16rpx;
			.box{
				display: flex;
				align-items: center;
				justify-content: space-between;
				text{
					width: 80px;
					margin-left: 32rpx;
					font-size: 30rpx;
					color: rgba(10, 15, 45, 0.5);
				}
			}
		}
        .identity-box {
            background: rgba(10, 15, 45, 0.04);
            border-radius: 16rpx;
            margin: 16rpx 0;
        }
        .identity-foot {
            margin-top: 130rpx;
            text-align: center;
            .but {
                margin-top: 44rpx;
            }
        }
 
        .identity-card {
            background: #FAFAFB;
            border-radius: 16rpx;
            height: 410rpx;
            line-height: 410rpx;
            text-align: center;
            margin-top: 27rpx;
        }
    }
    .foot-but {
        position: fixed;
        left: 40rpx;
        right: 40rpx;
        z-index: 1;
        margin: 0 auto;
        z-index: 111;
        bottom: 60rpx;
    }

</style>
