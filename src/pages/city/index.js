import React from 'react'
import { Card, Button, Table, Form, Select, Modal, message } from 'antd'
import Utils from '../../utils/util'
import axios from '../../axios/index'
import { apis } from '../../utils/apis'

const FormItem = Form.Item
const Option = Select.Option

export default class City extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			list: [],
			isShowOpenCity: false, // 定义弹框默认隐藏
		}
	}
	params = {
		page: 1,
		pageSize: 10,
	}

	componentDidMount() {
		this._requestList()
	}

	_requestList = () => {
		let _this = this
		axios
			.ajax({
				url: apis.getOpenCity,
				method: 'post',
				data: this.params,
				isShowLoading: true,
			})
			.then((res) => {
				let data = res.data

				if (data.code === 200) {
					data.data.list.map((item, index) => {
						// antd 规范里面要求每个组件最好都要有一个key 值，有了这个key 值 我们的页面呢就会少很多的警告
						return (item.key = index) //一定要记得return   return之后才能返回一个全新的对象，不return  实际上还是返回的老的
					})

					this.setState({
						list: data.data.list,
						pagination: Utils.pagination(res, (page, pageSize) => {
							// res: 当前接口返回的值传递过去   callback ：主要是用于 当前页码换的时候  可以回调掉到下一次
							_this.params.page = page // 参数页码的复制
							_this.params.pageSize = pageSize
							_this._requestList() // 重新请求列表
						}),
					})
				}
			})
			.catch((err) => {
				console.log(err)
			})
	}

	// 接收BaseForm 返回值
	handleFilter = (values) => {
		// console.log(values, "11")
		this.params = {
			page: this.params.page,
			pageSize: this.params.pageSize,
			city_id: values.city_id,
			mode: values.mode,
			op_mode: values.op_mode,
			auth_status: values.auth_status,
		}

		this._requestList()
	}

	/**
	 * 开通新城市
	 */
	handleOpenCity = () => {
		this.setState({
			// 所有状态的变化都必须要通过setState  方法来进行改变
			isShowOpenCity: true,
		})
	}

	// 开通城市 弹框  提交按钮
	handleSubmit = () => {
		let cityInfo = this.cityForm.props.form.getFieldsValue() // 通过对象去取form 里面的getFieldsValue 值
		axios
			.ajax({
				url: apis.cityOpenSubmit,
				method: 'post',
				data: cityInfo,
				isShowLoading: false,
			})
			.then((res) => {
				let data = res.data
				if (data.code === 200) {
					message.success('开通成功')
					this.setState({
						isShowOpenCity: false,
					})
					this._requestList()
				}
			})
			.catch((err) => {
				console.log(err)
			})
	}

	render() {
		const columns = [
			{
				title: '城市ID',
				dataIndex: 'id',
			},
			{
				title: '城市名称',
				dataIndex: 'name',
			},
			{
				title: '用车模式',
				dataIndex: 'mode',
				render(mode) {
					return mode === 1 ? '停车点' : '禁停区'
				},
			},
			{
				title: '营运模式',
				dataIndex: 'op_mode',
				render(op_mode) {
					// 可以自定义数据字典
					return op_mode === 1 ? '自营' : '加盟'
				},
			},
			{
				title: '授权加盟商',
				dataIndex: 'franchisee_name',
			},
			{
				title: '城市管理员',
				dataIndex: 'city_admins', // 如果他的对象是一个数组是不能进行渲染的  必须要进行处理，不能直接去渲染一个非普通类型的  ，比如一个object 对象，或者一个数组 ，或者一个function这样复杂的数据类型
				render(arr) {
					// 通过 render 进行处理   arr: 就是city_admins 这个字段
					return arr
						.map((item) => {
							return item.user_name //  只有return  才能拿到这个值
						})
						.join(',') // 通过join拼接 得到一个全新的字符串的形式  数组独有的方法 把数组连接起来 得到一个全新的字符串
				},
			},
			{
				title: '城市开通时间',
				dataIndex: 'open_time',
			},
			{
				title: '操作时间',
				dataIndex: 'update_time',
				render: Utils.formateDate,
			},
			{
				title: '操作人',
				dataIndex: 'sys_user_name',
			},
		]
		return (
			<div>
				<Card>
					<FilterForm filterSubmit={this.handleFilter} />
				</Card>
				<Card>
					<Button type="primary" onClick={this.handleOpenCity}>
						开通城市
					</Button>
				</Card>
				<div className="ant-table-contentWrap">
					<Table
						bordered={true}
						columns={columns}
						dataSource={this.state.list}
						pagination={this.state.pagination}
					/>
				</div>
				<Modal
					title="开通城市" // 弹框标题
					visible={this.state.isShowOpenCity} // 控制弹框显示隐藏
					onCancel={() => {
						// 触发取消事件
						this.setState({
							isShowOpenCity: false,
						})
					}}
					onOk={this.handleSubmit} // 点击确定 进行掉用接口
				>
					{
						// 在弹框里面嵌套表单
						// 获取表单里面的值 我需要在表单里面再去添加一个属性 否则没有办法去使用的 wrappedComponentRef
						// vue 开发中我们会给他定义一个ref 然后通过ref  获取表单里面的值 ，wrappedComponentRef等同
						//相当于给他起一个这个变量，方便我们通过这种方式去获取
						// wrappedComponentRef 接收一个回调 这个inst 参数是可以改变的，把对象保存在cityForm 里面，这样就可以通过cityForm去取值
					}
					<OpenCityForm
						wrappedComponentRef={(inst) => {
							this.cityForm = inst
						}}
					/>
				</Modal>
			</div>
		)
	}
}

class FilterForm extends React.Component {
	// 提交表单
	handleSearch = (e) => {
		e.preventDefault()
		this.props.form.validateFields((err, values) => {
			this.props.filterSubmit(values)
		})
	}

	// 重置表单按钮
	handleReset = () => {
		this.props.form.resetFields()
	}

	render() {
		const { getFieldDecorator } = this.props.form
		return (
			<Form layout="inline" onSubmit={this.handleSearch}>
				<FormItem label="城市">
					{getFieldDecorator('city_id')(
						<Select
							style={{ width: 200 }}
							placeholder="Select"
							allowClear
						>
							<Option value="全部">全部</Option>
							<Option value="北京市">北京市</Option>
							<Option value="天津市">天津市</Option>
							<Option value="深圳市">深圳市</Option>
						</Select>
					)}
				</FormItem>
				<FormItem label="用车模式">
					{getFieldDecorator('mode')(
						<Select
							style={{ width: 200 }}
							placeholder="Select"
							allowClear
						>
							<Option value="全部">全部</Option>
							<Option value="指定停车点模式">
								指定停车点模式
							</Option>
							<Option value="禁停区模式">禁停区模式</Option>
						</Select>
					)}
				</FormItem>
				<FormItem label="营运模式">
					{getFieldDecorator('op_mode')(
						<Select
							style={{ width: 200 }}
							placeholder="Select"
							allowClear
						>
							<Option value="全部">全部</Option>
							<Option value="自营">自营</Option>
							<Option value="加盟">加盟</Option>
						</Select>
					)}
				</FormItem>
				<FormItem label="加盟商授权状态">
					{getFieldDecorator('auth_status')(
						<Select
							style={{ width: 200 }}
							placeholder="Select"
							allowClear
						>
							<Option value="全部">全部</Option>
							<Option value="已授权">已授权</Option>
							<Option value="未授权">未授权</Option>
						</Select>
					)}
				</FormItem>
				<FormItem>
					<Button
						type="primary"
						style={{ marginRight: '20px' }}
						htmlType="submit"
					>
						查询
					</Button>
					<Button onClick={this.handleReset}>重置</Button>
				</FormItem>
			</Form>
		)
	}
}

FilterForm = Form.create({})(FilterForm)

class OpenCityForm extends React.Component {
	render() {
		const formItemLayout = {
			labelCol: {
				span: 5,
			},
			wrapperCol: {
				span: 19,
				// style={{ width: 100 }}可以通过控制表单的宽度控制表单的长度，也可以通过调整wrapperCol：{span:10}
			},
		}
		const { getFieldDecorator } = this.props.form // 辅助性帮助我们去做 双向数据绑定功能的   自动帮助我们去封装 我们就不需要考虑我们点击的是哪一项了
		return (
			<Form layout="horizontal" {...formItemLayout}>
				<FormItem label="选择城市">
					{
						getFieldDecorator('city_id', {
							initialValue: '全部', // 初始化值
						})(
							<Select style={{ width: 200 }} allowClear>
								<Option value="">全部</Option>
								<Option value="北京市">北京市</Option>
								<Option value="天津市">天津市</Option>
							</Select>
						)
						// 框架的value 值是必须要加上的。{...formItemLayout}如果不加，label 和表单就会都占24列，因为我们指定了layout="horizontal"
					}
				</FormItem>
				<FormItem label="营运模式">
					{getFieldDecorator('op_mode', {
						initialValue: '全部',
					})(
						<Select style={{ width: 200 }} allowClear>
							<Option value="">全部</Option>
							<Option value="自营">自营</Option>
							<Option value="加盟">加盟</Option>
						</Select>
					)}
				</FormItem>
				<FormItem label="用车模式">
					{getFieldDecorator('use_mode', {
						initialValue: '全部',
					})(
						<Select style={{ width: 200 }} allowClear>
							<Option value="">全部</Option>
							<Option value="指定停车点">指定停车点</Option>
							<Option value="禁停区">禁停区</Option>
						</Select>
					)}
				</FormItem>
			</Form>
		)
	}
}
OpenCityForm = Form.create({})(OpenCityForm)
