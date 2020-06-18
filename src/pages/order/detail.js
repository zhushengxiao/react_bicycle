import React from 'react'
import { Card } from 'antd'
import axios from '../../axios'
import { apis } from '../../utils/apis'
import { DetailDiv } from './detailStyle.js'

export default class Order extends React.Component {
	state = {}
	componentDidMount() {
		let orderId = this.props.match.params.orderId // 第一步 拿取我们的订单编号  router4.0  通过当前页面取路由里面的动态参数的时候
		// 参数之所以是动态 Route path 已经：orderId 给大家定义了 这就意味着他可以接收一个动态的变量 变量的名字就叫做orderId
		// 通过this.props  因为我们系统是单页面的 不管是组件还是什么我们所有的属性都是通过  this.props  来取。match.params是取参数的
		// 固定语法  取路由里面的参数 一定要记住
		if (orderId) {
			this.getDetailInfo(orderId)
		}
	}

	//订单详情
	getDetailInfo = (orderId) => {
		axios
			.ajax({
				url: apis.orderDetail,
				method: 'post',
				data: {
					orderId: orderId,
				},
				isShowLoading: true,
			})
			.then((res) => {
				console.log(res)
				if (res.data.code === 200) {
					this.setState({
						orderInfo: res.data.result,
					})
					this.renderMap(res.data.result) // 调用
				}
			})
	}

	renderMap = (result) => {
		//单页面应用程序和多页面应用程序的区别，如果说他是一张张网页，他是全局变量就没有关系，react 是单页面应用程序，都是模块化开发  也就是说 你里面的每一个对象都当作一个模块了，你必须通过import 导入进来的才是一个模块，才能进行识别，如果你是一个对象呢，不是模块里面导入进来的，他会认为你是一个非法的变量，就会给你提示undefind .怎么实现呢？
		// 我们需要加一个window   BMap  是挂载在window 下面的，window是一个全局变量，模块是不会去检测window 变量是否存在的 ，因为他是一个系统的变量，单页面应用程序不会去检测window是不是一个对象，但是他会检测BMap 是不是一个对象，挂载到window 下面就能够避免这一个错误了。
		// new BMap.Map("orderDetailMap",{enableMapClick:false});    // 创建Map实例 enableMapClick  启用地图的点击事件  地图禁止点击
		this.map = new window.BMap.Map('orderDetailMap') // 把对象挂载到我们当前的作用域里面去 形成这样的对象
		console.log(this.map)
		// this.map.centerAndZoom('北京',11); //设置地图中心坐标点 以及一个缩放等级
		// 添加地图控件 功能业务
		this.addMapControl() // 控件定义一个方法把他添加进去
		// 调用路线图绘制方法
		this.drawBikeRoute(result.position_list)
		// 调用服务区绘制方法
		this.drwaServiceArea(result.area)
	}

	// 添加地图控件
	addMapControl = () => {
		let map = this.map
		//ScaleControl 缩放控件 anchor：设置控件的存放位置
		//NavigationControl 导航控件
		map.addControl(
			new window.BMap.ScaleControl({
				anchor: window.BMAP_ANCHOR_TOP_RIGHT,
			})
		) // 放大缩小比例尺控件
		map.addControl(
			new window.BMap.NavigationControl({
				anchor: window.BMAP_ANCHOR_TOP_RIGHT,
				// LARGE类型
				type: window.BMAP_NAVIGATION_CONTROL_LARGE,
				// 启用显示定位
				enableGeolocation: true,
			})
		) // 导航控件

		var geolocationControl = new window.BMap.GeolocationControl()
		geolocationControl.addEventListener('locationSuccess', function (e) {
			// 定位成功事件
			var address = ''
			address += e.addressComponent.province
			address += e.addressComponent.city
			address += e.addressComponent.district
			address += e.addressComponent.street
			address += e.addressComponent.streetNumber
			alert('当前定位地址为：' + address)
		})
		geolocationControl.addEventListener('locationError', function (e) {
			// 定位失败事件
			alert(e.message)
		})
		map.addControl(geolocationControl)
	}

	// 绘制用户的行驶路线
	//positionList 行驶轨迹
	drawBikeRoute = (positionList) => {
		let startPoint = '' // 开始坐标点
		let endPoint = '' // 结束坐标点
		if (positionList.length > 0) {
			let first = positionList[0]
			let last = positionList[positionList.length - 1]

			// lon 经度 first 纬度
			startPoint = new window.BMap.Point(first.lon, first.lat) // BMap.Point 在地图里生成坐标点  拿到坐标点我们才能去做其他的业务
			//BMap.Icon 创建起始坐标点的图标   BMap.Size 控制图标大小 宽36 高42
			//startIcon 设置起始坐标
			let startIcon = new window.BMap.Icon(
				'/assets/start_point.png',
				new window.BMap.Size(36, 42),
				{
					imageSize: new window.BMap.Size(36, 42), // 添加图片的大小  前者：icon对象本身需要的空间 后者：设置空间里面图片的大小
					anchor: new window.BMap.Size(18, 42), // 设置图片的位置
				}
			)
			// icon 不能直接添加到我们地图里面去需要依赖于Marker   控制marker  坐标点 和icon(默认时气球的图标  这里给替换了我们自定义的图标  )
			let startMarker = new window.BMap.Marker(startPoint, {
				icon: startIcon,
			})
			this.map.addOverlay(startMarker) //addOverlay 在地图上添加一个起始坐标点
			// 添加结束的图标
			endPoint = new window.BMap.Point(last.lon, last.lat)
			let endIcon = new window.BMap.Icon(
				'/assets/end_point.png',
				new window.BMap.Size(36, 42),
				{
					imageSize: new window.BMap.Size(36, 42),
					anchor: new window.BMap.Size(18, 42),
				}
			)
			let endMarker = new window.BMap.Marker(endPoint, { icon: endIcon })
			this.map.addOverlay(endMarker)

			// 连接路线图
			let trackPoint = []
			for (let i = 0; i < positionList.length; i++) {
				let point = positionList[i]
				trackPoint.push(new window.BMap.Point(point.lon, point.lat)) // 把所有的坐标点都保存到trackPoint里面去
			}
			// 划线 帮助我们把坐标点连接起来
			// 折现 只会把坐标点连接起来 但是他没有闭合
			let polyline = new window.BMap.Polyline(trackPoint, {
				// 划线方法Polyline
				strokeColor: '#1869AD', // 各种属性 设置折线的颜色
				strokeWeight: 3, //折线的宽度
				strokeOpacity: 1, //透明度
			})
			this.map.addOverlay(polyline) //addOverlay 所有的对象都是通过addOverlay 的形式添加进去

			this.map.centerAndZoom(endPoint, 11) // 设置用户的终点为地图中心点， 其实应该把可视化区域把起点终点中间找一个点当作地图视野的中心点，
			// 因为我们的车辆他不一定是在北京，他还可能在其他城市  上海深圳等。所以我们需要根据用户接口返回的坐标点动态控制，怎么去聚焦，怎么把某一个点聚焦到视野的正中间
			this.map.setCurrentCity('北京') // 设置地图显示的城市 此项是必须设置的
			this.map.enableScrollWheelZoom(true)
		}
	}

	// 绘制服务区
	drwaServiceArea = (positionList) => {
		// 连接路线图
		let trackPoint = []
		for (let i = 0; i < positionList.length; i++) {
			let point = positionList[i]
			trackPoint.push(new window.BMap.Point(point.lon, point.lat))
		}
		// 绘制服务区
		let polygon = new window.BMap.Polygon(trackPoint, {
			// Polygon 绘制多边形 他是自动闭合的  他会把坐标点起点和终点闭合起来
			strokeColor: '#CE0000', // 多边形颜色
			strokeWeight: 4, //宽度
			strokeOpacity: 1, //透明度
			fillColor: '#ff8605', //填充颜色
			fillOpacity: 0.4, //填充透明度
		})
		this.map.addOverlay(polygon)
	}

	render() {
		const info = this.state.orderInfo || {}
		return (
			<DetailDiv>
				<Card>
					<div id="orderDetailMap" className="order-map"></div>
					<div className="detail-items">
						<div className="item-title">基础信息</div>
						<ul className="detail-form">
							<li>
								<div className="detail-form-left">用车模式</div>
								<div className="detail-form-content">
									{info.mode === 1 ? '服务区' : '停车点'}
								</div>
							</li>
							<li>
								<div className="detail-form-left">订单编号</div>
								<div className="detail-form-content">
									{info.order_sn}
								</div>
							</li>
							<li>
								<div className="detail-form-left">车辆编号</div>
								<div className="detail-form-content">
									{info.bike_sn}
								</div>
							</li>
							<li>
								<div className="detail-form-left">用户姓名</div>
								<div className="detail-form-content">
									{info.user_name}
								</div>
							</li>
							<li>
								<div className="detail-form-left">手机号码</div>
								<div className="detail-form-content">
									{info.mobile}
								</div>
							</li>
						</ul>
					</div>
					<div className="detail-items">
						<div className="item-title">行驶轨迹</div>
						<ul className="detail-form">
							<li>
								<div className="detail-form-left">行程起点</div>
								<div className="detail-form-content">
									{info.start_location}
								</div>
							</li>
							<li>
								<div className="detail-form-left">行程终点</div>
								<div className="detail-form-content">
									{info.end_location}
								</div>
							</li>
							<li>
								<div className="detail-form-left">行驶里程</div>
								<div className="detail-form-content">
									{info.distance / 1000}公里
								</div>
							</li>
						</ul>
					</div>
				</Card>
			</DetailDiv>
		)
	}
}
