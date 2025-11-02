import { NetworkConstants } from "./networks.constants";

export const getNetwork = (chainId: string) => {
    switch (chainId) {
        case NetworkConstants.SCROLL:
            return NETWORKS.scroll;
        case NetworkConstants.SCROLL_SEPOLIA:
        default:
            return NETWORKS.scrollSepolia;
    }
};

export const NETWORKS = {
    scroll: {
        chainId: "0x82750",
        name: "Scroll Sepolia",
        rpcUrls: ["https://rpc.scroll.io"],
        nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18
        },
        blockExplorerUrls: ["https://scrollscan.com/"],
        contracts: {
            nft: import.meta.env.NG_APP_NFT_CONTRACT,
            creditsMgr: import.meta.env.NG_APP_CMGR_CONTRACT
        }
    },
    scrollSepolia: {
        chainId: "0x8274F",
        name: "Scroll Sepolia",
        rpcUrls: ["https://sepolia-rpc.scroll.io"],
        nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18
        },
        blockExplorerUrls: ["https://sepolia.scrollscan.com/"],
        contracts: {
            nft: import.meta.env.NG_APP_NFT_CONTRACT_TESTNET,
            creditsMgr: import.meta.env.NG_APP_CMGR_CONTRACT_TESTNET
        }
    }
};