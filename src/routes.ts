// routes.ts
export const publicRoutes: (string | RegExp)[] = ["/", "/category"];
export const authRoutes: string[] = ["/signin"];
export const protectedRoutes: string[] = ["/admin"]; // 👈 Tambah ini
export const apiAuthPrefix: string = "/api/auth";
export const DEFAULT_LOGIN_REDIRECT: string = "/admin";
