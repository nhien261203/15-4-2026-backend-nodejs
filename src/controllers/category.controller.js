const { User } = require("../models");
const { hashPassword, comparePassword, signPayload } = require("../utils/security");
const { badRequest, created, ok, serverError } = require("../utils/api-response");

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phone, address } = req.body;

    if (!fullName || !email || !password) {
      return badRequest(res, "fullName, email, password are required");
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return badRequest(res, "Email already exists");
    }

    const passwordHash = hashPassword(password);
    const user = await User.create({ fullName, email, passwordHash, phone, address });

    return created(
      res,
      {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      "Register successful"
    );
  } catch (error) {
    return serverError(res, error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return badRequest(res, "email and password are required");
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return badRequest(res, "Invalid email or password");
    }

    const matched = comparePassword(password, user.passwordHash);
    if (!matched) {
      return badRequest(res, "Invalid email or password");
    }

    const token = signPayload({ id: user.id, email: user.email, role: user.role });

    return ok(res, {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return serverError(res, error);
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "fullName", "email", "phone", "address", "role", "createdAt"],
    });

    return ok(res, user);
  } catch (error) {
    return serverError(res, error);
  }
};