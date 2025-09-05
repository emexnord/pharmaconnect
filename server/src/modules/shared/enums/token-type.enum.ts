export enum TokenType {
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
  REGISTRATION_KEY = 'registration_key',
}
export enum TokenStatus {
  PENDING = 'pending',
  USED = 'used',
  EXPIRED = 'expired',
}
