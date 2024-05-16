import { AbstractControl } from '@angular/forms';
import { ISignUpForm } from '../models';

export const passwordConfirming = (
  c: AbstractControl<ISignUpForm['passwords']>,
): { invalid: boolean } | null => {
  const cPassword = c.get('password');
  const cRepeatPassword = c.get('repeatPassword');
  if (!cPassword || !cRepeatPassword) return null;

  if (cPassword.value !== cRepeatPassword.value) {
    cRepeatPassword?.setErrors({ notEqual: true });
    return { invalid: true };
  }
  cRepeatPassword?.setErrors(null);
  return null;
};
