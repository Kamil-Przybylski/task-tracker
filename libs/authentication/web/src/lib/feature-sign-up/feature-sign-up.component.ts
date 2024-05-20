import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { AuthenticationStore } from '../data-access/authentication.store';
import { ISignUpFormPayload } from '../models';
import { UiSignUpFormComponent } from '../ui/sign-up-form/ui-sign-up-form.component';

@Component({
  selector: 'auth-feature-sign-up',
  standalone: true,
  imports: [
    RouterModule,
    UiSignUpFormComponent,
    MatButtonModule,
    MatCardModule,
    MatProgressBar,
    MatDividerModule,
  ],
  templateUrl: './feature-sign-up.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSignUpComponent {
  #authenticationStore = inject(AuthenticationStore);
  isPending: Signal<boolean> = this.#authenticationStore.isPending;
  errorMessage: Signal<string | null> = this.#authenticationStore.error;

  handleSubmit(payload: ISignUpFormPayload): void {
    this.#authenticationStore.signUp(payload);
  }
}
