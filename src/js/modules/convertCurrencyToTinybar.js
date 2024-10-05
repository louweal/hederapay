import { convertPrice } from "./convertPrice";

export const convertCurrencyToTinybar = async function convertCurrencyToTinybar(amount, currency) {
    try {
        const hbarPriceInCurrency = await convertPrice(currency, "hedera-hashgraph");
        // if (hbarPriceInCurrency === undefined) {
        //     throw new Error("Failed to retrieve HBAR price");
        // }
        return Math.round((amount / hbarPriceInCurrency) * 1e8);
    } catch (error) {
        console.error("Error converting currency to hbar/tinybar:", error);
        throw error;
    }
};
