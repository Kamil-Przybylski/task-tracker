import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkspaceWebComponent } from './workspace-web.component';

describe('WorkspaceWebComponent', () => {
  let component: WorkspaceWebComponent;
  let fixture: ComponentFixture<WorkspaceWebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceWebComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspaceWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
