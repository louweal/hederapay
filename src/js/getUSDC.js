const { Client, TokenId, AccountId, PrivateKey, TransferTransaction } = require('@hashgraph/sdk');

// Create a client for the testnet
const client = Client.forTestnet();
client.setOperator(process.env.MY_ACCOUNT_ID, process.env.MY_PRIVATE_KEY); // Your account details

const usdcTokenId = TokenId.fromString('0.0.429274'); // USDC token ID
const swapAmount = 10; // Amount of USDC you want to receive

async function swapHbarForUSDC() {
    // Here you would implement the logic for swapping,
    // possibly interacting with a liquidity pool or a smart contract.

    // Example transfer USDC from a pool to your account:
    const transferTx = await new TransferTransaction()
        .addTokenTransfer(usdcTokenId, 'pool_account_id', -swapAmount * 10 ** 6) // Assuming 6 decimals for USDC
        .addTokenTransfer(usdcTokenId, process.env.MY_ACCOUNT_ID, swapAmount * 10 ** 6)
        .execute(client);

    const receipt = await transferTx.getReceipt(client);
    console.log('Swap Transaction Status:', receipt.status.toString());
}

// Execute the swap
swapHbarForUSDC().catch(console.error);
