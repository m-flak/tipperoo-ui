import { makeEnvironmentProviders, InjectionToken } from '@angular/core';
import { MetaMaskSDK } from '@metamask/sdk';

const MMSDK = new MetaMaskSDK({
    dappMetadata: {
        name: 'Tipperoo - Decentralized Tipping',
        url: window.location.href,
        // iconUrl: "https://mydapp.com/icon.png" // Optional
    },
    infuraAPIKey: import.meta.env.NG_APP_INFURA_API_KEY,
});

export const METAMASK = new InjectionToken<string>('METAMASK');

export const provideMetamask = () => {
    return makeEnvironmentProviders([{ provide: METAMASK, useValue: MMSDK }]);
};
