import { convertCurrencyToTinybar } from './convertCurrencyToTinybar';

export const getTinybarAmount = async function getTinybarAmount(transactionWrapper, transactionData) {
    let transactionInput = transactionWrapper.querySelector('.hederapay-transaction-input');
    let transactionNotices = transactionWrapper.querySelector('.hederapay-transaction-notices');
    transactionNotices.innerText = ''; // reset

    let currency = transactionData.currency;
    let amount = transactionData.amount;

    if (!amount) {
        // check for user input
        if (transactionInput) {
            if (transactionInput.value != '') {
                let amountInputValue = transactionInput.value;
                return await convertCurrencyToTinybar(amountInputValue, currency);
            } else {
                transactionNotices.innerText += 'Please enter the amount.';
                return null; // do nothing; amount missing
            }
        } else {
            return null; // do nothing; amount missing and input field missing
        }
    } else {
        return await convertCurrencyToTinybar(amount, currency);
    }
};
