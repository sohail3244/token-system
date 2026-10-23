import { prisma } from "../config/db.js";

const createPlan = async (payload) => {
  const existingPlan = await prisma.plan.findUnique({
    where: {
      name: payload.name,
    },
    select: {
      id: true,
    },
  });

  if (existingPlan) {
    const error = new Error("A plan with this name already exists");
    error.statusCode = 409;
    throw error;
  }

  try {
    const plan = await prisma.plan.create({
      data: {
        name: payload.name,
        description: payload.description ?? null,
        billingInterval: payload.billingInterval,
        price: payload.price,
        currency: payload.currency,
        maxUsers: payload.maxUsers,
        maxBranches: payload.maxBranches,
        maxCounters: payload.maxCounters,
        maxTokensPerDay: payload.maxTokensPerDay,
      },
      select: {
        id: true,
        name: true,
        description: true,
        billingInterval: true,
        price: true,
        currency: true,
        maxUsers: true,
        maxBranches: true,
        maxCounters: true,
        maxTokensPerDay: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return plan;
  } catch (error) {
    if (error.code === "P2002") {
      const conflict = new Error(
        "A plan with this name already exists",
      );
      conflict.statusCode = 409;
      throw conflict;
    }

    throw error;
  }
};

export default {
  createPlan,
};