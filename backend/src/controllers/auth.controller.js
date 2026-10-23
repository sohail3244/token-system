import AuthService from "../services/auth.service.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await AuthService.login({
      email,
      password,
    });

    res.cookie("accessToken", result.token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);

    return res.status(error.statusCode || 401).json({
      success: false,
      message: error.message || "Invalid email or password",
    });
  }
};

export const me = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error("Get Me Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch user",
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

export default { login, me, logout };