import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'aw-sign-in-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AwSignInFormComponent {
  readonly #fb = inject(NonNullableFormBuilder);

  readonly loginForm = this.#fb.group({
    email: this.#fb.control('', [Validators.required, Validators.email]),
    password: this.#fb.control('', [Validators.required]),
  });
}
