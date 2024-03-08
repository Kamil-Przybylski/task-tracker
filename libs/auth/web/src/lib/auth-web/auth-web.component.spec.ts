import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthWebComponent } from './auth-web.component';

describe('AuthWebComponent', () => {
  let component: AuthWebComponent;
  let fixture: ComponentFixture<AuthWebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthWebComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
