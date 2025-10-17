import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { orgAdminGuard } from './org-admin-guard';

describe('orgAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => orgAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
