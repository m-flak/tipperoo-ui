import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-asset-summary',
    imports: [],
    templateUrl: './asset-summary.html',
    styleUrl: './asset-summary.scss',
})
export class AssetSummary {
    @Input()
    hasAccount = false;

    @Input()
    accountId = 0;

    @Input()
    credits = 0;

    @Input()
    eth = 0;
}
