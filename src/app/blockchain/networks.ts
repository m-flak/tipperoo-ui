import { NetworkConstants } from './networks.constants';

export const getNetwork = (chainId: string) => {
    switch (chainId) {
        case NetworkConstants.BASE:
            return NETWORKS.base;
        case NetworkConstants.BASE_SEPOLIA:
            return NETWORKS.baseSepolia;
        case NetworkConstants.SCROLL:
            return NETWORKS.scroll;
        case NetworkConstants.MONAD_TESTNET:
            return NETWORKS.monadTestnet;
        case NetworkConstants.SCROLL_SEPOLIA:
        default:
            return NETWORKS.scrollSepolia;
    }
};

export const NETWORKS = {
    scroll: {
        chainId: '0x82750',
        name: 'Scroll',
        rpcUrls: ['https://rpc.scroll.io'],
        nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
        },
        blockExplorerUrls: ['https://scrollscan.com/'],
        bridgeUrl: 'https://portal.scroll.io/bridge',
        nativeTokenIcon: '/icons/ethereum-asset.svg',
        contracts: {
            nft: import.meta.env.NG_APP_NFT_CONTRACT,
            creditsMgr: import.meta.env.NG_APP_CMGR_CONTRACT,
            tipper: import.meta.env.NG_APP_TIPPER_CONTRACT,
        },
        alchemyBaseUrl: 'https://scroll-mainnet.g.alchemy.com/v2/',
    },
    scrollSepolia: {
        chainId: '0x8274F',
        name: 'Scroll Sepolia',
        rpcUrls: ['https://sepolia-rpc.scroll.io'],
        nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
        },
        blockExplorerUrls: ['https://sepolia.scrollscan.com/'],
        bridgeUrl: 'https://portal-sepolia.scroll.io/bridge',
        nativeTokenIcon: '/icons/ethereum-asset.svg',
        contracts: {
            nft: import.meta.env.NG_APP_NFT_CONTRACT_TESTNET,
            creditsMgr: import.meta.env.NG_APP_CMGR_CONTRACT_TESTNET,
            tipper: import.meta.env.NG_APP_TIPPER_CONTRACT_TESTNET,
        },
        alchemyBaseUrl: 'https://scroll-sepolia.g.alchemy.com/v2/',
    },
    baseSepolia: {
        chainId: '0x14A34',
        name: 'Base Sepolia',
        rpcUrls: ['https://sepolia.base.org'],
        nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
        },
        blockExplorerUrls: ['https://sepolia.basescan.org/'],
        bridgeUrl: 'https://superbridge.app/base-sepolia',
        nativeTokenIcon: '/icons/ethereum-asset.svg',
        contracts: {
            nft: import.meta.env.NG_APP_NFT_CONTRACT_BASE_TESTNET,
            creditsMgr: import.meta.env.NG_APP_CMGR_CONTRACT_BASE_TESTNET,
            tipper: import.meta.env.NG_APP_TIPPER_CONTRACT_BASE_TESTNET,
        },
        alchemyBaseUrl: 'https://base-sepolia.g.alchemy.com/v2/',
    },
    base: {
        chainId: '0x2105',
        name: 'Base',
        rpcUrls: ['https://mainnet.base.org'],
        nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
        },
        blockExplorerUrls: ['https://basescan.org/'],
        bridgeUrl: 'https://bridge.base.org',
        nativeTokenIcon: '/icons/ethereum-asset.svg',
        contracts: {
            nft: import.meta.env.NG_APP_NFT_CONTRACT_BASE,
            creditsMgr: import.meta.env.NG_APP_CMGR_CONTRACT_BASE,
            tipper: import.meta.env.NG_APP_TIPPER_CONTRACT_BASE,
        },
        alchemyBaseUrl: 'https://base-mainnet.g.alchemy.com/v2/',
    },
    monadTestnet: {
        chainId: '0x279f',
        name: 'Monad Testnet',
        rpcUrls: ['https://testnet-rpc.monad.xyz'],
        nativeCurrency: {
            name: 'Monad',
            symbol: 'MON',
            decimals: 18,
        },
        blockExplorerUrls: ['https://testnet.monadexplorer.com/'],
        bridgeUrl: null,
        nativeTokenIcon: null,
        contracts: {
            nft: import.meta.env.NG_APP_NFT_CONTRACT_MONAD_TESTNET,
            creditsMgr: import.meta.env.NG_APP_CMGR_CONTRACT_MONAD_TESTNET,
            tipper: import.meta.env.NG_APP_TIPPER_CONTRACT_MONAD_TESTNET,
        },
        alchemyBaseUrl: 'https://monad-testnet.g.alchemy.com/v2/',
    },
};
