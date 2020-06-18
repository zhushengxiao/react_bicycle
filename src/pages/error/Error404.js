import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'
import { ErrorDiv } from './style.js'

export default class Error404 extends Component {
	state = {
		time: 9,
	}

	handleGoBack = () => {
		this.props.history.goBack()
	}

	componentDidMount() {
		this.bodyOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'

		if (this.props.history.length >= 2) {
			this.sI = setInterval(() => {
				const time = this.state.time - 1

				if (time === 0) this.handleGoBack()

				this.setState({ time })
			}, 1000)
		}
	}

	componentWillUnmount() {
		clearInterval(this.sI)
		document.body.style.overflow = this.bodyOverflow
	}

	render() {
		const { history } = this.props
		const { time } = this.state
		return (
			<ErrorDiv>
				<div className="root error404">
					<div className="container">
						<div className="header">
							<h3>页面不存在</h3>
						</div>
						<p className="intro">
							跳转到<Link to="/"> 首页 </Link>
							{history.length >= 2 ? (
								<span>
									或者返回
									<Button
										type="link"
										onClick={this.handleGoBack}
									>
										上一步 ({time})
									</Button>
								</span>
							) : null}
						</p>
					</div>
				</div>
			</ErrorDiv>
		)
	}
}
