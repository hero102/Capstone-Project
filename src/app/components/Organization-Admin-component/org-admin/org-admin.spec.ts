import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgAdmin } from './org-admin';

describe('OrgAdmin', () => {
  let component: OrgAdmin;
  let fixture: ComponentFixture<OrgAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
