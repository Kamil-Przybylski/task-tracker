import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeatureSignUpComponent } from '@libs/auth-web';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FeatureSignUpComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sign-up.component.html',
})
export class SignUpComponent {}
