import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAdmin } from './bank-admin';

describe('BankAdmin', () => {
  let component: BankAdmin;
  let fixture: ComponentFixture<BankAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
