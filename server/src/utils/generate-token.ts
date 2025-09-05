import * as crypto from 'crypto';
import { OTP_LENGTH, REGISTRATION_KEY_LENGTH } from 'src/constants';

function isPatternForbidden(token: string) {
  // Checks if all characters are the same (digits or uppercase letters)
  return /^([A-Z0-9])\1+$/.test(token);
}

export function generateOTP(length = OTP_LENGTH) {
  let otp;
  do {
    otp = crypto
      .randomInt(0, 10 ** length)
      .toString()
      .padStart(length, '0');
  } while (isPatternForbidden(otp));
  return otp;
}

export function generatePasswordResetToken(length = 32) {
  const result = crypto.randomBytes(length).toString('hex');
  return result;
}

export function generateRegistrationKey(length = REGISTRATION_KEY_LENGTH) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token;
  do {
    token = Array.from(
      { length },
      () => chars[crypto.randomInt(0, chars.length)],
    ).join('');
  } while (isPatternForbidden(token));
  return token;
}
