import React from 'react';
import { BankAccountItem } from 'plugins/Bank/components';
import { BankAccount } from 'modules/plugins/fiat/bank/types';
import { LoadingGif } from 'components/LoadingGif';

interface BankAccountListProps {
	bankAccounts: BankAccount[];
	isLoading: boolean;
}

export const BankAccountList = (props: BankAccountListProps) => {
	const { bankAccounts, isLoading } = props;

	return (
		<div className="desktop-bank-account-list-screen__bank-account-list">
			<table>
				<thead>
					<tr>
						<th>#</th>
						<th style={{ textAlign: 'left' }}>Name</th>
						<th>Account Number</th>
						<th>Bank Name</th>
						<th>Bank Address</th>
						<th>-</th>
					</tr>
				</thead>
				{/* Render Bank Account List Items  */}
				<tbody>
					{!isLoading &&
						bankAccounts.map((bankAccount, index) => (
							<BankAccountItem index={index + 1} bankAccountItem={bankAccount} key={bankAccount.id} />
						))}
				</tbody>
			</table>
			{!isLoading && bankAccounts.length === 0 && (
				<div className="text-center empty mt-3">
					<img
						className="text-center"
						width="100px"
						src="https://cdn-icons-png.flaticon.com/512/5089/5089733.png"
						alt="empty"
					/>
					<br />
					<p>No Data</p>
				</div>
			)}
			{isLoading && (
				<div className="desktop-bank-account-list-screen__bank-account-list__body-loading mt-3">
					<LoadingGif alt="loading" />
					<h3 className="mr-4">Loading</h3>
				</div>
			)}
		</div>
	);
};
