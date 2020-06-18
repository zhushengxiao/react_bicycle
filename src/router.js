import React from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import App from './App'
import Admin from './admin'
import Common from './common'
import Error404 from './pages/error/Error404'
import Login from './pages/login'
import Home from './pages/home'
import Buttons from './pages/ui/buttons'
import Carousel from './pages/ui/carousel'
import Gallery from './pages/ui/gallery'
import NoMatch from './pages/no_match'
import Loading from './pages/ui/loading'
import Messages from './pages/ui/messages'
import Modals from './pages/ui/modals'
import Notice from './pages/ui/notice'
import Tabs from './pages/ui/tabs'
import FormLogin from './pages/form/login'
import FormRegister from './pages/form/register'
import Basic from './pages/table/basicTable'
import HighTable from './pages/table/highTable'
import Rich from './pages/rich/index'
import City from './pages/city'
import Order from './pages/order'
import OrderDetail from './pages/order/detail'
import User from './pages/user'
import BikeMap from './pages/bikeMap'
import Bar from './pages/echarts/bar'
import Permission from './pages/permission'

export default class IRouter extends React.Component {
	render() {
		return (
			<HashRouter>
				<App>
					<Switch>
						<Route
							path="/"
							exact
							render={() => <Redirect to="/admin/home" />}
						/>
						<Route path="/login" component={Login} />
						<Route
							path="/common"
							render={() => (
								// 这样我们就不需要考虑我们的二级导航  小导航了
								// render 的时候 匹配到一个/common 路由的时候 我们需要  renturn 或者把大括号去掉  否则是没有办法接收到数据的 一但加大括号是不会直接return  手动的return一下
								// 如果不写大括号  他会自动的帮助我们return
								<Switch>
									<Route
										path="/common/order/detail/:orderId"
										render={() => (
											<Common>
												<Route
													component={OrderDetail}
												/>
											</Common>
										)}
									/>
									<Route component={Error404} />
								</Switch>
							)}
						/>
						<Route
							path="/admin"
							render={() => (
								<Admin>
									<Switch>
										<Route
											exact={true}
											path="/admin/home"
											component={Home}
										/>
										<Route
											exact={true}
											path="/admin/ui/buttons"
											component={Buttons}
										/>
										<Route
											exact={true}
											path="/admin/ui/carousel"
											component={Carousel}
										/>
										<Route
											exact={true}
											path="/admin/ui/gallery"
											component={Gallery}
										/>
										<Route
											exact={true}
											path="/admin/ui/loadings"
											component={Loading}
										/>
										<Route
											exact={true}
											path="/admin/ui/messages"
											component={Messages}
										/>
										<Route
											exact={true}
											path="/admin/ui/modals"
											component={Modals}
										/>
										<Route
											exact={true}
											path="/admin/ui/notification"
											component={Notice}
										/>
										<Route
											exact={true}
											path="/admin/ui/tabs"
											component={Tabs}
										/>
										<Route
											path="/admin/form/login"
											component={FormLogin}
										/>
										<Route
											path="/admin/form/reg"
											component={FormRegister}
										/>
										<Route
											path="/admin/table/basic"
											component={Basic}
										/>
										<Route
											path="/admin/table/high"
											component={HighTable}
										/>
										<Route
											path="/admin/rich"
											component={Rich}
										/>
										<Route
											path="/admin/city"
											component={City}
										/>
										<Route
											path="/admin/order"
											component={Order}
										/>
										<Route
											path="/admin/user"
											component={User}
										/>
										<Route
											path="/admin/bikeMap"
											component={BikeMap}
										/>
										<Route
											path="/admin/charts/bar"
											component={Bar}
										/>
										<Route
											path="/admin/permission"
											component={Permission}
										/>
										<Route component={NoMatch} />
									</Switch>
								</Admin>
							)}
						/>
						<Route path="/order/detail" component={Login} />
					</Switch>
				</App>
			</HashRouter>
		)
	}
}
