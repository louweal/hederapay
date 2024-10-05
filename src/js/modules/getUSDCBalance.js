export const getUSDCBalance = async function getUSDCBalance(network, tokenId, accountId) {
    let url = `https://${network}.mirrornode.hedera.com/api/v1/accounts/${accountId}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {},
        });
        const text = await response.text(); // Parse it as text
        const data = JSON.parse(text); // Try to parse the response as JSON
        // The response was a JSON object

        let balance = data["balance"];
        if (balance) {
            let tokens = balance["tokens"];
            for (let token of tokens) {
                if (token["token_id"] === tokenId) {
                    return token["balance"];
                }
            }
        }
    } catch (err) {
        console.log(err);
        return null;
    }
};
