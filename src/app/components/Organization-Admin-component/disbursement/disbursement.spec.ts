import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Disbursement } from './disbursement';

describe('Disbursement', () => {
  let component: Disbursement;
  let fixture: ComponentFixture<Disbursement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Disbursement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Disbursement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
