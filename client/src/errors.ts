import { CredentialsSignin } from "next-auth";

export class UserNotVerifiedError extends CredentialsSignin {
  constructor(message: string) {
    super(message);
    this.name = "CustomAuthError";
    this.message = message;
    this.code = "403";
  }
}

export class InvalidCredentialsError extends CredentialsSignin {
  constructor(message: string) {
    super(message);
    this.name = "InvalidCredentialsError";
    this.code = "404";
  }
}

export class ExpiredOrInvalidResetCodeError extends CredentialsSignin {
  constructor(message: string) {
    super(message);
    this.name = "ExpiredOrInvalidResetCodeError";
    this.code = "400";
  }
}
