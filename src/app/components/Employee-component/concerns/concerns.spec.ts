import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcernsComponent } from './concerns'; // ✅ Add this import

describe('ConcernsComponent', () => {
  let component: ConcernsComponent;
  let fixture: ComponentFixture<ConcernsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConcernsComponent] // ✅ standalone import
    }).compileComponents();

    fixture = TestBed.createComponent(ConcernsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
