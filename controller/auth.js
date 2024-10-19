import { authModel } from "../model/auth.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import {
  logInValidationSchema,
  regiterValidationSchema,
} from "../validations/auth.js";

const createToken = (payLoad) => {
  const token = jwt.sign({ payLoad }, process.env.SECRET_KEY, {
    expiresIn: "175d",
  });
  return token;
};


export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate login request
    const { error } = logInValidationSchema.validate(req.body);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Check if the user exists
    const user = await authModel.findOne({ email });
    if (!user) {
      throw new Error("User does not exist with this email.");
    }

    

    // Compare passwords
    const isMatch = await user.comparePassword(password,user.password);
    if (isMatch) {
      throw new Error("Password does not match.");
    }

    // Generate a token
    const token = createToken({ _id: user._id, role: user.role });

    // Send success response
    res.send({
      message: "Successfully logged in.",
      token,
      data: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};



export const signUp = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;

    const { error, value } = regiterValidationSchema.validate(req.body);

    if (error) {
      throw new Error(error.details[0].message);
    }

    // Check if the role is valid
    const validRoles = ['Admin', 'Parent', 'Student'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role selected." });
    }

    // Check if the email already exists
    const userExist = await authModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({ error: "User already exists with this email." });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new authModel({
      userName,
      email,
      password: hashedPassword,
      role,
    });

    const saveUser = await newUser.save();

    // Generate a token for the new user
    const token = createToken({ _id: saveUser._id, role: saveUser.role });

    // Send success response
    res.status(201).json({
      message: "Successfully registered.",
      token,
      data: {
       saveUser
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


