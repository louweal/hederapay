export const convertPrice = async function convertPrice(fromCurrency, toCurrency) {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${toCurrency}&vs_currencies=${fromCurrency}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data[toCurrency][fromCurrency];
    } catch (error) {
        console.error("Error fetching coingecko price:", error);
        throw error;
    }
};
