import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDashboardComponent } from './bank-dashboard.component';

describe('BankDashboardComponent', () => {
  let component: BankDashboardComponent;
  let fixture: ComponentFixture<BankDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
