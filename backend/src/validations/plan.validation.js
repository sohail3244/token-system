import { z } from "zod";

export const createPlanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Plan name must be at least 2 characters")
    .max(100, "Plan name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional()
    .nullable(),

  billingInterval: z.enum(["MONTHLY", "YEARLY"], {
    errorMap: () => ({
      message: "Billing interval must be MONTHLY or YEARLY",
    }),
  }),

  price: z
    .number()
    .finite()
    .min(0, "Price cannot be negative")
    .max(9999999999.99, "Price is too large"),

  currency: z
    .string()
    .trim()
    .length(3, "Currency must be a 3-letter code")
    .transform((value) => value.toUpperCase())
    .default("INR"),

  maxUsers: z
    .number()
    .int()
    .min(1, "Maximum users must be at least 1")
    .max(100000),

  maxBranches: z
    .number()
    .int()
    .min(1, "Maximum branches must be at least 1")
    .max(100000),

  maxCounters: z
    .number()
    .int()
    .min(1, "Maximum counters must be at least 1")
    .max(100000),

  maxTokensPerDay: z
    .number()
    .int()
    .min(1, "Daily token limit must be at least 1")
    .max(10000000),
});

export const validateCreatePlan = (req, res, next) => {
  const result = createPlanSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Plan validation failed",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  req.body = result.data;
  next();
};