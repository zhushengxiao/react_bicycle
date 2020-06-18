import React from 'react'
import { NavLink } from 'react-router-dom'
import { Menu /*Icon*/ } from 'antd'
import MenuConfig from '../../config/menuConfig'
import './index.less'
const SubMenu = Menu.SubMenu

export default class NavLeft extends React.Component {
	componentWillMount() {
		const menuTreeNode = this.renderMenu(MenuConfig)
		this.setState({ menuTreeNode })
	}

	// 菜单渲染
	renderMenu = (data) => {
		return data.map((item) => {
			if (item.children) {
				return (
					<SubMenu key={item.key} title={item.title}>
						{this.renderMenu(item.children)}
					</SubMenu>
				)
			} else {
				return (
					<Menu.Item key={item.key} title={item.title}>
						<NavLink to={'/admin' + item.key}>{item.title}</NavLink>
					</Menu.Item>
				)
			}
		})
	}

	render() {
		return (
			<div className="navleft">
				<div className="logo">
					<img src="/assets/logo-ant.svg" alt="" />
					<h1>AntD MS</h1>
				</div>
				<Menu mode="vertical" theme="dark" className="navMenu">
					{this.state.menuTreeNode}
				</Menu>
			</div>
		)
	}
}
