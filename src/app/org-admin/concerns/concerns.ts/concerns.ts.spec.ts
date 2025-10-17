import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcernsTs } from './concerns.ts';

describe('ConcernsTs', () => {
  let component: ConcernsTs;
  let fixture: ComponentFixture<ConcernsTs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConcernsTs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConcernsTs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
