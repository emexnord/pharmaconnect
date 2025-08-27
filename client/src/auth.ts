// src/pages/api/auth/[...nextauth].ts

import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { type Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { InvalidCredentialsError, UserNotVerifiedError } from "./errors";
import { Pharmacy } from "./types/pharmacy";

const authOptions = {
  session: {
    strategy: "jwt" as const,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (credentials?.phone && credentials.password) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/pharmacy/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                phone: credentials.phone,
                password: credentials.password,
              }),
            }
          );
          const data = await response.json();

          if (!response.ok) {
            const message = data?.message || "Login failed. Please try again.";

            if (response.status === 403) {
              throw new UserNotVerifiedError(message);
            }

            throw new InvalidCredentialsError(message);
          }

          return data;
        }

        // if (credentials?.handle && credentials.otp) {
        //   try {
        //     const data = await verifyEmailOTP(
        //       credentials.handle as string,
        //       credentials.otp as string
        //     );
        //     return data;
        //   } catch (error) {
        //     throw new ExpiredOrInvalidResetCodeError(
        //       error instanceof Error ? error.message : "Verification failed."
        //     );
        //   }
        // }
        return null;
      },
    }),
  ],
  callbacks: {
    // @ts-expect-error: pharmacy type may not match expected type, but merging is intentional
    async jwt({ token, pharmacy, trigger, session }) {
      if (pharmacy) {
        return { ...token, ...pharmacy };
      }
      if (trigger === "update") {
        return { ...token, ...session };
      }
      return token;
    },

    // Expose them in the client-side session
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.pharmacy)
        session.pharmacy = {
          ...token.pharmacy,
        } as Pharmacy;

      if (token.accessToken) session.accessToken = token.accessToken;
      if (token.accessTokenExp) session.accessTokenExp = token.accessTokenExp;
      if (token.iat) session.iat = token.iat;
      if (token.exp) session.exp = token.exp;
      if (token.jti) session.jti = token.jti;

      return session;
    },
  },
};

// @ts-expect-error: NextAuth type mismatch due to custom callbacks signature
export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
