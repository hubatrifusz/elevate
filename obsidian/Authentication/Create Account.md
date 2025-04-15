### 1. Overview

The **Create Account** page enables users to register a personal account, which they can later use to log in via the [[Login]] page.

### 2. UI Components

##### **Create Account Form**

| Field (input) | Type   | Validation Rules                                                          | id                      |
| ------------- | ------ | ------------------------------------------------------------------------- | ----------------------- |
| Full name     | String | none                                                                      | name_text_input         |
| Email         | String | Regex: `/^[a-zA-Z0-9!#$%&'*+-=?^_{\|}~.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/` | email_text_input        |
| Password      | String | Regex: `^(?=.*\d).{6,}$`                                                  | password_password_input |
##### **Buttons**

| Name                | Purpose                                     | id                    |
| ------------------- | ------------------------------------------- | --------------------- |
| Create Account      | Attempts to create an account for the user. | create_account_button |
| Sign in with Google | Attempts login with a Google account.       | google_sign_in_button |
| Go back             | Returns to the [[Login]] page.              | return_button         |
##### **Error Messages**

| Scenario               | Message                                   |
| ---------------------- | ----------------------------------------- |
| Invalid email/password | "Invalid email." / "Invalid password"     |
| Empty fields           | "\*Field\* is required."                  |
| Server error           | "Something went wrong, please try again!" |

### 3. Components & File Structure

- Create Account component

```
/src/app/pages/auth
├──create-account/
│  ├── create-account.component.ts
│  ├── create-account.component.html
│  ├── create-account.component.scss
│  ├── create-account.component.spec.ts
```
### 4. Redirects & User Flow
