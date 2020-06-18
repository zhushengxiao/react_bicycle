import JsonP from 'jsonp'
import axios from 'axios'
import { Modal } from 'antd'

export default class Axios {
	static jsonp(option) {
		return new Promise((resolve, reject) => {
			JsonP(
				option.url,
				{
					param: 'callback',
				},
				function (err, response) {
					if (response.status === 'success') {
						resolve(response)
					} else {
						reject(response.message)
					}
				}
			)
		})
	}

	/**
	 * 封装请求
	 * @param {object} option 参数
	 * @param { string } option.url 请求 URL
	 * @param {string='GET'} option.method
	 * @param {object} option.data 请求参数
	 */
	static ajax(option) {
		let loading = document.getElementById('ajaxLoading')
		if (option.data && option.data.isShowLoading !== false) {
			loading.style.display = 'block'
		}

		return new Promise((resolve, reject) => {
			let baseApi =
				'https://www.easy-mock.com/mock/5a7278e28d0c633b9c4adbd7/api'

			axios({
				url: option.url,
				method: option.method || 'GET',
				baseURL: baseApi,
				timeout: 5000,
				params: (option.date && option.date.params) || '',
			}).then((response) => {
				if (option.data && option.data.isShowLoading !== false) {
					loading.style.display = 'none'
				}

				if (response.status * 1 === 200) {
					let res = response.data
					if (res.code * 1 === 0) {
						resolve(res)
					} else {
						Modal.info({
							title: '提示',
							content: res.msg,
						})
					}
				} else {
					reject(response.data)
				}
			})
		})
	}
}
