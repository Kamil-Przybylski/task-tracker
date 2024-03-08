import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tt-sign-up',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sign-up.component.html',
})
export class SignUpComponent {}
