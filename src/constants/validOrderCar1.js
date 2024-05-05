const statusList1 = [
	{id: 1, label: '核验通过'},
	{id: 2, label: '存在问题'},
]

const statusList2 = [
	{id: 1, label: '有'},
	{id: 2, label: '无'},
]

const validJSON = [
	{
		id: 1,
		level: 1,
		title: '车架号照片',
		name: '前挡风玻璃车架号照片',
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
		title: '轮胎检查',
		name: '轮胎信息',
		isExpand: false,
		type: 'tyre',
		uploadTip: '上传异常处照片',
		rightText: '',
		children: [
			{
				id: 2,
				level: 2,
				name: '轮胎',
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
				children: [
					{
						level: 3,
						name: '左前轮胎',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '右前轮胎',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '左后轮胎',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '右后轮胎',
						imgList: [],
						exceptionDesc: '',
					},
				]
			},
			{
				id: 3,
				level: 2,
				name: '轮毂',
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
				children: [
					{
						level: 3,
						name: '左前轮毂',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '右前轮毂',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '左后轮毂',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '右后轮毂',
						imgList: [],
						exceptionDesc: '',
					},
				],
			},
		],
	},
	{
		id: 3,
		level: 1,
		title: '外观检查',
		name: '外观检查',
		isExpand: false,
		type: 'appearance',
		uploadTip: '上传异常处照片',
		rightText: '',
		children: [
			{
				id: 5,
				level: 2,
				name: '前挡风玻璃',
				isExpand: true,
				type: 'appearance',
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
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
				children: [
					{
						level: 3,
						name: '左前杠',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '右前杠',
						imgList: [],
						exceptionDesc: '',
					},
				],
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
				statusList: statusList1,
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
				statusList: statusList1,
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
				statusList: statusList1,
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
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 19,
				level: 2,
				name: '大灯',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
				children: [
					{
						level: 3,
						name: '左前大灯',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '右前大灯',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '左后大灯',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '右后大灯',
						imgList: [],
						exceptionDesc: '',
					},
				],
			},
			{
				id: 21,
				level: 2,
				name: '叶子板',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
				children: [
					{
						level: 3,
						name: '左前叶子板',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '右前叶子板',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '左后叶子板',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '右后叶子板',
						imgList: [],
						exceptionDesc: '',
					},
				],
			},
			{
				id: 22,
				level: 2,
				name: '车门',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
				children: [
					{
						level: 3,
						name: '左前门',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '右前门',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '左后门',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '右后门',
						imgList: [],
						exceptionDesc: '',
					},
				],
			},
			{
				id: 23,
				level: 2,
				name: '后视镜',
				isExpand: false,
				type: 'appearance',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
				children: [
					{
						level: 3,
						name: '左后视镜',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '右后视镜',
						imgList: [],
						exceptionDesc: '',
					},
				],
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
				statusList: statusList1,
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
				statusList: statusList1,
				isComplete: false,
				rightText: '',
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
				statusList: statusList1,
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
				statusList: statusList1,
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
				statusList: statusList1,
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
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
		],
	},
	{
		id: 4,
		level: 1,
		title: '内饰检查',
		name: '内饰检查',
		isExpand: false,
		type: 'interior',
		uploadTip: '上传异常处照片',
		rightText: '',
		children: [
			{
				id: 39,
				level: 2,
				name: '车门饰板',
				isExpand: true,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
				children: [
					{
						level: 3,
						name: '左前门饰板',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '右前门饰板',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '左后门饰板',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '右后门饰板',
						imgList: [],
						exceptionDesc: '',
					},
				],
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
				statusList: statusList1,
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
				statusList: statusList1,
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
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 47,
				level: 2,
				name: '室内灯光',
				isExpand: false,
				type: 'interior',
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
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
			{
				id: 50,
				level: 2,
				name: '音响',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
				children: [
					{
						level: 3,
						name: '前排音响',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '后排音响',
						imgList: [],
						exceptionDesc: '',
					},
				],
			},
			{
				id: 52,
				level: 2,
				name: '座椅',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
				children: [
					{
						level: 3,
						name: '主驾驶座椅',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '副驾驶座椅',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '中排座椅',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '后排座椅',
						imgList: [],
						exceptionDesc: '',
					},
				],
			},
			{
				id: 56,
				level: 2,
				name: '室内地板',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
				children: [
					{
						level: 3,
						name: '驾驶位地板',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '副驾驶位地板',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '中排地板',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '后排地板',
						imgList: [],
						exceptionDesc: '',
					},
				],
			},
			{
				id: 60,
				level: 2,
				name: '电器面板',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
				children: [
					{
						level: 3,
						name: '前排电器面板',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '后排电器面板',
						imgList: [],
						exceptionDesc: '',
					},
				],
			},
			{
				id: 62,
				level: 2,
				name: '车门开关',
				isExpand: false,
				type: 'interior',
				status: 0, // 0.未选 1.正常 2.异常
				requireImg: true,
				imageType: 2, // 1.单张 2.多张
				imgList: [],
				exceptionDesc: '',
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
				children: [
					{
						level: 3,
						name: '左前门开关',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '右前门开关',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '左后门开关',
						imgList: [],
						exceptionDesc: '',
					},
					{
						level: 3,
						name: '右后门开关',
						imgList: [],
						exceptionDesc: '',
					},
				],
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
				statusList: statusList1,
				isComplete: false,
				rightText: '',
				isHas: 1, // 0.未选 1.有 2.无
			},
		],
	},
	{
		id: 5,
		level: 1,
		title: '随车配件',
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
				status: 0, // 0.未选 1.正常 2.异常
				statusList: statusList2,
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
				status: 0, // 0.未选 1.正常 2.异常
				statusList: statusList2,
				isComplete: false,
				rightText: '',
			},
			{
				id: 69,
				level: 2,
				name: '车辆使用说明书',
				isExpand: false,
				type: 'parts',
				isHas: 0, // 0.未选 1.有 2.无
				status: 0, // 0.未选 1.正常 2.异常
				statusList: statusList2,
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
				status: 0, // 0.未选 1.正常 2.异常
				statusList: statusList2,
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
				status: 0, // 0.未选 1.正常 2.异常
				statusList: statusList2,
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
				status: 0, // 0.未选 1.正常 2.异常
				statusList: statusList2,
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
				status: 0, // 0.未选 1.正常 2.异常
				statusList: statusList2,
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
				status: 0, // 0.未选 1.正常 2.异常
				statusList: statusList2,
				isComplete: false,
				rightText: '',
			},
		],
	},
]

export {
	validJSON,
}