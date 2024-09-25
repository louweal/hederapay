import { decodeData } from './decodeData';

export const setWalletConnectId = function setWalletConnectId() {
    let metadata = document.querySelector('#hederapay-app-metadata');

    if (metadata) {
        let metadataData = decodeData(metadata.dataset.attributes);
        return metadataData.projectId;
    }
    return undefined;
};
