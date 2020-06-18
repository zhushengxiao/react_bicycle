import React, { PureComponent } from 'react'
import { Input, Select, Form, Button, Checkbox, DatePicker } from 'antd'
import Utils from '../../utils/util'
const FormItem = Form.Item
const { RangePicker } = DatePicker

class FilterForm extends PureComponent {
	// 查询
	handleFilterSubmit = () => {
		//方法定义 就是往父级去传输的
		let fieldsValue = this.props.form.getFieldsValue()
		this.props.filterSubmit(fieldsValue) // 调用父级的方法 把值传递回去
	}

	// 重置
	reset = () => {
		this.props.form.resetFields()
	}

	initFormList = () => {
		const { getFieldDecorator } = this.props.form //  getFieldDecorator帮助我们实现数据双向绑定的功能
		const formList = this.props.formList // 协助我们获取从外层传递进来的formList 拿到formList  怎么去便利和解析他呢
		const formItemList = [] // 包装一个formItem
		if (formList && formList.length > 0) {
			//否则遍历会出问题的
			formList.forEach((item, i) => {
				let label = item.label
				let field = item.field // 字段参数
				let placeholder = item.placeholder
				let initialValue = item.initialValue || '' // 得到初始化值 默认给他一个空字符串
				let width = item.width
				if (item.type === 'TIME_ZONE') {
					// 遍历类型的判断
					//colon={false} 去除掉label  自动添加：冒号  <FormItem colon={false} label={label} key={field}>
					const TIME_ZONE = (
						<FormItem label={label} key={field}>
							{getFieldDecorator(`${field}`)(
								<RangePicker
									showTime
									format="YYYY-MM-DD HH:mm:ss"
								/>
							)}
						</FormItem>
					)
					formItemList.push(TIME_ZONE)
				} else if (item.type === 'INPUT') {
					// 先来判断input
					const INPUT = (
						<FormItem label={label} key={field}>
							{getFieldDecorator(`${field}`, {
								initialValue: initialValue,
							})(<Input type="text" placeholder={placeholder} />)}
						</FormItem>
					)
					formItemList.push(INPUT)
				} else if (item.type === 'SELECT') {
					// 封装一个select 的查询
					const SELECT = (
						<FormItem label={label} key={field}>
							{
								// 拿到结构化的数据去封装我们的FormItem
								//[field]中括号 会把他当作变量的形式来对待 使用[field] 的形式 会报错，这里改成模板字符串的形式
								// Warning: Failed prop type: Invalid prop `id` of type `array` supplied to `Select`, expected `string`.
								getFieldDecorator(`${field}`, {
									initialValue: initialValue,
								})(
									<Select
										style={{ width: width }}
										placeholder={placeholder}
										allowClear
									>
										{
											Utils.getOptionList(item.list)
											// 调用getOptionList的公共机制 帮助我们生成Option 项出来
										}
									</Select>
								)
							}
						</FormItem>
					)
					formItemList.push(SELECT) // 把值装起来进行使用  否则在后面没有办法去获取你想要的东西
				} else if (item.type === 'CHECKBOX') {
					const CHECKBOX = (
						<FormItem label={label} key={field}>
							{getFieldDecorator(`${field}`, {
								valuePropName: 'checked', // 是checked  才能指定他是否能选中  这个属性是必须添加的  不加的话设置true  false  是没有用的
								initialValue: initialValue, //是否选中  他的值必须是  true | false  checked 他必须是选中和非选中两个状态 不能随便去写这个值
							})(<Checkbox>{label}</Checkbox>)}
						</FormItem>
					)
					formItemList.push(CHECKBOX)
				}
			})
		}
		return formItemList // 处理后的结果进行 返回
	}

	render() {
		return (
			<Form layout="inline">
				{this.initFormList()}
				<FormItem>
					<Button
						type="primary"
						style={{ marginRight: '20px' }}
						onClick={this.handleFilterSubmit}
					>
						查询
					</Button>
					<Button onClick={this.reset}>重置</Button>
				</FormItem>
			</Form>
		)
	}
}

export default Form.create({})(FilterForm)
