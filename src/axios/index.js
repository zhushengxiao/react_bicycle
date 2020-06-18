import JsonP from 'jsonp'
import Utils from '../utils/util'
import request from '../utils/request'

export default class Axios {
	//针对表格查询的方法 没办法直接使用下方的ajax  查询是需要对业务逻辑进行处理的，所以不能够直接调用ajax,
	//因为下方是对所有请求的一个拦截，不会对业务代码进行处理，只会说对一些状态值进行判断和拦截
	// 请求table列表 -> 带分页的表格  使用的方法
	static getPagTabList(_this, url, params) {
		this.ajax({
			url,
			method: 'post',
			data: params,
			isShowLoading: true,
		}).then((res) => {
			let data = res.data
			console.log(data)
			let result = data.data ? data.data : data.result
			if (data && result) {
				result.list.map((item, index) => {
					// antd 规范里面要求每个组件最好都要有一个key 值，有了这个key 值 我们的页面呢就会少很多的警告
					item.key = index
					return item //一定要记得return   return之后才能返回一个全新的对象，不return  实际上还是返回的老的
				})
				_this.setState({
					list: result.list,
					pagination: Utils.pagination(res, (page, pageSize) => {
						// res: 当前接口返回的值传递过去   callback ：主要是用于 当前页码换的时候  可以回调掉到下一次
						_this.params.page = page // 参数页码的复制
						_this.params.pageSize = pageSize
						_this.requestList() // 重新请求列表
					}),
				})
			}
		})
	}

	//公共机制 axios
	static ajax(options) {
		// 本次核心的一个模块  作为所有请求的一个入口
		let loading
		if (options.isShowLoading && options.isShowLoading !== false) {
			loading = document.getElementById('ajaxLoading')
			loading.style.display = 'block'
		}
		return new Promise((resolve, reject) => {
			let method = options.method ? options.method : 'post'
			request[method](options.url, options.data)
				.then((res) => {
					if (
						options.isShowLoading &&
						options.isShowLoading !== false
					) {
						loading = document.getElementById('ajaxLoading')
						loading.style.display = 'none'
					}
					resolve(res)
				})
				.catch((err) => {
					// 防止页面一直卡顿在Loading  不能进行点击
					if (
						options.isShowLoading &&
						options.isShowLoading !== false
					) {
						loading = document.getElementById('ajaxLoading')
						loading.style.display = 'none'
					}
					reject(err)
				})
		})
	}
}
