require('dotenv').config();

const { Client, TokenId, AccountId, PrivateKey, TokenAssociateTransaction } = require('@hashgraph/sdk');

associate();

async function associate() {
    let accountId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
    let accountKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

    let tokenId = TokenId.fromString('0.0.429274'); // testnet usdc

    const client = Client.forTestnet();
    //Set the operator account and private key
    client.setOperator(accountId, accountKey);

    //Associate a token to an account and freeze the unsigned transaction for signing
    const transaction = await new TokenAssociateTransaction()
        .setAccountId(accountId)
        .setTokenIds([tokenId])
        .freezeWith(client);

    //Sign with the private key of the account that is being associated to a token
    const signTx = await transaction.sign(accountKey);

    //Submit the transaction to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    console.log('The transaction consensus status ' + transactionStatus.toString());
}
