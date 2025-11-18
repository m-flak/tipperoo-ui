import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-send-eth',
    imports: [FormsModule],
    templateUrl: './send-eth.html',
    styleUrl: './send-eth.scss',
})
export class SendEth {
    private _amount = 0;

    @Input()
    totalBalance = 0;

    @Input()
    disable = false;

    @Output()
    send = new EventEmitter<{ amount: number; to: number }>();

    get amount() {
        return this._amount;
    }

    set amount(val: number) {
        if (val < 0) {
            this._amount = 0;
        } else if (val > this.totalBalance) {
            this._amount = this.totalBalance;
        } else {
            this._amount = val;
        }
    }

    toAccount = 0;

    clickSend() {
        this.send.emit({ amount: this.amount, to: this.toAccount });
    }
}
