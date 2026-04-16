import { Injectable } from '@angular/core';
import { AbstractWalletService } from './wallet-svc.abstract';
import { GenericWalletService } from './generic.service';
import { MetaMaskService } from './metamask.service';
import { IWalletService } from './wallet-svc.interface';

@Injectable({
    providedIn: 'root',
})
export class WalletService {
    constructor(
        private generic: GenericWalletService,
        private metamask: MetaMaskService,
    ) {}

    getWalletProvider(name: string): IWalletService {
        switch (name.toLowerCase()) {
            case 'metamask':
                return this.metamask;
            default:
                return this.generic;
        }
    }
}
