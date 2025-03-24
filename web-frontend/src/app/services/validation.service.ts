import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  static requiredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && control.value.length > 0) {
        return null;
      } else {
        return {
          required: {
            message: 'All fields are requried.',
          },
        };
      }
    };
  }

  static passwordMinLengthValidator(min: number): ValidatorFn {
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

  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!control.value || emailRegex.test(control.value)) {
        return null;
      } else {
        return {
          invalidEmail: {
            value: control.value,
            message: 'Please enter a valid email address.',
          },
        };
      }
    };
  }

  static passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*.]).{12,}$/;
      if (!control.value || passwordRegex.test(control.value)) {
        return null;
      } else {
        return {
          invalidPassword: {
            value: control.value,
            message: 'Please enter a valid password.',
          },
        };
      }
    };
  }

  static createAccountPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      // Check for minimum length (12 characters)
      if (value && value.length < 12) {
        return {
          passwordLength: {
            value: value,
            message: 'Password must be at least 12 characters long.',
          },
        };
      }

      // Check for at least one digit
      if (value && !/\d/.test(value)) {
        return {
          passwordDigit: {
            value: value,
            message: 'Password must contain at least one digit.',
          },
        };
      }

      // Check for at least one lowercase letter
      if (value && !/[a-z]/.test(value)) {
        return {
          passwordLowercase: {
            value: value,
            message: 'Password must contain at least one lowercase letter.',
          },
        };
      }

      // Check for at least one uppercase letter
      if (value && !/[A-Z]/.test(value)) {
        return {
          passwordUppercase: {
            value: value,
            message: 'Password must contain at least one uppercase letter.',
          },
        };
      }

      // Check for at least one special character
      if (value && !/[!@#$%^&*.]/.test(value)) {
        return {
          passwordSpecialChar: {
            value: value,
            message: 'Password must contain at least one special character (!@#$%^&*.).',
          },
        };
      }

      // If all checks pass, return null
      return null;
    };
  }

  static passwordMatchValidator(passwordControlName: string, confirmPasswordControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const passwordControl = formGroup.get(passwordControlName);
      const confirmPasswordControl = formGroup.get(confirmPasswordControlName);

      // If either field is not present, return null (valid).
      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      // Check if the password and confirm password are the same
      if (passwordControl.value !== confirmPasswordControl.value) {
        return {
          passwordMismatch: {
            message: 'Password and Confirm Password do not match.',
          },
        };
      }

      // If passwords match, return null (valid)
      return null;
    };
  }
}
