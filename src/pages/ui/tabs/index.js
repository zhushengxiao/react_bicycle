import React, { Component } from 'react'
import { Card, message, Icon, Tabs } from 'antd'
import '../ui.less'

const TabPane = Tabs.TabPane

export default class Tabs1 extends Component {
	constructor(props) {
		super(props)
		const panes = [
			{ title: 'Tab 1', content: 'Content of Tab Pan1', key: '1' },
			{ title: 'Tab 2', content: 'Content of Tab Pan2', key: '2' },
		]
		this.newTabIndex = 0
		this.state = {
			activeKey: panes[0].key,
			panes,
		}
	}

	handleCallBack = (key) => {
		message.info('Hi, 你选择了页签：' + key)
	}

	onEdit = (targetKey, action) => {
		console.log('onEdit: ', targetKey, action)
		this[action] && this[action](targetKey)
	}

	add = () => {
		const panes = this.state.panes
		const activeKey = `newTab${this.newTabIndex++}`
		panes.push({
			title: activeKey,
			content: 'New Tab Pane',
			key: activeKey,
		})
		this.setState({ panes, activeKey })
	}

	remove = (targetKey) => {
		let activeKey = this.state.activeKey
		let lastIndex = null
		this.state.panes.forEach((pane, i) => {
			if (pane.key === targetKey) {
				lastIndex = i - 1
			}
		})

		const panes = this.state.panes.filter((pane) => pane.key !== targetKey)
		// 当前删除的是 选中的，则修改上一个为选中
		if (panes.length && activeKey === targetKey) {
			if (lastIndex >= 0) {
				activeKey = panes[lastIndex].key
			} else {
				activeKey = panes[0].key
			}
		}
		this.setState({ panes, activeKey })
	}

	render() {
		return (
			<div>
				<Card title="Tabs 标签页" className="card-wrap">
					<Tabs defaultActiveKey="1" onChange={this.handleCallBack}>
						<TabPane tab="Tab 1" key="1">
							Tab Content 1
						</TabPane>
						<TabPane tab="Tab 2" key="2">
							Tab Content 2
						</TabPane>
						<TabPane tab="Tab 3" key="3">
							Tab Content 3
						</TabPane>
					</Tabs>
				</Card>

				<Card title="Tabs 标签页（带图）" className="card-wrap">
					<Tabs defaultActiveKey="1" onChange={this.handleCallBack}>
						<TabPane
							tab={
								<span>
									<Icon type="plus" />
									Tab 1
								</span>
							}
							key="1"
						>
							Tab Content 1
						</TabPane>
						<TabPane
							tab={
								<span>
									<Icon type="edit" />
									Tab 2
								</span>
							}
							key="2"
						>
							Tab Content 2
						</TabPane>
						<TabPane
							tab={
								<span>
									<Icon type="delete" />
									Tab 3
								</span>
							}
							key="3"
						>
							Tab Content 3
						</TabPane>
					</Tabs>
				</Card>

				<Card title="动态页签">
					<Tabs
						onChange={this.onChange}
						activeKey={this.state.activeKey}
						type="editable-card"
						onEdit={this.onEdit}
					>
						{this.state.panes.map((item) => (
							<TabPane key={item.key} tab={item.title}>
								{item.content}
							</TabPane>
						))}
					</Tabs>
				</Card>
			</div>
		)
	}
}
