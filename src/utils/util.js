/**
 * 接口URL 共通方法
 * @Author: mmm
 * @Date: 2022-03-23
 */
// 开发s
//const serverUrl = process.env.NODE_ENV === "development" ? "https://api.51cheyaoshi.com/" : "https://wc.tigerlife.cn/";
const serverUrl = process.env.NODE_ENV === "development" ? "https://api.51cheyaoshi.com/" : "https://api.51cheyaoshi.com/";
//const serverUrl = process.env.NODE_ENV === "development" ? "https://uat-api.51cheyaoshi.com/" : "https://uat-api.51cheyaoshi.com/";
// https://partner.51cheyaoshi.com/
// http://47.100.3.41:8082/doc.html
// https://manager.wecar-rental.com/

// const wxPayUrl = 'wechat/wx/pay/createOrder'
const wxPayUrl = 'wx/pay/createOrder'

// 腾讯地图key
const QQMapWXKey = 'ONYBZ-WH6KF-BAIJO-NWS5O-KM4LS-BSFY4';
// 接口URL
const url = {
  // getOpenId: 'app/xcx/getOpenId', // 获取openid
  // getIdentifyingCode: 'app/xcx/getIdentifyingCode', //获取验证码
  // decryptData: 'app/xcx/wechat/decryptData', //获取手机号
  // wechatLoginByOpenId: 'app/xcx/wechatLoginByOpenId', //登录
  partnerUserInfoAll: 'app/partner/user/info', // 全部用户信息
  
  uploadText:'merchantapp/sysFiles/upload',//上传图片地址
  //首页
  partnerUserInfo: 'app/index/getPartnerUserInfo', // 用户统计信息
  partnerUserStatistics: 'app/index/getPartnerUserStatistics',
  partnerOrderStatistics: 'app/index/getPartnerOrderSubscribeStatistics',
  
  // 首页-订单
  orderList: 'app/order/list', // 订单列表
  orderDetail: 'app/order/getOrderInfo', // 订单详情
  
  // 首页-客户
  getCustomerList: 'app/PartnerUser/getUserList',
  cityList: 'app/CarSubscribe/openCityList',
  getCarBrandList: 'app/CarSubscribe/getCarBrandList',
  getCarTypeList: 'app/CarSubscribe/getCarTypeList',
  getCarTypeYearProductList: 'app/CarSubscribe/getCarTypeYearProductList',
  createCustomOrder: 'app/CarSubscribe/createUserCarSubscribe',
  unbindCorp: 'app/partner/user/delete',
  
  // 首页-钱包
  walletInfo: 'app/wallet/info',
  getWalletDetailList: 'app/wallet/detailList',
  getBankCardList: '/app/PartnerBankCard/bankCardList',
  bindBankCard: 'app/PartnerBankCard/bindBankCard',
  // getIdentifyingCode: 'app/PartnerBankCard/getIdentifyingCode',
  unboundBankCard: 'app/PartnerBankCard/unboundBankCard',
  ocrBankCard: 'app/PartnerBankCard/ocrBankCard',
  applyWithdrawal: '/app/partner/account/add',
  
  // 我的
  updateAvatar: 'app/partner/user/updateLogoImage',
  
  // 产品
  getCarSubscribeList: 'app/CarSubscribe/getCarSubscribeList', // 无查询条件
  carSubscribeDetail: 'app/CarSubscribe/carSubscribeDetail',
  carSubscribeDetailCommission: 'app/CarSubscribe/carSubscribeDetailCommission',
  
  // 合作
  ocrIdcard: 'app/partner/user/ocrIdcard', // 身份证 解析正反
  personRegister: 'app/partner/user/personRegister',
  getCooperList: 'app/company/cooperation', // 
  ocrCorpcard: 'app/company/ocrBusinessLicense',
  corpRegister: 'app/company/register',
  
  // 通用
  upload: 'sysFiles/upload', //上传
  
  /* 以下暂未调试 */
  businessMessageListByPage: 'app/user/message/businessMessageListByPage', //业务消息列表
  marketingMessageListByPage: 'app/user/message/marketingMessageListByPage', //营销消息列表
  
  getAccountList: 'app/my/accountDetail', // 余额 列表明细
  getDepositList: 'app/my/depositDetail', // 押金 列表明细
  
  paymentOrder: 'app/order/paymentOrder', //支付
  cancelOrder: 'app/order/cancelOrder', //取消订单
  updateOrder: 'app/order/updateOrder', // 修改订单
  feedback: 'app/feedback/create', //提交反馈
  searchCarTypeYearProduct: 'app/product/searchCarTypeYearProduct', //搜索
  
  userAuditSubmit: 'app/audit/userAuditSubmit', //提交认证
  userInfo: 'app/my/userInfo', // 用户信息
  likeProduct: 'app/product/likeProduct', //收藏
  payOrder: 'wx/pay/createOrder', //支付
  get4sList: 'app/product/get4SList', // 4S店接口
  createUserIntention: 'app/product/createUserIntention', //创建意向
  addCar: 'app/mycar/addCar', //添加爱车
  getMyCars: 'app/mycar/getMyCars',  //获取车辆接口
  getMyCarInfo: 'app/mycar/getMyCarInfo', //获取车辆详情接口
  getUserCarReport: 'app/mycar/getUserCarReport', //体验报告
  updateCarMileage: 'app/mycar/updateCarMileage', //修改里程数
  updateTyre: 'app/mycar/updateTyre', //更新轮胎
  updateInsurance: 'app/mycar/updateInsurance', //更新保险
  
  getMaintainItem: 'app/mycar/getMaintainItem', //保养列表
  updateMaintain: 'app/mycar/updateMaintain', //更新保养
  createUserCarDrivingLicense: 'app/mycar/createUserCarDrivingLicense', //添加行驶证
  // createUserCarDrivingLicense: 'app/mycar/createUserCarDrivingLicense', //创建车辆
	
	
	clientListByPage: 'merchantapp/clientManager/listByPage' ,//客户查询分页数据
	insertClient: 'merchantapp/clientManager/insertClient', //客户管理添加客户
	selectClientDetailInfo: 'merchantapp/clientManager/selectClientDetailInfo', //客户管理查询客户详情 
	selectClientConsumeRecord: 'merchantapp/clientManager/selectClientConsumeRecord', //客户管理查询客户所有消费记录
	selectClientVisitRecord: 'merchantapp/clientManager/selectClientVisitRecord', //客户管理查询客户跟进记录
	
	// 车辆模块
	getUpLoad:'merchantapp/sysFiles/upload',  //上传行驶证
	getLicense:'merchantapp/carManage/OCRDrivingLicense', //上传行驶证  获取车信息
	getAddCar:'merchantapp/carManage/addCar', //添加车辆-保存
	getCarOtherConfig:'merchantapp/carManage/updateCarOtherConfig', //车辆增配-保存
	getCarTravelLicense : 'merchantapp/carManage/updateCarTravelLicense', //上传行驶证 -保存
	
	updateCarInsuranceInfo : 'merchantapp/carManage/updateCarInsuranceInfo', //修改车辆保险信息
	
	
	listInsuranceCompany : 'merchantapp/carManage/listInsuranceCompany', //保险公司列表查询
	updateCarPicsInfo : 'merchantapp/carManage/updateCarPicsInfo', //保险公司列表查询
	getOrderList:'merchantapp/orderManage/pageSubscribeOrder', //  订单 -列表
	getOrderDetail:'merchantapp/orderManage/findSubscribeOrderDetails', //订单 - 详情
	getCars:'merchantapp/carManage/pageCars', //订单- 绑定车辆弹框里面的信息
	getBindOrder:'merchantapp/carManage/bindCarWithSubscribeOrder', //订单 - 绑定车辆
	getCarInShop:'merchantapp/orderManage/confirmCarInShop', //订单  - 销售角色- 车辆到店
	uploadCarCheckedPics:'merchantapp/orderManage/uploadCarCheckedPics', //订单  - 销售角色- 车辆到店
	addCarInfo:'merchantapp/orderManage/addCarInfo', //订单  - 销售角色- 车辆到店
	
	
	
	getOpenId : 'merchantapp/miniApp/login',  //登录
	decryptData :'merchantapp/miniApp/byMobile', //手机号登录
	getIdentifyingCode: 'merchantapp/miniApp/smsVerificationCode', //获取验证码
	getMobile:'merchantapp/miniApp/getMobileByCode', // 获取手机号
	
	
	// 车辆详情
	updateCarInsuranceInfoWithOnSheet:'merchantapp/carManage/updateCarInsuranceInfoWithOnSheet',//修改单份车辆保险信息
	updateCarInsurance:'merchantapp/carManage/updateCarInsuranceInfo',//修改车辆保险信息
	verifyCode:'merchantapp/carManage/verifyCode',//查询车牌号 车架号是否存在
	
	// 方案
	getCarBrandList:'merchantapp/carInfo/getCarBrandForSearch' ,  //获取品牌列表
	getForSearch:'merchantapp/carInfo/getCarYearTypeForSearch', //获取车型号列表
	getCarYear:'/merchantapp/carSubscribe/selectCarYearAndConfigDetail', //获取车型年款列表
	getCarPlanList: 'merchantapp/carSubscribe/selectCarSubscribeByPage', // 新车方案列表
	getOldCarPlanList: 'merchantapp/carSubscribe/selectSecondCarSubscribeByPage', // 二手车方案列表
	delCarPlan: 'merchantapp/carSubscribe/deleteCarSubscribe', // 删除方案
	getCarPlanDetail: 'merchantapp/carSubscribe/selectCarSubscribeDetail', // 方案详情
	createCarPlan: 'merchantapp/carSubscribe/insertCarSubscribe', // 创建方案
	updateNewCarSubscribe: 'merchantapp/carSubscribe/updateNewCarSubscribe', // 修改方案
	getCarConfigAndColor:'merchantapp/carManage/selectByCarTypeId',// 车辆信息 车辆增配  获取颜色和车辆增配项
	getCarColor:'merchantapp/carSubscribe/selectByCarTypeId',// 车辆信息 车辆增配  获取颜色和车辆增配项
	getProductTemplate: 'merchantapp/carSubscribe/productTemplate/selectAll', // 查询模板
	getFinancialScheme: 'merchantapp/carSubscribe/selectFinancialScheme', // 查询金融方案
	calculatePurchaseTaxRatio: 'merchantapp/carSubscribe/calculatePurchaseTaxRatio', // 计算购置税
	calculateDepositAndMonthPay: 'merchantapp/carSubscribe/selectDepositAndMonthPay', // 计算保证金
	selectSecondHandCarsByMerchant: 'merchantapp/carSubscribe/selectSecondHandCarsByMerchant', // 二手车创建方案选择
	selectCarsInfoInStore: 'merchantapp/carSubscribe/selectCarsInfoInStore', // 查询新车在库车辆
	openCityList: 'merchantapp/clientManager/app/home/openCityList', // 查询所有开放城市
	
	// 车辆
	findCarInfoById:'merchantapp/carManage/findCarInfoById', // 根据车辆ID查询车辆详情
	updateCarPicsInfo:'merchantapp/carManage/updateCarPicsInfo', // 修改图片信息
	getCarList: 'merchantapp/carManage/pageCars', // 新车 二手车列表
	deleteNewCar: 'merchantapp/carManage/deleteNewCar', // 新车删除
	deleteSecondCar: 'merchantapp/carManage/deleteSecondCar', // 二手车删除
	addCarAtLastPage:'merchantapp/carManage/addCarAtLastPage', // 添加车辆
	updateNewCarInfo:'merchantapp/carManage/updateNewCarInfo', // 新车修改
	
	// 工作台
	queryUserInfoAndCompanyList: 'merchantapp/miniApp/queryUserInfoAndCompanyList', // 公司查询
	updateUserLoginCompanyInfo: 'merchantapp/miniApp/updateUserLoginCompanyInfo', // 切换公司
	selectNoReadSystemMsgNum: 'merchantapp/message/selectNoReadSystemMsgNum', // 获取未读消息
	
	// 交车人员
	selectCarDeliveryInfo: 'merchantapp/orderManage/selectCarDeliveryInfo', // 查询交车点人员信息
	selectCarDeliveryOrderList: 'merchantapp/orderManage/selectCarDeliveryOrderList', // 查询交车点人员订单列表
	bindingCar: 'merchantapp/orderManage/bindingCar', // 绑定车辆
	updateMileage: 'merchantapp/orderManage/updateMileage', // 更新车辆里程以及油量
	insertOrUpdateCheckOtherConfig: 'merchantapp/carCheck/insertOrUpdateCheckOtherConfig', // 新增以及修改验车增配项
	selectTyreNameList: 'merchantapp/carCheck/selectTyreNameList', // 查询轮胎品牌
	selectTyreNameSize: 'merchantapp/carCheck/selectTyreNameSize', // 查询轮胎尺寸
	insertOrUpdateCheckInfo: 'merchantapp/carCheck/insertOrUpdateCheckInfo', // 新增以及修改验车信息
	uploadCheckCarPicture: 'merchantapp/carManage/uploadCheckCarPicture', // 验车照片上传，添加水印
	
	// 登录
	esignCooperation: 'merchantapp/miniApp/esignCooperation', // 易签宝在线签约
	selectUntreatedOrderNum: 'merchantapp/dataBoard/selectUntreatedOrderNum', // 查询未处理订单数量
	
	// 报价
	selectCarOfferList: 'merchantapp/carOffer/selectCarOfferList', // 查询报价
	createOrUpdateCarOffer: 'merchantapp/carOffer/createOrUpdateCarOffer', // 添加或修改车辆报价
	
	// 方案
	getCarSubscribeList: 'merchantapp/carSubscribe/getCarSubscribeList', // 订阅方案列表
	getProductDetail: 'merchantapp/carSubscribe/productDetail', // 查询新车订阅方案详情
	selectSecondCarSubscribeDetail: 'merchantapp/carSubscribe/selectSecondCarSubscribeDetail', // 查询二手车订阅方案详情
	selectDepositAndMonthPayOfApportionRate: 'merchantapp/carSubscribe/selectDepositAndMonthPayOfApportionRate', // 二手车订阅费计算
	selectCarBrandListOfSubscribe: 'merchantapp/carSubscribe/selectCarBrandListOfSubscribe', // 查询订阅方案对应的品牌集合
	updateCarBrandListOfSubscribe: 'merchantapp/carSubscribe/updateCarBrandListOfSubscribe', // 更新订阅方案对应的品牌集合
	selectCarDeliveryAddress: 'merchantapp/carSubscribe/selectCarDeliveryAddress', // 交车点查询
	createUnlimitedQrCode: 'merchantapp/carSubscribe/createUnlimitedQrCode', // 生成共享二维码
	
	// 员工
	getUserList: 'merchantapp/userManager/user/listByPage', // 查询员工列表
	getRoleList: 'merchantapp/userManager/role/listByPage', // 角色查询分页数据接口
	addUser: 'merchantapp/userManager/user/add', // 添加员工
	editUser: 'merchantapp/userManager/user/update', // 编辑员工
	delUser: 'merchantapp/userManager/user/delete', // 删除员工
	
	// 订单
	selectSubscribeOrderByPage: 'merchantapp/orderManage/selectSubscribeOrderByPage', // 订单列表查询
	updateOrderSalesmanReqVo: 'merchantapp/orderManage/updateOrderSalesmanReqVo', // 分配订单
	updateOrderPredictPlateDate: 'merchantapp/orderManage/updateOrderPredictPlateDate', // 更新订单预计上牌时间
	insertOrUpdateOrderCarCertificateImage: 'merchantapp/orderManage/insertOrUpdateOrderCarCertificateImage', // 添加订单车辆图片
	updateOrderViewNum: 'merchantapp/dataBoard/updateOrderViewNum', // 处理分配订单查询数量
	getScheme: 'merchantapp/miniApp/getScheme', // 获取scheme
	carDeliveryConfirm: 'merchantapp/orderManage/carDeliveryConfirm', // 确认交车
	updateDeliveryUser: 'merchantapp/orderManage/updateDeliveryUser', // 添加或者修改交车人员
	updateOrderDecorate: 'merchantapp/orderManage/updateOrderDecorate', // 添加订单装潢
	saveOtherConfig: 'merchantapp/orderManage/saveOtherConfig', // 添加订单增配项
	saveMerchantOrderStatus: 'merchantapp/orderManage/saveMerchantOrderStatus', // 修改订单状态
	esign:'merchantapp/orderManage/updateContractSignStatus',//易签宝在线签约
	
	// 客户
	getClientList: 'merchantapp/clientManager/listByPage', // 订单列表查询
	insertClient: 'merchantapp/clientManager/insertClient', // 添加客户
	InsertClientIntention: 'merchantapp/clientManager/InsertClientIntention', // 编辑客户
	selectClientDetailInfo: 'merchantapp/clientManager/selectClientDetailInfo', // 客户详情
	deleteClient: 'merchantapp/clientManager/deleteClient', // 删除客户
	
	// 佣金
	selectBrokerageDistribution: 'merchantapp/merchantBrokerageDistribution/selectBrokerageDistribution', // 查询商户佣金分配
	addOrUpdateDistribution: 'merchantapp/merchantBrokerageDistribution/addOrUpdateDistribution', // 新增或修改商户佣金分配
	
	// 装潢
	selectAllDecorate: 'merchantapp/orderDecorate/selectAllDecorate', // 查询装潢列表
	insertDecorate: 'merchantapp/orderDecorate/insertDecorate', // 新增装潢
	deleteDecorate: 'merchantapp/orderDecorate/deleteDecorate', // 删除装潢
	
	// 提现
	selectListOfUserId: 'merchantapp/userBrokerageRecord/selectListOfUserId', // 查询用户佣金、提现记录
	ocrIdcard: 'merchantapp/userBrokerageRecord/ocrIdcard', // 解析身份证正面或反面
	ocrBankCard: 'merchantapp/userBrokerageRecord/ocrBankCard', // 解析银行卡
	userAuditSubmit: 'merchantapp/userBrokerageRecord/userAuditSubmit', // 用户提交认证
	updateUserBankInfo: 'merchantapp/userBrokerageRecord/updateUserBankInfo', // 绑定银行卡
	updateBankBindStatus: 'merchantapp/userBrokerageRecord/updateBankBindStatus', // 解绑银行卡
	faceAudit: 'merchantapp/userBrokerageRecord/faceAudit', // 人脸识别
	insertBrokerageRecord: 'merchantapp/userBrokerageRecord/insertBrokerageRecord', // 提现或增加佣金记录
	
	// 金融 风控
	selectRiskList: 'merchantapp/riskAudit/selectRiskListByPage', // 风控订单列表
	selectRiskOrderDetail: 'merchantapp/riskAudit/selectRiskOrderDetail', // 风控订单详情
	updateAuditStatusOfAgain: 'merchantapp/riskAudit/updateAuditStatusOfAgain', // 复审通过或者不通过
	getCertificationConfigList: 'merchantapp/riskAudit/certificationConfigList', // 查询需要选择的材料配置
	addUserCarSubscribeCertification: 'merchantapp/riskAudit/addUserCarSubscribeCertification', // 添加材料
	addOtherDeposit: 'merchantapp/riskAudit/addOtherDeposit', // 增加保证金
	updateCertificationStatus: 'merchantapp/riskAudit/updateCertificationStatus', // 材料审核
	deleteUserCarSubscribeCertification: 'merchantapp/riskAudit/deleteUserCarSubscribeCertification', // 移除材料
	confirmOtherDeposit: 'merchantapp/riskAudit/confirmOtherDeposit', // 风控订单加收保证金查询确认接口
	updateRentalAuditStatusOfAgain: 'merchantapp/riskAudit/userCarRental/approve', // 租车订单复审通过或者不通过
	
	// 租车
	selectRentalOrderList: 'merchantapp/userCarRentalSubscribe/list', // 租车订单列表
	selectRentalOrderDetail: 'merchantapp/userCarRentalSubscribe/detail', // 租车订单列表
	startHandCar: 'merchantapp/userCarRentalSubscribe/startHandCar', // 开始送车
	uploadRentalOrderCheckInfo: 'merchantapp/userCarRentalSubscribe/insertOrUpdateCarInfo', // 验车
	startGetCar: 'merchantapp/userCarRentalSubscribe/startGetCar', // 开始接车
	returnedCarInfo: 'merchantapp/userCarRentalSubscribe/returnedCarInfo', // 还车验车
	
	// 竞拍
	addSecondAuction: 'merchantapp/secondAuction/add', // 设置竞拍
	deleteSecondAuction: 'merchantapp/secondAuction/delete', // 删除竞拍
	selectReceiptBankAccountInfo: 'app/combinationPayment/selectReceiptBankAccountInfo', // 银行卡转账的公司详情
	selectPaymentDetail: 'app/combinationPayment/selectPaymentDetail', // 查询支付列表详情
	createBankAccount: 'app/combinationPayment/createBankAccount', // 银行卡支付
	createBankBill: 'app/combinationPayment/createBankBill', // 添加银行卡支付照片
	createBiddingDisputes: 'app/app/secondAuction/biddingDisputes', // 发起纠纷
	confirmAuction: 'app/app/secondAuction/confirm', // 确认竞价交易
	getTurnoverRecord: 'app/app/turnoverRecord/listByPage', // 交易流水
	getBankAndBalance: 'app/app/turnoverRecord/bankAndBalance', // 银行卡信息和余额
	bindBank: 'app/app/turnoverRecord/bindBank', // 绑定银行卡
	getTurnoverRecordDetail: 'app/app/turnoverRecord/detail', // 流水详情
	withdrawal: 'app/app/turnoverRecord/Withdrawal', // 提现
}

/**
 * @description: 请求
 * @param {url, method, data}
 * @return:
 */
const getRequest = (url, method, data) => {
	//const tokenData = uni.getStorageSync('tokenData')'
  
	// const tokenData = 'qichejingxiaoshang-zongjingli-lijuan'
	const tokenData =uni.getStorageSync('tokenData')
	return new Promise((resolve, reject) => {
    uni.request({
      url: serverUrl + url,
      method: method,
      data: data,
      header: {
        // "content-type": "multipart/form-data",
				"authorization": tokenData
      },
      success: (res) => {
        console.log(url, res.data);
        if (res.data.code != 0 ) {
					if(res.data.code == 401001){
						uni.navigateTo({
							url:'/pages/login/sign'
						})
					}
          uni.showToast({
            title: res.data.msg,
            duration: 2000,
            icon: 'none'
          });
        }
        resolve(res.data);
      },
      fail(err) {
        console.log(err);
      },
    });
  });
};

// loginRoute 登录后跳转的路由
const getUserProfile = (loginRoute, cb) => {
  uni.showToast({
    title: '',
    duration: 1000,
    icon: 'loading'
  });
  uni.getUserProfile({
    desc: "获取头像用于展示",
    success: (result) => {
      console.log('resultresult', result)
      uni.setStorageSync('userInfo', {
        name: result.userInfo.nickName,
        avatarUrl: result.userInfo.avatarUrl
      });
      getApp().globalData.route = loginRoute
      cb && cb()
    },
    complete: () =>{
      uni.hideToast()
    },
    fail: (error) => {
      console.log('errorres', error)
    }
  })
}

/**
 * @description: 上传OSS  callback
 * @param {tempFilePaths, 上传callback}
 * @return:
 */
 const getFileUpload = (url, tempFilePaths) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: serverUrl +url,
      filePath: tempFilePaths[0],
      name: 'file',
      formData: {
        'file': tempFilePaths[0]
      },
      success: (uploadFileRes) => {
        console.log(uploadFileRes)
        const result = JSON.parse(uploadFileRes.data);
        if (result.code != 0 ) {
          uni.showToast({
            title: result.msg,
            duration: 2000,
            icon: 'none'
          });
        }
        resolve(result);
      },
      fail: (err) => {
        console.log(err);
      }
    });
  });
};

/**
 * @description: 上传OSS  callback
 * @param {tempFilePaths, 上传callback}
 * @return:
 */
 const getFileUpload1 = (url, formData) => {
	const tokenData = uni.getStorageSync('tokenData')
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: serverUrl +url,
      filePath: formData.file,
      name: 'file',
      formData,
			header: {
			  "authorization": tokenData
			},
      success: (uploadFileRes) => {
        console.log(uploadFileRes)
        const result = JSON.parse(uploadFileRes.data);
        if (result.code != 0 ) {
          uni.showToast({
            title: result.msg,
            duration: 2000,
            icon: 'none'
          });
        }
        resolve(result);
      },
      fail: (err) => {
        console.log(err);
      }
    });
  });
};

/**
 * 微信支付
 */
const requestPayment = async (data, cb ) => {
  const res = await getRequest(wxPayUrl, 'POST', data)
  if(res.code != 0) {
    return false;
  }
  uni.requestPayment({
    provider: 'wxpay',
    timeStamp: res.data.timeStamp,
    nonceStr: res.data.nonceStr,
    package: res.data.packageValue,
    signType: res.data.signType,
    paySign: res.data.paySign,
    success: async (res) => {
      if(res.errMsg == 'requestPayment:ok') {
        // code 支付成功
        uni.showToast({
          title: '支付成功',
          duration: 2500
        });
        return cb && cb('success')
      } else {
        console.log('订单已取消');
        return cb && cb('fail')
      }
    },
    fail: async (err) => {
		console.log("err=======>",err)
      // uni.showToast({
      //     title: '取消支付',
      //     duration: 2500
      // });
      return cb && cb('fail')
    }
  })
}

/**
 * 跳转html或下载显示
 * @param {Object} url
 * @param {Object} title
 */
const goHtml = function(url, title) {
  const length = url.length
  const newString = url.substring(length-4, length)
  const newString2 = newString.toLowerCase()
  if (newString2 == '.pdf') {
    uni.downloadFile({
      url: url,
      success: function(res) {
        const filepath = res.tempFilePath
        uni.openDocument({
          filePath: filepath,
        })
      }
    })
  } else {
    uni.navigateTo({
      url: '/pages/html/html?h5url=' + url + '&title=' + title
    })
  }
};

export {
  url,
  getRequest,
  getUserProfile,
  getFileUpload,
	getFileUpload1,
  requestPayment,
  goHtml
};
