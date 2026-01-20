// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

// Fungsi untuk mendapatkan base URL yang benar
const getBaseURL = () => {
  // Di browser, gunakan relative URL agar tidak ada masalah CORS
  if (typeof window !== "undefined") {
    return "";
  }

  // Di server-side, gunakan URL lengkap
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // Fallback untuk Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
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
