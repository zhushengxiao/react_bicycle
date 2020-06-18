import React, { Component } from 'react'
import { Card, Form, Input, Button, message, Icon, Checkbox } from 'antd'
const FormItem = Form.Item
class FormLogin extends Component {
	handleSubmit = () => {
		let userInfo = this.props.form.getFieldsValue()

		// 提交的时候进行验证
		this.props.form.validateFields((errors, values) => {
			console.log('errors: ', errors)
			console.log('values: ', values)
			if (!errors) {
				message.success(
					`当前账号：${userInfo.userName};当前密码：${userInfo.password}`
				)
			}
		})
	}
	render() {
		const { getFieldDecorator } = this.props.form
		return (
			<div>
				<Card title="登录行内表单">
					<Form layout="inline">
						<FormItem>
							<Input placeholder={'请输入用户名'} />
						</FormItem>
						<FormItem>
							<Input placeholder={'请输入密码'} />
						</FormItem>
						<FormItem>
							<Button type="primary">登录</Button>
						</FormItem>
					</Form>
				</Card>

				<Card title="登录水平表单" style={{ marginTop: 10 }}>
					{/*默认水平表单*/}
					<Form style={{ width: 300 }}>
						<FormItem>
							{getFieldDecorator('userName', {
								initialValue: '',
								rules: [
									{
										required: true,
										message: '用户名不能为空',
									},
									{
										min: 5,
										max: 10,
										message: '长度不在范围内',
									},
									{
										// new RegExp('^\\w+$', 'g'); 在字符串中 \w 成转义了
										pattern: /^\w+$/g,
										message: '用户名必须为字母或数字',
									},
								],
							})(
								<Input
									prefix={<Icon type="user" />}
									placeholder={'请输入用户名'}
								/>
							)}
						</FormItem>
						<FormItem>
							{getFieldDecorator('password', {
								initialValue: '',
								rules: [{ required: true }],
							})(
								<Input
									prefix={<Icon type="lock" />}
									placeholder={'请输入密码'}
								/>
							)}
						</FormItem>
						<FormItem>
							{getFieldDecorator('remember', {
								valuePropName: 'checked', // TODO: 必须使用 valuePropName 初始值才管用
								initialValue: true,
							})(<Checkbox>记住密码</Checkbox>)}
							{/*<a href="" style={{float:'right'}}>忘记密码</a>*/}
							<span href="" style={{ float: 'right' }}>
								忘记密码
							</span>
						</FormItem>
						<FormItem>
							<Button type="primary" onClick={this.handleSubmit}>
								登录
							</Button>
						</FormItem>
					</Form>
				</Card>
			</div>
		)
	}
}

export default Form.create()(FormLogin)
