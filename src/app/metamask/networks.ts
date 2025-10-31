export const getNetwork = (chainId: string) => {
    switch (chainId) {
        case "0x82750":
            return NETWORKS.scroll;
        case "0x8274F":
        default:
            return NETWORKS.scrollSepolia;
    }
}

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
            nft: import.meta.env.NG_APP_NFT_CONTRACT
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
            nft: import.meta.env.NG_APP_NFT_CONTRACT_TESTNET
        }
    }
};