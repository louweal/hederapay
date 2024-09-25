import { LedgerId } from '@hashgraph/sdk';

export const getNetworkId = function getNetworkId(network) {
    if (network == 'mainnet') return LedgerId.MAINNET;
    if (network == 'previewnet') return LedgerId.PREVIEWNET;
    return LedgerId.TESTNET;
};
