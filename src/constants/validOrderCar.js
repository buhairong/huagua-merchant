// 轮胎
const statusList1 = [
	{id: 1, label: '轮胎正常'},
	{id: 2, label: '轮胎异常（有划痕、凹痕、破损）'},
]

// 前部、左侧、车顶、右侧、后部、饰板、仪表、后视镜
const statusList2 = [
	{id: 1, label: '正常'},
	{id: 2, label: '异常（有划痕、凹痕、破损）'},
]

// 发动机
const statusList3 = [
	{id: 1, label: '正常'},
	{id: 2, label: '异常（抖动、漏油、破损）'},
]

// 蓄电池
const statusList4 = [
	{id: 1, label: '正常'},
	{id: 2, label: '异常（亏电、破损）'},
]

// 水箱、底盘
const statusList5 = [
	{id: 1, label: '正常'},
	{id: 2, label: '异常（有凹痕、破损）'},
]

// 机油
const statusList6 = [
	{id: 1, label: '正常'},
	{id: 2, label: '异常（泄漏、乳化）'},
]

// 冷却液、制动液
const statusList7 = [
	{id: 1, label: '正常'},
	{id: 2, label: '异常（泄漏、乳化）'},
]

// 灯光
const statusList8 = [
	{id: 1, label: '正常'},
	{id: 2, label: '异常（灯光损坏或不亮）'},
]

// 音响
const statusList9 = [
	{id: 1, label: '正常'},
	{id: 2, label: '异常（音响损坏或杂音）'},
]

// 座椅、地板
const statusList10 = [
	{id: 1, label: '正常'},
	{id: 2, label: '异常（划痕、污渍、破损）'},
]

// 电器面板
const statusList11 = [
	{id: 1, label: '正常'},
	{id: 2, label: '异常（损坏、错误代码）'},
]

// 车内开关
const statusList12 = [
	{id: 1, label: '正常'},
	{id: 2, label: '异常（损坏、松动、阻尼异常）'},
]


const validJSON = [
	{
		id: 1,
		level: 1,
		name: '车架号照片',
		isExpand: true,
		type: 'vin',
		imageType: 1, // 1.单张 2.多张
		url: '',
		uploadTip: '添加前挡风玻璃车架号照片',
		rightText: '',
		isComplete: false,
	},
	{
		id: 2,
		level: 1,
		name: '轮胎信息',
		isExpand: false,
		type: 'tyre',
		uploadTip: '上传异常处照片',
		rightText: '',
		children: [
			{
				id: 2,
				level: 2,
				name: '左前轮胎',
				isExpand: true,
				type: 'tyre',
				brand: '',
				size: '',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 3,
				level: 2,
				name: '左前轮毂',
				isExpand: false,
				type: 'tyre1',
				brand: '',
				size: '',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 4,
				level: 2,
				name: '右前轮胎',
				isExpand: false,
				type: 'tyre',
				brand: '',
				size: '',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 5,
				level: 2,
				name: '右前轮毂',
				isExpand: false,
				type: 'tyre1',
				brand: '',
				size: '',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 6,
				level: 2,
				name: '左后轮胎',
				isExpand: false,
				type: 'tyre',
				brand: '',
				size: '',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 7,
				level: 2,
				name: '左后轮毂',
				isExpand: false,
				type: 'tyre1',
				brand: '',
				size: '',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 8,
				level: 2,
				name: '右后轮胎',
				isExpand: false,
				type: 'tyre',
				brand: '',
				size: '',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 9,
				level: 2,
				name: '右后轮毂',
				isExpand: false,
				type: 'tyre1',
				brand: '',
				size: '',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
		],
	},
	{
		id: 10,
		level: 1,
		name: '外观检查',
		isExpand: false,
		type: 'appearance',
		uploadTip: '上传异常处照片',
		rightText: '',
		children: [
			{
				id: 10,
				level: 2,
				name: '前杠',
				isExpand: true,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 11,
				level: 2,
				name: '引擎盖',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 12,
				level: 2,
				name: '发动机',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList3,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 13,
				level: 2,
				name: '蓄电池',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList4,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 14,
				level: 2,
				name: '水箱',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList5,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 15,
				level: 2,
				name: '机油',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList6,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 16,
				level: 2,
				name: '冷却液',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList7,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 17,
				level: 2,
				name: '制动液',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList7,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 18,
				level: 2,
				name: '底盘',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList5,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 19,
				level: 2,
				name: '左前大灯',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 20,
				level: 2,
				name: '左后大灯',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 21,
				level: 2,
				name: '左前叶子板',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 22,
				level: 2,
				name: '左后视镜',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 23,
				level: 2,
				name: '左前门',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 24,
				level: 2,
				name: '左后门',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 25,
				level: 2,
				name: '左后叶子板',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 26,
				level: 2,
				name: '车顶',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 27,
				level: 2,
				name: '天窗',
				isExpand: false,
				type: 'appearance',
				requireChooseIfHas: true,
				isHas: 0, // 0.未选 1.有 2.无
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
			},
			{
				id: 28,
				level: 2,
				name: '右前大灯',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 29,
				level: 2,
				name: '右后大灯',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 30,
				level: 2,
				name: '右前叶子板',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 31,
				level: 2,
				name: '右后视镜',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 32,
				level: 2,
				name: '右前门',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 33,
				level: 2,
				name: '右后门',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 34,
				level: 2,
				name: '右后叶子板',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 35,
				level: 2,
				name: '尾箱盖',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 36,
				level: 2,
				name: '刹车灯',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 37,
				level: 2,
				name: '后挡风玻璃',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 38,
				level: 2,
				name: '后杠',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
		],
	},
	{
		id: 39,
		level: 1,
		name: '内饰检查',
		isExpand: false,
		type: 'interior',
		uploadTip: '上传异常处照片',
		rightText: '',
		children: [
			{
				id: 39,
				level: 2,
				name: '左前门饰板',
				isExpand: true,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 40,
				level: 2,
				name: '右前门饰板',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 41,
				level: 2,
				name: '左后门饰板',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 42,
				level: 2,
				name: '右后门饰板',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 43,
				level: 2,
				name: '中控饰板',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 44,
				level: 2,
				name: '后备箱',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 45,
				level: 2,
				name: '仪表盘',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 46,
				level: 2,
				name: '室内后视镜',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList2,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 47,
				level: 2,
				name: '前排室内灯光',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList8,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 48,
				level: 2,
				name: '后排室内灯光',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList8,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 49,
				level: 2,
				name: '氛围灯',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList8,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 50,
				level: 2,
				name: '前排音响',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList9,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 51,
				level: 2,
				name: '后排音响',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList9,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 52,
				level: 2,
				name: '主驾座椅',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList10,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 53,
				level: 2,
				name: '副驾座椅',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList10,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 54,
				level: 2,
				name: '中排座椅',
				isExpand: false,
				type: 'interior',
				requireChooseIfHas: true,
				isHas: 0, // 0.未选 1.有 2.无
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList10,
				isComplete: false,
				rightText: '',
			},
			{
				id: 55,
				level: 2,
				name: '后排座椅',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList10,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 56,
				level: 2,
				name: '驾驶位地板',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList10,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 57,
				level: 2,
				name: '副驾位地板',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList10,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 58,
				level: 2,
				name: '中排地板',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList10,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 59,
				level: 2,
				name: '后排地板',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList10,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 60,
				level: 2,
				name: '前排电器面板',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList11,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 61,
				level: 2,
				name: '后排电器面板',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList11,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 62,
				level: 2,
				name: '左前门开关',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList12,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 63,
				level: 2,
				name: '右前门开关',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList12,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 64,
				level: 2,
				name: '左后门开关',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList12,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 65,
				level: 2,
				name: '右后门开关',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList12,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 66,
				level: 2,
				name: '中控开关',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList12,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
		],
	},
	{
		id: 67,
		level: 1,
		name: '随车配件',
		isExpand: false,
		type: 'parts',
		rightText: '',
		children: [
			{
				id: 67,
				level: 2,
				name: '备胎',
				isExpand: true,
				type: 'parts',
				isHas: 0, // 0.未选 1.有 2.无
				isComplete: false,
				rightText: '',
			},
			{
				id: 68,
				level: 2,
				name: '工具包',
				isExpand: false,
				type: 'parts',
				isHas: 0, // 0.未选 1.有 2.无
				isComplete: false,
				rightText: '',
			},
			{
				id: 69,
				level: 2,
				name: '随车手册（车辆使用说明书）',
				isExpand: false,
				type: 'parts',
				isHas: 0, // 0.未选 1.有 2.无
				isComplete: false,
				rightText: '',
			},
			{
				id: 70,
				level: 2,
				name: '点烟器',
				isExpand: false,
				type: 'parts',
				isHas: 0, // 0.未选 1.有 2.无
				isComplete: false,
				rightText: '',
			},
			{
				id: 71,
				level: 2,
				name: '烟灰缸',
				isExpand: false,
				type: 'parts',
				isHas: 0, // 0.未选 1.有 2.无
				isComplete: false,
				rightText: '',
			},
			{
				id: 72,
				level: 2,
				name: '三脚架',
				isExpand: false,
				type: 'parts',
				isHas: 0, // 0.未选 1.有 2.无
				isComplete: false,
				rightText: '',
			},
			{
				id: 73,
				level: 2,
				name: '灭火器',
				isExpand: false,
				type: 'parts',
				isHas: 0, // 0.未选 1.有 2.无
				isComplete: false,
				rightText: '',
			},
			{
				id: 74,
				level: 2,
				name: '千斤顶',
				isExpand: false,
				type: 'parts',
				isHas: 0, // 0.未选 1.有 2.无
				isComplete: false,
				rightText: '',
			},
		],
	},
]

const pickup = [
	{
		id: 75,
		level: 1,
		name: '提车照片',
		isExpand: false,
		type: 'pickup',
		imageType: 2, // 1.单张 2.多张
		imgList: [],
		uploadTip: '添加提车照片',
		rightText: '',
		isComplete: false,
	},
]

export {
	validJSON,
	pickup,
} 