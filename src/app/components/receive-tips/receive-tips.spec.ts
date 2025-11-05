import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveTips } from './receive-tips';

describe('ReceiveTips', () => {
  let component: ReceiveTips;
  let fixture: ComponentFixture<ReceiveTips>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiveTips]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiveTips);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
