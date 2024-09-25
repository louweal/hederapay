import { decodeData } from './decodeData';

export const setConnectButtonsText = function setConnectButtonsText(network, attribute) {
    // if (!network) return;

    let connectButtons = document.querySelectorAll('.hederapay-connect-button');
    [...connectButtons].forEach((connectButton) => {
        let connectButtonData = decodeData(connectButton.dataset.attributes);
        if (!network || connectButtonData.network === network) {
            let connectButtonText = connectButton.querySelector('.hederapay-connect-button-text');
            connectButtonText.innerText = connectButtonData[attribute];
        }
    });
};
