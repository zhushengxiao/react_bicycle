import React, { PureComponent } from 'react'
import { Button, Card, Modal } from 'antd'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftjs from 'draftjs-to-html' // 这里使用这种方式 编辑器中的内容转换成我们想要的html 方式

export default class RichText extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			showRichText: false, // 控制弹框的显示隐藏
			editorContent: '',
			editorState: '', // 在state 中进行定义
		}
	}

	handleClearContent = () => {
		// 清空文本的内容  清空的时候 ，实际上只要把这个状态清空就可以了，状态是变化了以后  才会把值保存进来的
		this.setState({
			editorState: '', // 这里只需要把 状态清空掉 他的值就不存在了
			editorContent: '', // 同时清空 编辑器的内容的
		})
	}

	handleGetText = () => {
		// 获取的时候  弹框 文本框的html 内容
		this.setState({
			showRichText: true,
		})
	}

	//editorContent 内容的状态 ，editorContent是一个obj对象  我们输入的任何内容 实际上都已经被转换成一个object 对象了  ，
	// 通过obj形式去表达他的文本值得内容，所以说他并不是一个纯粹得文本。draftjs-to-html 把这个对象转换成对应的标签，比如说他把
	// 里面的文本 以及类型 以及标签结构等 都通过对象的形式去入的任何内容 实际上都已经被转换成一个object 对象了  ，
	// 通过obj形式去表达他的文本值得内容，所以说他并不是一个纯粹得文本。draftjs-to-html 把这个对象转换成对应的标签，比如说他把
	// 里面的文本 以及类型 以及标签结构等 都通过对象的形式去拼装了，所以说他转换的时候肯定是通过特定的结构把值转换出来，同时把标签也给转换出来。
	// 这个对象editorContent 就不能够直接去使用了，也不能直接把他传递到后台系统里面去了，肯定通过raftjs-to-html 把他转换成我们想要的格式，最终插入到数据库。
	onEditorChange = (editorContent) => {
		// 参数 内容的状态 ，这里面输入的值就是我们当前文本的内容
		this.setState({
			editorContent, // 下面就可以通过this.state  来取 编辑器的内容的。内容需要通过draftjs  转换成对应的html文本，这是我们想要的效果
		})
	}

	// editorState 编辑器的状态
	onEditorStateChange = (editorState) => {
		// 接收一个editorState  可以把这个editorState 丢进来
		this.setState({
			// 然后把这个值给他设置进去
			editorState, // 这样的话 state 中就保存了这个编辑器的状态 ,下面 editorState={editorState}  就能够接收到这个状态值了  。
		}) // 这样他们基本上就可以打通了 editorState={editorState} 是他需要的值 ，
		// onEditorStateChange={this.onEditorStateChange} 这个是当编辑器状态变化的时候呢，触发那个方法 ，然后把那个状态存一下 ，我们在下面接收这个值，然后赋值上去 ，这是我们富文本编辑器他的一个功能
	}

	render() {
		const { editorState } = this.state
		return (
			<div>
				<Card style={{ marginTop: 10 }}>
					<Button
						type="primary"
						onClick={this.handleClearContent}
						style={{ marginRight: 10 }}
					>
						清空内容
					</Button>
					<Button type="primary" onClick={this.handleGetText}>
						获取HTML文本
					</Button>
				</Card>
				<Card title="富文本编辑器">
					{
						// 基本用法 可以去 npm 搜索插件 可以找到对应的代码 进行粘贴就可以了
						// 编辑器他的一些字体的颜色会根据系统的主题进行定义
					}
					<Editor
						editorState={editorState} // editorState 编辑的状态 我们需要把状态值保存下来。他也提供方式供我们去修改他的样式
						onContentStateChange={this.onEditorChange} // 获取内容变化的时候 取这个内容的 当我们输入内容发生变化的时候 我们需要去处理一下
						onEditorStateChange={this.onEditorStateChange} // 编辑器状态发生变化的时候，他会接收这么一个方法 ，这个方法里面也会有很多的值 ，可以去看文档 这些值都是怎么去使用的
					/>
				</Card>
				<Modal
					title="富文本"
					visible={this.state.showRichText} // 控制弹框是否展示
					onCancel={() => {
						this.setState({
							showRichText: false,
						})
					}}
					footer={null} // footer  不需要 我们只需要展示一个内容
				>
					{draftjs(this.state.editorContent)}
					{
						// draftjs 只是转换的方法 值是我们需要转换的内容
					}
				</Modal>
			</div>
		)
	}
}
