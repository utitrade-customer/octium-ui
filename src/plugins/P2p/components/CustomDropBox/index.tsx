import React, { useEffect, useState } from 'react';
import { IoIosCloseCircle } from 'react-icons/io';
import { FaBitcoin } from 'react-icons/fa';
import { Dropdown, Input, Menu } from 'antd';
import { FiSearch } from 'react-icons/fi';
import { AiFillCaretDown } from 'react-icons/ai';

interface CustomDropBoxProps {
	values: string[];
	onSelect?: (name: string) => void;
	isForFiat?: boolean;
	dropdownWidth?: number | string;
	value?: string;
	imgs?: string[];
}

export const CustomDropBox = (props: CustomDropBoxProps) => {
	const { values, isForFiat = false, dropdownWidth, value, onSelect, imgs } = props;

	const [selectedValue, setSelectedValue] = useState<string>(values[0]);

	const [searchKeywords, setSearchKeywords] = useState('');

	useEffect(() => {
		value && setSelectedValue(value);
	}, [value]);

	const onChooseValue = (value: string) => {
		setSelectedValue(value);
		onSelect && onSelect(value);
	};

	const renderMenuItems = () => {
		return values.reduce((prev: JSX.Element[], currentValue, index) => {
			if (currentValue.toLocaleLowerCase().indexOf(searchKeywords.toLocaleLowerCase()) !== -1) {
				return prev.concat(
					<Menu.Item
						key={index}
						// onClick={() => handleChangeCurrency(e.id)}
						className="p2p-component-custom-drop-box__dropdown__options__option"
						onClick={() => onChooseValue(currentValue)}
					>
						<div
							key={currentValue}
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							{isForFiat &&
								imgs &&
								(imgs[index] ? <img src={imgs[index]} /> : <FaBitcoin style={{ marginRight: '0.5em' }} />)}
							<span>{currentValue}</span>
						</div>
					</Menu.Item>,
				);
			}
			return prev;
		}, []);
	};

	const options = (
		<Menu className="p2p-component-custom-drop-box__dropdown__options" style={{ width: dropdownWidth }}>
			<div className="d-flex">
				<Input
					className="p2p-component-custom-drop-box__dropdown__options__input"
					prefix={<FiSearch style={{ color: 'rgb(var(--rgb-text-black))' }} />}
					suffix={
						<IoIosCloseCircle style={{ color: 'rgb(var(--rgb-text-black))' }} onClick={() => setSearchKeywords('')} />
					}
					onChange={e => {
						const value = e.target.value;
						setSearchKeywords(value);
					}}
					value={searchKeywords}
				></Input>
			</div>
			{renderMenuItems()}
			{renderMenuItems().length === 0 && (
				<div className="p2p-component-custom-drop-box__dropdown__options__no-option">No options</div>
			)}
		</Menu>
	);

	const RenderValueImageChoose = () => {
		if (!imgs || !value) {
			return null;
		}

		const img = imgs[values.findIndex(e => e === value)];

		if (!img) {
			return <FaBitcoin style={{ marginRight: '0.5em', width: '1.7em', height: '1.7em' }} />;
		}

		return <img src={img} />;
	};

	return (
		<div className="p2p-component-custom-drop-box">
			<Dropdown overlay={options} placement="bottomLeft" trigger={['click']}>
				<div className="p2p-component-custom-drop-box__dropdown">
					<div className="d-flex flex-row justify-content-between align-items-center">
						<div className="d-flex flex-row align-items-center">
							{/* {isForFiat && <FaBitcoin style={{ marginRight: '0.5em', width: '1.7em', height: '1.7em' }} />}
							 */}
							{isForFiat && <RenderValueImageChoose />}
							<div
								className="p2p-component-custom-drop-box__dropdown__value"
								style={{ marginLeft: !isForFiat ? '1em' : 0 }}
							>
								{selectedValue || value}
							</div>
						</div>

						<AiFillCaretDown />
					</div>
				</div>
			</Dropdown>
		</div>
	);
};
