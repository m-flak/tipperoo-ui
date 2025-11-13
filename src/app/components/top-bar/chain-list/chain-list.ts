import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NetworkConstants } from '../../../blockchain/networks.constants';

@Component({
    selector: 'app-chain-list',
    imports: [NgbDropdownModule],
    templateUrl: './chain-list.html',
    styleUrl: './chain-list.scss',
})
export class ChainList {
    readonly chainIds = NetworkConstants;

    @Output()
    changeChain = new EventEmitter<string>();

    @Input()
    chainId = '0x0';

    clickChain(id: string) {
        this.changeChain.emit(id);
    }
}
