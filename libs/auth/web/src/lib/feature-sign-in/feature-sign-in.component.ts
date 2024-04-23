import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBar } from '@angular/material/progress-bar';
import { UiSignInFormComponent } from '../ui/sign-in-form/ui-sign-in-form.component';

@Component({
  selector: 'auth-feature-sign-in',
  standalone: true,
  imports: [
    UiSignInFormComponent,
    MatButtonModule,
    MatCardModule,
    MatProgressBar,
    MatDividerModule,
  ],
  templateUrl: './feature-sign-in.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSignInComponent {}
