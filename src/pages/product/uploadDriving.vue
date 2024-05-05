
<template>
  <view class="identity">
    <view class="u-padding-top-36">
      <u-section
        title="请上传行驶证正本照片，系统将为您自动识别"
        :right="false"
        line-color="#0A0F2D"
      />
    </view>
    <view class="u-flex">
      <view class="identity-card u-flex-1" @click="handleUploadFace">
        <template v-if="form.imageUrl">
          <u-image
            width="100%"
            height="100%"
            :src="form.imageUrl"
          />
        </template>
        <template v-else>
          <!-- <u-image
            width="100%"
            height="100%"
            src="https://image.51cheyaoshi.com/xcx/merchant/static/product/xszImg.png"
          /> -->
		  <image style="width: 100%;height: 100%;" src="https://image.51cheyaoshi.com/xcx/merchant/static/product/xszImg.png"></image>
        </template>
      </view>
    </view>
    <view class="u-padding-top-56">
      <u-section
        title="请确认行驶证信息（可手动修改）"
        :right="false"
        line-color="#0A0F2D"
      />
    </view>
      <view class="u-padding-top-12">
        <view
            class="identity-box u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 "
            @click="isCarKey = true"
        >
          <view
              class="u-text-left"
              @click="isCarKey = true"
          >
            <u-input
              v-model="form.carPlateNum"
              type="text"
              :custom-style="{
                  textAlign: 'left'
              }"
              placeholder="车牌号"
              @click="isCarKey = true"
			  @input="ceshi('carPlateNum')"
            />
          </view>
        </view>
        <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
    
          <view class="u-text-left">
            <u-input
              v-model="form.carVin"
              :custom-style="{
                  textAlign: 'left'
              }"
              placeholder="车架号"
			  @input="ceshi('carVin')"
            />
          </view>
        </view>
        <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
          
          <view class="u-text-left">
            <u-input
                v-model="form.carEngineNum"
                type="text"
                :custom-style="{
                    textAlign: 'left'
                }"
                placeholder="发动机号"
				@input="ceshi('carEngineNum')"
            />
          </view>
        </view>
        <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
          <view class="u-text-left">
            <u-calendar v-model="showCalendar" mode="date" btn-type="success" active-bg-color="#19be6b" @change="changeDate"></u-calendar>
            <u-input
              v-model="form.registerDate"
              @click="showCalendarDate"
              type="text"
              :custom-style="{
                  textAlign: 'left'
              }"
              disabled
              placeholder="车辆注册时间"
            />
          </view>
        </view>
		<view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
		  
		  <view class="u-text-left">
		    <u-input
		      v-model="form.mileage"
		      type="idcard"
		      :custom-style="{
		          textAlign: 'left'
		      }"
		      placeholder="实表里程数"
			  @input="ceshi('mileage')"
		    />
		  </view>
		</view>
        <view class="u-font-24 color-rgba" v-show="newOrOld!=2">
          如车辆暂无行驶证可跳过此流程
        </view>
      </view>
      <u-gap
        height="260"
        bg-color="#FFFFFF"
      />
      <view class="foot-but u-flex-1 but but-bg ">
        <view
          class="foot-but-r u-text-center"
          @click="verification"
        >
          下一步
        </view>
      </view>
     <!-- <u-keyboard
        ref="uKeyboard"
        v-model="isCarKey"
        :tooltip="false"
        mode="car"
        :safe-area-inset-bottom="true"
        @change="valChangeCar"
        @backspace="backspace"
      /> -->
      
      <!-- 车辆选择框 -->
      <u-popup v-model="showSelectCar" mode="right" width="80%">
        <view class="u-margin-30">
          <u-search :show-action="true" placeholder="输入品牌或车型快速检索" v-model="keyword" @search="searchCarType" @custom="searchCarType"></u-search>
          <view class="u-margin-20 card">
            <view
                v-for="(item, index) in searchList"
                :key="index"
                class="u-flex-1"
            >
              <view class="m-search-item u-font-14"  @click="clickSearchItem(item)">
                {{ item.carBrand }}{{ item.carType }}{{ item.carTypeYear }}{{ item.carTypeYearProduct }}
              </view>
            </view>
          </view>
        </view>
      </u-popup>
  </view>
</template>
<script>
// saveIDCardLicenseFile
import dayjs from 'dayjs';
import { statusName } from '@/constants'
export default {
    name: 'AddCar',
    data() {
      return {
        userInfo: {},
        tempFilePathsFace: '',
        saveFaceInfo: null,
        isCarKey: false,
        form: {
          carTypeYearProductId: '',
          registerDate: '',
          carPlateNum: '',
          carVin: '',
          carEngineNum: '',
          mileage: '',
          imageUrl: '',
        },
        current: 0, // 预设当前项的值
        menuHeight: 0, // 左边菜单的高度
        menuItemHeight: 0, // 左边菜单item的高度
        leftList: [{ name: "品牌", id: 0, foods: [], k: 'brandList', param: 'brandList' }],
        carList: [],
        search: {
          limit: 9999,
          page: 1,
          carBrandId: '',
          cityId: ''
        },
        checkList: [],
        showSelectCar: false,
        keyword: '',
        searchList: [],
        showCalendar: false,
		carid: '',
		newOrOld: '',
      }
    },
    onLoad(option) {
    	this.carid = option.carid
    	this.newOrOld = option.newOrOld
    },
    onShow() {
        getApp().globalData.getUserInfo((data) => {
            console.log(data);
            this.userInfo = data;
        })
    },
    methods: {
	  ceshi(v){
			if(v=='carPlateNum'){//车牌号
			console.log('车牌号');
				if (/\s+/g.test(this.form.carPlateNum)) {
				   	uni.showToast({
				   		title: '不能输入空格',
				   		duration: 2000,
				   		icon: 'none'
				   	});
				   	return
				}
			}
			if(v=='carVin'){//车架号
			console.log('车架号');
				if (this.form.carVin!=''&&!/^[A-Za-z0-9]+$/.test(this.form.carVin)) {
					if (/\s+/g.test(this.form.carVin)) {
						uni.showToast({
							title: '不能输入空格',
							duration: 2000,
							icon: 'none'
						});
						return
					}
					uni.showToast({
						title: '只能输入英文和数字',
						duration: 2000,
						icon: 'none'
					});
					return
				}
			}
			if(v=='carEngineNum'){//发动机号
			console.log(this.form.carEngineNum,this.form.carEngineNum.length,'this.form.carEngineNum');
				if (/\s+/g.test(this.form.carEngineNum)) {
					uni.showToast({
						title: '不能输入空格',
						duration: 2000,
						icon: 'none'
					});
					return
				}
				if (this.form.carEngineNum!=''&&!/^[A-Za-z0-9]+$/.test(this.form.carEngineNum)) {
					uni.showToast({
						title: '只能输入英文和数字',
						duration: 2000,
						icon: 'none'
					});
					return
				}
				
			}
			if(v=='mileage'){
				if (/^0/g.test(this.form.mileage)) {
					uni.showToast({
						title: '第一个数字不能为0',
						duration: 2000,
						icon: 'none'
					});
					return
				 }
				if (/\s+/g.test(this.form.mileage)) {
				   	uni.showToast({
				   		title: '不能输入空格',
				   		duration: 2000,
				   		icon: 'none'
				   	});
				   	return
				}
				if (this.form.mileage!=''&&!/^[1-9][0-9]*$/.test(this.form.mileage)) {
					uni.showToast({
						title: '只能输入数字',
						duration: 2000,
						icon: 'none'
					});
					return
				}
			}
		},
      handleConfirmDay(day) {
        this.defaultSelector = day;
      },
      async searchCarType() {
        console.log('searchCarType', this.keyword)
        if(this.keyword != '') {
          const result = await this.$getRequest(this.$url.searchCarTypeYearProductByName, 'POST', { searchStr: this.keyword })
          console.log(result)
          this.searchList = result.data
        }
      },
      clickSearchItem(item) {
        this.form.carTypeYearProductId = item.id
        this.form.carType = item.carBrand + item.carType + item.carTypeYear + item.carTypeYearProduct
        this.showSelectCar = false
      },
      changeDate(date) {
        this.form.registerDate = date.result 
      },
      showCalendarDate() {
        this.showCalendar = true
      },
      // 车牌号
      valChangeCar(val) {
        uni.vibrateShort({})
        this.form.carPlateNum +=  val;
        uni.showToast({
            title: this.form.carPlateNum,
            duration: 1000,
            icon: 'none'
        });
      },
      // 退格键被点击
      backspace() {
        // 删除value的最后一个字符
        if(this.form.carPlateNum.length) this.form.carPlateNum = this.form.carPlateNum.substr(0, this.form.carPlateNum.length - 1);
      },
      toastMsg(msg) {
        uni.showToast({
            title: msg,
            duration: 2000,
            icon: 'none'
        });
      },
	  verification(){
		  if(this.newOrOld==2){
			   if(this.form.imageUrl=='') {
			  	 this.toastMsg('请上传行驶证')
  				 return 
			   }
			  if(this.form.carPlateNum==''){
				   this.toastMsg('请输入车牌号')
				   return
			  }else{
				  if (/\s+/g.test(this.form.carPlateNum)) {
				     	uni.showToast({
				     		title: '车牌号不能输入空格',
				     		duration: 2000,
				     		icon: 'none'
				     	});
				     	return
				  }
			  }
			  if(this.form.carVin==''){
				   this.toastMsg('请输入车架号')
				   return
			  }else{
				  if (this.form.carVin!=''&&!/^[A-Za-z0-9]+$/.test(this.form.carVin)) {
				  	uni.showToast({
				  		title: '车架号只能输入英文和数字',
				  		duration: 2000,
				  		icon: 'none'
				  	});
				  	return
				  }else{
				  	if (/\s+/g.test(this.form.carVin)) {
				  	  	uni.showToast({
				  	  		title: '车架号不能输入空格',
				  	  		duration: 2000,
				  	  		icon: 'none'
				  	  	});
				  	  	return
				  	}
				  }
			  }
			  if(this.form.carEngineNum==''){
				   this.toastMsg('请输入发动机号')
				   return
			  }else{
				  if (!/^[A-Za-z0-9]+$/.test(this.form.carEngineNum)) {
				  	uni.showToast({
				  		title: '发动机号只能输入英文和数字',
				  		duration: 2000,
				  		icon: 'none'
				  	});
				  	return
				  }else{
				  	if (/\s+/g.test(this.form.carEngineNum)) {
				  	  	uni.showToast({
				  	  		title: '发动机号不能输入空格',
				  	  		duration: 2000,
				  	  		icon: 'none'
				  	  	});
				  	  	return
				  	}
				  }
			  }
			  if(this.form.registerDate==''){
				   this.toastMsg('请选择车辆注册时间')
				   return
			  }
			  if(this.form.mileage==null){
				   this.toastMsg('请输入实表里程数')
				   return
			   }else{
				   if (/^0/g.test(this.form.mileage)) {
						uni.showToast({
							title: '实表里程数第一个数字不能为0',
							duration: 2000,
							icon: 'none'
						});
						return
				    }
				   if (/\s+/g.test(this.form.mileage)) {
				      	uni.showToast({
				      		title: '实表里程数不能输入空格',
				      		duration: 2000,
				      		icon: 'none'
				      	});
				      	return
				   }
				   if (!/^[1-9][0-9]*$/.test(this.form.mileage)) {
						uni.showToast({
							title: '实表里程数只能输入数字',
							duration: 2000,
							icon: 'none'
						});
						return
				   }
			   }
		  }
		  this.handleSubmit()	
	  },
      async handleSubmit() {
		var params = {
			carId: this.carid,
			newOrOld: this.newOrOld,
			...this.form
		}
		uni.setStorageSync('getCarTravelLicense',params)//存储信息
		
		if(this.newOrOld==2){
			const carPlateNum = await this.$getRequest(this.$url.verifyCode,'POST', //判断车牌是否存在
			{
				codeType: 0,//编号类型: 0 车牌号，1 引擎号，2 车架号
				newOrOld: this.newOrOld,//1 新车，2 二手车
				verifyCode: this.form.carPlateNum//	校验编号
			})
			if(carPlateNum.code==0){
				const carVin = await this.$getRequest(this.$url.verifyCode,'POST', //判断车架号是否存在
				{
					codeType: 2,//编号类型: 0 车牌号，1 引擎号，2 车架号
					newOrOld: this.newOrOld,//1 新车，2 二手车
					verifyCode: this.form.carVin//	校验编号
				})
				if(carVin.code==0){
					const carEngineNum = await this.$getRequest(this.$url.verifyCode,'POST', //判断发动机号是否存在
					{
						codeType: 1,//编号类型: 0 车牌号，1 引擎号，2 车架号
						newOrOld: this.newOrOld,//1 新车，2 二手车
						verifyCode: this.form.carEngineNum//	校验编号
					})
					if(carEngineNum.code==0){
						
					}else{
						uni.showToast({
							title: '该发动机号已存在，请重新输入！',
							duration: 2000,
							icon: 'none'
						});
						return
					}
					
				}else{
					uni.showToast({
						title: carVin.msg,
						duration: 2000,
						icon: 'none'
					});
					return
				}
			}else{
				uni.showToast({
					title: carPlateNum.msg,
					duration: 2000,
					icon: 'none'
				});
				return
			}
		}

		uni.navigateTo({
			url: './addPolicy?newOrOld='+this.newOrOld
		})
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
            const upload = await this.$getFileUpload(this.$url.getUpLoad, tempFilePaths)

            console.log(upload)

            if(upload.code != 0) {
              uni.showToast({
                title: '识别失败，请重新上传',
                duration: 2000,
                icon: 'none'
              });
              return false;
            }
            this.form.imageUrl = upload.data.src;
            uni.hideLoading()
						this.tempFilePathsFace = upload.data.src;
						this.OCRCardImg({
								imageUrl: upload.data.src
						}, 0);
          }
        });
      },
			
      async OCRCardImg(params, type) {
        uni.showLoading({
          title: '上传成功，解析中'
        });
        const uploadInfo =  await this.$getRequest(this.$url.getLicense, 'POST', params)
				this.form.carPlateNum=uploadInfo.data.carPlateNum
				this.form.carVin=uploadInfo.data.carVin
				this.form.carEngineNum=uploadInfo.data.carEngineNum
				this.form.registerDate=uploadInfo.data.productDate.split(' ')[0]
				this.form.mileage=uploadInfo.data.mileage
        uni.hideLoading()
      },

      handleTime(obj) {
        const {year, month, day} = obj
        this.form.endTime = `${year}-${month}-${day}`
      },
      // 获取用户身份证信息
      async getUserInfo(userId) {
        const userInfo =  await this.$getRequest(this.$url.userInfo, 'POST', {userId})
        console.log(userInfo, 'userInfo')
        if (userInfo.data) {
          this.tempFilePathsFace = userInfo.data.idcardUrl
          this.tempFilePathsBack = userInfo.data.idcardBackUrl
          this.form.name = userInfo.data.name
          this.form.card = userInfo.data.idcard
          this.form.endTime = dayjs(userInfo.data.idcardValidityTimeEnd).format('YYYYMMDD')
        }
      },
    }
}
</script>
<style lang="scss" scoped>
  .m-search-item {
    min-height: 60rpx;
    line-height: 60rpx;
    border-bottom: 1px solid lightgray;
  }
  .u-menu-wrap {
      position: relative;
      flex: 1;
      display: flex;
      overflow: hidden;
      height: 100vh;
      .right {
          width: 100%;
          .right-box {
              width: 100%;
              overflow: hidden;
              white-space: nowrap;
              height: 100%;
              position: absolute;
              left: 160rpx;
              top: 0;
              .page-view {
                  &:last-child {
                      padding-bottom: 700rpx;
                  }
              }
          }
      }
  }
  .class-item {
      margin-bottom: 30rpx;
      background-color: #fff;
      padding: 16rpx;
      border-radius: 8rpx;
  }
  .brand-list {
      width: 100%;
  }
  .brand-list-letter {
      font-size: 32rpx;
      color: rgba(10, 15, 45, 0.5);
      margin-top: 22rpx;
      margin-left: 35rpx;
      font-weight: 500;
      color: #0AEB7D;
  }
  .brand-list-name {
      font-size: 30rpx;
      color: rgba(10, 15, 45, 0.8);
      padding: 20rpx 0;
      margin-left: 10rpx;
      text {
          padding: 6rpx 20rpx;
          border: 2px solid #fff;
      }
  }
  .brand-active {
      text {
          border: 2px solid #0A0F2D;
          border-radius: 8rpx;
          
      }
  }
    .identity {
        padding: 0 40rpx;
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
