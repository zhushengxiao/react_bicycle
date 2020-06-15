import React from 'react'
import { Row, Col } from 'antd'
import Util from '../../utils/util'
import Axios from '../../utils/axios'
import './index.less'

export default class Header extends React.Component {
	state = {
		userName: 'Yi-Bu',
		nowDate: '',
		weatherDetail: '晴转多云',
	}

	componentWillMount() {
		setInterval(() => {
			this.setState({
				nowDate: Util.formatDate(new Date()),
			})
		}, 1000)

		this.getWeatherAPIData()
	}

	getWeatherAPIData() {
		let city = '北京'
		Axios.jsonp({
			url:
				'http://api.map.baidu.com/telematics/v3/weather?location=' +
				encodeURIComponent(city) +
				'&output=json&ak=3p49MVra6urFRGOT9s8UBWr2',
		}).then((res) => {
			let data = res.results[0].weather_data[0]
			this.setState({
				weatherDetail: data.weather,
				dayPic: data.dayPictureUrl,
			})
		})
	}

	render() {
		return (
			<div className="header">
				<Row className="header-top">
					<Col span={24}>
						<span>欢迎，{this.state.userName}</span>
						<span className="exit">退出</span>
					</Col>
				</Row>
				<Row className="breadcrumb">
					<Col span={4} className="breadcrumb-title">
						首页
					</Col>
					<Col span={20} className="weather">
						<span className="date">{this.state.nowDate}</span>
						<span className="weather-img">
							<img
								className="img"
								src={this.state.dayPic}
								alt=""
							/>
						</span>
						<span className="weather-detail">
							{this.state.weatherDetail}
						</span>
					</Col>
				</Row>
			</div>
		)
	}
}
