import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAddEditComponent } from './bank-add-edit.component';

describe('BankAddEditComponent', () => {
  let component: BankAddEditComponent;
  let fixture: ComponentFixture<BankAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
