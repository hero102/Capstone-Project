import { TestBed } from '@angular/core/testing';

import { OrgAdmin } from './org-admin';

describe('OrgAdmin', () => {
  let service: OrgAdmin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrgAdmin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
