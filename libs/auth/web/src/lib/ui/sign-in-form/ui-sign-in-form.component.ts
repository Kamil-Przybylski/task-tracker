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
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ISignInFormPayload } from '../../models';

@Component({
  selector: 'auth-ui-sign-in-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './ui-sign-in-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSignInFormComponent {
  readonly #fb = inject(NonNullableFormBuilder);
  readonly #cd = inject(ChangeDetectorRef);

  readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  readonly bySubmit = output<ISignInFormPayload>();

  readonly loginForm = this.#fb.group({
    email: this.#fb.control('kamil@test.pl', [
      Validators.required,
      Validators.email,
    ]),
    password: this.#fb.control('test', [
      Validators.required,
      Validators.minLength(4),
    ]),
  });
  get emailControl(): AbstractControl {
    return this.loginForm.get('email') as AbstractControl;
  }
  get passwordControl(): AbstractControl {
    return this.loginForm.get('password') as AbstractControl;
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
      const payload: ISignInFormPayload = this.loginForm.getRawValue();
      this.bySubmit.emit(payload);
    } else {
      this.loginForm.markAllAsTouched();
      this.#cd.detectChanges();
    }
  }
}
