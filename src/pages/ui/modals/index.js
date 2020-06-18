import React, { Component } from 'react'
import { Card, Button, Modal } from 'antd'
import '../ui.less'

export default class Modals extends Component {
	state = {
		modal1: false,
		modal2: false,
		modal3: false,
		modal4: false,
	}

	handleModal = (type) => {
		console.log(type)
		this.setState({ [type]: true })
	}

	handleConfirm = (type) => {
		Modal[type]({
			title: '确认？',
			content: '你确定吗？',
			onOk() {
				console.log('ok')
			},
			onCancel() {
				console.log('cancel')
			},
		})
	}

	render() {
		return (
			<>
				<Card title="基础模态框" className="card-wrap">
					<Button
						type="primary"
						onClick={() => this.handleModal('modal1')}
					>
						open
					</Button>
					<Button
						type="primary"
						onClick={() => this.handleModal('modal2')}
					>
						自定义页脚(按钮文字)
					</Button>
					<Button
						type="primary"
						onClick={() => this.handleModal('modal3')}
					>
						顶部 20px
					</Button>
					<Button
						type="primary"
						onClick={() => this.handleModal('modal4')}
					>
						水平垂直居中
					</Button>
				</Card>

				<Card title="信息确认框" className="card-wrap">
					<Button
						type="primary"
						onClick={() => this.handleConfirm('info')}
					>
						Info
					</Button>
					<Button
						type="primary"
						onClick={() => this.handleConfirm('success')}
					>
						Success
					</Button>
					<Button
						type="primary"
						onClick={() => this.handleConfirm('error')}
					>
						Error
					</Button>
					<Button
						type="primary"
						onClick={() => this.handleConfirm('warning')}
					>
						Warning
					</Button>
					<Button
						type="primary"
						onClick={() => this.handleConfirm('confirm')}
					>
						Confirm
					</Button>
				</Card>

				<Modal
					title="AntD 弹窗"
					visible={this.state.modal1}
					onCancel={() => {
						this.setState({ modal1: false })
					}}
				>
					<p>AntD Open 弹窗</p>
				</Modal>

				<Modal
					title="AntD 弹窗"
					visible={this.state.modal2}
					okText={'确定'}
					cancelText={'取消'}
					onCancel={() => {
						this.setState({ modal2: false })
					}}
				>
					<p>AntD Open 弹窗</p>
				</Modal>

				<Modal
					title="AntD 弹窗"
					visible={this.state.modal3}
					style={{ top: '20px' }}
					onCancel={() => {
						this.setState({ modal3: false })
					}}
				>
					<p>AntD Open 弹窗</p>
				</Modal>

				<Modal
					title="AntD 弹窗"
					visible={this.state.modal4}
					wrapClassName="vertical-center-modal"
					onCancel={() => {
						this.setState({ modal4: false })
					}}
				>
					<p>AntD Open 弹窗</p>
				</Modal>
			</>
		)
	}
}
