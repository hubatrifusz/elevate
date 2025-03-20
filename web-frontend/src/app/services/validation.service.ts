import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  static passwordMinLengthValidator(min: number): ValidationErrors {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && control.value.length >= min) {
        return null;
      } else {
        return {
          minLength: {
            requiredLength: min,
            actualLength: control.value?.length,
            message: 'Password must be at least 12 characters long.',
          },
        };
      }
    };
  }
}
