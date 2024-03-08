import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AwSignInFormComponent } from '../ui/sign-in-form/sign-in-form.component';

@Component({
  selector: 'aw-feature-sign-in',
  standalone: true,
  imports: [AwSignInFormComponent, MatButtonModule],
  templateUrl: './feature-sign-in.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AwFeatureSignInComponent {}
