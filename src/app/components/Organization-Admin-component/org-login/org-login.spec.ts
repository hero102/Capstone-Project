import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgLogin } from './org-login';

describe('OrgLogin', () => {
  let component: OrgLogin;
  let fixture: ComponentFixture<OrgLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
