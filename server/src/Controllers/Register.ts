import { Request, Response } from "express";
import userModel from "../models/User";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export const Register = async (req: Request, res: Response) => {
  const { email, pass } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      res.status(422).send("User with same email exists");
      return;
    }

    const hashedPass = await bcrypt.hash(pass, 8);

    const newUser = new userModel({
      email: email,
      pass: hashedPass,
      expenses: [],
      uId: uuidv4()
    })

    await newUser.save();
    res.status(201).json({ message: "User Registered Successfully", userInfo: newUser });
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
}
