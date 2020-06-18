import React, { Component } from 'react'
import { Card, Spin, Alert, Icon } from 'antd'
import '../ui.less'

export default class Loadings extends Component {
	render() {
		const icon = <Icon type="loading" style={{ fontSize: 24 }} />
		const iconLoading = <Icon type="loading" style={{ fontSize: 24 }} />

		return (
			<>
				<Card title="Spin 用法" className="card-wrap">
					<Spin size="small" />
					<Spin style={{ margin: '0 10px' }} />
					<Spin size="large" />
					<Spin
						indicator={icon}
						style={{ marginLeft: '10px' }}
						spinning={true}
					/>
				</Card>

				<Card title="内容遮罩" className="card-wrap">
					<Alert
						message="Alert Message"
						description="Alert Description； Alert 描述信息"
						type="info"
						style={{ marginBottom: 10 }}
					/>

					<Spin>
						<Alert
							message="Alert Message"
							description="Alert Description； Alert 描述信息"
							type="warning"
							style={{ marginBottom: 10 }}
						/>
					</Spin>

					<Spin tip="加载中...">
						<Alert
							message="Alert Message"
							description="Alert Description； Alert 描述信息"
							type="success"
							style={{ marginBottom: 10 }}
						/>
					</Spin>

					<Spin indicator={iconLoading}>
						<Alert
							message="Alert Message"
							description="Alert Description； Alert 描述信息"
							type="error"
							style={{ marginBottom: 10 }}
						/>
					</Spin>
				</Card>
			</>
		)
	}
}
