<template>
  <view class="orderPage commonPage">
    <view class="m-label">选择城市</view>
    <u-cell-group class="m-cell-group-noborder" :border="false">
    	<u-cell-item
        :class="city == '' ? 'm-cell-item-off' : 'm-cell-item-on'"
        icon=""
        :title="city == '' ? '请选择所在的城市' :  city"
        bg-color="#ffffff"
        :border-bottom="false" @click="selectCity"></u-cell-item>
    </u-cell-group>
    <template>
      <u-picker
        v-model="showCityPicker"
        confirm-color="#31C37B"
        title="选择城市"
        mode="selector"
        :default-selector="[cityIndex]"
        range-key="city"
        :range="openCityList"
        @confirm="confirmCity"
      />
    </template>
    <view class="m-card m-car-v">
      <!-- 未选车型 -->
      <view v-if="selectCarId == 0 || selectCarId == ''">
        <view class="u-flex u-row-between" @click="selectCar">
          <view class="u-flex">
            <u-icon name="plus-circle" size="60" color="#999999"></u-icon>
            <text class="m-car-title-txt">选择订阅车型</text>
          </view>
          <view>
            <u-image
              width="186"
              height="106"
              src="https://image.51cheyaoshi.com/xcx/merchant/static/order/car.png"
            />
          </view>
        </view>
      </view>
      <!-- 已选车型 -->
      <view v-if="selectCarId > 0">
        <view class="u-flex u-row-between" @click="selectCar">
          <view>
            <view class="m-sel-brand">{{ selectCarItem.carBrand + ' ' + selectCarItem.carType  }}</view>
            <view class="m-sel-year">{{ selectCarItem.carTypeYear + ' ' + selectCarItem.carTypeYearProduct }}</view>
          </view>
          <view>
            <u-image
              width="186"
              height="106"
              :src="selectCarItem.imageUrl"
            />
          </view>
        </view>
      </view>
    </view>
    <view class="u-padding-top-50">
      <view class="m-label">合约周期</view>
      <view class="u-padding-top-24 u-flex">
        <view class="u-padding-right-24" v-for="(item,index) in periodList">
          <u-tag
            class="m-tag"
            :class="activePeriod == item.id ? 'm-tag-on' : 'm-tag-off'"
            mode="plain"
            :text="item.name"
            @click="clickPeriod(item.id)"
          />
        </view>
      </view>
    </view>
    <view class="u-padding-top-50">
      <view class="m-label">付款方案</view>
      <view class="u-padding-top-24 u-flex">
        <view class="u-padding-right-24" v-for="(item,index) in payTypeList">
          <u-tag
            class="m-tag"
            :class="activePayType == item.id ? 'm-tag-on' : 'm-tag-off'"
            mode="plain"
            :text="item.name"
            @click="clickPayType(item.id)"
          />
        </view>
      </view>
    </view>
    <view class="foot-sticky foot-btn u-flex-1">
      <view class="u-text-center" @click="handleSubmit">
        立即下单
      </view>
    </view>
    
    <template>
    	<u-popup v-model="showCarPop" mode="bottom" border-radius="12">
        <view class="m-pop-car">
          <view class="u-padding-top-40 u-padding-bottom-20 u-text-center m-pop-title">选择车型</view>
          <view class="m-pop-content">
            <view class="m-content-v u-flex">
              <view class="m-left u-flex-3 u-text-left u-padding-left-40">
                <scroll-view
                  id="leftScroll"
                  scroll-y
                  scroll-with-animation
                  class="m-bclist-sv"
                  :scroll-into-view="'toBrandView_' + activeBrandId"
                >
                  <view
                    :id="'toBrandView_' + item.id"
                    class="m-brand-v u-line-1"
                    :class="activeBrandId == item.id ? 'm-brand-v-on' : ''"
                    v-for="(item, index) in brandList"
                    :key="index"
                    @click="clickLeftBrand(item)"
                  >
                    {{ item.brandName }}
                  </view>
                </scroll-view>
              </view>
              <view class="m-right u-flex-7 u-padding-left-30">
                <scroll-view
                  id="rightScroll"
                  scroll-y
                  scroll-with-animation
                  class="m-carlist-sv"
                >
                  <view v-if="carList.length > 0">
                    <!-- TODO 品牌车型左显 车系名字 -->
                    <u-section
                      :title="activeBrandName"
                      font-size="30"
                      line-color="#31C37B"
                      color="#333333"
                      arrow="false"
                      :right="false"
                    />
                  </view>
                  <view
                    class="m-product u-padding-top-30 u-padding-bottom-30"
                    v-for="(item, index) in carList"
                    :key="index"
                    @click="clickRightCar(item)"
                  >
                    <text class="u-padding-right-16">{{ item.carType + ' ' + item.carTypeYear + ' ' + item.carTypeYearProduct }}</text>
                    <u-icon v-if="activeCarId == item.id" name="checkmark-circle-fill" color="#31C37B" size="32"></u-icon>
                  </view>
                </scroll-view>
                <!-- <view>
                  <u-section
                    :title="activeBrandName"
                    font-size="30"
                    line-color="#31C37B"
                    color="#333333"
                    arrow="false"
                    :right="false"
                  />
                </view>
                <view class="u-padding-top-20">
                  <view
                    class="m-product u-padding-top-30 u-padding-bottom-30"
                    v-for="(item, index) in carList"
                    :key="index"
                    @click="clickRightCar(item)"
                  >
                    {{ item.carTypeYear }}{{ item.carTypeYearProduct }}
                  </view>
                </view> -->
              </view>
            </view>
          </view>
          
          <view class="u-padding-left-60 u-padding-right-60 u-padding-top-20 u-padding-bottom-40">
            <view class="u-flex">
              <view class="m-btn foot-btn-cancel u-flex-1 u-text-center" @click="cancelCar">
                取消
              </view>
              <view class="m-btn foot-btn-confirm u-flex-1 u-text-center" @click="confirmCar">
                确定
              </view>
            </view>
          </view>
        </view>
    	</u-popup>
    </template>
    
  </view>
</template>

<script>
  export default {
    data() {
      return {
        custId: 0,
        
        showCityPicker: false,
        openCityList: [],
        cityIndex: 0,
        city: '',
        cityId: 0,
        activePeriod: 0,
        periodList: [
          { id: 1, name: '6个月' },
          { id: 2, name: '12个月' },
        ],
        activePayType: 0,
        payTypeList: [
          { id: 1, name: '一次性付清' },
          { id: 2, name: '分期付款' },
        ],
        showCarPop: false,
        brandList: [],
        activeBrandId: '',
        selectBrandId: '',
        activeBrandName: '',
        carList: [],
        activeCarId: 0,
        activeCarItem: null,
        selectCarId: 0,
        selectCarItem: null
      }
    },
    onLoad(option) {
      if(option) {
        this.custId = option.id
      }
      this.init()
    },
    methods: {
      async init() {
        // TODO
      },
      // 点击切换城市
      async selectCity() {
        const pageThis = this
        const res = await this.$getRequest(this.$url.cityList, "POST",{});
        this.openCityList = res.data
        // 查找cityIndex
        this.openCityList.forEach(function(item, index) {
          if(pageThis.city.indexOf(item.city) >= 0) {
            pageThis.cityIndex = index
            pageThis.cityId = item.id
          }
        })
        this.showCityPicker = true
      },
      // 确认切换城市
      async confirmCity(index) {
        this.cityIndex = index
        this.cityId = this.openCityList[index].id
        this.city = this.openCityList[index].city
        uni.setStorageSync("city",this.openCityList[index].city)
        uni.setStorageSync("cityId",this.openCityList[index].id)
        
        const res = await this.$getRequest(this.$url.getCarBrandList, 'POST', {
          cityId: this.cityId
        });
        // 品牌左显
        // this.brandList = res.data;
        
        
        // TODO 品牌车型左显
        let bList = res.data
        // TODO del 接口调整为 返回 品牌车型
        let bcList = []
        let bProps = []
        let taskList = []
        for(const item of res.data) {
          bProps.push({ cityId: this.cityId, carBrandId: item.id})
          taskList.push(this.$getRequest(this.$url.getCarTypeList, 'POST', { cityId: this.cityId, carBrandId: item.id}))
        }
        Promise.all(taskList).then(typeRes => {
          for(const bItem of bList) {
            for (const tRItem of typeRes) {
              for(const tItem of tRItem.data) {
                if (bItem.id == tItem.carBrandId) {
                  bcList.push({ id: tItem.id, carBrandId: bItem.id, carTypeId: tItem.id, brandName: bItem.brandName + tItem.carType })
                }
              }
            }
          }
        })
        // TODO del end
        this.brandList = bcList
        console.log(this.brandList)
      },
      clickPeriod(index) {
        this.activePeriod = index
      },
      clickPayType(index) {
        this.activePayType = index
      },
      async selectCar() {
        // 提示选择城市
        if (this.cityId == 0){
          uni.showToast({
              title: '请选择所在的城市',
              duration: 2000,
              icon: 'none'
          });
          return false;
        }
        if (this.selectBrandId) {
          this.activeBrandName = this.brandList.find(item => item.id === this.selectBrandId).brandName
          // 获取车型列表
          const result =  await this.$getRequest(this.$url.getCarTypeList, 'POST', { cityId: this.cityId, carBrandId: this.selectBrandId })
          this.carList = result.data.records
        }
        this.showCarPop = true
      },
      clickRightCar(item) {
        console.log('dsdss', item, this.activeCarItem, this.carList)
        this.activeCarId = item.id
        this.activeCarItem = item
        console.log(item)
      },
      confirmCar() {
        console.log(this.activeCarItem, this.carList)
        this.selectBrandId = this.activeBrandId
        this.selectCarId = this.activeCarId
        if(this.activeCarItem == null || this.activeCarItem =='') {
          uni.showToast({
              title: '请选中具体车款',
              duration: 2000,
              icon: 'none'
          });
          return false;
        }
        this.selectCarItem = this.activeCarItem
        this.showCarPop = false
      },
      cancelCar() {
        if (this.activeBrandId != this.selectBrandId) {
          this.activeBrandId = this.selectBrandId
        }
        if (this.activeCarId != this.selectCarId) {
          this.activeCarId = this.selectCarId
          this.activeCarItem = this.selectCarItem
        }
        this.carList = []
        // this.activeBrandId = ''
        // this.activeCarId = ''
        // this.activeCarItem = null
        this.showCarPop = false
      },
      async handleSubmit() {
        const pageThis = this
        // 校验各选择项目
        // 提示选择城市
        if (this.cityId == 0){
          uni.showToast({
              title: '请选择所在的城市',
              duration: 2000,
              icon: 'none'
          });
          return false;
        }
        if (this.selectCarId == 0 || this.selectCarId == '' ){
          uni.showToast({
              title: '请选择订阅车型',
              duration: 2000,
              icon: 'none'
          });
          return false;
        }
        if (this.activePeriod == 0 || this.activePeriod == '' ){
          uni.showToast({
              title: '请选择合约周期',
              duration: 2000,
              icon: 'none'
          });
          return false;
        }
        if (this.activePayType == 0 || this.activePayType == '' ){
          uni.showToast({
              title: '请选择付款方式',
              duration: 2000,
              icon: 'none'
          });
          return false;
        }
        
        // 代客下单提交
        const orderRes = await this.$getRequest(this.$url.createCustomOrder, 'POST', { carSubscribeId: 1, userId: this.custId }) //TODO this.activeCarItem.id
        // 提示后跳转到客户列表
        if (orderRes.code == 0){
          uni.showLoading({
          	title: '下单成功'
          });
          setTimeout(function () {
          	uni.hideLoading();
            // 跳转客户列表
            pageThis.$u.route(`/pages/mine/customer?`)
          }, 2000);
        }
      },
      async clickLeftBrand(item) {
        this.activeBrandId = item.id
        this.activeBrandName = item.brandName
        // 获取车型数据
        // const result =  await this.$getRequest(this.$url.getCarTypeList, 'POST', { cityId: this.cityId, carBrandId: item.id})
        // this.carList = result.data
        
        // TODO 品牌车型左显 获取车型列表
        const result =  await this.$getRequest(this.$url.getCarTypeYearProductList, 'POST', { cityId: this.cityId, carTypeId: item.id })
        this.carList = result.data
      },
    }
  }
</script>
<style lang="scss">
  .orderPage {
    .m-cell-group-noborder {
      .u-cell {
        padding: 4rpx 0rpx !important;
        u-icon {
          margin-right: 0rpx !important;
        }
        .u-cell_title {
          font-size: 32rpx;
          font-weight: bold;
        }
      }
      .m-cell-item-off {
        .u-cell_title {
          color: #CCCCCC;
        }
      }
      .m-cell-item-on {
        .u-cell_title {
          color: #333333;
        }
      }
    }
    .m-tag {
      .u-tag {
        font-weight: 500;
        font-size: 32rpx;
        background-color: #FFFFFF;
        padding: 14rpx 40rpx;
        border-radius: 8rpx;
      }
    }
    .m-tag-on {
      .u-tag {
        background-color: rgba(49, 195, 123, 0.1);
        color: #31C37B;
        border-color: rgba(49, 195, 123, 0.1);
      }
    }
    .m-tag-off {
      .u-tag {
        background-color: #FFFFFF;
        color: #333333;
        border-color: #E6E6E6;
      }
    }
  }
</style>
<style lang="scss" scoped>
.orderPage {
  padding: 26rpx 40rpx;
  .m-label {
    font-size: 28rpx;
    font-weight: 400;
    color: #666666;
  }
  .m-car-v {
    padding: 60rpx 40rpx;
    .m-sel-brand {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
    }
    .m-sel-year {
      padding-top: 10rpx;
      font-size: 24rpx;
      font-weight: 400;
      color: #666666;
    }
  }
  .m-car-title-txt {
    padding-left: 20rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
  }
  .m-pop-car {
    .m-pop-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
    }
    .m-left {
      background: #F7F7F7;
      padding-top: 20rpx;
      height: 700rpx;
      
      .m-brand-v {
        padding: 20rpx 0;
        font-size: 28rpx;
        font-weight: 400;
        color: #666666;
      }
      .m-brand-v-off {
        color: #666666;
      }
      .m-brand-v-on {
        font-weight: 500;
        color: #31C37B;
      }
      .m-bclist-sv {
        height: 654rpx;
      }
    }
    .m-right {
      height: 700rpx;
      padding-top: 46rpx;
      .m-carlist-sv {
        height: 654rpx;
      }
      .m-product {
        border-bottom: 1px solid #F0F0F0;
      }
    }
  }
}
</style>
