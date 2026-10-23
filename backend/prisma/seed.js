
require("dotenv").config();

const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const name = process.env.SUPER_ADMIN_NAME;
  const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      "SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are required in .env"
    );
  }

  if (password.length < 12) {
    throw new Error("Password must be at least 12 characters long");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const superAdmin = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      role: "SUPER_ADMIN",
      isActive: true
    },
    create: {
      name,
      email,
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
      emailVerified: true
    }
  });

  console.log("✅ Super Admin seeded successfully");
  console.log("Email:", superAdmin.email);
  console.log("User ID:", superAdmin.id);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
