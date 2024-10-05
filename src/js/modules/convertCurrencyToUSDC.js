import { convertPrice } from "./convertPrice";

export const convertCurrencyToUSDC = async function convertCurrencyToTinybar(amount, currency) {
    try {
        const converted = await convertPrice(currency, "usd-coin");

        return Math.round((amount / converted) * 1e6);
    } catch (error) {
        console.error("Error converting currency to USDC:", error);
        throw error;
    }
};
