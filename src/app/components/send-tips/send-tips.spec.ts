import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendTips } from './send-tips';

describe('SendTips', () => {
  let component: SendTips;
  let fixture: ComponentFixture<SendTips>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendTips]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendTips);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
