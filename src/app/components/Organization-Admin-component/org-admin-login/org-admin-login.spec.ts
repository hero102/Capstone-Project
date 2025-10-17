import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgAdminLogin } from './org-admin-login';

describe('OrgAdminLogin', () => {
  let component: OrgAdminLogin;
  let fixture: ComponentFixture<OrgAdminLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgAdminLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgAdminLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
