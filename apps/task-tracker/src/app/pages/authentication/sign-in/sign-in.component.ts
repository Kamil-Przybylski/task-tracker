import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AwFeatureSignInComponent } from '@libs/auth-web';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [AwFeatureSignInComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sign-in.component.html',
})
export class SignInComponent {}
