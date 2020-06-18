import React, { PureComponent } from 'react'
import { Card, Table, Modal, Button, message, Badge } from 'antd'
import request from '../../utils/request'
import { apis } from '../../utils/apis'

class BasicTable extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {}
	}
	params = {
		page: 1,
		pageSize: 10,
	}
	componentDidMount() {
		this.getData()
	}

	// 动态获取mock数据
	getData = () => {
		request
			.post(apis.getDataSource, {
				page: this.params.page,
				pageSize: this.params.pageSize,
			})
			.then((res) => {
				let data = res.data
				console.log(data)
				if (data.code === 200) {
					data.data.list.map((item, index) => {
						return (item.key = index)
					})
					this.setState({
						dataSource: data.data.list,
					})
				}
			})
			.catch((err) => {
				console.log(err)
			})
	}

	// 表格里面 无论是分页变化 还是排序变化 都是需要给他加一个onChange事件的（分页 排序 筛选 变化时触发）
	// 接收三个参数  分别是分页 过滤 排序
	handleChange = (pagination, filters, sorter) => {
		console.log('::' + sorter)
		this.setState({
			sortOrder: sorter.order, // sorter 返回是一个对象  .order  存储着升序降序的变量
		})
	}
	render() {
		const columns = [
			{
				title: 'id',
				key: 'id',
				width: 80, // 要想表头和内容是等宽的 给每一列指定宽度 没有宽度 表头和内容是没有办法对其的  隐藏bug
				dataIndex: 'id',
			},
			{
				title: '用户名',
				key: 'userName',
				width: 80,
				dataIndex: 'userName',
			},
			{
				title: '性别',
				key: 'sex',
				width: 80,
				dataIndex: 'sex',
				render(sex) {
					return sex === 1 ? '男' : '女'
				},
			},
			{
				title: '状态',
				key: 'state',
				width: 80,
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
				width: 80,
				dataIndex: 'interest',
				render(abc) {
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
				width: 120,
				dataIndex: 'birthday',
			},
			{
				title: '地址',
				key: 'address',
				width: 120,
				dataIndex: 'address',
			},
			{
				title: '早起时间',
				key: 'time',
				width: 80,
				dataIndex: 'time',
			},
		]
		const columns2 = [
			{
				title: 'id',
				key: 'id',
				width: 80,
				fixed: 'left', // 用来固定其中的某一列   固定到左边
				dataIndex: 'id',
			},
			{
				title: '用户名',
				key: 'userName',
				width: 80,
				fixed: 'left',
				dataIndex: 'userName',
			},
			{
				title: '性别',
				key: 'sex',
				width: 80,
				dataIndex: 'sex',
				render(sex) {
					return sex === 1 ? '男' : '女'
				},
			},
			{
				title: '状态',
				key: 'state',
				width: 80,
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
				width: 80,
				dataIndex: 'interest',
				render(abc) {
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
				key: 'birthday1',
				width: 120,
				dataIndex: 'birthday',
			},
			{
				title: '生日',
				key: 'birthday2',
				width: 120,
				dataIndex: 'birthday',
			},
			{
				title: '生日',
				key: 'birthday3',
				width: 120,
				dataIndex: 'birthday',
			},
			{
				title: '生日',
				key: 'birthday4',
				width: 120,
				dataIndex: 'birthday',
			},
			{
				title: '生日',
				key: 'birthday5',
				width: 120,
				dataIndex: 'birthday',
			},
			{
				title: '生日',
				key: 'birthday6',
				width: 120,
				dataIndex: 'birthday',
			},
			{
				title: '生日',
				key: 'birthday7',
				width: 120,
				dataIndex: 'birthday',
			},
			{
				title: '生日',
				key: 'birthday8',
				width: 120,
				dataIndex: 'birthday',
			},
			{
				title: '生日',
				key: 'birthday9',
				width: 120,
				dataIndex: 'birthday',
			},
			{
				title: '生日',
				key: 'birthday10',
				width: 120,
				dataIndex: 'birthday',
			},
			{
				title: '生日',
				key: 'birthday11',
				width: 120,
				dataIndex: 'birthday',
			},
			{
				title: '生日',
				key: 'birthday12',
				width: 120,
				dataIndex: 'birthday',
			},
			{
				title: '生日',
				key: 'birthday13',
				width: 120,
				dataIndex: 'birthday',
			},
			{
				title: '生日',
				key: 'birthday14',
				width: 120,
				dataIndex: 'birthday',
			},
			{
				title: '生日',
				key: 'birthday15',
				width: 120,
				dataIndex: 'birthday',
			},
			{
				title: '生日',
				key: 'birthday16',
				width: 120,
				dataIndex: 'birthday',
			},
			{
				title: '生日',
				key: 'birthday17',
				width: 120,
				dataIndex: 'birthday',
			},
			{
				title: '地址',
				key: 'address',
				width: 120,
				fixed: 'right',
				dataIndex: 'address',
			},
			{
				title: '早起时间',
				key: 'time',
				width: 80,
				fixed: 'right',
				dataIndex: 'time',
			},
		]
		const columns3 = [
			{
				title: 'id',
				key: 'id',
				dataIndex: 'id',
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
					return sex === 1 ? '男' : '女'
				},
			},
			{
				title: '年龄',
				key: 'age',
				dataIndex: 'age',
				sorter: (a, b) => {
					// sorter  指定你这一列是需要排序的 具体怎么排序 就需要单独处理了 方式和js  的排序非常类似  获取a b
					return a.age - b.age // a b  都是列的对象  通过列的对象它可以获取到年龄的字段 通过大于0  小于0 获取是降序 倒序 还是升序
				},
				sortOrder: this.state.sortOrder, // 同时需要指定sortOrder 指定你是升序还是降序  写一个动态变量 要不然每次他都是一样了
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
		const columns4 = [
			{
				title: 'id',
				dataIndex: 'id',
			},
			{
				title: '用户名',
				dataIndex: 'userName',
			},
			{
				title: '性别',
				dataIndex: 'sex',
				render(sex) {
					return sex === 1 ? '男' : '女'
				},
			},
			{
				title: '年龄',
				dataIndex: 'age',
			},
			{
				title: '状态',
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
				dataIndex: 'interest',
				render(abc) {
					// 这里没有是用箭头函数是因为 这边没有使用this指针 只是把这个值做一个返回  这个this  实际上是render 方法内置的this
					let config = {
						'1': <Badge status="success" text="成功" />, // badge 设置一些文本的状态 徽标
						'2': <Badge status="error" text="报错" />,
						'3': <Badge status="default" text="正常" />,
						'4': <Badge status="processing" text="进行中" />,
						'5': <Badge status="warning" text="警告" />,
					}
					return config[abc]
				},
			},
			{
				title: '生日',
				dataIndex: 'birthday',
			},
			{
				title: '地址',
				dataIndex: 'address',
			},
			{
				title: '操作', // 操作 他是没有列的   就没有dataIndex 直接render
				// 通过this 绑定对象  最好使用箭头函数的形式书写 render:()=> {}
				render: (text, item) => {
					// text  文本  item  整个一行所有字段都在里面 操作本身是没有对应的列的  text 肯定是空  取 要从item  里面取
					return (
						<Button
							size="small"
							onClick={(item) => {
								this.handleDelete(item)
							}}
						>
							删除
						</Button>
					) // 需要获取到删除对象的id的 // 一但传参 我们最好使用箭头函数来进行传参 不要直接取写  可能会出现问题
					// =>{} 必须通过大括号进行包裹一下 这样才能取执行方法体的内容 不加大括号实际上是一个return  把整个值return 回来了，这样是不对的，点击以后 我们想让 他去执行里面的方法
				},
			},
		]
		return (
			<div>
				<Card title="头部固定">
					<Table
						bordered
						columns={columns}
						dataSource={this.state.dataSource}
						pagination={false}
						scroll={{ y: 240 }} // 指定y 轴滚动 指定y轴滚动 给y 轴 定义一个高度240  这样他才能进行这种y轴 方向的滚动
					/>
				</Card>

				<Card title="左侧固定" style={{ margin: '10px 0' }}>
					<Table
						bordered
						columns={columns2}
						dataSource={this.state.dataSource}
						pagination={false}
						scroll={{ x: 2650 }} // 指定x 轴滚动  不能太大 也不能太小。 x 轴的值 要略大于我们总和的值 才能够实现滚动的效果
					/>
				</Card>

				<Card title="表格排序" style={{ margin: '10px 0' }}>
					<Table
						bordered // 排序 是我们本地排序  而不是服务器端排序
						columns={columns3}
						dataSource={this.state.dataSource}
						pagination={false}
						onChange={this.handleChange} // 表格里面 无论是分页变化 还是排序变化 都是需要给他加一个onChange事件的（分页 排序 筛选 变化时触发）
						// 接收三个参数  分别是分页 过滤 排序
					/>
				</Card>

				<Card title="操作按钮" style={{ margin: '10px 0' }}>
					<Table
						bordered
						columns={columns4}
						dataSource={this.state.dataSource}
						pagination={false}
					/>
				</Card>
			</div>
		)
	}
}

export default BasicTable
