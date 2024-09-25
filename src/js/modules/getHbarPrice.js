export const getHbarPrice = async function getHbarPrice(currency) {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=hedera-hashgraph&vs_currencies=' + currency;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data['hedera-hashgraph'][currency];
    } catch (error) {
        console.error('Error fetching HBAR price:', error);
        throw error;
    }
};
