import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAdminDashboard } from './bank-admin-dashboard';

describe('BankAdminDashboard', () => {
  let component: BankAdminDashboard;
  let fixture: ComponentFixture<BankAdminDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankAdminDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankAdminDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
