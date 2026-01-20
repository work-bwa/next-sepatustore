import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Seeding admin user...");
  try {
    const data = await auth.api.signUpEmail({
      body: {
        name: "Admin",
        email: "admin@bwa.com",
        password: "@admin1234",
      },
    });

    console.log("Updating user role...");

    const [admin] = await db
      .update(user)
      .set({ role: "admin" })
      .where(eq(user.id, data.user.id))
      .returning();

    console.log("Admin user:", admin);
    process.exit();
  } catch (error) {
    console.error("Error seeding admin user:", error);
    process.exit();
  }
}

main();
