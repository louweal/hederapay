/* IMPORTANT: THIS SCRIPT IS NOT ENQUEUED WHEN REALVIEWS IS ACTIVE */

import { HashConnect, HashConnectConnectionState } from "hashconnect";
import { TransferTransaction, Hbar, AccountId, TokenId } from "@hashgraph/sdk";
// import { ContractId, ContractExecuteTransaction, ContractFunctionParameters } from '@hashgraph/sdk';

import { setAppMetadata } from "./modules/setAppMetadata";
import { setQueryParamAndRedirect } from "./modules/setQueryParamAndRedirect";
import { decodeData } from "./modules/decodeData";
import { getTinybarAmount } from "./modules/getTinybarAmount";
import { getNetworkId } from "./modules/getNetworkId";
import { setConnectButtonsText } from "./modules/setConnectButtonsText";
import { setVisibleAccountId } from "./modules/setVisibleAccountId";
import { setWalletConnectId } from "./modules/setWalletConnectId";
import { getUSDCBalance } from "./modules/getUSDCBalance";
import { convertCurrencyToUSDC } from "./modules/convertCurrencyToUSDC";

// Main thread
(function () {
    "use strict";

    let hashconnect;
    let state = HashConnectConnectionState.Disconnected;
    let pairingData;
    let appMetadata = setAppMetadata();

    let projectId = setWalletConnectId();

    let localAccountId = localStorage.getItem("accountId");

    if (!hashconnect && localAccountId) {
        localStorage.removeItem("accountId");
    }

    setVisibleAccountId(localAccountId);
    setConnectButtonsText(undefined, localAccountId ? "disconnect_text" : "connect_text");

    let connectButtons = document.querySelectorAll(".hederapay-connect-button");
    [...connectButtons].forEach((connectButton) => {
        connectButton.addEventListener("click", async function () {
            let buttonData = decodeData(connectButton.dataset.attributes);

            if (!pairingData) {
                await init(buttonData.network); //connect
            } else {
                await hashconnect.disconnect(); // disconnect wallet
            }
        });
    });

    let transactionWrappers = document.querySelectorAll(".hederapay-transaction-wrapper");

    [...transactionWrappers].forEach((transactionWrapper) => {
        let transactionButton = transactionWrapper.querySelector(".hederapay-transaction-button");
        transactionButton.addEventListener("click", async function () {
            let transactionNotices = transactionWrapper.querySelector(".hederapay-transaction-notices");
            transactionNotices.innerText = ""; // reset

            let transactionData = decodeData(transactionButton.dataset.attributes);
            let network = transactionData.network;

            // connected to wrong network
            if (pairingData && pairingData.network != network) {
                console.log("wrong network");
                transactionNotices.innerText += "You're connected to the wrong network. Please reload and try again.";
                await hashconnect.disconnect(); // disconnect wallet

                return;
            }

            if (!pairingData) {
                await init(network);
            }

            let tokenId;
            switch (network) {
                case "testnet":
                    tokenId = "0.0.429274";
                    break;
                case "mainnet":
                    tokenId = "0.0.456858";
                    break;
                default:
                    tokenId = "0.0.429274";
                    break;
            }

            let balance = await getUSDCBalance(network, tokenId, pairingData.accountIds[0]);
            console.log(balance);

            let currency = transactionData.currency;
            let amount = transactionData.amount;
            let usdcAmount = await convertCurrencyToUSDC(amount, currency);
            console.log(usdcAmount);
            if (usdcAmount <= balance) {
                console.log("enough USDC");
                handleTransaction(transactionWrapper, transactionData, tokenId);
            } else {
                let tinybarAmount = await getTinybarAmount(transactionWrapper, transactionData);
                if (!tinybarAmount) return;
                handleTransaction(transactionWrapper, transactionData);
            }
        }); // eventlistener
    }); //foreach

    async function handleTransaction(transactionWrapper, transactionData, tokenId = false) {
        let transactionNotices = transactionWrapper.querySelector(".hederapay-transaction-notices");

        let fromAccount = AccountId.fromString(pairingData.accountIds[0]); // assumes paired and takes first paired account id
        const toAccount = AccountId.fromString(transactionData.account);

        let signer = hashconnect.getSigner(fromAccount);

        let transaction;
        if (!tokenId) {
            let tinybarAmount = await getTinybarAmount(transactionWrapper, transactionData);
            if (!tinybarAmount) return;
            // hbar transaction
            transaction = await new TransferTransaction()
                .addHbarTransfer(fromAccount, Hbar.fromTinybars(-1 * tinybarAmount)) //Sending account
                .addHbarTransfer(toAccount, Hbar.fromTinybars(tinybarAmount)) //Receiving account
                .setTransactionMemo(transactionData.memo)
                .freezeWithSigner(signer);
        } else {
            // usdc

            let usdcAmount = await convertCurrencyToUSDC(transactionData.amount, transactionData.currency);
            console.log(usdcAmount);

            transaction = await new TransferTransaction()
                .addTokenTransfer(TokenId.fromString(tokenId), fromAccount, -usdcAmount) //Sending account
                .addTokenTransfer(TokenId.fromString(tokenId), toAccount, usdcAmount) //Receiving account
                .setTransactionMemo(transactionData.memo)
                .freezeWithSigner(signer);
        }

        try {
            let response = await transaction.executeWithSigner(signer);
            console.log(response);

            const transactionId = response.transactionId.toString();
            console.log("Transaction ID:", transactionId);
            let receipt = await response.getReceiptWithSigner(signer);

            console.log(receipt);

            // Check if the transaction was successful
            if (receipt.status.toString() === "SUCCESS") {
                if (transactionData.store === true || transactionData.store === "true") {
                    // transaction data needs to be stored (for reviewing later)
                    setQueryParamAndRedirect("transaction_id", parseTransactionId(transactionId));
                } else {
                    transactionNotices.innerText += "Payment received. Thank you! ";
                }
                return;
            }
            console.log(`Transaction failed with status: ${receipt.status}`);
        } catch (e) {
            if (e.code === 9000) {
                transactionNotices.innerText += "Transaction rejected by user or insufficient balance. ";
            } else {
                transactionNotices.innerText += "Transaction failed. Please try again. ";
            }
        }
        return;
    }

    async function init(network) {
        // Create the hashconnect instance
        hashconnect = null;
        let debugMode = true;
        hashconnect = new HashConnect(getNetworkId(network), projectId, appMetadata, debugMode);

        setUpHashConnectEvents(); // Register events

        try {
            await hashconnect.init(); // Initialize

            if (!pairingData) {
                hashconnect.openPairingModal(); // Open pairing modal
            }
        } catch (e) {
            console.log(e);
        }
    }

    function setUpHashConnectEvents() {
        hashconnect.pairingEvent.on((newPairing) => {
            pairingData = newPairing;
            localStorage.setItem("accountId", pairingData.accountIds[0]); // set id in local browser storage
            setConnectButtonsText(pairingData.network, "disconnect_text");
            setVisibleAccountId(pairingData.accountIds[0]);
        });

        hashconnect.disconnectionEvent.on(() => {
            setConnectButtonsText(pairingData.network, "connect_text");
            pairingData = null;
            localStorage.removeItem("accountId"); // remove from browser storage
            setVisibleAccountId(undefined);
        });

        hashconnect.connectionStatusChangeEvent.on((connectionStatus) => {
            state = connectionStatus;
            // console.log(state);
        });
    }
})();
