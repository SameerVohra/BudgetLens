import mongoose, { Model, Schema, Document } from "mongoose";
// Interface for individual expenses
interface ExpenseI {
  date: Date;
  month: number;
  year: number;
  type: string;
  amount: number;
  description: string;
  paymentMethod: string;
}

// Interface for user document with embedded expenses
interface UserI extends Document {
  name: string;
  password: string;
  uId: string;
  expenses: ExpenseI[]; 
}

// Schema for individual expenses
const ExpenseSchema: Schema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  type: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  }
});

// Schema for the user, with embedded expenses array
const UserSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  uId: {
    type: String,
    required: true,
  },
  expenses: {
    type: [ExpenseSchema], // Embeds the expenses schema
    default: [], // Default is an empty array
  },
});

// Create the model based on the schema
const userModel: Model<UserI> = mongoose.model<UserI>("User", UserSchema);

export default userModel;
