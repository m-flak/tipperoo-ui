import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCredits } from './send-credits';

describe('SendCredits', () => {
    let component: SendCredits;
    let fixture: ComponentFixture<SendCredits>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SendCredits],
        }).compileComponents();

        fixture = TestBed.createComponent(SendCredits);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
