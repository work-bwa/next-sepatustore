import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { db } from "@/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: {
    enabled: true,
    // disableSignUp: true,
  },
  plugins: [
    admin({
      defaultRole: "user", // Role default saat user register
      adminRole: "admin", // Role yang dianggap admin
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;

export type User = typeof auth.$Infer.Session.user;
