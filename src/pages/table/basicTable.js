import React from 'react'
import { Card, Table, Modal, Button, message } from 'antd'
import request from '../../utils/request'
import { apis } from '../../utils/apis'
import Utils from '../../utils/util'

const dataSource = []

export default class Basic extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			dataSource2: [],
		}
	}

	params = {
		page: 1,
		pageSize: 10,
	}

	componentWillMount() {
		this.setState({
			params: 1,
			dataSource: dataSource.map((item, index) => {
				item.key = 'tab' + index
				return item
			}),
		})
		this.getData()
	}

	/**
	 * record: 当前行数据
	 */
	onRowClick = (record, index) => {}

	onSelectCheckChange = (selectedRowKeys, selectedRows) => {}

	// 执行多行删除操作
	handleDelete = () => {}

	getData() {
		let _this = this
		request
			.post(apis.getDataSource, {
				page: this.params.page,
				pageSize: this.params.pageSize,
			})
			.then((res) => {
				let data = res.data
				if (data.code === 200) {
					data.data.list.map((item, index) => {
						return (item.key = index)
					})
					this.setState({
						dataSource2: data.data.list,
						selectedRowKeys: [], // 初始化以后 把selectedRowKeys selectedRows 重置一下 否则他还会把这个状态 带到表格里面去
						selectedRows: null,
						pagination: Utils.pagination(res, (page, pageSize) => {
							_this.params.page = page
							_this.params.pageSize = pageSize
							_this.getData()
						}),
					})
				}
			})
			.catch((err) => {
				console.log(err)
			})
	}

	onRowClick = (record, index) => {
		console.log(index)
		let selectKey = [index] // 获取selectKey 固定格式  获取index 索引  这为什么使用数组呢  因为他是个单选  单选理论上就是一个值  多选话就是一个数组了，这里主要是考虑格式规范
		Modal.info({
			title: '信息',
			content: `用户名：${record.userName},用户爱好：${record.interest}`,
		})
		this.setState({
			selectedRowKeys: selectKey, // 获取选中这一行的key 值
			selectedItem: record, // 存储起来获取用户信息
		})
	}

	// 多选执行删除动作
	handleDelete = () => {
		let rows = this.state.selectedRows
		let ids = [] // 获取id 的目的  比如删除操作可能会需要很多的id
		rows.map((item) => {
			return ids.push(item.id)
		})
		Modal.confirm({
			title: '删除提示',
			content: `您确定要删除这些数据吗？${ids.join(',')}`,
			onOk: () => {
				message.success('删除成功')
				this.getData()
			},
		})
	}

	render() {
		const columns = [
			//
			{
				title: 'id', // 表格头的显示
				key: 'id',
				dataIndex: 'id', // 定义表格的字段
			},
			{
				title: '用户名',
				key: 'userName',
				dataIndex: 'userName',
			},
			{
				title: '性别',
				key: 'sex',
				dataIndex: 'sex',
				render(sex) {
					// 把列表展示的性别1 换成男和女
					return sex === 1 ? '男' : '女' // 用来处理当前的字段
				},
			},
			{
				title: '状态',
				key: 'state',
				dataIndex: 'state',
				render(state) {
					let config = {
						'1': '咸鱼一条',
						'2': '风华浪子',
						'3': '北大才子',
						'4': '百度FE',
						'5': '创业者',
					}
					return config[state]
				},
			},
			{
				title: '爱好',
				key: 'interest',
				dataIndex: 'interest',
				render(abc) {
					// 参数名字自己起  不一定要和字段同名
					// 对interest 这个字段 做一个字典的映射 这个称之为字典
					// 可以把常用的字典定义到字典文件里面去  写一个字典的js  把这些对象全部封装进去，这里是使用统一的公共机制进行调用。
					let config = {
						'1': '游泳',
						'2': '打篮球',
						'3': '踢足球',
						'4': '跑步',
						'5': '爬山',
						'6': '骑行',
						'7': '桌球',
						'8': '麦霸',
					}
					return config[abc]
				},
			},
			{
				title: '生日',
				key: 'birthday',
				dataIndex: 'birthday',
			},
			{
				title: '地址',
				key: 'address',
				dataIndex: 'address',
			},
			{
				title: '早起时间',
				key: 'time',
				dataIndex: 'time',
			},
		]
		const selectedRowKeys = this.state.selectedRowKeys
		const rowSelection = {
			// 单选按钮 点击这一行要把当前这一行的信息存储下来 而且需要获取当前用户的id 或者说获取到当前用户的姓名
			type: 'radio',
			selectedRowKeys, // 指定选中项的key 数组需要和onChange进行配合   数组类型
			// 单选  我们已经加了  onRow 点击每一行去给他选中 ，就没给他添加 onChange 事件（我们按钮  从第一个选中 到第二个选中发生了变化 所以需要onChange事件）
		}
		const rowCheckSelection = {
			type: 'checkbox',
			selectedRowKeys, // 告诉table  你当前选中了哪些行  他会把你的按钮勾选中 同时这边需要添加一个onChange 事件
			onChange: (selectedRowKeys, selectedRows) => {
				// 作用 ：每一个checkbo框上面添加事件 上下变化了以后去给他一个记录
				// selectedRowKeys  当前选中了哪些行 ,selectedRows  你选中了哪些行（是一个对象 是一个综合型对象 就把你选中的那些行对象 都列出来了）
				this.setState({
					selectedRowKeys, // 必须的 选中了那选文本框  复选框
					selectedRows,
				})
			},
		}
		return (
			<div>
				<Card title="基础表格">
					<Table
						columns={columns}
						bordered={true}
						dataSource={this.state.dataSource}
						pagination={false}
					/>
				</Card>
				<Card
					title="动态数据渲染表格-Mock"
					style={{ margin: '10px 0' }}
				>
					<Table
						bordered
						columns={columns}
						dataSource={this.state.dataSource2}
						pagination={false}
					/>
				</Card>
				<Card title="Mock-单选" style={{ margin: '10px 0' }}>
					<Table
						bordered
						rowSelection={rowSelection} // 控制单选还是多选
						onRow={(record, index) => {
							// onRow  设置行 （选中某一行去选中单选按钮）通过onRow  设置 控制我们去点击某一行
							return {
								onClick: () => {
									this.onRowClick(record, index) // onRowClick 主要是用来把我们当前的值给存储起来
								},
							}
						}}
						columns={columns}
						dataSource={this.state.dataSource2}
						pagination={false}
					/>
				</Card>
				<Card title="Mock-多选" style={{ margin: '10px 0' }}>
					<div style={{ marginBottom: 10 }}>
						<Button onClick={this.handleDelete}>删除</Button>
					</div>
					<Table
						bordered
						rowSelection={rowCheckSelection} // 控制多选
						columns={columns}
						dataSource={this.state.dataSource2}
						pagination={false}
					/>
				</Card>
				<Card title="Mock-表格分页" style={{ margin: '10px 0' }}>
					<Table
						bordered
						columns={columns}
						dataSource={this.state.dataSource2}
						pagination={this.state.pagination} // 分页 就不应该设置false 了，应该设置为true. 推荐大家不要去加载pagination组件 加载也可以
						// 我们可以定义一个组件的方法， 需要做一些 项目公共机制的构建 类似项目的工程化 （封装分页的公共机制）
					/>
				</Card>
			</div>
		)
	}
}
