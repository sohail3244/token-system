
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["warn", "error"]
      : ["error"],
});

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await prisma.$connect();
  await prisma.$queryRaw`SELECT 1`;

  isConnected = true;
  console.log("✅ PostgreSQL database connected successfully");
}

async function disconnectDB() {
  if (!isConnected) return;

  await prisma.$disconnect();
  isConnected = false;

  console.log("Database disconnected");
}

module.exports = {
  prisma,
  connectDB,
  disconnectDB,
};
