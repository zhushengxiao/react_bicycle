import styled from 'styled-components'
import { colorAll } from '../../style/default'

export const DetailDiv = styled.div`
	.detail-items {
		margin-left: 90px;
		padding: 25px 50px 25px 0;
		border-bottom: 1px solid ${colorAll.colorN};

		&:last-child {
			border-bottom: none;
		}

		.item-title {
			margin: 20px 0;
			font-size: ${colorAll.fontG};
			color: ${colorAll.colorU};
		}

		.detail-form {
			li {
				margin: 20px 0;
				line-height: 20px;
				font-size: 15px;
				color: ${colorAll.colorC};
			}
		}

		.detail-form-left {
			float: left;
			width: 164px;
			text-align: right;
			color: ${colorAll.colorH};
		}

		.detail-form-content {
			padding-left: 194px;
		}
	}

	.order-map {
		height: 450px;
		margin: 25px -31px 0;
	}
`
