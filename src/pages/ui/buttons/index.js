import React, { Component } from 'react'
import { Card, Button, Icon, Radio } from 'antd'
import '../ui.less'

export default class Buttons extends Component {
	state = {
		loading: true,
		size: 'default',
		buttons: [{ type: 'primary' }, { type: 'dashed' }],
	}

	handleCloseLoading = () => {
		this.setState({ loading: false })
	}

	handleRadioChange = (e) => {
		console.log(e)
		this.setState({
			size: e.target.value,
		})
	}

	render() {
		return (
			<div>
				<Card title={'基础按钮'} className="card-wrap">
					<Button>Type:null</Button>
					<Button type="primary">Type:primary</Button>
					<Button type="dashed">Type:dashed</Button>
					<Button type="danger">Type:danger</Button>
					<Button disabled={1}>禁用</Button>
				</Card>

				<Card title={'图形按钮'} className="card-wrap">
					<Button icon={'plus'}>创建</Button>
					<Button icon={'edit'}>编辑</Button>
					<Button icon={'delete'}>删除</Button>
					<Button icon={'search'} shape={'circle'}></Button>
					<Button icon={'search'} type={'primary'}>
						搜索
					</Button>
					<Button icon={'download'} type={'primary'}>
						下载
					</Button>
				</Card>

				<Card title={'Loading 按钮'} className="card-wrap">
					<Button loading={this.state.loading} type={'primary'}>
						确定
					</Button>
					<Button
						loading={this.state.loading}
						shape={'circle'}
						type={'primary'}
					/>
					<Button loading={this.state.loading}>点击加载</Button>
					<Button loading={this.state.loading} shape={'circle'} />
					<Button type={'primary'} onClick={this.handleCloseLoading}>
						关闭
					</Button>
				</Card>

				<Card title={'按钮组'} style={{ marginBottom: '10px' }}>
					<Button.Group className="button-group">
						{/*<Button icon={'left'} type='primary'>后退</Button>*/}
						{/*<Button icon={'right'} type='primary'>前进</Button>*/}
						<Button type="primary">
							<Icon type="left" />
							后退
						</Button>
						<Button type="primary">
							前进
							<Icon type="right" />
						</Button>
					</Button.Group>
				</Card>

				<Card title={'按钮尺寸'} className="card-wrap">
					<Radio.Group
						onChange={this.handleRadioChange}
						value={this.state.size}
					>
						<Radio value="small">小</Radio>
						<Radio value="default">中</Radio>
						<Radio value="large">大</Radio>
					</Radio.Group>

					<Button size={this.state.size}>Type:null</Button>
					<Button size={this.state.size} type="primary">
						Type:primary
					</Button>
					<Button size={this.state.size} type="dashed">
						Type:dashed
					</Button>
					<Button size={this.state.size} type="danger">
						Type:danger
					</Button>
				</Card>

				<Card title={'循环'}>
					{this.state.buttons.map((item, index) => {
						return (
							<Button type={item.type} key={index}>
								For: {item.type}
							</Button>
						)
					})}
				</Card>
			</div>
		)
	}
}
