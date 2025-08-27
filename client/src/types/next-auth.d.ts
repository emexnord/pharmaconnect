import { DefaultSession, DefaultJWT } from "next-auth";
import { Pharmacy } from "./pharmacy";

declare module "next-auth" {
  interface Session extends DefaultSession {
    pharmacy: Pharmacy;
    accessToken: string;
    accessTokenExp: number;
    iat: number;
    exp: number;
    jti: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    pharmacy: Pharmacy;
    accessToken: string;
    accessTokenExp: number;
    iat: number;
    exp: number;
    jti: string;
  }
}
