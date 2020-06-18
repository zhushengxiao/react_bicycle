/*
 * @Author: wudongxue
 * @Date: 2019-12-24
 * @Last Modified by: wudongxue
 * @Last Modified time: 2019-12-24
 */

// 本文件用于初始化网络请求，无需更改 axios的配置以及拦截器

import axios from 'axios'
import { message } from 'antd'

const baseApi = 'http://rap2api.taobao.org/app/mock/240246' //默认路径，这里也可以使用env来判断环境

//使用create方法创建axios示例
const service = axios.create({
	baseURL: baseApi,
	timeout: 60000, // 请求超时时间
	responseType: 'json',
	headers: {},
})

//request拦截器interceptors
service.interceptors.request.use(
	(config) => {
		if (config.url.indexOf('/app/mock') > 0) {
			config.headers = {
				'Content-Type': 'application/json;charset=UTF-8',
			}
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

// respone拦截器
service.interceptors.response.use(
	(response) => {
		const result = response.data
		// 业务失败，需要跳转到404页面
		if (
			result.code !== '0' &&
			result.code !== 0 &&
			result.state !== '200' &&
			result.state !== 200 &&
			result.statusCode !== '200' &&
			result.statusCode !== 200 &&
			result.code !== '200' &&
			result.code !== 200 &&
			result.status !== '200' &&
			result.status !== 200 &&
			result.code !== '2000' &&
			result.code !== 2000
		) {
			message.error(result.msg ? result.msg : result.message)
			return Promise.resolve(result)
		}
		return response
	},
	(error) => {
		console.log('TCL: error', error)
		const msg = error.Message !== undefined ? error.Message : ''
		message.error(`网络连接失败 ${+msg}`)
		return Promise.reject(error)
	}
)

export default service
