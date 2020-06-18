import React from 'react'
import {
	Card,
	Button,
	Form,
	Input,
	Select,
	Tree,
	Transfer,
	Modal,
	message,
} from 'antd'
import axios from '../../axios'
import Utils from '../../utils/util'
import { apis } from '../../utils/apis'
import ETable from '../../components/ETable'
import menuConfig from '../../config/menuConfig'
const FormItem = Form.Item
const Option = Select.Option
const TreeNode = Tree.TreeNode // TreeNode 也是 Tree 下面的一个对象

export default class Permission extends React.Component {
	state = {}

	params = {
		page: 1,
		pageSize: 10,
	}

	componentWillMount() {
		this.requestList()
	}

	requestList = () => {
		axios.getPagTabList(this, apis.roleList, this.params)
	}

	// 打开创建角色创建
	handleRole = () => {
		this.setState({
			isRoleVisible: true, // 用于把弹框显示出来
		})
	}

	// 角色提交
	handleRoleSubmit = () => {
		let data = this.roleForm.props.form.getFieldsValue() // 拿到表单里面的值
		this.roleForm.props.form.validateFields((err, values) => {
			if (!err) {
				axios
					.ajax({
						url: apis.roleCreate,
						method: 'post',
						data: {
							...data,
						},
					})
					.then((res) => {
						if (res.data.code === 200) {
							// 判断是否创建成功
							this.setState({
								isRoleVisible: false, // 关闭弹框
							})
							message.success('This is a success message')
							this.requestList() // 创建成功 刷新表单
							this.roleForm.props.form.resetFields() // 弹框关闭掉  同时把表单重置了 ，防止对下一次创建 造成干扰
						}
					})
					.catch((err) => {
						this.setState({
							isRoleVisible: false, // 关闭弹框
						})
						this.roleForm.props.form.resetFields()
					})
			}
		})
	}

	// 设置权限  方法
	handlePermission = () => {
		if (!this.state.selectedItem) {
			// 获得当前选中的这个对象  通过对象来判断 你当前是否有选中  一条数据
			Modal.info({
				title: '信息',
				content: '请选择一个角色',
			})
			return
		}
		this.setState({
			isPermVisible: true,
			detailInfo: this.state.selectedItem, // 列出角色的详情（每条数据已经包含了各种信息了，比如说角色名称、角色状态、
			//menus 每个角色他所拥有的权限（包含哪些菜单  他的一个路径，这个权限也是可以提供一个详情接口，单独去查询一次，但是我们这相对来说没有那么复杂，就把角色权限 丢到列表里面去了，
			// 这里大家其实也可以把他拆分成两个接口，把这个权限单独放到一个详情接口里面去，根据角色id 去查询他对应的权限，也是可以的。两种实现方式））
		})
		let menuList = this.state.selectedItem.menus
		this.setState({
			menuInfo: menuList,
		})
	}

	// 权限设置 提交按钮
	handlePermEditSubmit = () => {
		let data = this.permForm.props.form.getFieldsValue() // 获取权限设置 表单数据
		data.role_id = this.state.selectedItem.id // 设置角色权限 往往需要把 角色id 传递回去 ，否则后台不知道你到底给哪一个角色设置权限
		data.menus = this.state.menuInfo // 勾选用户的key 值
		// 服务端在拿到id 之后和menus 之后，就能够进行接口的提交，把角色对应的权限 写入到数据库里面去。
		axios
			.ajax({
				url: apis.permissionEdit,
				method: 'post',
				data: {
					...data, // es6 的 对象结构的方式  ，把data 里面的每一个值 都给他解构出来
				},
			})
			.then((res) => {
				// 接收返回的数据
				if (res.data.code === 200) {
					// 报错的话 ，拦截器会直接把他拦截出来
					this.setState({
						isPermVisible: false, // 关闭弹框
					})
					message.success('This is a success message')
					this.requestList() // 刷新页面
				}
			})
			.catch((err) => {
				this.setState({
					isPermVisible: false, // 关闭弹框
				})
				console.log(err)
			})
	}

	// 用户授权
	handleUserAuth = () => {
		if (!this.state.selectedItem) {
			// 判断你是否选择一个角色，没有选择角色 ，是没有办法给这个角色分配一批用户的。
			Modal.info({
				title: '信息',
				content: '未选中任何项目',
			})
			return
		}
		this.getRoleUserList(this.state.selectedItem.id)
		this.setState({
			isUserVisible: true, // 弹框显示
			isAuthClosed: false,
			detailInfo: this.state.selectedItem, //  显示角色名称
		})
	}

	// 获取角色下已有的用户列表
	getRoleUserList = (id) => {
		axios
			.ajax({
				// 我们先把这批用户查询出来，因为我们分配过一批用户 角色之后呢，第二次打开 一定是需要把默认的用户带过来的
				url: apis.roleUserList, // 用户 是同一个接口，接口“角色-用户列表”，
				method: 'post',
				data: {
					id: id,
				},
			})
			.then((res) => {
				if (res.data.code === 200) {
					this.getAuthUserList(res.data.result) // 从结果里 筛选目标用户
					// res.data.result ，包括了一批用户，这里面通过status 去区分目标用户 1： 是目标用户，0 ：不是目标用户
					// 大家也可以定义两个接口 比如把全量用户查询出来 在把目标用户查询出来也是可以的，这里合并成一个接口，通过一个状态来区分，你是全量用户还是目标用户
				}
			})
	}

	// 筛选目标用户
	getAuthUserList = (dataSource) => {
		const mockData = [] // 数据源
		const targetKeys = [] // 目标用户
		if (dataSource && dataSource.length > 0) {
			// 有数据
			for (let i = 0; i < dataSource.length; i++) {
				// map forEach  都是可以的
				const data = {
					// 结构必须和antd 框架保持一致
					key: dataSource[i].user_id, // 可以理解为用户的id
					title: dataSource[i].user_name, // 穿梭框 需要展示的数据 用户名称
					status: dataSource[i].status, // 可要可不要  指数据源  ，key 和title 必须定义，否则他不会展示出来的
				}
				if (data.status === 1) {
					// 说明你是目标用户
					targetKeys.push(data.key) // 显示在右侧框数据的key 集合，他是一个数组，数组里面是一个string类型的，
					// 他是一个key 的集合  ，不是一个对象的集合
					// 根据状态为1 的，挑出来，把这些key 值挑出来，组件会自动的做一些过滤，根据这个key  从mockData 里面一一映射，把
					// key 值 相同的数据挑选出来，放到右侧。 不应该是互斥的作用，互斥的话 ，mockData 里面就是一个比较少量的数据
					// 他在移动的过程中呢，，左边的数据是没有办法移动到右边去的。首先mockData  是一个完整的数据
					// 当你在移动的过程中，他会根据你的key 从左边的数据里面去拿 ，然后把对象移到右侧去
					// 其实左侧是一个完整的数据，因为右侧会定义一些key 值，他会从左侧里面去查找，把key值，相同的数据给移动到右边去，
					// 所以你现在从左边看和右边看，他不会有重读的数据， 但是在代码开发的时候，必须要保证mockData 是一份完整的数据 。这就是我们的用户授权
				}
				mockData.push(data) // 全量数据 // 他需要从接口里面获取到所有的数据，这必须是一套完全的数据
			}
		}
		this.setState({ mockData, targetKeys }) // 保存完之后  需要给他弹框了
	}

	// 接收一个targetKeys  从子组件传回来得到一个targetKeys
	patchUserInfo = (targetKeys) => {
		this.setState({
			targetKeys: targetKeys, // 把目标源暂存下来 ，保存了以后，重新获取这个值，把这个值在传回给子组件，由子组件 在重新渲染这些 数据。进而达到穿梭框这样的一个效果
			// react 比较不好的地方 只能去做到一个单项的数据流通 ，不能做到双向的数据流通
		})
	}

	// 用户授权提交按钮
	handleUserSubmit = () => {}

	render() {
		const columns = [
			{
				title: '角色ID',
				dataIndex: 'id',
			},
			{
				title: '角色名称',
				dataIndex: 'role_name',
			},
			{
				title: '创建时间',
				dataIndex: 'create_time',
				render: Utils.formateDate,
			},
			{
				title: '使用状态',
				dataIndex: 'status',
				render(status) {
					// 状态转换
					if (status === 1) {
						return '启用'
					} else {
						return '停用'
					}
				},
			},
			{
				title: '授权时间', // 什么时间授权的 防止某一个人给他串改了 用户给某个人授权的时候呢 我们需要知道他授权的时间  这样我们能够去查到一些问题
				dataIndex: 'authorize_time',
				render: Utils.formateDate, // 时间需要使用公共机制进行格式化 辅助性帮助我们去转换日期  时间戳转换成2017-7-6 9:49:50	 这种形式
			},
			{
				title: '授权人', // 到底是谁给你授权的  这些我们都需要严格的把控 ，防止某一个用户 人为的给一个用户授权，我们没有查询的记录，这些都必须有记录的跟踪
				dataIndex: 'authorize_user_name',
			},
		]
		return (
			<div>
				<Card>
					<Button
						type="primary"
						onClick={this.handleRole}
						style={{ marginRight: 10 }}
					>
						创建角色
					</Button>
					<Button
						type="primary"
						onClick={this.handlePermission}
						style={{ marginRight: 10 }}
					>
						设置权限
					</Button>
					<Button
						type="primary"
						onClick={this.handleUserAuth}
						style={{ marginRight: 10 }}
					>
						用户授权
					</Button>
				</Card>
				<ETable
					// 添加表格单选功能的封装 这样选中完之后 才能去调用你的方法，触发你的方法
					// 把当前作用域传递过去
					columns={columns}
					dataSource={this.state.list}
					updateSelectedItem={Utils.updateSelectedItem.bind(this)}
					selectedRowKeys={this.state.selectedRowKeys}
					pagination={this.state.pagination}
				/>

				<Modal
					title="创建角色"
					visible={this.state.isRoleVisible}
					onOk={this.handleRoleSubmit} // 确定的时候需要执行的方法
					onCancel={() => {
						// 取消执行的操作
						this.roleForm.props.form.resetFields() // 弹框关闭掉  同时把表单重置了
						this.setState({
							isRoleVisible: false,
						})
					}}
				>
					{
						// 用于获取我们表单里面的元素值 ，这样就会把对象保存到roleForm里面去。
					}
					<RoleForm
						wrappedComponentRef={(inst) => (this.roleForm = inst)}
					/>
				</Modal>
				<Modal
					title="权限设置"
					visible={this.state.isPermVisible}
					width={600} // 数字通过大括号进行包裹
					onOk={this.handlePermEditSubmit} // 点击确定提交方法
					onCancel={() => {
						this.setState({
							isPermVisible: false,
						})
					}}
				>
					{
						// 内部包含了表单部分和树形结构部分，这里最好去定义一个 form  表单
					}
					<PermEditForm
						wrappedComponentRef={(inst) => (this.permForm = inst)}
						detailInfo={this.state.detailInfo} // 从当前列表里面去取当前选中项对应的数据，大家也可以通过详情接口单独去拉数据
						menuInfo={this.state.menuInfo || []} // menus:this.state.detailInfo.menus 每个角色他所拥有的权限（包含哪些菜单  他的一个路径)
						patchMenuInfo={(checkedKeys) => {
							// 用户勾选的框 勾选的权限，从子组件传回来，setState ,在从父组件传回去，因为我们取是从detailInfo 取的
							this.setState({
								menuInfo: checkedKeys,
							})
						}}
					/>
				</Modal>
				<Modal
					title="用户授权"
					visible={this.state.isUserVisible}
					width={800}
					onOk={this.handleUserSubmit}
					onCancel={() => {
						this.setState({
							isUserVisible: false,
						})
					}}
				>
					<RoleAuthForm
						wrappedComponentRef={(inst) =>
							(this.userAuthForm = inst)
						}
						isClosed={this.state.isAuthClosed} // 没用到
						detailInfo={this.state.detailInfo} // input 中的角色名称
						targetKeys={this.state.targetKeys} // 目标用户
						mockData={this.state.mockData} // 全量数据
						patchUserInfo={this.patchUserInfo} // 父组件定义的方法  去接收我们的 数据源targetKeys
					/>
				</Modal>
			</div>
		)
	}
}

// 角色创建 RoleForm（角色列表）
class RoleForm extends React.Component {
	render() {
		const { getFieldDecorator } = this.props.form
		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 16 },
		}
		return (
			<Form layout="horizontal" {...formItemLayout}>
				<FormItem label="角色名称">
					{getFieldDecorator('role_name', {
						initialValue: '', //  没有编辑功能  所以这里不需要给他初始化值
						rules: [
							{
								required: true,
								message: '角色名称不能为空',
							},
						],
					})(<Input type="text" placeholder="请输入角色名称" />)}
				</FormItem>
				<FormItem label="状态">
					{getFieldDecorator('state', {
						initialValue: 1,
					})(
						<Select>
							<Option value={1}>开启</Option>
							<Option value={0}>关闭</Option>
						</Select>
					)}
				</FormItem>
			</Form>
		)
	}
}
RoleForm = Form.create({})(RoleForm) //生成表单  用于实现状态的数据双向绑定的这样的一个功能

// 设置权限的表单
class PermEditForm extends React.Component {
	state = {}

	// 设置选中的节点，通过父组件方法再传递回来
	onCheck = (checkedKeys) => {
		// 当你权限更改了以后 ，需要把这个属性在传递回去，传到父组件，再从父组件流回来
		// 因为我们的react 是一个单项流通的 ，从父组件流向子组件，如果你的子组件发生了变化，需要把子组件变化的值，在传回父组件，由父组件在流回子组件，他是一个单项循环的过程。
		// react 是一个单项流动的 不是一个双向流动的，只能由父组件流向子组件，子组件在去调用父组件的方法，再从父组件流回子组件
		// 只能是这样的循环
		// 是我们能够勾选中父选框
		this.props.patchMenuInfo(checkedKeys)
	}

	// 递归的方式 来实现完整的权限树的加载
	// data：加载进来的 config->menuConfig.js
	renderTreeNodes = (data, key = '') => {
		console.log(data)
		// 实现权限列表的渲染
		return data.map((item) => {
			// map 会把每一个元素 改成一个 <TreeNode></TreeNode> 节点，最后需要把这个完整的数据返回出去，加return
			// 递归遍历非常的简单
			// data 是一个大的对象 ，里面是一个list,list 一定是一个遍历，遍历我们知道 他有一级菜单，有二级菜单，我要去判断你当前是否有子节点
			// 如果有子节点children  我们需要继续去遍历，直到 你没有子节点为止
			let parentKey = key + item.key
			if (item.children) {
				// 如果你有子节点 ，我们需要继续去遍历 继续去递归
				return (
					<TreeNode
						title={item.title}
						key={parentKey}
						dataRef={item}
						className="op-role-tree"
					>
						{
							// 添加子节点 递归去遍历
							// 渲染的时候 一定传递的是 item.children 一个数组进行渲染
							this.renderTreeNodes(item.children, parentKey)
						}
					</TreeNode>
				)
			} else if (item.btnList) {
				return (
					<TreeNode
						title={item.title}
						key={parentKey}
						dataRef={item}
						className="op-role-tree"
					>
						{this.renderBtnTreedNode(item, parentKey)}
					</TreeNode>
				)
			}
			return <TreeNode {...item} />
		})
	}

	renderBtnTreedNode = (menu, parentKey = '') => {
		const btnTreeNode = []
		menu.btnList.forEach((item) => {
			console.log(parentKey + '-btn-' + item.key)
			btnTreeNode.push(
				<TreeNode
					title={item.title}
					key={parentKey + '-btn-' + item.key}
					className="op-role-tree"
				/>
			)
		})
		return btnTreeNode
	}

	render() {
		// getFieldDecorator外部声明 getFieldDecorator 否则是没有办法去使用的。
		// 他是通过 this.props 结构出来的，位于form 里面的一个对象，通过结构的方式给大家结构出来
		const { getFieldDecorator } = this.props.form
		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 18 },
		}

		const detail_info = this.props.detailInfo // 从父组件取属性 就是通过this.props 去取
		// menuInfo 角色 对应的菜单权限 menu
		// 从父组件去取的
		const menuInfo = this.props.menuInfo
		return (
			<Form layout="horizontal">
				{
					// 指定表单水平布局  因为他本身不是一个水平布局
				}
				<FormItem label="角色名称：" {...formItemLayout}>
					{
						// disabled 本身不能编辑
						// detail_info.role_name 这样就可以取到角色名称了
					}
					<Input
						disabled
						maxLength="8"
						placeholder={detail_info.role_name}
					/>
				</FormItem>
				<FormItem label="状态：" {...formItemLayout}>
					{
						// 启用的时候就是可以使用的 ，当你停用的时候就不存在这个角色了，用户登录就可能会受影响
						// 实现双向数据绑定功能，需要使用antd 里面的一个方法，getFieldDecorator 方法来进行绑定关联getFieldDecorator（）（），
						// 两个方法 括号代表一个方法 方法里面又返回一个方法，我们需要把组件放到第二个方法里面去
					}
					{getFieldDecorator('status', {
						// 添加字段status，同时初始化一个值  比如说 initialValue：1
						initialValue: '1',
					})(
						<Select style={{ width: 80 }} placeholder="启用">
							<Option value="1">启用</Option>
							<Option value="0">停用</Option>
						</Select>
					)}
				</FormItem>
				{
					// 权限赋值 一定是使用的树形结构，
					// 树形控件赋值权限 都会使用复选框，因为你要给某一个角色赋权限 一定会勾选某一个权限进行赋值
					// 这里就给大家实现一个标准的权限控制是什么样子的
					//=================
					// 第一步：<Tree></Tree> 树形控件，首先他有一个根节点
					// 渲染控件里面的每一个节点，实际上是TreeNode,定义根节点
				}
				<Tree
					checkable // 指定你前面是否有复选框 不加的话前面是不会出现复选框的 因为我们设置权限 一定是要有勾选功能的
					defaultExpandAll // 默认展开 否则 他会进行合并
					onCheck={(checkedKeys) => this.onCheck(checkedKeys)} // 勾选之后会触发的事件 checkedKeys：选中之后 默认接收一个选中的 keys,把当前树形结构 选中的keys  '所有的keys' 传递回来
					checkedKeys={menuInfo || []} // 接口里面选中的权限给他赋值 勾选上去 （默认选中哪些属性，默认角色拥有哪些权限 ，给他渲染出来）
					//
				>
					{
						// 根节点 ，外层是一个tree 结构的对象，内层平台结构 也是一个节点，他是一个父节点。权限通常就是一个父节点，里面是子节点
						// 根节点本身不在我们的循环之中 ，key="platform_all" antd 里面要求每个组件要有一个key ,这里可以随便给他定义一个。
						// 接着去赋值里面的权限，肯定不能一个个去写，本身他有很多的权限，而且这个权限可能会是动态的，所以这里不能一个个去写，最好通过配置的形式去实现
						// 分两部分走 ，首先我们要去加载后台系统完整的权限（两种方法：1.服务端返回完整的权限列表，前端来进行加载；2.服务端比较懒，不做，前端可以自定义一个完整的权限列表，自己去加载，服务端只需要把对应的角色 拥有的权限 返回给前端就可以了），
						// 这里通过本身自己定义 完整的菜单进行加载（config->menuConfig.js）通过读取这个权限，来加载权限树
						// 第二步，我们要根据 角色拥有的权限 去把他勾选上
					}
					<TreeNode title="平台权限" key="platform_all">
						{
							// 调用权限加载 传递一个menuConfig
							this.renderTreeNodes(menuConfig)
						}
					</TreeNode>
				</Tree>
			</Form>
		)
	}
}

PermEditForm = Form.create({})(PermEditForm)

// 用户授权表单
class RoleAuthForm extends React.Component {
	// 穿梭框 过滤 inputValue：输入的值 在我们的option.title 列表里面去搜索 ，大于-1 返回true ,从title 里面去搜索我们的数据
	filterOption = (inputValue, option) => {
		return option.title.indexOf(inputValue) > -1
	}
	// 当我们选择一批用户数据的时候，我们需要把这批数据给他保存起来
	handleChange = (targetKeys) => {
		// targetKeys：把你当前获取的目标源keys 保存起来
		// patchUserInfo ：在父组件调用的方法
		this.props.patchUserInfo(targetKeys) // 然后把数据源传递到父组件里面去，由父组件在传递回来，这么一个单项流通的形式，才能去实现我们这样的一个目的
	}

	render() {
		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 18 },
		}
		const detail_info = this.props.detailInfo
		return (
			<Form layout="horizontal" {...formItemLayout}>
				<FormItem label="角色名称：">
					<Input
						disabled
						maxLength={8}
						placeholder={detail_info.role_name}
					/>
				</FormItem>
				<FormItem label="选择用户：">
					<Transfer
						listStyle={{ width: 200, height: 400 }} // 两个穿梭框的自定义样式（相当于写的一个style样式） 官网提供的属性
						dataSource={this.props.mockData} // 全量数据
						showSearch // 添加搜索功能
						titles={['待选用户', '已选用户']} // 两个穿梭框 一边有一个title
						searchPlaceholder="输入用户名" // 搜索框的Placeholder
						filterOption={this.filterOption} // 过滤
						targetKeys={this.props.targetKeys} // 目标数据
						onChange={this.handleChange} // 控制目标源 // 当我们选择一批用户数据的时候，我们需要把这批数据给他保存起来
						render={(item) => item.title} // 每行数据渲染函数 接收一个item 就是每行数据的对象，返回一个item.title 把名字渲染上去
						// render  渲染每一行的数据  ，把item.title  返回回去，把他装在到我们的框里面去
					/>
				</FormItem>
			</Form>
		)
	}
}
RoleAuthForm = Form.create({})(RoleAuthForm)
