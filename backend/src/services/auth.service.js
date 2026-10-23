import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

/*
|--------------------------------------------------------------------------
| Generate JWT Access Token
|--------------------------------------------------------------------------
*/

const generateAccessToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      sub: user.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      issuer: "token-management-api",
    },
  );
};

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

const login = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  // Find user by email
  const user = await prisma.user.findUnique({
    where: {
      email: email.trim().toLowerCase(),
    },
  });

  // Use the same message for unknown email and wrong password
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // Check account status if your User model has isActive
  if (user.isActive === false) {
    const error = new Error("Your account is inactive");
    error.statusCode = 403;
    throw error;
  }

  // Check password against the stored bcrypt hash
  const isPasswordValid = await bcrypt.compare(
    password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // Only allow the two roles used by this application
  if (!["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
    const error = new Error("You are not authorized to log in");
    error.statusCode = 403;
    throw error;
  }

  // Generate JWT
  const token = generateAccessToken(user);

  // Return token for the controller to set as an httpOnly cookie
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? null,
      role: user.role,
    },
  };
};

/*
|--------------------------------------------------------------------------
| GET CURRENT USER
|--------------------------------------------------------------------------
*/

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.isActive === false) {
    const error = new Error("Your account is inactive");
    error.statusCode = 403;
    throw error;
  }

  return user;
};

/*
|--------------------------------------------------------------------------
| EXPORT SERVICE
|--------------------------------------------------------------------------
*/

const AuthService = {
  login,
  getMe,
};

export default AuthService;