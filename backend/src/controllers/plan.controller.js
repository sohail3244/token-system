import PlanService from "../services/plan.service.js";

export const createPlan = async (req, res) => {
  try {
    const plan = await PlanService.createPlan(req.body);

    return res.status(201).json({
      success: true,
      message: "Subscription plan created successfully",
      data: {
        plan,
      },
    });
  } catch (error) {
    console.error("Create Plan Error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode && error.statusCode < 500
          ? error.message
          : "Unable to create subscription plan",
    });
  }
};

export default {
  createPlan,
};