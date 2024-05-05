export const formatTenThousandNumber= (num, unit1='万', unit2='元') => {
	let res = ''
	
	if (num || num == 0) {
		if (num < 10000) {
			res = num + unit2
		} else {
			if (num % 10000 === 0) {
				res = num / 10000 + unit1
			} else {
				if (num % 1000 === 0) {
					res = (num/10000).toFixed(1) + unit1
				} else {
					res = (num/10000).toFixed(2) + unit1
				}
			}
		}
	}
	
	return res
}

/**
 * 千分位格式化
 * @param n number
 */
export function formatThousandNumber(n) {
    n = Math.floor(n) // 只考虑整数
 
    const s = n.toString()
    const arr = s.split('').reverse()
    return arr.reduce((prev, val, index) => {
        if (index % 3 === 0) {
            if (prev) {
                return val + ',' + prev
            } else {
                return val
            }
        } else {
            return val + prev
        }
    }, '')
}

// 保证金
export function getDeposit(num) {
	if (!num) {
		if (num === 0) {
			return '减免保证金'
		} else {
			return '-'
		}
	} else {
		return `￥${formatThousandNumber(num)}`
	}
}

export function getImageInfo(src, ratio = 0.75) {
	return new Promise((resolve) => {
		uni.getImageInfo({
			src,
			success: (image) => {
				console.log('getImageInfo', image)
				let res = src
				if (image.height > image.width) {
					const w = image.width
					const h = Math.floor(image.width * ratio)
					const x = 0
					const y = Math.floor((image.height - h) / 2)
					res = `${src}?x-oss-process=image/crop,x_${x},y_${y},w_${w},h_${h}`
				}
				console.log('getImageInfo', res)
				resolve(res)
			},
			fail: (err) => {
				console.log(err)
				resolve('')
			}
		})
	})
}

export const formatDate = (time) => {
	// 2023-11-16 15:03:31
	let year = time.slice(0, 4)
	let month = time.slice(5, 7)
	let date = time.slice(8, 10)
	let hour = ''
	let minute = ''
	let second = ''
	
	if(time.length > 10) {
		hour = time.slice(11, 13)
		minute = time.slice(14, 16)
		second = time.slice(17, 19)
	}
	
	return {
		year,
		month,
		date,
		hour,
		minute,
		second,
	}
}

export const formatTimeStamp = (timeStamp) => {
	const dateObj = new Date(timeStamp)
	const year = dateObj.getFullYear()
	const month = ((dateObj.getMonth() + 1)+'').padStart(2, '0')
	const date = ((dateObj.getDate() + 1)+'').padStart(2, '0')
	const hour = ((dateObj.getHours() + 1)+'').padStart(2, '0')
	const minute = ((dateObj.getMinutes() + 1)+'').padStart(2, '0')
	const second = ((dateObj.getSeconds() + 1)+'').padStart(2, '0')
	
	return {
		year,
		month,
		date,
		hour,
		minute,
		second,
	}
}

export const countdown = (timeStamp) => {
	let signToCancelTimeStr = ''
	if (timeStamp > 0) {
		const oneH = 60 * 60 * 1000
		const h = Math.floor(timeStamp / oneH) + ''
		const m = Math.floor((timeStamp % oneH) / (60 * 1000)) + ''
		signToCancelTimeStr = h.padStart(2, '0') + ':' + m.padStart(2, '0')
	} else {
		signToCancelTimeStr = ''
	}
	
	return signToCancelTimeStr
}
