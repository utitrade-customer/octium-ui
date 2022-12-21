import classnames from 'classnames';
import { NewTabPanel } from 'components';
import { HistoryTable } from 'mobile/components/HistoryTable';
import { Subheader } from 'mobile/components/Subheader';
import { TabPane, TabsProps } from 'rc-tabs';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

// tslint:disable-next-line: no-empty-interface
interface FundingWalletHistoryProps {}

export const NewWalletFundingHistoryMobileScreen: React.FC<FundingWalletHistoryProps> = ({}) => {
	const intl = useIntl();
	const history = useHistory();

	const [currentTabIndex, setCurrentTabIndex] = React.useState<number>(0);

	const TAB_LIST_INFO = [
		{
			content: currentTabIndex === 0 ? <HistoryTable type="funding" /> : null,
			label: (i: number) => {
				const classActive = classnames('wallet-history-mobile-title', {
					'wallet-history-mobile-title__withdraw-active': i === 4,
				});
				return <div className={classActive}>Funding</div>;
			},
		},
	];

	const onChangeTabIndex: TabsProps['onChange'] = key => {
		setCurrentTabIndex(Number(key));
	};

	return (
		<div className="td-mobile-screen-wallet-history">
			<Subheader title={intl.formatMessage({ id: 'page.body.wallet.history.header' })} onGoBack={() => history.goBack()} />
			<NewTabPanel onChange={onChangeTabIndex}>
				{TAB_LIST_INFO.map((tabInfo, i) => (
					<TabPane key={i} tab={tabInfo.label(i)}>
						{tabInfo.content}
					</TabPane>
				))}
			</NewTabPanel>
		</div>
	);
};
