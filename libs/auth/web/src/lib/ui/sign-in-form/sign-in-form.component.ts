import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  effect,
  inject,
  input,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ISignInFormPayload } from '../../models/sign-in-form.models';

@Component({
  selector: 'auth-ui-sign-in-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './sign-in-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AwSignInFormComponent {
  readonly #fb = inject(NonNullableFormBuilder);

  readonly disabled = input<boolean, boolean | string>(false, {
    transform: coerceBooleanProperty,
  });
  @Output()
  readonly bySubmit = new EventEmitter<ISignInFormPayload>();

  readonly loginForm = this.#fb.group({
    email: this.#fb.control('', [Validators.required, Validators.email]),
    password: this.#fb.control('', [Validators.required, Validators.min(4)]),
  });

  constructor() {
    this.disableFormEffect();
  }

  submit() {
    if (this.loginForm.valid) {
      const payload: ISignInFormPayload = this.loginForm.getRawValue();
      this.bySubmit.emit(payload);
    } else {
      this.loginForm.markAllAsTouched();
      // this.#cd.detectChanges();
    }
  }

  private disableFormEffect(): void {
    effect(() => {
      if (this.disabled()) {
        this.loginForm.disable();
      } else {
        this.loginForm.enable();
      }
    });
  }
}
