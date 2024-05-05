<template>
    <view class="policyInfo">
        <view class="itemBox">
            <view class="infoItem">
                <view class="itemLeft">投保公司</view>
                <view class="itemRight">{{ getName(insInfo.insuranceCompany)}}</view>
            </view>
            <view class="infoItem">
                <view class="itemLeft">保险单号</view>
                <view class="itemRight">{{ insInfo.insuranceNo || insInfo.insuranceNumber}}</view>
            </view>
            <view v-if="type == 1" class="infoItem">
                <view class="itemLeft">三者金额</view>
                <view class="itemRight">{{ insInfo.amountOfThree }}</view>
            </view>
            <view class="infoItem">
                <view class="itemLeft">有效日期</view>
                <view class="itemRight">{{ insInfo.expireDate ||insInfo.lastValidDate }}</view>
            </view>
        </view>
        <view class="imgDiv"  @touchstart="touchStart" @touchend="touchEnd">
			<!-- <u-icon name="arrow-left" class='leftArrow'></u-icon> -->
            <image class="insImg"  :src="insInfo.insurancePicsList[idx].url|| insInfo.imgArr[idx].url" mode="widthFix"></image>
			<!-- <u-icon name="arrow-right" class='rightArrow'></u-icon> -->
		</view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            type: '',
            insInfo: {},
			actionSheetList:[],
			startX:0,//初始化点击位置的x坐标
			idx:0,//当前图片的下标
        }
    },
    onLoad(option) {
        this.type = option.type
        // this.insInfo = uni.getStorageSync('carInfo').insCompany[this.type]
		// console.log(this.insInfo ,'this.insInfo ');
		this.insInfo=uni.getStorageSync('insuranceList')
		this.getInsCompany()
    },
	methods:{
		async getInsCompany(){
		    const res =  await this.$getRequest(this.$url.listInsuranceCompany, 'POST', {})
		    this.actionSheetList = res.data
		},
		getName(id){
			for(let i of this.actionSheetList){
				if(id == i.id){
					return i.insuranceName
				}
			}
			return ''
		},
		touchStart: function (e) {
			if (e.touches.length == 1) {
				//设置触摸起始点水平方向位置
				this.startX=e.touches[0].clientX;
			}
		},
		touchEnd: function (e) {
			if (e.changedTouches.length == 1) {
				//手指移动结束后水平位置
				var endX = e.changedTouches[0].clientX;
				let diff = endX-this.startX;
				if(Math.abs(diff)>20){
					if(diff>0){
						console.log("左滑...");
						if(this.idx==0){
							uni.showToast({
								title: '已是第一张图片',
								duration: 2000,
								icon: 'none'
							});
						}else{
							this.idx=this.idx-1
						}
					}else{
						console.log("右滑...");
						if((this.insInfo.insurancePicsList&&this.idx==this.insInfo.insurancePicsList.length-1)||(this.insInfo.imgArr&&this.idx==this.insInfo.imgArr.length-1)){
							uni.showToast({
								title: '已是最后一张图片',
								duration: 2000,
								icon: 'none'
							});
						}else{
							this.idx=this.idx+1
						}
					}
				}
			}
		},
	}
}
</script>
<style lang="scss" scoped>
.policyInfo {
    font-size: 14px;
    .itemBox {
        background: #000;
        padding: 30rpx 24px;

        .infoItem {
            margin-top: 15px;
            display: flex;

            &:first-child {
                margin-top: 0px;
            }

            .itemLeft {
                color: #fff;
                opacity: 0.6;
            }

            .itemRight {
                color: #fff;
                margin-left: 30px;
            }
        }
    }
    .insImg {
		width: 100%;
		height: 502px;
    }
	.imgDiv{
		position: relative;
		.leftArrow{
			position: absolute;
			z-index: 999;
			// background-color: red;
			font-size: 50px;
			top: 50%;
		}
	}
}
</style>