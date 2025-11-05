import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectWallet } from './connect-wallet';

describe('ConnectWallet', () => {
    let component: ConnectWallet;
    let fixture: ComponentFixture<ConnectWallet>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConnectWallet],
        }).compileComponents();

        fixture = TestBed.createComponent(ConnectWallet);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
