import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAdminLogin } from './bank-admin-login';

describe('BankAdminLogin', () => {
  let component: BankAdminLogin;
  let fixture: ComponentFixture<BankAdminLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankAdminLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankAdminLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
