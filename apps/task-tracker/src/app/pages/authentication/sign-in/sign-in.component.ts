import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeatureSignInComponent } from '@libs/auth-web';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FeatureSignInComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sign-in.component.html',
})
export class SignInComponent {}
