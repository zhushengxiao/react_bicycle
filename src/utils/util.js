import React from 'react' // 凡是我们使用到react 的语法都必须引入react
import { Select } from 'antd'
const Option = Select.Option

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

	// 分页
	pagination(res, callback) {
		// res: 当前接口返回的值传递过去   callback ：主要是用于 当前页码换的时候  可以回调掉到下一次
		return {
			// 页码改变的回调，参数是改变后的页码及每页条数	Function(page, pageSize) （左右箭头 和 快速跳转至某一页的回调）
			onChange: (page, pageSize) => {
				callback(page, pageSize)
			},
			showTotal: () => {
				return `共${res.data.total}条`
			},
			current: res.data.page,
			pageSize: res.data.pageSize,
			total: res.data.total,
			showSizeChanger: true, // 是否可以改变pageSize  boolean
			onShowSizeChange: (page, pageSize) => {
				//pageSize 变化的回调 Function(current, size)
				callback(page, pageSize)
			},
			showQuickJumper: true, //是否可以快速跳转至某页 boolean | { goButton: ReactNode }
		}
	},
	// 搜索表单封装 -> 遍历formList 的list 变为OptionList，封装
	getOptionList(data) {
		// data -> 是一个数组
		if (!data) {
			return []
		}
		let options = [] //[<Option value="0" key="all_key">全部</Option>];  默认有一个全部的选项 key 不重复即可
		data.map((item) => {
			// 箭头函数 一层就是renturn  加了大括号就是执行了。直接写个值 就是直接renturn  回去。
			return options.push(
				<Option value={item.id} key={item.id}>
					{item.name}
				</Option>
			) // {item.name} js对象用大括号去包住他 这里也需要使用大括号
		})
		return options // 将结果  必须要return  出去   否则 接收不到
	},
	// 隐藏手机号中间4位
	formatPhone(phone) {
		phone += ''
		return phone.replace(/(\d{3})\d*(\d{4})/g, '$1****$2')
	},
	// 格式化公里（eg:3000 = 3公里）
	formatMileage(mileage, text) {
		if (!mileage) {
			return 0
		}
		if (mileage >= 1000) {
			text = text || ' km'
			return Math.floor(mileage / 100) / 10 + text
		} else {
			text = text || ' m'
			return mileage + text
		}
	},

	// 隐藏身份证号中11位
	formatIdentity(number) {
		number += ''
		return number.replace(/(\d{3})\d*(\d{4})/g, '$1***********$2')
	},

	/**
	 * ETable 行点击通用函数
	 * @param {*选中行的索引} selectedRowKeys
	 * @param {*选中行对象} selectedItem
	 */
	updateSelectedItem(selectedRowKeys, selectedRows, selectedIds) {
		if (selectedIds) {
			this.setState({
				selectedRowKeys,
				selectedIds: selectedIds,
				selectedItem: selectedRows,
			})
		} else {
			this.setState({
				selectedRowKeys,
				selectedItem: selectedRows,
			})
		}
	},
}

function padLeftZero(str) {
	return ('00' + str).substr(str.length)
}
