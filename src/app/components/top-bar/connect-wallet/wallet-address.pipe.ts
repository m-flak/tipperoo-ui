import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'walletAddress',
})
export class WalletAddressPipe implements PipeTransform {
    transform(value: string | undefined): string {
        if (!value) {
            return '';
        }

        //0xAAAA...aaaa
        let shrunk = value.substring(0, 6);
        shrunk += '...';
        shrunk += value.substring(value.length - 5, value.length - 1);
        return shrunk;
    }
}
