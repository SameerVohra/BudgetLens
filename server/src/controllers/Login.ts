import { Request, Response } from "express";
import userModel from "../models/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const Login = async (req: Request, res: Response) => {
  const { name, password } = req.body;

  try {
    // Find the user by name
    const user = await userModel.findOne({ name });
    if (!user) {
      return res.status(401).send("Invalid Credentials");  // Return 401 for unauthorized access
    }

    // Compare the password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);  // Await the bcrypt comparison
    if (!isPasswordValid) {
      return res.status(401).send("Invalid Credentials");  // Same 401 response for invalid password
    }

    // Prepare the JWT payload
    const tokenPayload = { username: user.name, userId: user.uId };

    // Sign the JWT with a secret key, setting an expiration time
    const token: string = jwt.sign(
      tokenPayload, 
      process.env.SECRET_KEY as string, 
      { expiresIn: "24h" }
    );

    // Send the token and user ID as a response
    return res.status(200).send({ token, uId: user.uId });
    
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send("Internal Server Error");  // Standard 500 error code for server issues
  }
};

export default Login;
