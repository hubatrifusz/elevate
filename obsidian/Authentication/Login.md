### 1. Overview

The **Login Page** is responsible for user authentication. It allows users to log in using their email and password, with additional features like "Remember Me" and "Forgot Password."

### 2. UI Components

##### **Login Form**

| Field (input)     | Type   | Validation Rules                                              | id                               |
| ----------------- | ------ | ------------------------------------------------------------- | -------------------------------- |
| Email             | String | Regex: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`<br> | email_text_input                 |
| Password          | String | Regex: `^(?=.*\d).{8,}$`<br>                                  | password_text_input              |
| Remember password | Bool   |                                                               | remember_password_checkbox_input |

##### **Buttons**

| Name                | Purpose                                                            | id                                |
| ------------------- | ------------------------------------------------------------------ | --------------------------------- |
| Login               | Validates and submits the login form, and attempts authentication. | login_button                      |
| Sign in with Google | Attempts login with a Google account.                              | google_sign_in_button             |
| Forgot password?    | Redirects to the [[Password Recovery]] page.                       | forgot_password_button            |
| Create one here!    | Redirects to the [[Create Account]] page.                          | redirect_to_create_account_button |
##### **Error Messages**

| Scenario               | Message                                   |
| ---------------------- | ----------------------------------------- |
| Invalid email/password | "Invalid email or password"               |
| Empty fields           | "Please fill out all fields"              |
| Server error           | "Something went wrong, please try again!" |
### 3. Components & File Structure

- Login component
- Create Account component
- Password Recovery component



```
/src/app/pages/auth
├──login/
│  ├── login.component.ts
│  ├── login.component.html
│  ├── login.component.scss
│  ├── login.component.spec.ts
├──create-account/
│  ├── create-account.component.ts
│  ├── create-account.component.html
│  ├── create-account.component.scss
│  ├── create-account.component.spec.ts
├──password-recovery/
│  ├── password-recovery.component.ts
│  ├── password-recovery.component.html
│  ├── password-recovery.component.scss
│  ├── password-recovery.component.spec.ts
```
### 4. Redirects & User Flow

| Action                   | Next Step                              |
| ------------------------ | -------------------------------------- |
| Successful login         | Redirect to [[Calendar]] page          |
| Incorrect email/password | Show error message                     |
| Click "Forgot password?" | Redirect to [[Password Recovery]] page |
