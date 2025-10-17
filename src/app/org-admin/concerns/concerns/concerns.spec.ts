import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Concerns } from './concerns';

describe('Concerns', () => {
  let component: Concerns;
  let fixture: ComponentFixture<Concerns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Concerns]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Concerns);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
