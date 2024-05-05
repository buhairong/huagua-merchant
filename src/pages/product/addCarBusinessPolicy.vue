
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
			<view class="box">
				<text>投保公司</text>
				<u-input style="border-radius:16rpx;margin-right:24rpx" v-model="value" :type="type" @click="show = true" />
			</view>
			<u-action-sheet :list="actionSheetList" v-model="show" @click="actionSheetCallback"></u-action-sheet>
		</view>
		
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
                        src="https://image.51cheyaoshi.com/xcx/merchant/static/add_car_2.jpeg"
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
                <view style="color:#86909C;">保单号</view>
				<view class="u-text-right">
                    <u-input
                        v-model="form.insuranceNumber"
                        :custom-style="{
                            textAlign: 'right'
                        }"
                        placeholder="保单号"
						placeholder-style="color:#86909C"
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
            <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
                <view style="color:#86909C;">三者金额</view>
				<view class="u-text-right">
                    <u-input
                        v-model="form.otherAmount"
                        type="idcard"
                        :custom-style="{
                            textAlign: 'right'
                        }"
                        placeholder="三者金额"
						placeholder-style="color:#86909C"
                    />
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
                提交信息
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
    name: 'AddInsurance',
    data() {
        return {
            isDate: false,
            userInfo: {},
            tempFilePathsFace: '',
            saveFaceInfo: null,
            form: {
                insuranceCompany: '',
                insuranceNumber: '',
                lastValidDate: '',
                otherAmount: '',
                userCarId: '',
                imageUrl: ''
            },
            id: '',
			
			value: '',
			type: 'select',
			show: false,
			border: true,
			actionSheetList: [
				{
					text: '太平洋保险'
				},
				{
					text: '太平洋保险1'
				},
				{
					text: '太平洋保险1'
				}
			],

        }
    },
    onLoad(option) {
        this.form.userCarId = option.id
    },
    onShow() {
        getApp().globalData.getUserInfo((data) => {
            console.log(data);
            this.userInfo = data;
          
        })
    },
    methods: {
        handleDate(val) {
            this.form.lastValidDate = `${val.year}-${val.month}-${val.day} 00:00:00`
        },
        async handleSubmit() {
          
            for(let i in this.form) {
                if(!this.form[i]) {
                    uni.showToast({
                        title: '请输入内容',
                        duration: 2000,
                        icon: 'none'
                    });
                    return false;
                }
            }
     
            uni.showLoading({
                title: '加载中'
            });
            const { code } = await this.$getRequest(this.$url.updateInsurance, 'POST', this.form)
            uni.hideLoading()
            if(code != 0) {
                return false;
            }
            uni.showToast({
                title: '提交成功',
                duration: 2000
            });
            this.$u.route({
                type: 'navigateBack',
                delta: 1
            })
            console.log(result)
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
                    const upload = await this.$getFileUpload(this.$url.upload, tempFilePaths)

                    console.log(upload.data)

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
                }
            });
        },

        // 获取用户身份证信息
        async getUserInfo(userId) {
            const userInfo =  await this.$getRequest(this.$url.userInfo, 'POST', {userId})
            console.log(userInfo, 'userInfo')
            // if (userInfo.data) {
            // }
        },
		// 点击actionSheet回调
		actionSheetCallback(index) {
			this.value = this.actionSheetList[index].text;
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
