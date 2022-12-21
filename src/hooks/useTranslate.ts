import { useIntl } from 'react-intl';
import { en } from 'translations/en';
import { PrimitiveType } from 'intl-messageformat';

export const useTranslate = () => {
	const intl = useIntl();
	const translate = (id: keyof typeof en, values?: Record<string, PrimitiveType>) => {
		return intl.formatMessage({ id }, values);
	};
	return translate;
};
