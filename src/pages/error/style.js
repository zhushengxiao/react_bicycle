import styled from 'styled-components'
import err401Pic from './401.jpg'
import err404Pic from './404.jpg'

export const ErrorDiv = styled.div`
	.root {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 99999;
	}

	.container {
		display: flex;
		justify-content: center;
		flex-direction: column;
		position: absolute;
		bottom: 30px;
		.header {
			text-align: center;
			h1 {
				margin: 10px;
				font-size: 88px;
			}
		}
		.intro {
			margin-top: 16px;
			text-align: center;
		}
	}

	.error404 {
		background: url(${err404Pic}) no-repeat center #fff;
		background-size: contain;
	}

	.error401 {
		background: url(${err401Pic}) no-repeat center #fff;
		background-size: contain;
	}
`
