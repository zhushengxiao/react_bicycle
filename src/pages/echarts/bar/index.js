import React from 'react'
import { Card } from 'antd'
import ReactEcharts from 'echarts-for-react'
import echartTheme from '../echartTheme'
// import echarts from 'echarts'
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts'
// 引入柱状图
import 'echarts/lib/chart/bar'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'

export default class Bar extends React.Component {
	state = {}
	componentWillMount() {
		// 提前把这个主题注入进去  不能在下面render 执行完 在去注入  那就可能晚了
		// 怎么去实现编码
		// 1.注册主题
		echarts.registerTheme('Imooc', echartTheme)
	}

	// 关键点 如何拼造option ,(去echarts 官网去拷贝一个过来)
	getOption() {
		let option = {
			// 配置 肯定是一个object  // 如何定义
			title: {
				// 定义图表的标题
				text: '用户骑行订单', // text 文本  ，都是这种配置化的形式  通过text 去写我们的标题
			},
			// 百度 echarts  内部封装好 的一种值，只需要按照他的规则去展示 就好了  展示的效果是处理好的 也可以加自定义的tooltip
			tooltip: {
				// 鼠标移动上去 有个框 提示条 。
				// 有很多自定义的方式，根据公司需求加一些 不同种类 tooltip 的值
				trigger: 'axis', // 鼠标移动上去  展示x轴的数据  （周几 订单量多少）
			},
			xAxis: {
				// x轴的数据加载  语法基本固定 里面的配置项也都是固定的
				data: [
					// 指定数据源 x 轴需要展示的数据 周一到周日  ，这里不在通过进行moke加载数据的方式进行演示
					// 实际开发的时候  只需要把data 替换成数据接口 服务端返回的数据就可以了 形式都是一样的
					'周一',
					'周二',
					'周三',
					'周四',
					'周五',
					'周六',
					'周日',
				],
			},
			yAxis: {
				// y 轴 主要是呈现的我们的数据量  数据的一个值，不需要配备很多东西  因为他这个值会自动的去计算 ，指定type 指向value
				// 把y 轴 里面的值 给列出来就ok了  核心数据是在series 里面
				type: 'value',
			},
			//  定义我们整个的数据量 展示每一个x轴 坐标 对应的一个数据量。数据列出来之后，他会自动计算哪一个最高 最高3000 他就会把
			// y 轴定义成 0 500 1000 1500 2000 2500 3000 这种形式，自动计算  到底什么样区间比例 计算 这个比例值  ，
			// 这个比例值 不是我们去定义的 ，我们只需要把每一条柱形图数据呢呈现出来 ，他内部会进行计算 从最小的到最高的，等级是多少，这个不是我们关注的
			series: [
				// 我们只需要定义数据源
				{
					name: '订单量',
					type: 'bar', // 代表柱形图
					data: [
						// 只需要写7个就可以了 ，和x 轴的data 保持一一对应 千万不能说少一个 多一个   否则会出问题
						// 这样就实现了一个柱形图 主要是一种思路  做这个图的一种思路  怎么去实现这么一种东西
						1000,
						2000,
						1500,
						3000,
						2000,
						1200,
						800,
					],
				},
			],
		}
		return option // 配置完之后肯定是去return option
	}

	getOption2() {
		let option = {
			title: {
				text: '用户骑行订单',
			},
			tooltip: {
				trigger: 'axis',
			},
			// 副标题 种类分类的一个处理
			legend: {
				// 本身也是需要把数据列出来的  统一的。
				// 这个他还做了一个过滤的功能  点击图表，地图帮我们去做了一个封装 并不是我们去做的一个处理
				data: ['OFO', '摩拜', '小蓝'],
			},
			xAxis: {
				data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
			},
			yAxis: {
				type: 'value',
			},
			// 整个的数据源 一定不是在yAxis 中 搞很多数据源   x轴 搞很多的数据源
			series: [
				// 数组形式 写三个 就可以把三个的订单量加载出来
				// 定义series  加载我们的数据源
				{
					name: 'OFO',
					type: 'bar',
					data: [2000, 3000, 5500, 7000, 8000, 12000, 20000],
				},
				{
					name: '摩拜',
					type: 'bar',
					data: [1500, 3000, 4500, 6000, 8000, 10000, 15000],
				},
				{
					name: '小蓝',
					type: 'bar',
					data: [1000, 2000, 2500, 4000, 6000, 7000, 8000],
				},
			],
		}
		return option
	}

	render() {
		return (
			<div>
				<Card title="柱形图表之一">
					{
						// 2.
						// 加载组件 添加option->是他的配置,我们只需要实现这个option，图表就可以加载出来了
						// them:配置当前加载图表的他的主题 主题值必须要和上面注册的主题保持一致 否则你是加载不出来的（使用主题）
						// 提前把这个主题注入进去echarts.registerTheme('Imooc', echartTheme);  不能在下面render 执行完 在去注入  那就可能晚了 theme 加载的时候就找不到了 他只加载一次
						// 这里并没有用this.state 去取这个值，因为他这个组件化配置 实际上是
						// 我们所谓取state 里面的值 更多是渲染到我们页面上去得，比如说数字 某个标签元素 需要获取到里面dom值得时候，我们需要从state里面去取的，
						// 但是我们使用ReactEcharts 他是自己封装在里面的，我们只需要在这个方法里面取到option值 就可以了，我没有必要去定义一个state,让他再去渲染render,这个是完全没有必要的
					}
					<ReactEcharts
						option={this.getOption()}
						theme="Imooc"
						notMerge={true}
						lazyUpdate={true}
						style={{ height: 500 }}
					/>
				</Card>
				<Card title="柱形图表之二" style={{ marginTop: 10 }}>
					{
						//ofo 摩拜 小蓝 骑行量 分别做了一个对比，每天大概是一个什么样的数据
					}
					<ReactEcharts
						option={this.getOption2()}
						theme="Imooc"
						notMerge={true}
						lazyUpdate={true}
						style={{ height: 500 }}
					/>
				</Card>
			</div>
		)
	}
}
