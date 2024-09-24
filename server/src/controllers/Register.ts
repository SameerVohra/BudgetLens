import { Request, Response } from "express";
import userModel from "../models/UserModel";
import bcrypt from "bcryptjs";

const Register = async (req: Request, res: Response) => {
  const { name, password, uId } = req.body;

  try {
    // Check if a user with the same name already exists
    const existingUser = await userModel.findOne({ name });
    if (existingUser) {
      return res.status(409).send("A user with the same name already exists");  // Use 409 for conflict
    }

    // Hash the password asynchronously
    const hashedPassword = await bcrypt.hash(password, 8);  // Use bcrypt.hash instead of hashSync

    // Create a new user
    const newUser = new userModel({
      name,
      password: hashedPassword,
      uId,
    });

    // Save the user in the database
    await newUser.save();

    // Return success message
    return res.status(200).send("User successfully registered");
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).send("Internal Server Error");  // Use 500 for server errors
  }
};

export default Register;
