import styled from 'styled-components';

export const OrderHistoryStyle = styled.div`
	height: 350px;
	margin-bottom: 3px;

	.rc-tabs {
		height: 100%;
		display: flex;
		flex-direction: column;
		.rc-tabs-nav {
			display: flex;
			align-items: center;
			background-color: var(--thin-blue);

			.rc-tabs-extra-content {
				padding: 0 13px;
				display: flex;
				align-items: center;
				.td-open-orders-tabs__cancel {
					color: var(--system-text-black-color);
					cursor: pointer;
					:hover {
						color: var(--blue);
					}
					svg {
						margin-left: 5px;
					}
				}
			}
			.rc-tabs-nav-wrap {
				flex: 1;
				.rc-tabs-nav-list {
					padding: 0px 13px;
					display: flex;

					.rc-tabs-tab {
						font-weight: 500;
						padding: 5px 25px;

						&.rc-tabs-tab-active {
							font-weight: 600;
							background-color: var(--trading-body-background);
							.rc-tabs-tab-btn {
								color: var(--system-text-black-color);
							}
						}
						:not(:last-child) {
							margin-right: 24px;
						}
						.rc-tabs-tab-btn {
							color: #848e9c;
							font-size: 14px;
							padding: 5px 0;
							outline: none;
							cursor: pointer;
						}
					}
				}
			}
		}
		.rc-tabs-content-holder {
			flex: 1;
			.rc-tabs-content {
				height: 100%;
				.rc-tabs-tabpane {
					height: 100%;
					outline: none;
					padding: 8px 0;
				}
			}
		}
		.rc-tabs-ink-bar,
		.rc-tabs-nav-operations {
			display: none;
		}
	}
`;

export const TableStyle = styled.table`
	width: 100%;
	table-layout: fixed;
	border-collapse: collapse;
	color: var(--system-text-black-color);
	thead {
		color: #848e9c;
		tr {
			position: relative;
			th {
				border: none;
				text-align: left;
				font-weight: 500;
			}
		}
	}
	tbody {
		display: block;
		overflow: auto;
		width: 100%;
		height: 260px;
		td {
			border: none;
		}
	}
	tr {
		display: flex;
		th,
		td {
			flex: 1;
			padding: 3px 13px;
			:not(:first-child):not(:last-child) {
				text-align: right;
			}
			:last-child {
				text-align: center;
				svg {
					cursor: pointer;
				}
			}
		}
	}
`;

export const OpenOrdersStyle = styled.div`
	height: 100%;
	${TableStyle} {
		tr {
			th,
			td {
				:not(:first-child):not(:last-child) {
					text-align: right;
				}
				:last-child {
					text-align: center;
					svg {
						cursor: pointer;
					}
				}
			}
		}
	}
`;

export const OrderHistoryListStyle = styled.div`
	${TableStyle} {
		tbody {
			height: 240px;
		}
		tr {
			th,
			td {
				:first-child {
					flex: 2;
				}
			}
			td {
				.td-order-history-list-executed {
					color: var(--blue);
				}

				.td-order-history-list-canceled {
					color: var(--system-red);
				}

				.td-order-history-list-opened {
					color: var(--system-green);
				}
			}
		}
	}
`;
