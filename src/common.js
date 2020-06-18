import React, { PureComponent, Fragment } from 'react'
import { Row } from 'antd'
import { GlobalStyle } from './style/reset'
import Header from './components/Header'
import './style/common.less'

class Common extends PureComponent {
	render() {
		return (
			<Fragment>
				<GlobalStyle />
				<div>
					<Row className="simple-page">
						<Header menuType="second" />
						{
							// menuType="second"  控制头部可以称之为二级导航 小导航 .头部组件复用
						}
					</Row>
					<Row className="content">{this.props.children}</Row>
				</div>
			</Fragment>
		)
	}
}

export default Common
