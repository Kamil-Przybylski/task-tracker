import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreWebComponent } from './core-web.component';

describe('CoreWebComponent', () => {
  let component: CoreWebComponent;
  let fixture: ComponentFixture<CoreWebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreWebComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoreWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
