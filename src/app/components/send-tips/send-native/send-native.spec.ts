import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEth } from './send-eth';

describe('SendEth', () => {
    let component: SendEth;
    let fixture: ComponentFixture<SendEth>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SendEth],
        }).compileComponents();

        fixture = TestBed.createComponent(SendEth);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
