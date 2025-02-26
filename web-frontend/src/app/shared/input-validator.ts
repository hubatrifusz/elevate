import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function inputValidator(inputReg: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const isValid = inputReg.test(control.value);
    return isValid ? null : { forbiddenPattern: { value: control.value } };
  };
}
