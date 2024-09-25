import { getHbarPrice } from './getHbarPrice';

export const convertCurrencyToTinybar = async function convertCurrencyToTinybar(amount, currency) {
    try {
        const hbarPriceInCurrency = await getHbarPrice(currency);
        if (hbarPriceInCurrency === undefined) {
            throw new Error('Failed to retrieve HBAR price');
        }
        return Math.round((amount / hbarPriceInCurrency) * 1e8);
    } catch (error) {
        console.error('Error converting HBAR to currency:', error);
        throw error;
    }
};
