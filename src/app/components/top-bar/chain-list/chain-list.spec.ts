import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainList } from './chain-list';

describe('ChainList', () => {
    let component: ChainList;
    let fixture: ComponentFixture<ChainList>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChainList],
        }).compileComponents();

        fixture = TestBed.createComponent(ChainList);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
