# Refactor Plan: Network-Agnostic Native Token Support

Goal: remove all hardcoded ETH/Ethereum assumptions so the app works correctly on any EVM chain whose native gas token is not ETH (e.g. Monad with MON).

---

## Where ETH Is Currently Hardcoded

### 1. Network Configuration — `blockchain/networks.ts`

Every entry has its `nativeCurrency` hardcoded as ETH:

```ts
nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
},
```

This object is passed verbatim to `wallet_addEthereumChain` in `wallet-svc.abstract.ts:67`, so any new chain will also advertise ETH as its native token until this is fixed.

`blockchain/networks.constants.ts` has no concept of a native token symbol — it only lists chain IDs.

### 2. Native Balance Fetching — `wallets/wallet-svc.abstract.ts:97`

```ts
map((big) => Number((big / 1n ** 18n).toString()) / 1e18),
```

The 18-decimal conversion is hardcoded. The `decimals` field from the network config is never read here, making it a disconnected configuration value.

### 3. Transaction Value Encoding — `store/wallet.facade.ts:130,194`

Both `buyCredits` and `sendEthereum` multiply by `1e18` before sending as the transaction `value`:

```ts
BigInt(Math.floor(amount * 1e18))
```

This happens to be correct for MON (also 18 decimals) but is coincidental — the value is not derived from network config.

### 4. NgRx Store Shape — `store/wallet.*`

The entire state slice names the native balance as `eth`/`balanceEth`:

| File | Hardcoded reference |
|---|---|
| `wallet.actions.ts:14` | `props<{ credits: number; eth: number }>()` |
| `wallet.reducer.ts:18,34,66,77–80` | `balanceEth` field |
| `wallet.selectors.ts:18` | `eth: state.balanceEth` |
| `changes.constants.ts:6` | `SEND_ETHEREUM = 'SEND_ETHEREUM'` |
| `wallet.facade.ts:181,198,215,219` | method `sendEthereum()`, variable `eth` |

### 5. Price Feed — `store/price.facade.ts:14,17`

```ts
getEthereumPrice = () => this._store.select(selectPrice('ETH'));

getPrices() {
    this._store.dispatch(PriceActions.getPrice({ symbol: 'ETH' }));
}
```

`PriceActions.getPrice` already accepts a generic `{ symbol: string }` and `AlchemyService.getSymbolPrice(symbol)` is already generic — the issue is only in `PriceFacade` hardcoding `'ETH'`.

### 6. Credit Purchase Logic — `components/send-tips/send-tips.ts:24–41`

```ts
buyCreditsAllowance$ = this._priceFacade
    .getEthereumPrice()
    .pipe(
        mergeMap((ethPriceUsd) =>
            this._walletFacade
                .getBalances()
                .pipe(map(({ eth }) => Math.floor((ethPriceUsd * eth) / 0.1))),
        ),
    );

async buyCredits(amount: number) {
    const ethUsd = await firstValueFrom(this._priceFacade.getEthereumPrice());
    await this._walletFacade.buyCredits((amount * 0.1) / ethUsd);
}
```

Credits cost $0.10 each; affordability is computed as `ETH_balance * ETH_price_USD / 0.10`. Both the balance and price are ETH-specific.

### 7. UI & Templates

| File | Hardcoded reference |
|---|---|
| `top-bar/asset-summary/asset-summary.html:11–15` | `<img src="/icons/ethereum-asset.svg">`, `@Input() eth`, `.eth-amount` CSS class |
| `top-bar/top-bar.html:17–29` | `[eth]="balances.eth"`, hardcoded bridge links with `token=ETH` |
| `send-tips/send-tips.html:19–27` | `id="SendCurrency_Ethereum"`, `value="ethereum"`, label "Ethereum" |
| `send-tips/send-eth/send-eth.html:3` | `<span>Send Ethereum:</span>` |
| `receive-tips/receive-tips.html:28` | Copy: "...or Ethereum with Tipperoo!" |

The `send-eth/` component directory, class name `SendEth`, and selector are all ETH-specific.

---

## Refactoring Plan

Changes are grouped into 5 layers that should be implemented in order, as each layer unblocks the next.

### Layer 1 — Network Configuration (Foundation)

**`blockchain/networks.ts`**

Populate `nativeCurrency` correctly per network instead of hardcoding ETH everywhere. Add a `bridgeUrl` optional field to drive bridge links from config:

```ts
// Monad testnet example
{
    chainId: '0x279f',
    chainName: 'Monad Testnet',
    nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
    rpcUrls: [...],
    blockExplorerUrls: [...],
    bridgeUrl: null,  // new optional field
}
```

**`blockchain/networks.constants.ts`**

Add Monad chain IDs (`0x279f` = 10143 testnet; mainnet TBD when assigned).

---

### Layer 2 — NgRx Store Rename

Purely cosmetic but touches many files. Rename consistently across actions, reducer, selectors, and facade:

| Old | New |
|---|---|
| `WalletState.balanceEth` | `WalletState.balanceNative` |
| `setBalances({ credits, eth })` | `setBalances({ credits, native })` |
| `selectWallet.eth` | `selectWallet.native` |
| `SEND_ETHEREUM` | `SEND_NATIVE` |
| `sendEthereum()` | `sendNative()` |

Files: `wallet.actions.ts`, `wallet.reducer.ts`, `wallet.selectors.ts`, `changes.constants.ts`, `wallet.facade.ts`, and every component that reads `balances.eth`.

---

### Layer 3 — Services & Facades: Dynamic Decimals and Symbol

**`wallets/wallet-svc.abstract.ts` — `getBalance()`**

Replace the hardcoded `1e18` divisor with a value derived from the active network config. The service needs access to the current network — inject `NetworkService` (or a lightweight config helper) and compute:

```ts
const decimals = BigInt(network.nativeCurrency.decimals);
map((big) => Number(big) / Number(10n ** decimals))
```

**`store/wallet.facade.ts` — `buyCredits()` and `sendNative()`**

Same fix at lines 130 and 194. Replace `1e18` with the active network's decimal factor.

**`store/price.facade.ts`**

Replace the hardcoded `'ETH'` symbol with the active network's `nativeCurrency.symbol`. Since `PriceActions.getPrice({ symbol })` is already generic, this is just wiring — select the current chain's symbol from the store (chain ID is already in `WalletState`) and look it up in the network config:

```ts
getEthereumPrice = () =>
    this._store.select(selectActiveNetworkSymbol).pipe(
        switchMap((symbol) => this._store.select(selectPrice(symbol))),
    );
```

---

### Layer 4 — Component Updates

**`AssetSummary` component** (`top-bar/asset-summary/`)

- Rename `@Input() eth: number` → `@Input() nativeBalance: number`
- Add `@Input() nativeTokenSymbol: string`
- Add `@Input() nativeTokenIcon: string | null` (fall back to a generic coin SVG when null)
- Replace hardcoded `ethereum-asset.svg` with `[src]="nativeTokenIcon ?? genericCoinIcon"`
- Rename CSS class `.eth-amount` → `.native-amount`

**`TopBar` component** (`top-bar/top-bar.html`)**

- Pass `nativeBalance`, `nativeTokenSymbol`, and `nativeTokenIcon` into `<app-asset-summary>` from the active network config
- Replace hardcoded bridge links with `*ngIf="activeNetwork.bridgeUrl"` conditional driven from the new config field

**`SendNative` component** (currently `send-eth/`)

- Rename the directory, files, class, and selector from `send-eth`/`SendEth` to `send-native`/`SendNative`
- Change the template label from `"Send Ethereum:"` to `"Send {{ nativeTokenSymbol }}:"`
- Update the parent `send-tips.html` radio button from `value="ethereum"` / label "Ethereum" to use the dynamic symbol

**`ReceiveTips` template** (`receive-tips/receive-tips.html:28`)

- Replace the hardcoded `"Ethereum"` string in the copy with the active network's `nativeCurrency.name`

---

### Layer 5 — Credit Purchase Logic

**`send-tips/send-tips.ts`** (lines 24–41)

Observe the active network's native token symbol and use it for both the price lookup and the balance:

```ts
buyCreditsAllowance$ = this._walletFacade.getActiveNetworkSymbol().pipe(
    switchMap((symbol) =>
        combineLatest([
            this._priceFacade.getPrice(symbol),
            this._walletFacade.getBalances(),
        ]),
    ),
    map(([nativePriceUsd, { native }]) => Math.floor((nativePriceUsd * native) / 0.1)),
);
```

This works as long as there's a USD price feed for the active token. Verify Alchemy's `getSymbolPrice` endpoint supports `MON` before shipping Monad support — if not, a fallback source (CoinGecko, etc.) will be needed.

---

## Suggested Implementation Order

```
1. networks.ts / networks.constants.ts     ← config foundation, no side effects
2. NgRx store rename                       ← unblocks all downstream reads
3. wallet-svc.abstract.ts                  ← dynamic decimal conversion
4. wallet.facade.ts                        ← dynamic decimals + sendNative rename
5. price.facade.ts                         ← dynamic symbol selection
6. send-tips.ts                            ← credit purchase logic
7. AssetSummary component                  ← UI inputs + icon
8. TopBar component                        ← wires config into AssetSummary + bridge links
9. SendNative component rename             ← cosmetic rename
10. receive-tips.html                      ← one-line copy change
```

---

## Open Questions

1. **MON price feed** — Does Alchemy's `getSymbolPrice` endpoint support `MON`? If not, what is the fallback source?
2. **Network token icons** — Where do per-network token icons live? Options: a config field pointing to an asset path, or a shared icon registry keyed by symbol.
3. **Bridge links for non-ETH chains** — Should bridge links be hidden entirely for networks without a `bridgeUrl`, or replaced with a generic message?
4. **Single active network** — The current architecture assumes one active network at a time. This refactor can preserve that assumption; no multi-network-simultaneous changes are needed.
