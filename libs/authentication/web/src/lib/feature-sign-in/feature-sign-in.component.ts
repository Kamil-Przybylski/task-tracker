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
import { AuthenticationStore } from '../data-access/store/authentication.store';
import { ISignInFormPayload } from '../models/sign-in-form.models';
import { UiSignInFormComponent } from '../ui/sign-in-form/ui-sign-in-form.component';

@Component({
  selector: 'auth-feature-sign-in',
  standalone: true,
  imports: [
    RouterModule,
    UiSignInFormComponent,
    MatButtonModule,
    MatCardModule,
    MatProgressBar,
    MatDividerModule,
  ],
  templateUrl: './feature-sign-in.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSignInComponent {
  #authenticationStore = inject(AuthenticationStore);
  isPending: Signal<boolean> = this.#authenticationStore.isPending;
  errorMessage: Signal<string | null> = this.#authenticationStore.error;

  handleSubmit(payload: ISignInFormPayload): void {
    this.#authenticationStore.signIn(payload);
  }
}
