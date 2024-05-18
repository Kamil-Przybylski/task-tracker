import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  booleanAttribute,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ISignUpFormPayload } from '../../models';
import { passwordConfirming } from '../../utils/password-validators';

@Component({
  selector: 'auth-ui-sign-up-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './ui-sign-up-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSignUpFormComponent {
  readonly #fb = inject(NonNullableFormBuilder);
  readonly #cd = inject(ChangeDetectorRef);

  readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  readonly bySubmit = output<ISignUpFormPayload>();

  readonly loginForm = this.#fb.group({
    username: this.#fb.control('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: this.#fb.control('', [Validators.required, Validators.email]),
    passwords: this.#fb.group(
      {
        password: this.#fb.control('', [
          Validators.required,
          Validators.minLength(4),
        ]),
        repeatPassword: this.#fb.control(''),
      },
      { validators: passwordConfirming },
    ),
  });

  get usernameControl() {
    return this.loginForm.get('username')!;
  }
  get emailControl() {
    return this.loginForm.get('email')!;
  }
  get passwordControl() {
    return this.loginForm.get('passwords.password')!;
  }
  get repeatPasswordControl() {
    return this.loginForm.get('passwords.repeatPassword')!;
  }

  constructor() {
    effect(() => {
      if (this.disabled()) {
        this.loginForm.disable();
      } else {
        this.loginForm.enable();
      }
    });
  }

  submit() {
    if (this.loginForm.valid && !this.disabled()) {
      const formValue = this.loginForm.getRawValue();
      const payload: ISignUpFormPayload = {
        username: formValue.username,
        email: formValue.email,
        password: formValue.passwords.password,
      };
      this.bySubmit.emit(payload);
    } else {
      this.loginForm.markAllAsTouched();
      this.#cd.detectChanges();
    }
  }
}
