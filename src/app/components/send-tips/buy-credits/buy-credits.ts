import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-buy-credits',
    imports: [FormsModule],
    templateUrl: './buy-credits.html',
    styleUrl: './buy-credits.scss',
})
export class BuyCredits {
    private _amount = 0;

    @Input()
    allowance = 0;

    @Input()
    disable = false;

    @Output()
    buy = new EventEmitter<number>();

    get amount() {
        return this._amount;
    }

    set amount(val: number) {
        if (val < 0) {
            this._amount = 0;
        } else if (val > this.allowance) {
            this._amount = this.allowance;
        } else {
            this._amount = val;
        }
    }

    clickBuy() {
        this.buy.emit(this._amount);
    }
}
