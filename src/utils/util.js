export default {
	formatDate(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
		//正则替换对应的年月日
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(
				RegExp.$1,
				(date.getFullYear() + '').substr(4 - RegExp.$1.length)
			)
		}
		let o = {
			'M+': date.getMonth() + 1, // M+ 匹配 M 至少一次
			'd+': date.getDate(),
			'h+': date.getHours(),
			'm+': date.getMinutes(),
			's+': date.getSeconds(),
		}

		for (let k in o) {
			if (new RegExp(`(${k})`).test(fmt)) {
				let str = o[k] + ''
				fmt = fmt.replace(
					RegExp.$1,
					RegExp.$1.length === 1 ? str : padLeftZero(str)
				)
			}
		}
		return fmt
	},
}

function padLeftZero(str) {
	return ('00' + str).substr(str.length)
}
