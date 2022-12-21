import React, { useState } from 'react';
import { AiFillPlusCircle, AiFillMinusCircle } from 'react-icons/ai';

interface FAQItemProps {
	question: string;
	answer?: string;
}

export const FAQItem = (props: FAQItemProps) => {
	const { question, answer } = props;
	const [showContent, setShowContent] = useState(false);

	return (
		<div className="p2p-mobile-component-faq-item">
			{showContent ? (
				<AiFillMinusCircle className="p2p-mobile-component-faq-item__icon" onClick={() => setShowContent(false)} />
			) : (
				<AiFillPlusCircle className="p2p-mobile-component-faq-item__icon" onClick={() => setShowContent(true)} />
			)}

			<div className="d-flex flex-column align-items-start">
				<div className="p2p-mobile-component-faq-item__question mb-2">{question}</div>
				{showContent && <div className="p2p-mobile-component-faq-item__answer">{answer}</div>}
			</div>
		</div>
	);
};
