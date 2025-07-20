import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

// Define and validate environment variables schema
const configSchema = z.object({
  // General settings
  PORT: z.string().regex(/^\d+$/).transform(Number).default(8080),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  VERSION: z.string().optional().default('1.0'),

  // client settings
  CLIENT_URL: z.string().default('http://localhost:3000'),
  CLIENT_RESET_PASSWORD_URL: z
    .string()
    .default('http://localhost:3000/reset-password'),

  // JWT Configuration
  JWT_ACCESS_TOKEN_SECRET: z.string().optional().default(''),
  JWT_REFRESH_TOKEN_SECRET: z.string().optional().default(''),
  JWT_ALGORITHMS: z.string().optional().default('RS256'),
  JWT_ACCESS_TOKEN_EXPIRY: z.string().optional().default('7d'),
  JWT_REFRESH_TOKEN_EXPIRY: z.string().optional().default('7d'),

  // MySQL settings
  MONGODB_URL: z.string().default('mongodb://localhost:27017'),

  // Google settings
  GOOGLE_CLIENT_ID: z.string().optional().default(''),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(''),
  GOOGLE_REDIRECT_URL: z.string().optional().default(''),
  GOOGLE_CALLBACK_URL: z.string().optional().default(''),

  // SendGrid settings
  SENDGRID_API_KEY: z.string().default(''),
  SENDER_EMAIL: z.string().default(''),
  OTP_EMAIL_TEMPLATE_ID: z.string().default(''),
  RESET_PASSWORD_EMAIL_TEMPLATE_ID: z.string().default(''),
  WELCOME_EMAIL_TEMPLATE_ID: z.string().default(''),
  SET_PASSWORD_EMAIL_TEMPLATE_ID: z.string().default(''),
});

// Parse and validate environment variables
const config = configSchema.parse(process.env);

// Configuration object
const configuration = () => ({
  app: {
    port: config.PORT,
    environment: config.NODE_ENV,
    version: config.VERSION,
  },
  client: {
    url: config.CLIENT_URL,
    resetPasswordUrl: config.CLIENT_RESET_PASSWORD_URL,
  },
  google: {
    clientId: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackUrl: config.GOOGLE_CALLBACK_URL,
    redirectUrl: config.GOOGLE_REDIRECT_URL,
  },
  db: {
    url: config.MONGODB_URL,
    autoLoadEntities: config.NODE_ENV === 'development',
  },
  jwt: {
    accessTokenSecret: config.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: config.JWT_REFRESH_TOKEN_SECRET,
    accessAlgorithms: config.JWT_ALGORITHMS,
    accessTokenExpiry: config.JWT_ACCESS_TOKEN_EXPIRY,
    refreshTokenExpiry: config.JWT_REFRESH_TOKEN_EXPIRY,
  },
  sendgrid: {
    apiKey: config.SENDGRID_API_KEY,
    senderEmail: config.SENDER_EMAIL,
    otpTemplateId: config.OTP_EMAIL_TEMPLATE_ID,
    resetTemplateId: config.RESET_PASSWORD_EMAIL_TEMPLATE_ID,
    welcomeTemplateId: config.WELCOME_EMAIL_TEMPLATE_ID,
    setPasswordTemplateId: config.SET_PASSWORD_EMAIL_TEMPLATE_ID,
  },
});

export type Config = ReturnType<typeof configuration>;
export default configuration;
