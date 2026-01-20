// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    adminClient(), // Match dengan admin plugin di server
  ],
});

// Destructure untuk kemudahan penggunaan
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  admin, // Admin functions
} = authClient;
