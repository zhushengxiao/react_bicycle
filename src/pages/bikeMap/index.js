import React from 'react'
import { Card } from 'antd'
import Moment from 'moment'
import axios from '../../axios'
import { apis } from '../../utils/apis'
import BaseForm from '../../components/BaseForm'

export default class BikeMap extends React.Component {
	state = {
		// res.result.total_count 使用  就需要定义state,否则就会报错
		bikeInfo: {},
	}

	map = {} // 保存地图对象

	// 表单封装，通过构建表单对象，在BaseForm中进行统一渲染
	formList = [
		// 配置化查询
		{
			type: 'SELECT',
			label: '城市',
			field: 'city_id',
			placeholder: 'Select',
			initialValue: '1',
			width: 200,
			list: [
				{ id: '0', name: '全部' },
				{ id: '1', name: '北京市' },
				{ id: '2', name: '天津市' },
				{ id: '3', name: '深圳市' },
			],
		},
		{
			type: 'TIME_ZONE', // 检测到如果type叫做TIME_ZONE (我们直接去给你封装两个组件---这里使用RangePicker 替换开始时间和结束时间两个组件的显示）
			label: '订单时间',
			field: 'order_time',
		},
		{
			type: 'SELECT',
			label: '订单状态',
			field: 'order_status',
			placeholder: 'Select',
			initialValue: '1',
			width: 200,
			list: [
				{ id: '0', name: '全部' },
				{ id: '1', name: '进行中' },
				{ id: '2', name: '进行中(临时锁车)' },
				{ id: '3', name: '行程结束' },
			],
		},
	]

	params = {
		page: 1,
		pageSize: 10,
	}

	componentDidMount() {
		this.requestList() //默认初始化方法  否则页面刷新是不会获取数据的
	}

	// 列表请求
	requestList = () => {
		axios
			.ajax({
				url: apis.bikeMap,
				data: this.params, // this.params  属于当前组件的全局对象
				// 为什么要通过this 去存储呢，通过this去存 实际上不需要渲染我们的render ,凡是在render里面需要使用到我  我们才把他存储到state 里面去
				// 这里只是一个参数  通常把他挂在到当前的this 对象里面去就可以了，不要把这个参数往state 里面去存，凡是往state里面去存的 都是需要调用render 方法的 。
			})
			.then((res) => {
				console.log(res)
				if (res.data.code === 200) {
					this.setState(
						{
							total_count: res.data.result.total_count,
							//res.data.result.total_count  这个值是在render中需要使用到的，必须要把他存下来，在render中 才能取到。
						},
						() => {}
					)
					this.renderMap(res.data.result) // 根据查询到的结果数据进行渲染地图，接收渲染地图的结果，根据结果去渲染，去处理我们的数据
					// res.data.result  就不需要往state里面去存了，因为他不需要去渲染render
					// 只需要操作这个div container,通过地图服务的能力 百度地图SDK  操作地图就可以了
				}
			})
	}

	// 查询表单 接收BaseForm 返回值  // handleFilterSubmit接收整个查询功能返回的参数   在参数里面去实现我们的查询功能
	handleFilterSubmit = (params) => {
		this.params = params
		this.params = {
			city_id: params.city_id,
			order_status: params.order_status,
			begin_time: Moment(params.order_time ? params.order_time[0] : ''),
			end_time: Moment(params.order_time ? params.order_time[1] : ''),
			page: this.params.page,
			pageSize: this.params.pageSize,
		}
		this.requestList()
	}

	// 渲染地图
	renderMap = (res) => {
		//  1. 初始化map地图（并且把地图某一个点聚集到屏幕的正中间）
		//  2. 获得起点和终点
		//  3.

		// 拿到我们路线的列表 （起点和终点的坐标）
		let list = res.route_list
		// 初始化map地图   把地图服务初始化到container里面去
		this.map = new window.BMap.Map('container', { enableMapClick: false })
		// 起点
		let gps1 = list[0].split(',')
		// 拿到起点坐标  坐标也是在window.BMap对象下面  .Point() 得到百度地图的坐标点 ，参数  精度和纬度
		let startPoint = new window.BMap.Point(gps1[0], gps1[1])
		// 终点
		let gps2 = list[list.length - 1].split(',')
		// 拿到终点坐标
		let endPoint = new window.BMap.Point(gps2[0], gps2[1])
		// 保证地图根据某一个点去居中 缩放等级11级
		this.map.centerAndZoom(endPoint, 11)

		// 完成地图上面数据的渲染部分
		// 1.渲染地图的起点 车辆的起点和终点 ，然后去绘制车辆的行驶路线
		// 2.然后绘制服务区  和 地图分布的数据

		//-------------
		// window ：这个对象实际上组件模块化开发是不会去检测的，但是不去加载window  我们的BMap 等，实际上是没有导入
		// 因为我们的百度SDK 是直接通过js 引入进来的，而不是通过npm 安装的组件包，所以我们这里最好是加window.。否则会找不到
		//------------
		// 绘制渲染地图的起点
		//添加起始图标（车辆的起点）
		// 通过BMap对象获取Icon对象（第一个参数：图标路径，第二个参数：开辟的整个空间大小，第三个参数：icon 的选项，配置条件）

		let startPointIcon = new window.BMap.Icon(
			'/assets/start_point.png',
			new window.BMap.Size(36, 42),
			{
				imageSize: new window.BMap.Size(36, 42), //配置图片大小
				anchor: new window.BMap.Size(18, 42), // 控制图片的偏移量  图片的位置 使图片和路线点正好对齐
			}
		)
		// Marker 地图的覆盖物 （点的位置，同时指定icon  这就给他添加了一张图片上去了）
		var bikeMarkerStart = new window.BMap.Marker(startPoint, {
			icon: startPointIcon,
		})
		// 初始化一个组件之后 需要通过 addOverlay去把他添加到地图上面去， 这个时候地图才能把它显示出来
		this.map.addOverlay(bikeMarkerStart)
		// 车辆的终点
		let endPointIcon = new window.BMap.Icon(
			'/assets/end_point.png',
			new window.BMap.Size(36, 42),
			{
				imageSize: new window.BMap.Size(36, 42),
				anchor: new window.BMap.Size(18, 42),
			}
		)
		// 把结束的坐标点也绑定上去
		var bikeMarkerEnd = new window.BMap.Marker(endPoint, {
			icon: endPointIcon,
		})
		// 保证我们的地图能够渲染出来
		this.map.addOverlay(bikeMarkerEnd)

		// 路线列表 保存路线的坐标点
		let routeList = []
		list.forEach((item) => {
			// item 里面的坐标点是一个字符串
			let p = item.split(',') // split 分割
			// 创建百度地图的坐标点
			let point = new window.BMap.Point(p[0], p[1])
			// 车辆行驶路线所有坐标点全部进行保存
			routeList.push(point) // 添加到对象数组里面去
		})
		// 行驶路线（绘制行驶路线）折现部分就是  整个车辆在骑的过程中向服务端上报的数据点
		// 我们可以看到很多对象类都是挂在到BMap 下面的
		// Polyline折现 他会把所有的坐标点连接起来
		var polyLine = new window.BMap.Polyline(routeList, {
			// 如下为配置
			strokeColor: '#ef4136', // 线颜色
			strokeWeight: 3, //线粗
			strokeOpacity: 1, // 透明度
		})
		// 任何的组件控件 都是通过addOverlay添加到地图上面去的
		this.map.addOverlay(polyLine)

		// 服务区路线（类似起始路线 也是化折线图）
		let serviceList = res.service_list
		let servicePointist = [] // 定义坐标点
		serviceList.forEach((item) => {
			let point = new window.BMap.Point(item.lon, item.lat) // lon 精度  lat:纬度
			servicePointist.push(point) //把所有坐标点装载起来
		})
		// 画线（只要掌握Polyline 是画直线的 就很简单）
		var polyServiceLine = new window.BMap.Polyline(servicePointist, {
			// 把坐标点丢进去 进行绘制 绘制这个服务区还是比较简单的
			strokeColor: '#ef4136',
			strokeWeight: 3,
			strokeOpacity: 1,
		})
		this.map.addOverlay(polyServiceLine)

		// 添加地图中的自行车图标（订单车绘制到地图上 ，每辆自行车都会隔段时间上传一次坐标点，上报我们当前是在哪个位置，
		// 服务器拿到之后  就会做这种大数据地图的可视化，就会把坐标点绘制成坐标系，然后再把它绘制到地图中）
		let bikeList = res.bike_list
		// 绘制icon 图表 创建icon 图表 把图表 绑定到marker 上面去  ，和起点终点比较类似
		let bikeIcon = new window.BMap.Icon(
			'/assets/bike.jpg',
			new window.BMap.Size(36, 42),
			{
				imageSize: new window.BMap.Size(36, 42),
				anchor: new window.BMap.Size(18, 42),
			}
		)
		bikeList.forEach((item) => {
			// 遍历自行车的坐标点
			let p = item.split(',')
			// 通过这种方式创建坐标点
			let point = new window.BMap.Point(p[0], p[1])
			// 我们必须创建marker 地图上创建icon  必须通过marker 去实现，不能直接把一个icon设置到地图上面去，这样是不允许的
			var bikeMarker = new window.BMap.Marker(point, { icon: bikeIcon })
			// marker 首先去设置marker坐标点point  ，第一个参数：point（它是一个覆盖物）我们需要把这个覆盖物放到地图中的哪个位置
			// 就必须有个point 点，设置我们的marker 他上面去添加一个图片，添加什么图片，就是我们的bikeIcon。
			//（如果不设置icon 就会是一个默认的气球图片，他也是一个覆盖物，其实他背后有一张默认图片，他本身也是图片，这里只是给他做一个图片icon 的覆盖）
			this.map.addOverlay(bikeMarker) // 通过addOverlay给他添加上去
		})

		// 添加地图控件
		this.addMapControl()
	}

	// 添加地图控件
	addMapControl = () => {
		let map = this.map
		// 右上角，添加比例尺
		var top_right_control = new window.BMap.ScaleControl({
			anchor: window.BMAP_ANCHOR_TOP_RIGHT,
		})
		var top_right_navigation = new window.BMap.NavigationControl({
			anchor: window.BMAP_ANCHOR_TOP_RIGHT,
		})
		//添加控件和比例尺
		map.addControl(top_right_control)
		map.addControl(top_right_navigation)
		map.enableScrollWheelZoom(true)
		// legend.addLegend(map);
	}

	render() {
		return (
			<div>
				<Card>
					<BaseForm
						formList={this.formList}
						filterSubmit={this.handleFilterSubmit}
					/>
				</Card>
				<Card style={{ marginTop: 10 }}>
					<div style={{ paddingBottom: 10 }}>
						共{this.state.total_count}辆车
					</div>
					<div id="container" style={{ height: 500 }}></div>
					{
						//高度必须定义的  否则地图是撑不开的
					}
				</Card>
			</div>
		)
	}
}
