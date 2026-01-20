// routes.ts
export const publicRoutes: (string | RegExp)[] = ["/", "/category"];
export const authRoutes: string[] = ["/admin/signin"];
export const protectedRoutes: string[] = ["/admin", "/dashboard"]; // 👈 Tambah ini
export const apiAuthPrefix: string = "/api/auth";
export const DEFAULT_LOGIN_REDIRECT: string = "/dashboard";
