import React, { PureComponent } from 'react'
import {
	Card,
	Button,
	Form,
	Input,
	Select,
	Radio,
	Modal,
	DatePicker,
} from 'antd'
import axios from '../../axios'
import Utils from '../../utils/util'
import { apis } from '../../utils/apis'
import ETable from '../../components/ETable'
import Moment from 'moment'
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group // 单选按钮的组
const { confirm } = Modal

export default class User extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			list: [],
			loading: false,
		}
	}

	componentDidMount() {
		this.requestList()
	}

	requestList = () => {
		let _this = this
		axios
			.ajax({
				url: apis.StaffManageList,
				method: 'post',
				data: this.params,
				isShowLoading: true,
			})
			.then((res) => {
				let data = res.data

				if (data.code === 200) {
					data.result.list.map((item, index) => {
						// antd 规范里面要求每个组件最好都要有一个key 值，有了这个key 值 我们的页面呢就会少很多的警告
						return (item.key = index) //一定要记得return   return之后才能返回一个全新的对象，不return  实际上还是返回的老的
					})
					this.setState({
						list: data.result.list,
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

	// 操作员工
	handleOperator = (type) => {
		let item = this.state.selectedItem // 获取表格选中项
		if (type === 'create') {
			this.setState({
				// 实现了三个动态的变量
				title: '创建员工',
				isVisible: true,
				type,
			})
		} else if (type === 'edit' || type === 'detail') {
			if (!item) {
				Modal.info({
					title: '信息',
					content: '请选择一个用户',
				})
				return
			}
			this.setState({
				title: type === 'edit' ? '编辑员工' : '员工详情',
				isVisible: true,
				userInfo: item, // userInfo  需要在表单里面进行传递
				type,
			})
		} else if (type === 'delete') {
			if (!item) {
				Modal.info({
					title: '信息',
					content: '请选择一个用户',
				})
				return
			}
			confirm({
				title: '确认',
				content: '确定要删除此用户吗？',
				onOk: () => {
					axios
						.ajax({
							url: apis.userDelete,
							method: 'post',
							data: {
								user_id: item.id,
							},
						})
						.then((res) => {
							if (res.data.code === 200) {
								this.setState({
									isVisible: false,
									selectedRowKeys: [],
									selectedItem: null,
								})
								this.requestList() // 删除成功  重新获取 列表进行展示
							}
						})
				},
				onCancel() {},
			})
		}
	}

	// 创建员工提交
	handleSubmit = () => {
		this.setState({ loading: true })
		let type = this.state.type
		let data = this.userForm.props.form.getFieldsValue() // this.userForm 是我们整个form 的对象
		// .props 获取整个对象外面的值
		// .form 获取表单对象
		axios
			.ajax({
				url: type === 'create' ? apis.userAdd : apis.userEdit,
				method: 'post',
				data: {
					...data,
				},
			})
			.then((res) => {
				if (res.data.code === 200) {
					this.setState({
						isVisible: false,
						userInfo: '', // 防止点完编辑和查看后  在去点击添加 表单里面被带入数据
						selectedRowKeys: [], // 清空按钮的选中状态
						selectedItem: null,
						loading: false,
					})
					this.userForm.props.form.resetFields() // 关闭弹框重置表单
					this.requestList() // 创建之后 刷新列表
				}
			})
			.catch((err) => {
				this.setState({
					isVisible: false,
					userInfo: '', // 防止点完编辑和查看后  在去点击添加 表单里面被带入数据
					loading: false,
				})
				this.userForm.props.form.resetFields() // 关闭弹框重置表单
			})
	}

	handleCancel = () => {
		this.userForm.props.form.resetFields() // 关闭弹框重置表单
		this.setState({
			isVisible: false,
			userInfo: '', // 防止点完编辑和查看后  在去点击添加 表单里面被带入数据
		})
	}

	render() {
		const { isVisible, loading } = this.state
		const columns = [
			{
				title: 'id',
				dataIndex: 'id',
			},
			{
				title: '用户名',
				dataIndex: 'username',
			},
			{
				title: '性别',
				dataIndex: 'sex',
				render(sex) {
					return sex === 1 ? '男' : '女'
				},
			},
			{
				title: '状态',
				dataIndex: 'state',
				render(state) {
					// 字典足够多  最好建一个字典的配置文件
					let config = {
						'1': '咸鱼一条',
						'2': '风华浪子',
						'3': '北大才子一枚',
						'4': '百度FE',
						'5': '创业者',
					}
					return config[state]
				},
			},
			{
				title: '爱好',
				dataIndex: 'interest',
				render(interest) {
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
					return config[interest]
				},
			},
			{
				title: '婚配',
				dataIndex: 'isMarried',
				render(isMarried) {
					return isMarried ? '已婚' : '未婚'
				},
			},
			{
				title: '生日',
				dataIndex: 'birthday',
			},
			{
				title: '联系地址',
				dataIndex: 'address',
			},
			{
				title: '早起时间',
				dataIndex: 'time',
			},
		]
		return (
			<div>
				<Card style={{ marginTop: 10 }}>
					<Button
						type="primary"
						icon="plus"
						onClick={() => this.handleOperator('create')}
						style={{ marginRight: 10 }}
					>
						创建员工
					</Button>
					<Button
						icon="edit"
						onClick={() => this.handleOperator('edit')}
						style={{ marginRight: 10 }}
					>
						编辑员工
					</Button>
					<Button
						onClick={() => this.handleOperator('detail')}
						style={{ marginRight: 10 }}
					>
						员工详情
					</Button>
					<Button
						type="danger"
						icon="delete"
						onClick={() => this.handleOperator('delete')}
						style={{ marginRight: 10 }}
					>
						删除员工
					</Button>
				</Card>

				<ETable
					columns={columns}
					dataSource={this.state.list}
					updateSelectedItem={Utils.updateSelectedItem.bind(this)}
					selectedRowKeys={this.state.selectedRowKeys}
					pagination={this.state.pagination}
				/>

				<Modal
					title={this.state.title}
					visible={isVisible} // 控制模态框是否展示
					onOk={this.handleSubmit} // 确认事件
					width={800} // 加一个宽度
					onCancel={this.handleCancel}
					footer={
						this.state.type === 'detail'
							? null
							: [
									<Button
										key="back"
										onClick={this.handleCancel}
									>
										Return
									</Button>,
									<Button
										key="submit"
										type="primary"
										loading={loading}
										onClick={this.handleSubmit}
									>
										Submit
									</Button>,
							  ]
					}
					// footer 不显示 如果type 是详情的话  footer 取消。这样的话编辑也没有了  需要换种方式
					// footer 为null 的话 是没有底部区域的  {...footer}
				>
					{
						// UserForm：
						// type:告诉我们创建的表单是一个什么类型的  创建的时候用不到type  在后面的编辑和详情的时候  会用到type
						// wrappedComponentRef :  类似vue 的ref  把这个对象保存下来 主要就是把form  存储到本地
					}
					<UserForm
						userInfo={this.state.userInfo}
						type={this.state.type}
						wrappedComponentRef={(inst) => (this.userForm = inst)}
					/>
				</Modal>
			</div>
		)
	}
}

class UserForm extends React.Component {
	getState = (state) => {
		return {
			'1': '咸鱼一条',
			'2': '风华浪子',
			'3': '北大才子一枚',
			'4': '百度FE',
			'5': '创业者',
		}[state]
	}

	render() {
		const { getFieldDecorator } = this.props.form
		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 16 },
		}
		const userInfo = this.props.userInfo || {} // 获取当前选中的用户信息 // 如果没有值给一个空防止报错 实现我们编辑的功能
		// 不会影响我们创建的功能   我们创建的时候 userInfo是空  是空的话就取不到的
		const type = this.props.type // 获取type
		return (
			<Form layout="horizontal" {...formItemLayout}>
				<FormItem label="姓名">
					{userInfo && type === 'detail'
						? userInfo.username // type 如果是详情的话  直接显示一个值就可以了 ，如果不是详情 直接取渲染这个控件
						: getFieldDecorator('user_name', {
								initialValue: userInfo.username, // 编辑的话 我们只要初始化值 就可以实现我们的功能
						  })(<Input type="text" placeholder="请输入姓名" />)}
				</FormItem>
				<FormItem label="性别">
					{userInfo && type === 'detail'
						? userInfo.sex === 1
							? '男'
							: '女'
						: getFieldDecorator('sex', {
								initialValue: userInfo.sex,
						  })(
								<RadioGroup>
									{
										// 数字的1 必须{1}这样定义  "1" 这样定义得到的结果是一个字符串
										// 只有接口给你返回数字的1  才能初始化上去   如果接口给你返回的字符串 我们这里也必须写成"1" 字符串的形式
										// 这里需要定义：我们怎么去书写字符串类型 和 数字类型  就是通过变量的形式进行书写  就是数字类型
									}
									<Radio value={1}>男</Radio>
									<Radio value={2}>女</Radio>
								</RadioGroup>
						  )}
				</FormItem>
				<FormItem label="状态">
					{userInfo && type === 'detail'
						? this.getState(userInfo.state)
						: getFieldDecorator('state', {
								initialValue: userInfo.state,
						  })(
								<Select>
									<Option value={1}>咸鱼一条</Option>
									<Option value={2}>风华浪子</Option>
									<Option value={3}>北大才子一枚</Option>
									<Option value={4}>百度FE</Option>
									<Option value={5}>创业者</Option>
								</Select>
						  )}
				</FormItem>
				<FormItem label="生日">
					{userInfo && type === 'detail'
						? userInfo.birthday
						: getFieldDecorator('birthday', {
								initialValue: Moment(userInfo.birthday), // antd 里面  日期控件实际上是一个moment 对象
						  })(<DatePicker />)}
				</FormItem>
				<FormItem label="联系地址">
					{userInfo && type === 'detail'
						? userInfo.address
						: getFieldDecorator('address', {
								initialValue: userInfo.address,
						  })(
								<Input.TextArea
									rows={3}
									placeholder="请输入联系地址"
								/>
						  )}
				</FormItem>
			</Form>
		)
	}
}
UserForm = Form.create({})(UserForm)
