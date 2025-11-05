import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainIcon } from './chain-icon';

describe('ChainIcon', () => {
    let component: ChainIcon;
    let fixture: ComponentFixture<ChainIcon>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChainIcon],
        }).compileComponents();

        fixture = TestBed.createComponent(ChainIcon);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
