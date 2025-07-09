import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpoolResults } from './carpool-results';

describe('CarpoolResults', () => {
  let component: CarpoolResults;
  let fixture: ComponentFixture<CarpoolResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarpoolResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarpoolResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
