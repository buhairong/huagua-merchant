/**
 * 常量预设
 */
import dayjs from "dayjs"

/** 日期筛选条件常量设置 **/
const dateCondAll = [
  { id: 0, cateName: '今天', dateFrom: dayjs(new Date()).format('YYYY-MM-DD') },
  { id: 1, cateName: '昨天', dateFrom: dayjs(new Date()).subtract(1, 'day').format('YYYY-MM-DD') },
  { id: 2, cateName: '近7天', dateFrom: dayjs(new Date()).subtract(7, 'day').format('YYYY-MM-DD') },
  { id: 3, cateName: '近30天', dateFrom: dayjs(new Date()).subtract(30, 'day').format('YYYY-MM-DD') },
  { id: 4, cateName: '自定义', dateFrom: '', dateTo: '' }
]

/** 认证状态 **/
const auditStatusAll = {
  '0': '待审核',
  '1': '初审通过',
  '2': '初审拒绝',
  '3': '等待人工审核',
  '4': '复审拒绝',
  '5': '认证通过'
}

/** 用户认证筛选条件 **/
const userStatusCond = [
  { value: 0, name: '已注册' },
  { value: 1, name: '已认证' },
  { value: 2, name: '已成交' },
]

/** 订单状态**/
const orderStatusAll = [
  { value: 0, name: '待支付订金' },
  { value: 1, name: '待签约' },
  { value: 2, name: '待支付押金' },
  { value: 3, name: '采购中' },
  { value: 4, name: '待支付合约' },
  { value: 5, name: '待交车' },
  { value: 6, name: '用车中' },
  { value: 7, name: '合约结束' },
  { value: 8, name: '已取消' },
]

/** 账户余额状态 **/
const accountStatusAll = [
  { value: 0, name: '待支付' },
  { value: 1, name: '已支付' },
  { value: 2, name: '已取消' },
  { value: 3, name: '冻结中' },
]

/** 账户余额支付方式 **/
const accountPayTypeAll = [
  { value: 0, name: '账户充值' },
  { value: 1, name: '订单扣费' },
  { value: 2, name: '订单退款' },
  { value: 3, name: '订金支付' },
  { value: 4, name: '尾款支付' },
  { value: 5, name: '购买产品' },
]

// 区分浅白色色值
const whiteColors = ['#FFFFFF', '#F7F6F1']

//图片上传地址
const uploadAction = 'https://api.51cheyaoshi.com/merchantapp/sysFiles/upload' 

// 图片上传地址（含水印）
const uploadActionWithWaterMark = 'merchantapp/carManage/uploadCheckCarPicture'

// 车辆 tab
const carTypeTabs = [
	{id: 1, label: '全新车'},
	{id: 2, label: '二手车'},
]

// 二手车车辆状态
const oldCarStatus = {
	"1": {label: '已下架'},
	"2": {label: '已上架'},
	"3": {label: '订阅中'},
}

// 动力方式：1汽油、2柴油、3纯电、4油电混合、5插电混合、6增程式混合
const powerMode = {
	"1": {label: '汽油'},
	"2": {label: '柴油'},
	"3": {label: '纯电'},
	"4": {label: '油电混合'},
	"5": {label: '插电混合'},
	"6": {label: '增程式混合'},
}

// 动力方式：驱动方式：1前驱、2前驱、3全时四驱、4适时四驱、5分时四驱、6电动四驱
const drive = {
	"1": {label: '前驱'},
	"2": {label: '前驱'},
	"3": {label: '全时四驱'},
	"4": {label: '适时四驱'},
	"5": {label: '分时四驱'},
	"6": {label: '电动四驱'},
}

// 订单来源：自有订单、外部订单
const orderSourceList = [
	{value: '', label: '全部'},
	{value: '2', label: '自有订单'},
	{value: '1', label: '外部订单'},
]

const orderSourceObj = {
	'2': '自有订单',
	'1': '外部订单',
}

// 订单状态：审核中、待签约、待支付提车押金、备车中、上牌中、待交车、待支付订阅费用、已完成
const orderStatusList = [
	{value: '', label: '全部'},
	{value: '10', label: '审核中'},
	{value: '1', label: '待签约'},
	{value: '2', label: '待支付提车押金'},
	{value: '3', label: '备车中'},
	{value: '13', label: '上牌中'},
	{value: '5', label: '待验车'},
	{value: '4', label: '待支付订阅费用'},
	{value: '7', label: '已完成'},
	{value: '12', label: '审核拒绝'},
	{value: '8', label: '已取消'},
	{value: '14', label: '待审核'},
	{value: '15', label: '待交车'},
]

const orderStatusObj = {
	'10': '审核中',
	'16': '待接单',
	'17': '已拒绝接单',
	'1': '待签约',
	'2': '待支付提车押金',
	'3': '备车中',
	'13': '上牌中',
	'5': '待交车',
	'4': '待支付订阅费用',
	'6': '已完成',
	'12': '审核拒绝',
	'8': '已取消',
	'14': '待审核',
	'15': '待交车',
}

// 价格区间
const carPriceList = [
	{value: 0, label: '不限'},
	{value: 30, label: '30万'},
	{value: 50, label: '50万'},
	{value: 100, label: '100万'},
	{value: 200, label: '200万'},
	{value: 300, label: '300万'},
]

// 金融 tab
const userTypeTabs = [
	{id: 1, label: '个人用户'},
	{id: 2, label: '企业用户'},
]

// 风控订单审核状态
const RiskOrderStatus = {
    '1': {label: '初审通过'},
    '2': {label: '初审未通过'},
    '3': {label: '初审人工'},
    '4': {label: '补充材料'},
    '5': {label: '复审通过'},
    '6': {label: '复审未通过'},
    '7': {label: '补充材料'},
}

// 租车管理人员 tab
const rentalUserTypeTabs = [
	{id: 1, label: '送车单'},
	{id: 2, label: '接车单'},
]

// 租车订单状态
const CAR_RENTAL_ORDER_STATUS = {
	'10': '待审核',    // 风控审核
	'20': '审核拒绝',  // 风控审核拒绝
	'30': '待签约',
	'40': '待支付',
	'50': '已取消',   // 24小时未支付租金，订单自动取消
	'60': '待审核',   // 租金 银行转账 财务审核
	'70': '备车中',
	'80': '待取车',
	'85': '送车中',
	'90': '待验车',
	'100': '用车中',
	'110': '待还车',
	'115': '接车中',
	'120': '已逾期',
	'130': '结算中',
	'140': '需补缴',
	'150': '已完成',
}

// 竞拍车辆状态
const auctionCarStatus = {
	0: {label: '审核中'},
	1: {label: '待开始'},
	2: {label: '审核拒绝'},
	3: {label: '已取消'},
	4: {label: '进行中'},
	5: {label: '竞价结束'},
	6: {label: '交易完成'},
}

// 纠纷
const disputesList = [
	{ value: 1, label: '联系不上竞买方' },
	{ value: 2, label: '竞买方毁约行为' },
	{ value: 3, label: '其他竞买方原因' },
	{ value: 4, label: '对最终出价不满意' },
	{ value: 5, label: '车辆出现问题（ 车辆出现损坏等问题 ）' },
	{ value: 6, label: '其他我的原因' },
]

const disputesObj = {
	1: '联系不上竞买方',
	2: '竞买方毁约行为',
	3: '其他竞买方原因',
	4: '对最终出价不满意',
	5: '车辆出现问题（ 车辆出现损坏等问题 ）',
	6: '其他我的原因',
}

const disputeResultStatus = {
	1: '商家赔付',
	2: '用户赔付',
}

// 1: 充值
// 2: 上架冻结
// 3: 加收保证金
// 4: 违约补偿
// 5: 退还保证金

// 11: 违约赔付
// 12: 提现
// 13: 佣金支付

// 1, 2, 3, 12
const cashRecordObj = {
	1: { text: '充值', title: '充值', label: ['支付方式', '支付金额', '支付时间'], },
	2: { text: '上架冻结', title: '上架冻结', label: ['支付方式', '支付金额', '支付时间'] },
	3: { text: '加收保证金', title: '加收保证金', label: ['支付方式', '支付金额', '支付时间'] },
	4: { text: '违约补偿', title: '违约补偿', label: ['补偿方式', '补偿金额', '补偿时间'], label1Content: '补偿至账户余额', },
	5: { text: '退还保证金', title: '退还保证金', label: ['退还方式', '退还金额', '退还时间'], label1Content: '退还至账户余额', },
	11: { text: '违约赔付', title: '违约赔付', label: ['赔付方式', '赔付金额', '赔付时间'], label1Content: '账户余额', },
	12: { text: '提现', title: '提现', label: ['提现方式', '提现金额', '支付时间'], label1Content: '银行转账', },
	13: { text: '佣金支付', title: '佣金支付', label: ['支付方式', '支付金额', '支付时间'], label1Content: '账户余额', },
}

// 适用业务
const BUSINESS_TYPE = [
	{ id: 1, label: '汽车订阅' },
	{ id: 2, label: '会员租车' },
]

export {
  orderStatusAll,
  auditStatusAll,
  dateCondAll,
  userStatusCond,
  accountStatusAll,
  accountPayTypeAll,
	whiteColors,
	uploadAction,
	uploadActionWithWaterMark,
	carTypeTabs,
	oldCarStatus,
	powerMode,
	drive,
	orderSourceList,
	orderSourceObj,
	orderStatusList,
	orderStatusObj,
	carPriceList,
	userTypeTabs,
	RiskOrderStatus,
	rentalUserTypeTabs,
	CAR_RENTAL_ORDER_STATUS,
	auctionCarStatus,
	disputesList,
	disputesObj,
	disputeResultStatus,
	cashRecordObj,
	BUSINESS_TYPE,
}