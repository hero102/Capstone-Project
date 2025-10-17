import { TestBed } from '@angular/core/testing';

import { Concern } from './concern';

describe('Concern', () => {
  let service: Concern;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Concern);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
