import { decodeData } from './decodeData';

export const setAppMetadata = function setAppMetadata() {
    let metadata = document.querySelector('#hederapay-app-metadata');

    if (metadata) {
        let metadataData = decodeData(metadata.dataset.attributes);

        return {
            name: metadataData.name,
            description: metadataData.description,
            icons: [metadataData.icon],
            url: metadataData.url,
        };
    }
    return {};
};
