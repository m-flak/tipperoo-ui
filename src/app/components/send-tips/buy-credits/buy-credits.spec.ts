import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyCredits } from './buy-credits';

describe('BuyCredits', () => {
    let component: BuyCredits;
    let fixture: ComponentFixture<BuyCredits>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BuyCredits],
        }).compileComponents();

        fixture = TestBed.createComponent(BuyCredits);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
