import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetSummary } from './asset-summary';

describe('AssetSummary', () => {
  let component: AssetSummary;
  let fixture: ComponentFixture<AssetSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
